"use server";

import { prisma } from "@/database";
import { ServerActionResponse } from "@/utils/types";
import {
  CompanyCreatePayload,
  CompanyResponsePayload,
  CompanyUpdatePayload,
} from "@/lib/modules/company/schemas";
import {
  companyWithDetailsInclude,
  mapCompanyEntity,
} from "@/lib/data/company/index";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { AppError } from "@/utils/errors/app-error";
import { getUserId } from "@/lib/data/user/index";

export async function createCompanyAction(
  companyData: CompanyCreatePayload,
): ServerActionResponse<CompanyResponsePayload> {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const company = await prisma.company.create({
      data: {
        ...companyData,
        members: {
          create: [
            { userId },
            ...companyData.members
              .filter((u) => u.email !== userId)
              .map((u) => ({ userId: u.id })),
          ],
        },
        creator: { connect: { id: userId } },
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
    } else if (err instanceof AppError) {
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
      message: "Não foi possível criar a empresa.",
    };
  }
}

export async function getCompanyByIdAction(
  companyId: string,
): ServerActionResponse<CompanyResponsePayload> {
  try {
    if (!getUserId()) {
      throw new AppError("Usuário não autenticado", 401);
    }

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
    const userId = await getUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    // Update the company data
    const { members, ...data } = newData;
    const newMemberUserIds = (members ?? []).map((m) => m.id);

    const updatedCompany = await prisma.$transaction(async (tx) => {
      // Verify if the user has permission to update the company
      const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { createdBy: true },
      });
      if (!company) {
        throw new AppError("Empresa não encontrada.", 404);
      }
      if (company.createdBy !== userId) {
        throw new AppError(
          "Usuário não tem permissão para atualizar a empresa.",
          403,
        );
      }

      await tx.company.update({
        where: { id: companyId },
        data,
      });

      const memberIds = newData.members?.map((m) => m.id) ?? [];
      if (memberIds.length > 0) {
        const existingUserCount = await tx.user.count({
          where: { id: { in: memberIds } },
        });

        if (existingUserCount !== memberIds.length) {
          throw new AppError(
            "Um ou mais usuário selecionados não existem.",
            400,
          );
        }
      }

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
        (id) => !existingUserIds.includes(id),
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
    } else if (err instanceof AppError) {
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
      message: "Não foi possível criar a empresa.",
    };
  }
}

export async function deleteCompanyByIdAction(
  companyId: string,
): ServerActionResponse<null> {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
        select: { createdBy: true },
      });
      if (!company) {
        throw new AppError("Empresa não encontrada.", 404);
      }
      if (company.createdBy !== userId) {
        throw new AppError(
          "Usuário não tem permissão para deletar a empresa.",
          403,
        );
      }

      await tx.company.delete({
        where: { id: companyId },
      });
    });

    updateTag(`company-${companyId}`);
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
      message: "Não foi possível deletar a empresa.",
    };
  }
}
