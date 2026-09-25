"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/utils/types";
import {
  CompanyCreatePayload,
  CompanyResponsePayload,
  CompanyUpdatePayload,
} from "@/lib/schemas/company";
import { companyWithDetailsInclude, mapCompanyEntity } from "../entities";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { AppError } from "@/utils/errors/app-error";
import { getUserData } from "../data";

export async function createCompanyAction(
  companyData: CompanyCreatePayload,
): ServerActionResponse<CompanyResponsePayload> {
  try {
    const user = await getUserData();
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "Usuário não encontrado.",
      };
    }

    const company = await prisma.company.create({
      data: {
        ...companyData,
        members: {
          create: [
            { userId: user.id },
            ...companyData.members
              .filter((u) => u.email !== user.id)
              .map((u) => ({ userId: u.id })),
          ],
        },
        creator: { connect: { id: user.id } },
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
  cacheTag(`company-${companyId}`);
  cacheLife("default");

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: companyWithDetailsInclude,
    });
    if (!company) {
      throw new AppError("Empresa não encontrada", 404);
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

export async function updateCompanyByIdAction(
  companyId: string,
  newData: CompanyUpdatePayload,
): ServerActionResponse<CompanyResponsePayload> {
  try {
    const { members, ...data } = newData;
    const newMemberUserIds = (members ?? []).map((m) => m.id);

    const updatedCompany = await prisma.$transaction(async (tx) => {
      // Update the company basic data
      await tx.company.update({
        where: { id: companyId },
        data,
      });

      // Delete the removed members
      await tx.companyMember.deleteMany({
        where: {
          companyId,
          userId: {
            notIn: newMemberUserIds,
          },
        },
      });

      // Get the new members to be added
      const existingMembers = await tx.companyMember.findMany({
        where: { companyId },
        select: { userId: true },
      });
      const existingUserIds = existingMembers.map((m) => m.userId);
      const userIdsToAdd = newMemberUserIds.filter(
        (is) => !existingUserIds.includes(is),
      );

      // Add the new members
      if (userIdsToAdd.length > 0) {
        await tx.companyMember.createMany({
          data: userIdsToAdd.map((id) => ({ companyId, userId: id })),
          skipDuplicates: true,
        });
      }

      // Return the updated company
      return await tx.company.findUnique({
        where: { id: companyId },
        include: companyWithDetailsInclude,
      });
    });

    updateTag(`company-${companyId}`);

    return {
      success: true,
      status: 200,
      data: mapCompanyEntity(updatedCompany!),
    };
  } catch (err) {
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

export async function deleteCompanyByIdAction(
  companyId: string,
): ServerActionResponse<null> {
  try {
    await prisma.company.delete({
      where: { id: companyId },
    });

    updateTag(`company-${companyId}`);

    return { success: true, status: 200, data: null };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      if (leanErr.errType === "NOT_FOUND") {
        return {
          success: false,
          status: 404,
          message: "Empresa não encontrada.",
        };
      }
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível deletar a empresa.",
    };
  }
}
