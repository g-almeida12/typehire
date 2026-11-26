import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { JobForm } from "@/components/job/JobForm";
import {
  SkeletonCompanyProfile,
  SkeletonJobForm,
} from "@/components/skeletons";
import { getJobByIdAction } from "@/lib/modules/job";
import { truncateText } from "@/utils/string";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function JobUpdatePage(
  props: PageProps<"/jobs/[id]/update">,
) {
  return (
    <main className="w-full max-w-lg pb-4 mx-auto">
      <section>
        <div className="mt-4">
          <BackButton />
        </div>

        <div className="my-8">
          <Suspense fallback={<SkeletonCompanyProfile />}>
            <CompanyHeader props={props} />
          </Suspense>
        </div>

        <h1 className="mt-8 mb-4 text-2xl font-semibold">
          Atualize os dados da sua vaga
        </h1>
      </section>

      <section>
        <Suspense fallback={<SkeletonJobForm />}>
          <JobFormContent props={props} />
        </Suspense>
      </section>
    </main>
  );
}

async function CompanyHeader({
  props,
}: {
  props: PageProps<"/jobs/[id]/update">;
}) {
  const jobId = (await props.params).id;
  const jobResponse = await getJobByIdAction(jobId);
  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else
      throw new Error(`Failed to load job company header for job ID: ${jobId}`);
  }

  return (
    <CompanyProfile
      company={jobResponse.data.company}
      type="readonly"
      visualOnlyWebsiteLink={false}
    />
  );
}

async function JobFormContent({
  props,
}: {
  props: PageProps<"/jobs/[id]/update">;
}) {
  const jobId = (await props.params).id;
  const jobResponse = await getJobByIdAction(jobId);
  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw new Error(`Failed to load form for job ID: ${jobId}`);
  }

  return (
    <JobForm
      job={jobResponse.data}
      companyId={jobResponse.data.company.id}
      key={`${jobResponse.data.id} - ${jobResponse.data.company.id}`}
    />
  );
}

export async function generateMetadata(
  props: PageProps<"/jobs/[id]/update">,
): Promise<Metadata> {
  const jobId = (await props.params).id;
  const jobResponse = await getJobByIdAction(jobId);
  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw new Error(`Failed to generate metadata for job ID: ${jobId}`);
  }

  return {
    title: `Atualizar vaga ${truncateText(jobResponse.data.title, 35)} da empresa ${truncateText(jobResponse.data.company.name, 35)} | TypeHire`,
    description: `Atualize os dados da vaga de ${truncateText(jobResponse.data.title, 35)} da empresa ${truncateText(jobResponse.data.company.name, 35)}.`,
  };
}
