"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/types";
import {
  CompanyCreatePayload,
  CompanyResponsePayload,
} from "@/utils/schemas/company";
import { companyWithDetailsSelect, mapCompanyEntity } from "../entities";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";

export async function createCompany(
  companyData: CompanyCreatePayload,
): ServerActionResponse<CompanyResponsePayload> {
  try {
    const company = await prisma.company.create({
      data: {
        ...companyData,
        members: { create: { userId: companyData.createdBy } },
      },
      select: companyWithDetailsSelect,
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
      message: "Ocorreu um erro inesperado ao tentar criar a empresa.",
    };
  }
}

export async function getCompanyById(
  companyId: string,
): ServerActionResponse<CompanyResponsePayload | null> {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: companyWithDetailsSelect,
    });
    if (!company) {
      return { success: true, status: 200, data: null };
    }

    return { success: true, status: 200, data: mapCompanyEntity(company) };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message:
        "Ocorreu um erro inesperado ao tentar retornar os dados da empresa.",
    };
  }
}
