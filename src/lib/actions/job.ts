"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/utils/types";
import { JobCreatePayload, JobResponsePayload } from "@/lib/schemas";
import { jobWithDetailsInclude, mapJobEntity } from "../entities";
import { AppError } from "@/lib/errors/app-error";
import { PaginationResponsePayload } from "@/utils/types";
import { cacheLife, cacheTag, updateTag } from "next/cache";

export async function createJobAction(
  jobData: JobCreatePayload,
): ServerActionResponse<JobResponsePayload> {
  try {
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

      updateTag("job-list");
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
      message: "Ocorreu um erro inesperado ao criar a vaga.",
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
  "use cache";
  cacheLife("hours");
  cacheTag("job-list");

  try {
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
    console.error(err);
    return {
      success: false,
      status: 500,
      message: "Não foi possível retornar mais vagas.",
    };
  }
}
