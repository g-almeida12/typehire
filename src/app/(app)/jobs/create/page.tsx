import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/common/CompanyProfile";
import { JobForm } from "@/components/job/JobForm";
import { Skill } from "@/database/generated/enums";
import { getCompanyByIdAction } from "@/lib/modules/company";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function CompanyCreatePage(
  props: PageProps<"/jobs/create">,
) {
  const companyId = (await props.searchParams).companyId as string;
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) {
      notFound();
    } else {
      throw new Error();
    }
  }

  return (
    <main className="pb-4">
      <div className="size-6 mt-4">
        <BackButton />
      </div>

      <div className="my-8">
        <CompanyProfile company={companyResponse.data} type="readonly" />
      </div>

      <h1 className="mt-8 mb-4 text-2xl font-semibold">
        Crie uma nova vaga para sua empresa
      </h1>
      <p>
        Mantenha sua vaga atualizada e dê feedback aos candidatos regularmente.
      </p>

      <section>
        <JobForm
          skills={Object.values(Skill).toSorted()}
          companyId={companyId}
          key={companyId}
        />
      </section>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Criar uma nova empresa | Typehire",
};
