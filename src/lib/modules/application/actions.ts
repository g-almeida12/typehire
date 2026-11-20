"use server";

import { PaginationResponsePayload, ServerActionResponse } from "@/utils/types";
import {
  ApplicationCreateSchema,
  ApplicationFormFilterSchema,
  ApplicationResponsePayload,
  ApplicationUpdateSchema,
  JobApplicationStatuses,
} from "./schemas";
import { getCurrentUserId } from "@/lib/data/user";
import { AppError } from "@/utils/errors/app-error";
import { prisma } from "@/database";
import {
  getCachedApplicationById,
  getCachedJobApplicationStatuses,
  applicationWithDetailsInclude,
  mapApplicationEntity,
} from "@/lib/data/application";
import { ApplicationStatus, Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { updateTag } from "next/cache";
import { after } from "next/server";
import { sendApplicationUpdateEmail } from "@/lib/email/emails";
import { IdSchema, PaginationSchema } from "../common/schemas";

const STATUSES = Object.values(ApplicationStatus);

export async function createApplicationAction(
  data: unknown,
): ServerActionResponse<ApplicationResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const appData = ApplicationCreateSchema.parse(data);

    const jobData = await prisma.job.findUnique({
      where: { id: appData.jobId },
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
        jobId: appData.jobId,
        status: "PENDING",
      },
      include: applicationWithDetailsInclude,
    });

    updateTag(`job-${appData.jobId}`);
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

    return AppError.handleDefaultError(
      err,
      "Não foi possível se candidatar para a vaga.",
    );
  }
}

export async function getApplicationByIdAction(
  id: unknown,
): ServerActionResponse<ApplicationResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const appId = IdSchema.parse(id);

    const application = await getCachedApplicationById(appId, currentUserId);
    if (!application) {
      throw new AppError("Candidatura não encontrada", 404);
    }

    return {
      success: true,
      status: 200,
      data: mapApplicationEntity(application),
    };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível retornar a candidatura.",
    );
  }
}

export async function getApplicationsAction(
  filterData: unknown,
  pagination: unknown,
): ServerActionResponse<{
  applications: ApplicationResponsePayload[];
  pagination: PaginationResponsePayload;
}> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const filter = ApplicationFormFilterSchema.parse(filterData);
    const pag = PaginationSchema.parse(pagination);

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
    const totalApplicationsPages = Math.ceil(totalApplications / pag.size);

    return {
      success: true,
      status: 200,
      data: {
        applications: applications.map((app) => mapApplicationEntity(app)),
        pagination: {
          page: pag.page,
          pageSize: pag.size,
          total: totalApplications,
          totalPages: totalApplicationsPages,
          hasNextPage: pag.page < totalApplicationsPages,
          hasPrevPage: pag.page > 1,
        },
      },
    };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível retornar as candidaturas.",
    );
  }
}

export async function getJobApplicationStatusesAction(
  id: unknown,
): ServerActionResponse<JobApplicationStatuses> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const jobId = IdSchema.parse(id);

    const applicationStatuses = await getCachedJobApplicationStatuses(
      jobId,
      currentUserId,
    );

    return { success: true, status: 200, data: applicationStatuses };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível retornar os estados das candidaturas da vaga.",
    );
  }
}

export async function updateApplicationByIdAction(
  id: unknown,
  data: unknown,
): ServerActionResponse<ApplicationResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const appId = IdSchema.parse(id);
    const appData = ApplicationUpdateSchema.parse(data);

    let oldStatus: ApplicationStatus | undefined = undefined;
    if (appData.status) {
      const application = await prisma.application.findUnique({
        where: {
          id: appId,
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

      // Reject update to the same status
      if (application.status === appData.status) {
        throw new AppError("A candidatura já está nessa etapa.", 422, "status");
      }

      // Reject update to a previous status without a feedback
      oldStatus = application.status;
      const oldStatusIdx = STATUSES.indexOf(application.status);
      const newStatusIdx = STATUSES.indexOf(appData.status);
      if (oldStatusIdx > newStatusIdx && !appData.feedback) {
        throw new AppError(
          "Informe um feedback para mover a candidatura para uma etapa anterior.",
          422,
          "feedback",
        );
      }
    }

    const updatedApplication = await prisma.application.update({
      where: {
        id: appId,
        OR: [
          { candidateId: currentUserId },
          { job: { createdBy: currentUserId } },
          { job: { company: { createdBy: currentUserId } } },
        ],
      },
      data: appData,
      include: applicationWithDetailsInclude,
    });

    updateTag(`application-${appId}`);
    updateTag(`job-application-statuses-${updatedApplication.jobId}`);

    // Send a email to candidate on status changes
    const statusHasChanged =
      appData.status &&
      oldStatus &&
      appData.status !== oldStatus;

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
          newStatus: appData.status,
          feedback: appData.feedback ?? "",
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

    return AppError.handleDefaultError(
      err,
      "Não foi possível atualizar a candidatura.",
    );
  }
}

export async function deleteApplicationByIdAction(
  id: unknown,
): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const appId = IdSchema.parse(id);

    const { count } = await prisma.application.deleteMany({
      where: {
        id: appId,
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
    return AppError.handleDefaultError(
      err,
      "Não foi possível deletar a candidatura.",
    );
  }
}
