"use server";

import {
  UserPrivateResponsePayload,
  UserUpdatePayload,
  UserPublicResponsePayload,
} from "./schemas";
import {
  mapPublicUserEntity,
  userWithDetailsInclude,
  getCachedUser,
  getCurrentUserId,
  mapPrivateUserEntity,
} from "@/lib/data/user/index";
import { ServerActionResponse } from "@/utils/types";
import { prisma } from "@/database";
import { AppError } from "@/utils/errors/app-error";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { updateTag } from "next/cache";

export async function getUserByIdAction(
  userId: string,
): ServerActionResponse<UserPublicResponsePayload> {
  try {
    if (!(await getCurrentUserId())) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const user = await getCachedUser(userId);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return { success: true, status: 200, data: mapPublicUserEntity(user) };
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
      message: "Não foi possível encontrar o usuário.",
    };
  }
}

export async function getUsersByEmailPrefixAction(
  prefix: string,
): ServerActionResponse<UserPublicResponsePayload[]> {
  try {
    if (!(await getCurrentUserId())) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const users = await prisma.user.findMany({
      where: {
        email: {
          startsWith: prefix,
          mode: "insensitive",
        },
      },
      take: 7,
      include: userWithDetailsInclude,
    });

    return {
      success: true,
      status: 200,
      data: users.map((u) => mapPublicUserEntity(u)),
    };
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
      message: "Não foi possível buscar os usuário.",
    };
  }
}

export async function updateUserAction(
  newUserData: UserUpdatePayload,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: newUserData,
      include: userWithDetailsInclude,
    });

    updateTag(`user-${currentUserId}`);
    return {
      success: true,
      status: 200,
      data: mapPrivateUserEntity(updatedUser),
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

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      switch (leanErr.errType) {
        case "UNIQUE_CONSTRAINT_ERROR":
          return {
            success: false,
            status: 409,
            message: `${leanErr.field} fornecido(a) já está registrado.`,
            field: leanErr.field,
          };
      }
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível atualizar o usuário.",
    };
  }
}

export async function uploadResumeAction(
  formData: FormData,
): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const resumeUrl = (formData.get("resume") as File).name;
    await prisma.user.update({
      where: { id: currentUserId },
      data: { resumeUrl },
    });

    updateTag(`user-${currentUserId}`);
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
      message: "Não foi possível enviar o currículo.",
    };
  }
}

export async function removeResumeAction(): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    await prisma.user.update({
      where: { id: currentUserId },
      data: { resumeUrl: null },
    });

    updateTag(`user-${currentUserId}`);
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
      message: "Não foi possível remover o currículo.",
    };
  }
}

export async function deleteUserAction(): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    await prisma.user.delete({
      where: { id: currentUserId },
    });

    updateTag(`user-${currentUserId}`);
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
      message: "Não foi possível deletar o usuário.",
    };
  }
}
