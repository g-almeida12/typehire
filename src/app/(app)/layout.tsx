import { prisma } from "@/database";
import { authServer } from "@/lib/auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Encontre sua próxima vaga | TypeHire",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AppLayout({ children }: LayoutProps<"/">) {
  // Verify if user is registered in database
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect(APP_URLS.register);

  // Verify if user is fully registered (CPF included)
  const user = await prisma.user.findFirst({
    where: { id: session.user.id, cpf: { not: null } },
    select: { id: true },
  });
  if (!user) redirect(APP_URLS.completeProfile);

  return children;
}
