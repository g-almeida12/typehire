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
import { getJobByIdAction } from "@/lib/modules/job";
import { truncateText } from "@/utils/string";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function JobUpdatePage(
  props: PageProps<"/jobs/[id]/update">,
) {
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

        <h1 className="mt-8 mb-4 text-2xl font-semibold">
          Atualize os dados da sua vaga
        </h1>
      </section>

      <section>
        <Suspense fallback={<JobFormContentFallback />}>
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

      <div className="mt-8">
        <SkeletonButton />
      </div>
    </div>
  );
}
