import { BackButton } from "@/components/common/BackButton";
import {
  ApplicationURLFilterSchema,
  getApplicationsAction,
  getJobApplicationStatusesAction,
} from "@/lib/modules/application";
import { Metadata } from "next";
import { getJobByIdAction } from "@/lib/modules/job";
import { notFound } from "next/navigation";
import { ApplicationStatusFilter } from "@/components/application/ApplicationStatusFilter";
import { CandidateListView } from "@/components/user/CandidateListView";
import { JobInfoTags } from "@/components/job/JobInfoTags";
import { Suspense } from "react";
import { SkeletonText, SkeletonCandidateCard } from "@/components/skeletons";

export default async function JobApplicationsPage(
  props: PageProps<"/jobs/[id]/applications">,
) {
  return (
    <>
      <main className="pb-4">
        <section className="flex flex-row items-center justify-between">
          <div className="size-6 mt-4">
            <BackButton />
          </div>
        </section>

        {/* Job info */}
        <section className="mt-6 mb-6">
          <Suspense fallback={<JobHeaderFallback />}>
            <JobHeader props={props} />
          </Suspense>
        </section>

        <section>
          <p className="mt-8 mb-1">Selecione o filtro</p>
          <Suspense fallback={<JobApplicationListContentFallback />}>
            <JobApplicationListContent props={props} />
          </Suspense>
        </section>
      </main>
    </>
  );
}

async function JobHeader({
  props,
}: {
  props: PageProps<"/jobs/[id]/applications">;
}) {
  const jobId = (await props.params).id;
  const jobResponse = await getJobByIdAction(jobId);
  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw new Error();
  }

  return (
    <>
      <p className="text-2xl font-medium">{jobResponse.data.title}</p>
      <JobInfoTags
        level={jobResponse.data.level}
        modality={jobResponse.data.modality}
      />
    </>
  );
}

async function JobApplicationListContent({
  props,
}: {
  props: PageProps<"/jobs/[id]/applications">;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);
  const filter = ApplicationURLFilterSchema.parse({
    status: searchParams.status,
    jobId: params.id,
  });

  const [jobResponse, jobApplcResponse, jobApplcStatusesResponse] =
    await Promise.all([
      getJobByIdAction(params.id),
      getApplicationsAction(filter, 1, 10),
      getJobApplicationStatusesAction(params.id),
    ]);
  if (jobResponse.status === 404) notFound();
  if (!jobResponse.success || !jobApplcStatusesResponse.success)
    throw new Error();

  return (
    <>
      <div className="mb-12">
        <ApplicationStatusFilter
          jobApplicationStatuses={jobApplcStatusesResponse.data}
        />
      </div>

      {!jobApplcResponse.success ? (
        <div className="flex flex-col items-center justify-center px-4 text-center">
          <p className="text-background-300 text-lg/[22px]">
            Não foi possível carregar as candidaturas da vaga.
          </p>
          <p className="text-sm text-background-400 mt-2">
            Tente recarregar a página mais tarde.
          </p>
        </div>
      ) : (
        <CandidateListView
          filter={filter}
          initialApplications={jobApplcResponse.data.applications}
          initialHasMore={jobApplcResponse.data.pagination.hasNextPage}
          key={JSON.stringify(searchParams)}
        />
      )}
    </>
  );
}

export async function generateMetadata(
  props: PageProps<"/jobs/[id]/applications">,
): Promise<Metadata> {
  const jobId = (await props.params).id;
  const jobResponse = await getJobByIdAction(jobId);

  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw Error();
  }

  return {
    title: `Suas candidaturas da vaga para ${jobResponse.data.title} | TypeHire`,
    description: `Veja todas as candidaturas para a sua vaga de ${jobResponse.data.title}, filtre os candidatos e escolha quem melhor se encaixar.`,
  };
}

function JobHeaderFallback() {
  return (
    <div>
      <SkeletonText customClassName="w-60 h-5 mb-2 rounded-md bg-background-200" />

      <div className="flex flex-row gap-2 mt-3">
        <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
        <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
      </div>
    </div>
  );
}

function JobApplicationListContentFallback() {
  return (
    <>
      {/* Status filter */}
      <div className="mb-12">
        <div className="w-[calc(100%+1rem)] flex flex-row gap-2 overflow-x-hidden mt-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <span
              className="shrink-0 w-20 h-8 rounded-md bg-background-700 animate-pulse"
              key={`status-${idx}`}
            ></span>
          ))}
        </div>
        <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
      </div>

      {/* Job card list */}
      <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonCandidateCard key={`job-${idx}`} />
        ))}
      </div>
    </>
  );
}
