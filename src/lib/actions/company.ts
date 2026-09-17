"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/utils/types";
import {
  CompanyCreatePayload,
  CompanyResponsePayload,
} from "@/lib/schemas/company";
import { companyWithDetailsInclude, mapCompanyEntity } from "../entities";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { cacheLife, cacheTag } from "next/cache";
import { AppError } from "@/utils/errors/app-error";

export async function createCompanyAction(
  companyData: CompanyCreatePayload,
): ServerActionResponse<CompanyResponsePayload> {
  try {
    const company = await prisma.company.create({
      data: {
        ...companyData,
        members: { create: { userId: companyData.createdBy } },
      },
      include: companyWithDetailsInclude,
    });

    return { success: true, status: 201, data: mapCompanyEntity(company) };
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanError = PrismaClientError.getLeanError(err);
      if (
        leanError.errType === "UNIQUE_CONSTRAINT_ERROR" &&
        leanError.field === "cnpj"
      ) {
        return {
          success: false,
          status: 409,
          message: "CNPJ já cadastrado.",
          field: "cnpj",
        };
      }
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível criar a empresa.",
    };
  }
}

export async function getCompanyByIdAction(
  companyId: string,
): ServerActionResponse<CompanyResponsePayload> {
  "use cache";
  cacheLife("default");
  cacheTag(`company-${companyId}`);

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: companyWithDetailsInclude,
    });
    if (!company) {
      throw new AppError("Empresa não encontrada.", 404);
    }

    return { success: true, status: 200, data: mapCompanyEntity(company) };
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
      message: "Não foi possível retornar os dados da empresa.",
    };
  }
}
