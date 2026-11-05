import { CompleteProfileForm } from "@/components/(auth)/CompleteProfileForm";
import { Navbar } from "@/components/ui/Navbar";
import { Metadata } from "next";

export default function CompleteProfilePage() {
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
