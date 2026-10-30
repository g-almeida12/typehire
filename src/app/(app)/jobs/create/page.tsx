import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { JobForm } from "@/components/job/JobForm";
import { getCompanyByIdAction } from "@/lib/modules/company";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function JobCreatePage(props: PageProps<"/jobs/create">) {
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
      <section>
        <div className="size-6 mt-4">
          <BackButton />
        </div>

        <div className="my-8">
          <CompanyProfile
            company={companyResponse.data}
            type="readonly"
            visualOnlyWebsiteLink={false}
          />
        </div>

        <h1 className="mt-8 mb-4 text-2xl font-semibold">
          Crie uma nova vaga para sua empresa
        </h1>
        <p>
          Mantenha sua vaga atualizada e dê feedback aos candidatos
          regularmente.
        </p>
      </section>

      <section>
        <JobForm companyId={companyId} key={companyId} />
      </section>
    </main>
  );
}

export async function generateMetadata(
  props: PageProps<"/jobs/create">,
): Promise<Metadata> {
  const companyId = (await props.searchParams).companyId as string;
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else throw Error();
  }

  return {
    title: `Criar vaga na empresa ${companyResponse.data.name} | TypeHire`,
    description: "Crie uma nova vaga para sua empresa.",
  };
}
