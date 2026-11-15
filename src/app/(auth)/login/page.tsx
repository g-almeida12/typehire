import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { LoginForm } from "@/components/(auth)/LoginForm";
import { authServer } from "@/lib/auth/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APP_URLS } from "@/utils/constants";

export default async function LoginPage() {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (session?.user) redirect(APP_URLS.HOME);

  return (
    <>
      <Navbar onlyBrand />
      <main className="pb-4">
        <h1 className="mt-8 text-2xl font-medium text-center">
          Bem-vindo de volta
        </h1>
        <p className="text-sm/tight text-background-300 text-center">
          Faça login e continue a procurar pela sua próxima vaga.
        </p>

        <LoginForm />
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title: "TypeHire | Entrar na sua Conta",
  description:
    "Acesse sua conta para acompanhar o status das suas candidaturas em vagas de tecnologia.",
};
