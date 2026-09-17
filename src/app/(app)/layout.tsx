import { authServer } from "@/lib/auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Encontre sua próxima vaga | TypeHire",
};

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(APP_URLS.login);
  }

  return children;
}
