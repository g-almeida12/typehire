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
import { updateTag } from "next/cache";
import {
  getCachedApplicationById,
  getCachedJobApplicationStatuses,
} from "@/lib/data/application/caches";
import { after } from "next/server";
import { sendApplicationUpdateEmail } from "@/lib/email/emails";

const STATUSES = Object.values(ApplicationStatus);

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
        company: {
          select: { members: true },
        },
      },
    });
    if (!jobData) {
      throw new AppError("Vaga não encontrada.", 404);
    }

    if (jobData.company.members.map((m) => m.userId).includes(currentUserId)) {
      throw new AppError(
        "Uma candidatura não pode ser criada para vagas da empresa onde o usuário é membro.",
        422,
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

    updateTag(`job-${applicationData.jobId}`);
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

    const application = await getCachedApplicationById(
      applicationId,
      currentUserId,
    );
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

    const applicationStatuses = await getCachedJobApplicationStatuses(
      jobId,
      currentUserId,
    );

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

    let oldStatus: ApplicationStatus | undefined = undefined;
    if (applicationData.status) {
      const application = await prisma.application.findUnique({
        where: {
          id: applicationId,
          OR: [
            { candidateId: currentUserId },
            { job: { createdBy: currentUserId } },
            { job: { company: { createdBy: currentUserId } } },
          ],
        },
        select: { status: true },
      });
      if (!application) {
        throw new AppError("Candidatura não encontrada.", 404);
      }

      if (application.status === applicationData.status) {
        throw new AppError("A candidatura já está nessa etapa.", 422, "status");
      }

      oldStatus = application.status;
      const oldStatusIdx = STATUSES.indexOf(application.status);
      const newStatusIdx = STATUSES.indexOf(applicationData.status);
      if (oldStatusIdx > newStatusIdx && !applicationData.feedback) {
        throw new AppError(
          "Informe um feedback para mover a candidatura para uma etapa anterior.",
          422,
          "feedback",
        );
      }
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

    updateTag(`application-${applicationId}`);
    updateTag(`job-application-statuses-${updatedApplication.jobId}`);

    const statusHasChanged =
      applicationData.status &&
      oldStatus &&
      applicationData.status !== oldStatus;

    if (statusHasChanged) {
      after(async () => {
        const candidate = updatedApplication.candidate;
        const job = updatedApplication.job;

        await sendApplicationUpdateEmail({
          to: candidate.email,
          userName: candidate.name,
          jobTitle: job.title,
          companyName: job.company.name,
          oldStatus: oldStatus!,
          newStatus: applicationData.status,
          feedback: applicationData.feedback ?? "",
        });
      });
    }

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
