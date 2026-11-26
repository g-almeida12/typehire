import { BackButton } from "@/components/common/BackButton";
import { CompanyForm } from "@/components/company/CompanyForm";
import { SkeletonCompanyForm } from "@/components/skeletons";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { Suspense } from "react";

export default function CompanyCreatePage() {
  return (
    <main className="w-full max-w-lg pb-4 mx-auto">
      <section>
        <div className="mt-4">
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
      </section>

      <section>
        <Suspense fallback={<SkeletonCompanyForm />}>
          <CompanyFormContent />
        </Suspense>
      </section>
    </main>
  );
}

async function CompanyFormContent() {
  const user = (await getCurrentUserData())!;

  return <CompanyForm currentUserEmail={user.email} />;
}

export const metadata: Metadata = {
  title: "Crie uma nova empresa | Typehire",
};
