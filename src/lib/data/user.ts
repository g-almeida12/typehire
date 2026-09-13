import { prisma } from "@/database";
import { authServer } from "@/lib/auth/auth-server";
import { headers } from "next/headers";
import { mapPrivateUserEntity, userWithDetailsInclude } from "../entities";
import { UserPrivateResponsePayload } from "../schemas";

export async function getUserData(): Promise<UserPrivateResponsePayload | null> {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: userWithDetailsInclude,
  });

  if (!user) return null;

  return mapPrivateUserEntity(user);
}
