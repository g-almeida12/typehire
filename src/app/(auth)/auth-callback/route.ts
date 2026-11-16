import { prisma } from "@/database";
import { authServer } from "@/lib/better-auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  // Verify if user is registered in database
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect(APP_URLS.REGISTER);

  // Verify if user is fully registered (CPF included)
  const user = await prisma.user.findFirst({
    where: { id: session.user.id, cpf: { not: null } },
    select: { id: true },
  });
  if (!user) redirect(APP_URLS.COMPLETE_PROFILE);

  redirect(APP_URLS.HOME);
}
