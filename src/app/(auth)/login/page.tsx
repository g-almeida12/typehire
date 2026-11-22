import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { LoginForm } from "@/components/(auth)/LoginForm";
import { authServer } from "@/lib/better-auth/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthGate>
        <div className="max-w-lg mx-auto">
          <Navbar onlyBrand />
          <main className="pb-4">
            <h1 className="mt-8 text-2xl font-medium text-left">
              Bem-vindo de volta
            </h1>
            <p className="text-sm/tight text-background-300 text-left">
              Faça login e continue a procurar pela sua próxima vaga.
            </p>
  
            <LoginForm />
          </main>
        </div>
      </AuthGate>
    </Suspense>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (session?.user) redirect(APP_URLS.HOME);

  return children;
}

export const metadata: Metadata = {
  title: "TypeHire | Entrar na sua Conta",
  description:
    "Acesse sua conta para acompanhar o status das suas candidaturas em vagas de tecnologia.",
};
