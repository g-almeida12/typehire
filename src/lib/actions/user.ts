"use server";

import { UserEntity, userWithDetailsInclude } from "@/lib/entities";
import { ServerActionResponse } from "@/utils/types";
import { authServer } from "@/lib/auth/auth-server";
import {
  UserLoginPayload,
  UserRegisterPayload,
  UserPrivateResponsePayload,
  UserUpdatePayload,
} from "@/lib/schemas";
import { mapPrivateUserEntity } from "../entities";
import { prisma } from "@/database";
import { headers } from "next/headers";
import { getUserData } from "@/lib/data";
import { AppError } from "@/utils/errors/app-error";
import { Prisma } from "@/database/generated/client";
import { PrismaClientError } from "@/utils/errors/prisma-error";

export async function signUpByEmailAction(
  userData: UserRegisterPayload,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    const authUser = await authServer.api.signUpEmail({
      body: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
      },
    });

    const newUser = (await prisma.user.update({
      where: { id: authUser.user.id },
      data: {
        cpf: userData.cpf,
        agreeToTerms: userData.agreeToTerms,
      },
      include: userWithDetailsInclude,
    })) as UserEntity;

    return { success: true, status: 201, data: mapPrivateUserEntity(newUser) };
  } catch (err: any) {
    let response: { message: string; status: number } = {
      message: "",
      status: 0,
    };

    if (
      err.body.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
      err.code === "P2002"
    ) {
      response.message = "Email ou CPF já cadastrados.";
      response.status = 409;
    } else {
      response.message = "Não foi possível realizar o cadastro.";
      response.status = 500;
    }

    return { success: false, ...response };
  }
}

export async function signInByEmailAction(
  userData: UserLoginPayload,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    const authUser = await authServer.api.signInEmail({
      body: {
        email: userData.email,
        password: userData.password,
      },
      headers: await headers(),
    });

    const loggedUser = (await prisma.user.findUnique({
      where: { id: authUser.user.id },
      include: userWithDetailsInclude,
    })) as UserEntity;

    return {
      success: true,
      status: 200,
      data: mapPrivateUserEntity(loggedUser),
    };
  } catch (err: any) {
    console.log(err);
    let response: { message: string; status: number } = {
      message: "",
      status: 0,
    };
    if (err.statusCode === 401) {
      response.message = "Email ou senha inválidos.";
      response.status = 401;
    } else {
      response.message = "Não foi possível conectar a sua conta.";
      response.status = 500;
    }
    return { success: false, ...response };
  }
}

export async function signOutAction(): ServerActionResponse<boolean> {
  try {
    await authServer.api.signOut({
      headers: await headers(),
    });

    return { success: true, status: 200, data: true };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: "Não foi possível desconectar a sua conta.",
    };
  }
}

export async function updateUserAction(
  newUserData: UserUpdatePayload,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    const user = await getUserData();
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const { companies, ...data } = newUserData;
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      include: userWithDetailsInclude,
    });

    return {
      success: true,
      status: 200,
      data: mapPrivateUserEntity(updatedUser),
    };
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, status: err.statusCode, message: err.message };
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      switch (leanErr.errType) {
        case "UNIQUE_CONSTRAINT_ERROR":
          return {
            success: false,
            status: 409,
            message: `${leanErr.field} passado já está registrado.`,
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

export async function deleteUserAction(): ServerActionResponse<boolean> {
  try {
    const user = await getUserData();
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    return { success: true, status: 200, data: true };
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, status: err.statusCode, message: err.message };
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const leanErr = PrismaClientError.getLeanError(err);
      if (leanErr.errType === "NOT_FOUND") {
        return {
          success: false,
          status: 404,
          message: "Usuário não encontrado.",
        };
      }
    }

    return {
      success: false,
      status: 500,
      message: "Não foi possível deletar o usuário.",
    };
  }
}
