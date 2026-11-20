"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/utils/types";
import {
  JobResponsePayload,
  JobServerCreateSchema,
  JobFormFilterSchema,
  JobUpdateSchema,
} from "./schemas";
import {
  jobWithDetailsInclude,
  mapJobEntity,
  getCachedJobById,
} from "@/lib/data/job";
import { AppError } from "@/utils/errors/app-error";
import { PaginationResponsePayload } from "@/utils/types";
import { updateTag } from "next/cache";
import { getCurrentUserId } from "@/lib/data/user";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { Prisma } from "@/database/generated/client";
import { IdSchema, PaginationSchema } from "../common/schemas";

export async function createJobAction(
  data: unknown,
): ServerActionResponse<JobResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const jobData = JobServerCreateSchema.parse(data);

    const isMember = await prisma.companyMember.findFirst({
      where: { userId: currentUserId, companyId: jobData.companyId },
      select: { userId: true },
    });
    if (!isMember) {
      throw new AppError(
        "O usuário fornecido não faz parte da empresa e por isso não pode gerenciar vagas.",
        403,
      );
    }

    const { intervalSalary, ...leanNewData } = jobData;
    const createdJob = await prisma.job.create({
      data: {
        ...leanNewData,
        minSalary: intervalSalary?.at(0) ?? null,
        maxSalary: intervalSalary?.at(1) ?? null,
        status: "OPEN",
        createdBy: currentUserId,
      },
      include: jobWithDetailsInclude,
    });

    updateTag(`company-${jobData.companyId}`);
    return {
      success: true,
      status: 201,
      data: mapJobEntity({ ...createdJob, userHasApplied: false }),
    };
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      if (
        leanErr.errType === "FOREIGN_KEY_ERROR" &&
        leanErr.field === "job_companyId_fkey"
      ) {
        return {
          success: false,
          status: 422,
          message: "Empresa não encontrada.",
        };
      }
    }

    return AppError.handleDefaultError(err, "Não foi possível criar a vaga.");
  }
}

export async function getJobsAction(
  filterData: unknown,
  pagination: unknown,
): ServerActionResponse<{
  jobs: JobResponsePayload[];
  pagination: PaginationResponsePayload;
}> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const filter = JobFormFilterSchema.parse(filterData);
    const pag = PaginationSchema.parse(pagination);

    const whereCondition: Prisma.JobWhereInput = {
      ...filter,
      title: filter.title
        ? { contains: filter.title, mode: "insensitive" }
        : undefined,
      skills: filter.skills ? { hasEvery: filter.skills } : undefined,
    };

    const jobs = await prisma.job.findMany({
      where: whereCondition,
      skip: (pag.page - 1) * pag.size,
      take: pag.size,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        ...jobWithDetailsInclude,
        applications: {
          where: { candidateId: currentUserId },
          select: { id: true },
        },
      },
    });

    const total = await prisma.job.count({ where: whereCondition });
    const totalPages = Math.ceil(total / pag.size);

    return {
      success: true,
      status: 200,
      data: {
        jobs: jobs.map((j) =>
          mapJobEntity({ ...j, userHasApplied: j.applications.length > 0 }),
        ),
        pagination: {
          page: pag.page,
          pageSize: pag.size,
          total,
          totalPages,
          hasNextPage: pag.page < totalPages,
          hasPrevPage: pag.page > 1,
        },
      },
    };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível retornar mais vagas.",
    );
  }
}

export async function getJobByIdAction(
  id: unknown,
): ServerActionResponse<JobResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const jobId = IdSchema.parse(id);

    const job = await getCachedJobById(jobId, currentUserId);
    if (!job) {
      throw new AppError("Vaga não encontrada.", 404);
    }

    return {
      success: true,
      status: 200,
      data: mapJobEntity({
        ...job,
        userHasApplied: job.applications.length > 0,
      }),
    };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível retornar os dados da vaga.",
    );
  }
}

export async function updateJobByIdAction(
  id: unknown,
  data: unknown,
): ServerActionResponse<JobResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const jobId = IdSchema.parse(id);
    const jobData = JobUpdateSchema.parse(data);

    const { intervalSalary, ...leanJobData } = jobData;
    const updatedJob = await prisma.job.update({
      where: {
        id: jobId,
        OR: [
          { createdBy: currentUserId },
          { company: { createdBy: currentUserId } },
        ],
      },
      data: {
        ...leanJobData,
        minSalary: intervalSalary?.at(0) ?? null,
        maxSalary: intervalSalary?.at(1) ?? null,
      },
      include: {
        ...jobWithDetailsInclude,
        applications: {
          where: { candidateId: currentUserId },
          select: { id: true },
        },
      },
    });

    updateTag(`job-${jobId}`);
    updateTag(`company-${updatedJob.companyId}`);
    return {
      success: true,
      status: 200,
      data: mapJobEntity({
        ...updatedJob,
        userHasApplied: updatedJob.applications.length > 0,
      }),
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      if (leanErr.errType === "NOT_FOUND") {
        return {
          success: false,
          status: 404,
          message: "Vaga não encontrada.",
        };
      }
    }

    return AppError.handleDefaultError(
      err,
      "Não foi possível atualizar os dados da vaga.",
    );
  }
}

export async function deleteJobByIdAction(
  id: unknown,
): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const jobId = IdSchema.parse(id);

    const deletedJob = await prisma.job.delete({
      where: {
        id: jobId,
        OR: [
          { createdBy: currentUserId },
          { company: { createdBy: currentUserId } },
        ],
      },
      select: { companyId: true },
    });

    updateTag(`job-${jobId}`);
    updateTag(`company-${deletedJob.companyId}`);
    return { success: true, status: 200, data: null };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      if (leanErr.errType === "NOT_FOUND") {
        return {
          success: false,
          status: 404,
          message: "Vaga não encontrada.",
        };
      }
    }

    return AppError.handleDefaultError(
      err,
      "Não foi possível deletar a vaga.",
    );
  }
}
