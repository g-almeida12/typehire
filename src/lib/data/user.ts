import { prisma } from "@/database";
import { authServer } from "@/lib/auth/auth-server";
import { headers } from "next/headers";
import { mapPrivateUserEntity } from "../entities";

export async function getUserData() {
  const session = (await authServer.api.getSession({
    headers: await headers(),
  }))!;

  const user = (await prisma.user.findUnique({
    where: { id: session.user.id },
  }))!;

  return mapPrivateUserEntity(user);
}
