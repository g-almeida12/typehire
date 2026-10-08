"use server";

import { PaginationResponsePayload, ServerActionResponse } from "@/utils/types";
import {
  ApplicationCreatePayload,
  ApplicationFormOutputFilterPayload,
  ApplicationResponsePayload,
  ApplicationUpdatePayload,
} from "./schemas";
import { getCurrentUserId } from "@/lib/data/user";
import { AppError } from "@/utils/errors/app-error";
import { prisma } from "@/database";
import {
  ApplicationEntity,
  applicationWithDetailsInclude,
  mapApplicationEntity,
} from "@/lib/data/application/entities";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { TruckElectricIcon } from "lucide-react";

export async function createApplicationAction(
  applicationData: ApplicationCreatePayload,
): ServerActionResponse<ApplicationResponsePayload> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const application = await prisma.application.create({
      data: {
        candidateId: userId,
        jobId: applicationData.jobId,
        status: "PENDING",
      },
      include: applicationWithDetailsInclude,
    });

    return {
      success: true,
      status: 201,
      data: mapApplicationEntity(application),
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
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const application = await prisma.$transaction(async (tx) => {
      const appData = await tx.application.findUnique({
        where: { id: applicationId },
        include: applicationWithDetailsInclude,
      });
      if (!appData) {
        throw new AppError("Candidatura não encontrada.", 404);
      }

      if (
        appData.candidateId !== userId &&
        appData.job.createdBy !== userId &&
        appData.job.company.createdBy !== userId
      ) {
        throw new AppError(
          "Você não tem permissão para ver essa candidatura.",
          403,
        );
      }

      return appData;
    });

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
  filter: ApplicationFormOutputFilterPayload,
  page: number = 1,
  pageSize: number = 10,
): ServerActionResponse<{
  applications: ApplicationResponsePayload[];
  pagination: PaginationResponsePayload;
}> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const whereCondition = filter.jobId
      ? { ...filter }
      : { ...filter, candidateId: userId };

    const applications = await prisma.$transaction(async (tx) => {
      if (filter.jobId) {
        const jobData = await tx.job.findUnique({
          where: { id: filter.jobId },
          select: {
            createdBy: true,
            company: { select: { createdBy: true } },
          },
        });
        if (!jobData) {
          throw new AppError("Vaga não encontrada.", 404);
        }

        if (
          jobData.createdBy !== userId &&
          jobData.company.createdBy !== userId
        ) {
          throw new AppError(
            "Você não tem permissão para ver essa candidatura.",
            403,
          );
        }
      }

      return await tx.application.findMany({
        where: whereCondition,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { createdAt: "desc" },
        include: applicationWithDetailsInclude,
      });
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

export async function updateApplicationByIdAction(
  applicationId: string,
  applicationData: ApplicationUpdatePayload,
): ServerActionResponse<ApplicationResponsePayload> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const appData = await tx.application.findUnique({
        where: { id: applicationId },
        select: {
          candidateId: true,
          job: {
            select: {
              createdBy: true,
              company: { select: { createdBy: true } },
            },
          },
        },
      });
      if (!appData) {
        throw new AppError("Candidatura não encontrada.", 404);
      }

      if (
        appData.candidateId !== userId &&
        appData.job.createdBy !== userId &&
        appData.job.company.createdBy !== userId
      ) {
        throw new AppError(
          "Você não tem permissão para atualizar essa candidatura.",
          403,
        );
      }

      return await tx.application.update({
        where: { id: applicationId },
        data: applicationData,
        include: applicationWithDetailsInclude,
      });
    });

    return {
      success: true,
      status: 200,
      data: mapApplicationEntity(updatedApplication),
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
      message: "Não foi possível atualizar a candidatura.",
    };
  }
}

export async function deleteApplicationByIdAction(
  applicationId: string,
): ServerActionResponse<null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    await prisma.$transaction(async (tx) => {
      const appData = await tx.application.findUnique({
        where: { id: applicationId },
        select: {
          candidateId: true,
          job: {
            select: {
              createdBy: true,
              company: { select: { createdBy: true } },
            },
          },
        },
      });
      if (!appData) {
        throw new AppError("Candidatura não encontrada.", 404);
      }

      if (
        appData.candidateId !== userId &&
        appData.job.createdBy !== userId &&
        appData.job.company.createdBy !== userId
      ) {
        throw new AppError(
          "Você não tem permissão para deletar essa candidatura.",
          403,
        );
      }

      await tx.application.delete({
        where: { id: applicationId },
      });
    });

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
