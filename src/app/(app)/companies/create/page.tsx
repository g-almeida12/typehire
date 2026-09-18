import { BackButton } from "@/components/common/BackButton";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { Metadata } from "next";

export default async function CompanyCreatePage() {
  await new Promise((r) => setTimeout(r, 5_000))

  return (
    <main className="pb-4">
      <div className="size-6 mt-4">
        <BackButton />
      </div>

      <h1 className="mt-8 mb-4 text-2xl font-semibold">
        Crie a conta da sua empresa no TypeHire
      </h1>
      <p>
        Ao registrar uma nova empresa, você se torna o responsável por ela no
        TypeHire, pode gerenciar vagas e convidar outros para trabalhar com
        você.
      </p>

      <section>
        <CompanyForm />
      </section>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Criar uma nova empresa | Typehire",
};
