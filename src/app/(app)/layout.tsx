import { prisma } from "@/database";
import { authServer } from "@/lib/auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={null}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
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

  return children;
}

export const metadata: Metadata = {
  title: "Encontre sua próxima vaga | TypeHire",
  robots: {
    index: false,
    follow: false,
  },
};
