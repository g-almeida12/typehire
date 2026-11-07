import { CompleteProfileForm } from "@/components/(auth)/CompleteProfileForm";
import { Navbar } from "@/components/ui/Navbar";
import { authServer } from "@/lib/auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CompleteProfilePage() {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect(APP_URLS.register);

  return (
    <>
      <Navbar onlyBrand />
      <main className="pt-10">
        <h1 className="mt-8 text-2xl font-medium">
          Termine de criar sua conta
        </h1>
        <p className="text-sm/tight text-background-300">
          Apenas insira o seu CPF e já pode ir na busca de novas vagas.
        </p>

        <CompleteProfileForm />
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title: "TypeHire | Complete o seu perfil",
  description:
    "Termine de concluir seu cadastro e comece a acompanhar o status das suas candidaturas em vagas de tecnologia.",
};
