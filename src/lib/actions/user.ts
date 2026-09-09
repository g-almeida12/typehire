"use server";

import { UserEntity } from "@/lib/entities";
import { ServerActionResponse } from "@/types";
import { authServer } from "@/utils/auth/auth-server";
import {
  UserLoginPayload,
  UserRegisterPayload,
  UserPrivateResponsePayload,
} from "@/utils/schemas";
import { mapPrivateUserEntity } from "../entities";
import { prisma } from "@/database";
import { headers } from "next/headers";

export async function signUpByEmail(
  userData: UserRegisterPayload,
): ServerActionResponse<UserPrivateResponsePayload> {
  try {
    const authUser = await authServer.api.signUpEmail({
      body: {
        email: userData.email,
        name: userData.name,
        password: userData.password!,
      },
    });

    const newUser = (await prisma.user.update({
      where: { id: authUser.user.id },
      data: {
        cpf: userData.cpf,
        agreeToTerms: userData.agreeToTerms,
      },
    })) as UserEntity;

    return { success: true, status: 201, data: mapPrivateUserEntity(newUser) };
  } catch (err: any) {
    let response: { message: string; status: number } = {
      message: "",
      status: 0,
    };
    if (
      err.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
      err.code === "P2002"
    ) {
      response.message = "Email ou CPF já cadastrados.";
      response.status = 409;
    } else {
      response.message =
        "Ocorreu um erro inesperado ao tentar realizar o cadastro.";
      response.status = 500;
    }
    return { success: false, ...response };
  }
}

export async function signInByEmail(
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
    })) as UserEntity;

    return {
      success: true,
      status: 200,
      data: mapPrivateUserEntity(loggedUser),
    };
  } catch (err: any) {
    let response: { message: string; status: number } = {
      message: "",
      status: 0,
    };
    if (err.code === "INVALID_EMAIL_OR_PASSWORD") {
      response.message = "Email ou senha inválidos.";
      response.status = 401;
    } else {
      response.message =
        "Ocorreu um erro inesperado ao tentar conectar a sua conta.";
      response.status = 500;
    }
    return { success: false, ...response };
  }
}
