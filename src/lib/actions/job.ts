"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/types";
import { JobCreatePayload, JobResponsePayload } from "@/utils/schemas";
import { jobWithDetailsSelect, mapJobEntity } from "../entities";
import { AppError } from "@/utils/errors/app-error";

export async function createJob(
  jobData: JobCreatePayload,
): ServerActionResponse<JobResponsePayload> {
  try {
    return await prisma.$transaction(async (tx) => {
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
        select: jobWithDetailsSelect,
      });

      return { success: true, status: 201, data: mapJobEntity(createdJob) };
    });
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
      message: "Ocorreu um erro inesperado ao criar a vaga.",
    };
  }
}
