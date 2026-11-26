import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { JobForm } from "@/components/job/JobForm";
import {
  SkeletonCompanyProfile,
  SkeletonJobForm
} from "@/components/skeletons";
import { getCompanyByIdAction } from "@/lib/modules/company";
import { getSearchParam, truncateText } from "@/utils/string";
import { SearchParams } from "@/utils/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function JobCreatePage(props: PageProps<"/jobs/create">) {
  return (
    <main className="pb-4">
      <section>
        <div className="mt-4">
          <BackButton />
        </div>

        <div className="my-8">
          <Suspense fallback={<SkeletonCompanyProfile />}>
            <CompanyHeader props={props} />
          </Suspense>
        </div>

        <h1 className="mt-8 mb-3 text-2xl font-semibold">
          Crie uma nova vaga para sua empresa
        </h1>
        <p>
          Mantenha sua vaga atualizada e dê feedback aos candidatos
          regularmente.
        </p>
      </section>

      <section>
        <Suspense fallback={<SkeletonJobForm />}>
          <JobFormContent searchParams={props.searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function CompanyHeader({ props }: { props: PageProps<"/jobs/create"> }) {
  const queries = await props.searchParams;
  const companyId = getSearchParam(queries, 'companyId');
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to load company header for company ID: ${companyId}`,
      );
  }

  return (
    <CompanyProfile
      company={companyResponse.data}
      type="readonly"
      visualOnlyWebsiteLink={false}
    />
  );
}

async function JobFormContent({ searchParams }: { searchParams: SearchParams }) {
  const queries = await searchParams;
  const companyId = getSearchParam(queries, 'companyId');

  return <JobForm companyId={companyId} key={companyId} />;
}

export async function generateMetadata(
  props: PageProps<"/jobs/create">,
): Promise<Metadata> {
  const queries = await props.searchParams;
  const companyId = getSearchParam(queries, 'companyId');
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to generate metadata for company ID: ${companyId}`,
      );
  }

  return {
    title: `Criar vaga na empresa ${truncateText(companyResponse.data.name, 35)} | TypeHire`,
    description: `Crie uma nova vaga para sua empresa ${truncateText(companyResponse.data.name, 35)}.`,
  };
}
