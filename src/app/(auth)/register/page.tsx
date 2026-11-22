import { Navbar } from "@/components/ui/Navbar";
import { Metadata } from "next";
import { RegisterForm } from "@/components/(auth)/RegisterForm";
import { authServer } from "@/lib/better-auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthGate>
        <div className="max-w-lg mx-auto">
          <Navbar onlyBrand />
          <main className="pb-4">
            <h1 className="mt-8 text-2xl font-medium text-left">
              Crie sua conta
            </h1>
            <p className="text-sm/tight text-background-300 text-left">
              Preencha seus dados pessoais necessários e registre suas informações
              básicas.
            </p>
  
            <RegisterForm />
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
  title: "TypeHire | Registrar uma nova conta",
  description:
    "Crie uma conta no Typehire e comece a buscar seu novo emprego em questão de segundos.",
};
