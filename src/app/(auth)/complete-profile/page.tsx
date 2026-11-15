import { CompleteProfileForm } from "@/components/(auth)/CompleteProfileForm";
import { Navbar } from "@/components/ui/Navbar";
import { authServer } from "@/lib/auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={null}>
      <AuthGate>
        <Navbar onlyBrand />
        <main className="pt-10">
          <h1 className="mt-8 text-2xl font-medium text-center">
            Termine de criar sua conta
          </h1>
          <p className="text-sm/tight text-background-300 text-center">
            Apenas insira o seu CPF e já pode ir na busca de novas vagas.
          </p>

          <CompleteProfileForm />
        </main>
      </AuthGate>
    </Suspense>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect(APP_URLS.REGISTER);

  return children;
}

export const metadata: Metadata = {
  title: "TypeHire | Complete o seu perfil",
  description:
    "Termine de concluir seu cadastro e comece a acompanhar o status das suas candidaturas em vagas de tecnologia.",
};
