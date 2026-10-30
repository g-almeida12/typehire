"use server";

import { PaginationResponsePayload, ServerActionResponse } from "@/utils/types";
import {
  ApplicationCreatePayload,
  ApplicationFormFilterOutputPayload,
  ApplicationResponsePayload,
  ApplicationUpdatePayload,
  JobApplicationStatuses,
} from "./schemas";
import { getCurrentUserId } from "@/lib/data/user";
import { AppError } from "@/utils/errors/app-error";
import { prisma } from "@/database";
import {
  applicationWithDetailsInclude,
  mapApplicationEntity,
} from "@/lib/data/application/entities";
import { ApplicationStatus, Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";

export async function createApplicationAction(
  applicationData: ApplicationCreatePayload,
): ServerActionResponse<ApplicationResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const jobData = await prisma.job.findUnique({
      where: { id: applicationData.jobId },
      select: {
        createdBy: true,
        company: {
          select: { createdBy: true },
        },
      },
    });
    if (!jobData) {
      throw new AppError("Vaga não encontrada.", 404);
    }

    if (jobData.createdBy === currentUserId) {
      throw new AppError(
        "O criador da vaga não pode se candidatar na própria vaga.",
        403,
      );
    }
    if (jobData.company.createdBy === currentUserId) {
      throw new AppError(
        "O criador da empresa não pode se candidatar a nenhuma vaga da própria empresa.",
        403,
      );
    }

    const createdApplication = await prisma.application.create({
      data: {
        candidateId: currentUserId,
        jobId: applicationData.jobId,
        status: "PENDING",
      },
      include: applicationWithDetailsInclude,
    });

    return {
      success: true,
      status: 201,
      data: mapApplicationEntity(createdApplication),
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      if (leanErr.errType === "UNIQUE_CONSTRAINT_ERROR") {
        return {
          success: false,
          status: 409,
          message:
            "Não é possível se candidatar mais de uma vez para a mesma vaga.",
        };
      }
    }

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
      message: "Não foi possível se candidatar para a vaga.",
    };
  }
}

export async function getApplicationByIdAction(
  applicationId: string,
): ServerActionResponse<ApplicationResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        OR: [
          { candidateId: currentUserId },
          { job: { createdBy: currentUserId } },
          { job: { company: { createdBy: currentUserId } } },
        ],
      },
      include: applicationWithDetailsInclude,
    });
    if (!application) {
      throw new AppError("Candidatura não encontrada", 404);
    }

    return {
      success: true,
      status: 200,
      data: mapApplicationEntity(application),
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
      message: "Não foi possível retornar a candidatura.",
    };
  }
}

export async function getApplicationsAction(
  filter: ApplicationFormFilterOutputPayload,
  page: number = 1,
  pageSize: number = 10,
): ServerActionResponse<{
  applications: ApplicationResponsePayload[];
  pagination: PaginationResponsePayload;
}> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const whereCondition = filter.jobId
      ? {
          ...filter,
          OR: [
            { job: { createdBy: currentUserId } },
            { job: { company: { createdBy: currentUserId } } },
          ],
        }
      : { ...filter, candidateId: currentUserId };
    const applications = await prisma.application.findMany({
      where: whereCondition,
      include: applicationWithDetailsInclude,
    });

    const totalApplications = await prisma.application.count({
      where: whereCondition,
    });
    const totalApplicationsPages = Math.ceil(totalApplications / pageSize);

    return {
      success: true,
      status: 200,
      data: {
        applications: applications.map((app) => mapApplicationEntity(app)),
        pagination: {
          page,
          pageSize,
          total: totalApplications,
          totalPages: totalApplicationsPages,
          hasNextPage: page < totalApplicationsPages,
          hasPrevPage: page > 1,
        },
      },
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
      message: "Não foi possível retornar as candidaturas.",
    };
  }
}

export async function getJobApplicationStatusesAction(
  jobId: string,
): ServerActionResponse<JobApplicationStatuses> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const statusesCount = await prisma.application.groupBy({
      by: ["status"],
      where: {
        jobId,
        OR: [
          { job: { createdBy: currentUserId } },
          { job: { company: { createdBy: currentUserId } } },
        ],
      },
      _count: true,
    });

    const applicationStatuses = Object.fromEntries(
      [...Object.values(ApplicationStatus), "ALL"].map((s) => [s, 0]),
    ) as JobApplicationStatuses;
    for (const { status, _count } of statusesCount) {
      applicationStatuses[status] = _count;
      applicationStatuses.ALL += _count;
    }

    return { success: true, status: 200, data: applicationStatuses };
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
      message: "Não foi possível retornar os estados das candidaturas da vaga.",
    };
  }
}

export async function updateApplicationByIdAction(
  applicationId: string,
  applicationData: ApplicationUpdatePayload,
): ServerActionResponse<ApplicationResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
        OR: [
          { candidateId: currentUserId },
          { job: { createdBy: currentUserId } },
          { job: { company: { createdBy: currentUserId } } },
        ],
      },
      data: applicationData,
      include: applicationWithDetailsInclude,
    });

    return {
      success: true,
      status: 200,
      data: mapApplicationEntity(updatedApplication),
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      if (leanErr.errType === "NOT_FOUND") {
        return {
          success: false,
          status: 404,
          message: "Candidatura não encontrada.",
        };
      }
    }

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
      message: "Não foi possível atualizar a candidatura.",
    };
  }
}

export async function deleteApplicationByIdAction(
  applicationId: string,
): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const { count } = await prisma.application.deleteMany({
      where: {
        id: applicationId,
        OR: [
          { candidateId: currentUserId },
          { job: { createdBy: currentUserId } },
          { job: { company: { createdBy: currentUserId } } },
        ],
      },
    });
    if (count === 0) {
      throw new AppError("Candidatura não encontrada.", 404);
    }

    return { success: true, status: 200, data: null };
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
      message: "Não foi possível deletar a candidatura.",
    };
  }
}
