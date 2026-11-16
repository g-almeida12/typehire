import { authServer } from "@/lib/better-auth/auth-server";
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

  return children;
}

export const metadata: Metadata = {
  title: "Encontre sua próxima vaga | TypeHire",
  robots: {
    index: false,
    follow: false,
  },
};
