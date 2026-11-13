import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { JobForm } from "@/components/job/JobForm";
import {
  SkeletonButton,
  SkeletonCompanyProfile,
  SkeletonInput,
  SkeletonSkills,
  SkeletonText,
} from "@/components/skeletons";
import { getCompanyByIdAction } from "@/lib/modules/company";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function JobCreatePage(props: PageProps<"/jobs/create">) {
  return (
    <main className="pb-4">
      <section>
        <div className="size-6 mt-4">
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
        <Suspense fallback={<JobFormContentFallback />}>
          <JobFormContent props={props} />
        </Suspense>
      </section>
    </main>
  );
}

async function CompanyHeader({ props }: { props: PageProps<"/jobs/create"> }) {
  const companyId = (await props.searchParams).companyId as string;
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

async function JobFormContent({ props }: { props: PageProps<"/jobs/create"> }) {
  const companyId = (await props.searchParams).companyId as string;

  return <JobForm companyId={companyId} key={companyId} />;
}

export async function generateMetadata(
  props: PageProps<"/jobs/create">,
): Promise<Metadata> {
  const companyId = (await props.searchParams).companyId as string;
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to generate metadata for company ID: ${companyId}`,
      );
  }

  return {
    title: `Criar vaga na empresa ${companyResponse.data.name} | TypeHire`,
    description: "Crie uma nova vaga para sua empresa.",
  };
}

function JobFormContentFallback() {
  return (
    <div className="mt-6">
      <SkeletonText customClassName="w-60 h-5 mb-6 rounded-md bg-background-200" />
      <div className="flex flex-col gap-4">
        {/* Company base info */}
        <SkeletonInput variant="input" />
        <SkeletonInput variant="textarea" />

        <div>
          <SkeletonText customClassName="w-40 h-3 mb-1 rounded-md bg-background-400" />
          <div className="w-full flex flex-col gap-2 px-2 py-1 mb-1 rounded-md border-background-800 bg-background-800">
            <div className="flex flex-row gap-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <span
                  className="block w-40 h-6 rounded-md bg-background-500 animate-pulse"
                  key={`salary-type-${idx}`}
                ></span>
              ))}
            </div>
          </div>
          <div className="block w-full h-8 rounded-md bg-background-600 animate-pulse"></div>
        </div>

        <SkeletonInput variant="input" />
        <SkeletonInput variant="input" />
        <SkeletonInput variant="input" />

        {/* Skills */}
        <div className="mt-8">
          <SkeletonText customClassName="w-60 h-5 mb-6 rounded-md bg-background-200" />
          <SkeletonInput variant="input" />
          <div className="mt-4">
            <SkeletonSkills />
          </div>
        </div>
      </div>

      <SkeletonButton />
    </div>
  );
}
