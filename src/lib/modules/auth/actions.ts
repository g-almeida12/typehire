"use server";

import { prisma } from "@/database";
import { authServer } from "@/lib/better-auth/auth-server";
import {
  userWithDetailsInclude,
  UserEntity,
  mapPrivateUserEntity,
} from "@/lib/data/user";
import { APP_URLS } from "@/utils/constants";
import { ServerActionResponse } from "@/utils/types";
import { headers } from "next/headers";
import { after } from "next/server";
import { UserPrivateResponsePayload } from "../user";
import {
  AuthRegisterPayload,
  AuthLoginPayload,
  AuthCompleteProfilePayload,
} from "../auth";
import { PrismaClientError } from "@/utils/errors/prisma-error";
import { Prisma } from "@/database/generated/client";
import { AppError } from "@/utils/errors/app-error";

export async function signUpByEmailAction(
  userData: AuthRegisterPayload,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    // Check if the email or CPF are already registered
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: userData.email }, { cpf: userData.cpf }] },
    });
    if (existingUser) {
      // Email is registered but not verified
      if (
        existingUser.email === userData.email &&
        !existingUser.emailVerified
      ) {
        after(
          async () =>
            await authServer.api.sendVerificationEmail({
              body: {
                email: existingUser.email,
                callbackURL: APP_URLS.HOME,
              },
            }),
        );

        const signedUpUser = (await prisma.user.findUnique({
          where: { id: existingUser.id },
          include: userWithDetailsInclude,
        })) as UserEntity;

        return {
          success: true,
          status: 201,
          data: mapPrivateUserEntity(signedUpUser),
        };
      }

      // CPF is registered
      return {
        success: false,
        status: 409,
        message: "Email ou CPF já cadastrados.",
      };
    }

    // User is not registered
    const authUser = await authServer.api.signUpEmail({
      body: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        callbackURL: APP_URLS.HOME,
        cpf: userData.cpf,
        agreeToTerms: userData.agreeToTerms,
      },
    });
    const signedUpUser = (await prisma.user.findUnique({
      where: { id: authUser.user.id },
      include: userWithDetailsInclude,
    })) as UserEntity;

    return {
      success: true,
      status: 201,
      data: mapPrivateUserEntity(signedUpUser),
    };
  } catch (_err) {
    return {
      success: false,
      status: 500,
      message: "Não foi possível realizar o cadastro.",
    };
  }
}

export async function finishUserRegisterAction(
  completeData: AuthCompleteProfilePayload,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    const session = await authServer.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: completeData,
      include: userWithDetailsInclude,
    });

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
            message: "CPF já cadastrado.",
          };
      }
    }

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
      message: "Não foi possível terminar o registro do usuário.",
    };
  }
}

export async function signInByEmailAction(
  userData: AuthLoginPayload,
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
    if (err.statusCode === 401) {
      return {
        success: false,
        message: "Email ou senha inválidos.",
        status: 401,
      };
    }

    if (err.statusCode === 403) {
      return {
        success: false,
        status: 403,
        message:
          "Por favor, verifique seu e-mail antes de entrar. Verifique sua caixa de entrada.",
      };
    }

    return {
      success: false,
      message: "Não foi possível conectar a sua conta.",
      status: 500,
    };
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
