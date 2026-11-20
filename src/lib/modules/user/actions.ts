"use server";

import {
  UserPrivateResponsePayload,
  UserPublicResponsePayload,
  UserUpdateSchema,
  UserResumeSchema,
} from "./schemas";
import {
  mapPublicUserEntity,
  userWithDetailsInclude,
  getCachedUser,
  getCurrentUserId,
  mapPrivateUserEntity,
} from "@/lib/data/user";
import { ServerActionResponse } from "@/utils/types";
import { prisma } from "@/database";
import { AppError } from "@/utils/errors/app-error";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { updateTag } from "next/cache";
import { IdSchema } from "../common/schemas";

export async function getUserByIdAction(
  id: unknown,
): ServerActionResponse<UserPublicResponsePayload> {
  try {
    if (!(await getCurrentUserId())) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const userId = IdSchema.parse(id);

    const user = await getCachedUser(userId);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return { success: true, status: 200, data: mapPublicUserEntity(user) };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível encontrar o usuário.",
    );
  }
}

export async function getUsersByEmailPrefixAction(
  prefix: unknown,
): ServerActionResponse<UserPublicResponsePayload[]> {
  try {
    if (!(await getCurrentUserId())) {
      throw new AppError("Usuário não autenticado", 401);
    }

    if (typeof prefix !== "string") {
      throw new AppError("Payload inválido fornecido.", 400);
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
    return AppError.handleDefaultError(
      err,
      "Não foi possível buscar os usuário.",
    );
  }
}

export async function updateUserAction(
  data: unknown,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    const userData = UserUpdateSchema.parse(data);

    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: userData,
      include: userWithDetailsInclude,
    });

    updateTag(`user-${currentUserId}`);
    return {
      success: true,
      status: 200,
      data: mapPrivateUserEntity(updatedUser),
    };
  } catch (err) {
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

    return AppError.handleDefaultError(
      err,
      "Não foi possível atualizar o usuário.",
    );
  }
}

export async function uploadResumeAction(
  data: unknown,
): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    if (!(data instanceof FormData)) {
      throw new AppError("Payload inválido fornecido.", 400);
    }
    const resumeData = await UserResumeSchema.parseAsync(
      Object.fromEntries(data.entries()).resume,
    );

    await prisma.user.update({
      where: { id: currentUserId },
      data: { resumeUrl: resumeData.name },
    });

    updateTag(`user-${currentUserId}`);
    return { success: true, status: 200, data: null };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível enviar o currículo.",
    );
  }
}

export async function removeResumeAction(): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    await prisma.user.update({
      where: { id: currentUserId },
      data: { resumeUrl: null },
    });

    updateTag(`user-${currentUserId}`);
    return { success: true, status: 200, data: null };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível remover o currículo.",
    );
  }
}

export async function deleteUserAction(): ServerActionResponse<null> {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    await prisma.user.delete({
      where: { id: currentUserId },
    });

    updateTag(`user-${currentUserId}`);
    return { success: true, status: 200, data: null };
  } catch (err) {
    return AppError.handleDefaultError(
      err,
      "Não foi possível deletar o usuário.",
    );
  }
}
