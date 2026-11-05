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
  getCachedCompanyById,
} from "@/lib/data/company/index";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { updateTag } from "next/cache";
import { AppError } from "@/utils/errors/app-error";
import { getCurrentUserId } from "@/lib/data/user/index";

export async function createCompanyAction(
  companyData: CompanyCreatePayload,
): ServerActionResponse<CompanyResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const company = await prisma.company.create({
      data: {
        ...companyData,
        members: {
          create: [
            { userId: currentUserId },
            ...companyData.members
              .filter((u) => u.email !== currentUserId)
              .map((u) => ({ userId: u.id })),
          ],
        },
        creator: { connect: { id: currentUserId } },
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
    if (!(await getCurrentUserId())) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const company = await getCachedCompanyById(companyId);
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
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    // Update the company data
    const { members, ...data } = newData;
    const newMemberIds = (members ?? []).map((m) => m.id);

    const updatedCompany = await prisma.$transaction(async (tx) => {
      // Update the company if the user has permission to do it
      const { count } = await tx.company.updateMany({
        where: { id: companyId, createdBy: currentUserId },
        data,
      });
      if (count === 0) {
        throw new AppError("Empresa não encontrada.", 404);
      }

      if (members) {
        await tx.companyMember.deleteMany({
          where: {
            companyId,
            userId: { notIn: newMemberIds, cpf: { not: null } },
          },
        });
        const count = await tx.user.count({
          where: { id: { in: newMemberIds }, cpf: { not: null } },
        });
        if (count !== newMemberIds.length) {
          throw new AppError(
            "Alguns dos usuários fornecidos não foram encontrados.",
            400,
            "members",
          );
        }

        await tx.companyMember.createMany({
          data: newMemberIds.map((id) => ({ companyId, userId: id })),
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
    for (const m of members ?? []) {
      updateTag(`user-${m.id}`);
    }

    return {
      success: true,
      status: 200,
      data: mapCompanyEntity(updatedCompany!),
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanError = PrismaClientError.getLeanError(err);
      switch (leanError.errType) {
        case "UNIQUE_CONSTRAINT_ERROR":
          if (leanError.field === "cnpj") {
            return {
              success: false,
              status: 409,
              message: "CNPJ já cadastrado.",
              field: "cnpj",
            };
          }
          break;

        case "FOREIGN_KEY_ERROR":
          return {
            success: false,
            status: 400,
            message: "Um ou mais usuários selecionados não existem.",
            field: "members",
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
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const deletedCompany = await prisma.company.delete({
      where: { id: companyId, createdBy: currentUserId },
      select: { members: true },
    });

    updateTag(`company-${companyId}`);
    for (const m of deletedCompany.members ?? []) {
      updateTag(`user-${m.id}`);
    }

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
