"use server";

import { ServerActionResponse, UserEntity } from "@/types";
import { authServer } from "@/utils/auth/auth-server";
import {
  UserLoginPayload,
  UserRegisterPayload,
  UserResponsePayload,
} from "@/utils/schemas";
import { mapUserEntity } from "../mappers";
import { prisma } from "@/database";
import { headers } from "next/headers";

export async function signUpByEmail(
  user: UserRegisterPayload,
): ServerActionResponse<UserResponsePayload> {
  try {
    const authUser = await authServer.api.signUpEmail({
      body: {
        email: user.email,
        name: user.name,
        password: user.password!,
      },
    });

    const newUser = (await prisma.user.update({
      where: { id: authUser.user.id },
      data: {
        cpf: user.cpf,
        phoneNumber: user.phoneNumber,
        location: user.location,
        agreeToTerms: user.agreeToTerms,
      },
    })) as UserEntity;

    return { success: true, data: mapUserEntity(newUser) };
  } catch (err: any) {
    let message: string;
    if (
      err.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
      err.code === "P2002"
    ) {
      message = "Email ou CPF já cadastrados.";
    } else {
      message = "Não foi possível realizar o cadastro.";
    }
    return { success: false, message };
  }
}

export async function signInByEmail(
  user: UserLoginPayload,
): ServerActionResponse<UserResponsePayload> {
  try {
    const authUser = await authServer.api.signInEmail({
      body: {
        email: user.email,
        password: user.password,
      },
      headers: await headers(),
    });

    const loggedUser = (await prisma.user.findUnique({
      where: { id: authUser.user.id },
    })) as UserEntity;
    return { success: true, data: mapUserEntity(loggedUser) };
  } catch (err: any) {
    let message;
    if (err.code === "INVALID_EMAIL_OR_PASSWORD") {
      message = "Email ou senha inválidos.";
    } else {
      message = "Não foi possível conectar a sua conta.";
    }
    return { success: false, message };
  }
}
