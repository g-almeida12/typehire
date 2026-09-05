"use server";

import { ServerActionResponse, UserEntity } from "@/types";
import { authServer } from "@/utils/auth/auth-server";
import { UserRegisterPayload, UserResponsePayload } from "@/utils/schemas";
import { mapUserEntity } from "../mappers";
import { prisma } from "@/database";

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

    const newUser = await prisma.user.update({
      where: { id: authUser.user.id },
      data: {
        cpf: user.cpf,
        phoneNumber: user.phoneNumber,
        location: user.location,
        agreeToTerms: user.agreeToTerms,
      },
    }) as UserEntity;

    return { success: true, data: mapUserEntity(newUser) };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { success: false, error: "Email ou CPF já cadastrados." };
    }
    return { success: false, error: err.message as string };
  }
}
