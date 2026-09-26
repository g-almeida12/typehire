"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/utils/types";
import { JobCreatePayload, JobResponsePayload, JobUpdatePayload } from "./schemas";
import { jobWithDetailsInclude, mapJobEntity } from "@/lib/data/job/entities";
import { AppError } from "@/utils/errors/app-error";
import { PaginationResponsePayload } from "@/utils/types";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { getCurrentUserId } from "@/lib/data/user/index";
import { getCachedJobById } from "@/lib/data/job/caches";

export async function createJobAction(
  jobData: JobCreatePayload,
): ServerActionResponse<JobResponsePayload> {
  try {
    if (!(await getCurrentUserId())) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const result = await prisma.$transaction(async (tx) => {
      const isMember = await tx.companyMember.findFirst({
        where: { userId: jobData.createdBy, companyId: jobData.companyId },
      });

      if (!isMember) {
        throw new AppError(
          "O usuário fornecido não faz parte da empresa e por isso não pode gerenciar vagas.",
          403,
          "companyId",
        );
      }

      const createdJob = await tx.job.create({
        data: {
          ...jobData,
          minSalary: jobData.intervalSalary?.at(0) ?? null,
          maxSalary: jobData.intervalSalary?.at(1) ?? null,
          status: "ABERTA",
        },
        include: jobWithDetailsInclude,
      });

      return mapJobEntity(createdJob);
    });

    return { success: true, status: 201, data: result };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        status: err.statusCode,
        message: err.message,
        field: err.field,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível criar a vaga.",
    };
  }
}

export async function getJobsAction(
  page: number = 1,
  pageSize: number = 10,
): ServerActionResponse<{
  jobs: JobResponsePayload[];
  pagination: PaginationResponsePayload;
}> {
  try {
    if (!(await getCurrentUserId())) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const jobs = await prisma.job.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: jobWithDetailsInclude,
    });

    const total = await prisma.job.count();
    const totalPages = Math.ceil(total / pageSize);

    return {
      success: true,
      status: 200,
      data: {
        jobs: jobs.map((j) => mapJobEntity(j)),
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        message: err.message,
        status: err.statusCode,
        field: err.field,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível retornar mais vagas.",
    };
  }
}

export async function getJobByIdAction(
  jobId: string,
): ServerActionResponse<JobResponsePayload> {
  "use cache";
  cacheLife("days");
  cacheTag(`job-${jobId}`);

  try {
    if (!(await getCurrentUserId())) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const job = await getCachedJobById(jobId);
    if (!job) {
      throw new AppError("Vaga não encontrada.", 404);
    }

    return { success: true, status: 200, data: mapJobEntity(job) };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        message: err.message,
        status: err.statusCode,
        field: err.field,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível retornar os dados da vaga.",
    };
  }
}

export async function updateJobByIdAction(
  jobId: string,
  newData: JobUpdatePayload,
): ServerActionResponse<JobResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      // Verify if the user has permission to update the job
      const job = await tx.job.findUnique({
        where: { id: jobId },
        select: {
          id: true,
          createdBy: true,
          company: { select: { createdBy: true } },
        },
      });
      if (!job) {
        throw new AppError("Vaga não encontrada.", 404);
      }

      if (
        currentUserId !== job.createdBy &&
        currentUserId !== job.company.createdBy
      ) {
        throw new AppError(
          "Usuário não tem permissão para atualizar a vaga.",
          403,
        );
      }

      // Delete the job
      return await tx.job.update({
        where: { id: jobId },
        data: newData,
        include: jobWithDetailsInclude,
      });
    });

    updateTag(`job-${jobId}`);
    return { success: true, status: 200, data: mapJobEntity(updatedJob) };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        message: err.message,
        status: err.statusCode,
        field: err.field,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível retornar os dados da vaga.",
    };
  }
}

export async function deleteJobByIdAction(
  jobId: string,
): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    await prisma.$transaction(async (tx) => {
      // Verify if the user has permission to delete the job
      const job = await tx.job.findUnique({
        where: { id: jobId },
        select: {
          id: true,
          createdBy: true,
          company: { select: { createdBy: true } },
        },
      });
      if (!job) {
        throw new AppError("Vaga não encontrada.", 404);
      }

      if (
        currentUserId !== job.createdBy &&
        currentUserId !== job.company.createdBy
      ) {
        throw new AppError(
          "Usuário não tem permissão para deletar a vaga.",
          403,
        );
      }

      // Delete the job
      await tx.job.delete({
        where: { id: jobId },
      });
    });

    updateTag(`job-${jobId}`);
    return { success: true, status: 200, data: null };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        message: err.message,
        status: err.statusCode,
        field: err.field,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível retornar os dados da vaga.",
    };
  }
}
