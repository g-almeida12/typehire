"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/utils/types";
import {
  JobServerCreatePayload,
  JobResponsePayload,
  JobUpdatePayload,
  JobFormFilterOutputPayload,
} from "./schemas";
import {
  jobWithDetailsInclude,
  mapJobEntity,
  getCachedJobById,
} from "@/lib/data/job/index";
import { AppError } from "@/utils/errors/app-error";
import { PaginationResponsePayload } from "@/utils/types";
import { updateTag } from "next/cache";
import { getCurrentUserId } from "@/lib/data/user/index";

export async function createJobAction(
  jobData: JobServerCreatePayload,
): ServerActionResponse<JobResponsePayload> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const result = await prisma.$transaction(async (tx) => {
      const isMember = await tx.companyMember.findFirst({
        where: { userId, companyId: jobData.companyId },
        select: { userId: true },
      });

      if (!isMember) {
        throw new AppError(
          "O usuário fornecido não faz parte da empresa e por isso não pode gerenciar vagas.",
          403,
          "companyId",
        );
      }

      const { intervalSalary, ...leanNewData } = jobData;
      const createdJob = await tx.job.create({
        data: {
          ...leanNewData,
          minSalary: jobData.intervalSalary?.at(0) ?? null,
          maxSalary: jobData.intervalSalary?.at(1) ?? null,
          status: "ABERTA",
          createdBy: userId,
        },
        include: jobWithDetailsInclude,
      });

      return createdJob;
    });

    return {
      success: true,
      status: 201,
      data: mapJobEntity({ ...result, userHasApplied: false }),
    };
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
  filter: JobFormFilterOutputPayload,
  page: number = 1,
  pageSize: number = 10,
): ServerActionResponse<{
  jobs: JobResponsePayload[];
  pagination: PaginationResponsePayload;
}> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const jobs = await prisma.job.findMany({
      where: {
        ...filter,
        title: filter.title
          ? { contains: filter.title, mode: "insensitive" }
          : undefined,
        skills: filter.skills ? { hasEvery: filter.skills } : undefined,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        ...jobWithDetailsInclude,
        applications: { where: { candidateId: userId }, select: { id: true } },
      },
    });

    const total = await prisma.job.count();
    const totalPages = Math.ceil(total / pageSize);

    return {
      success: true,
      status: 200,
      data: {
        jobs: jobs.map((j) =>
          mapJobEntity({ ...j, userHasApplied: j.applications.length > 0 }),
        ),
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
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const job = await getCachedJobById(jobId, userId);
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
    const userId = await getCurrentUserId();
    if (!userId) {
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

      if (userId !== job.createdBy && userId !== job.company.createdBy) {
        throw new AppError(
          "Usuário não tem permissão para atualizar a vaga.",
          403,
        );
      }
      
      // Update the job
      const { intervalSalary, ...leanNewData } = newData;
      return await tx.job.update({
        where: { id: jobId },
        data: {
          ...leanNewData,
          minSalary: newData.intervalSalary?.at(0) ?? null,
          maxSalary: newData.intervalSalary?.at(1) ?? null,
        },
        include: {
          ...jobWithDetailsInclude,
          applications: {
            where: { candidateId: userId },
            select: { id: true },
          },
        },
      });
    });

    updateTag(`job-${jobId}`);
    return {
      success: true,
      status: 200,
      data: mapJobEntity({
        ...updatedJob,
        userHasApplied: updatedJob.applications.length > 0,
      }),
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
      message: "Não foi possível atualizar os dados da vaga.",
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
