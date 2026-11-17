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
import { AuthRegisterPayload, AuthLoginPayload } from "../auth";

export async function signUpByEmailAction(
  userData: AuthRegisterPayload,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
      include: userWithDetailsInclude,
    });
    // Check if the email is already registered
    if (existingUser && !existingUser.emailVerified) {
      after(
        async () =>
          await authServer.api.sendVerificationEmail({
            body: {
              email: existingUser.email,
              callbackURL: APP_URLS.EMAIL_VERIFICATION(userData.email),
            },
          }),
      );

      return {
        success: true,
        status: 201,
        data: mapPrivateUserEntity(existingUser),
      };
    }

    // User is not registered
    const authUser = await authServer.api.signUpEmail({
      body: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        callbackURL: APP_URLS.EMAIL_VERIFICATION(userData.email),
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
