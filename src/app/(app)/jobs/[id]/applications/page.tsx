import { BackButton } from "@/components/common/BackButton";
import { ApplicationURLFilterSchema, getJobApplicationStatusesAction } from "@/lib/modules/application";
import { Metadata } from "next";
import { getJobByIdAction } from "@/lib/modules/job";
import { notFound } from "next/navigation";
import { JobInfoTags } from "@/components/job/JobInfoTags";
import { Suspense } from "react";
import { SkeletonProfileContent, SkeletonText } from "@/components/skeletons";
import { getSearchParam, truncateText } from "@/utils/string";
import { Navbar } from "@/components/ui/Navbar";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { Params, SearchParams } from "@/utils/types";
import { CandidateDetailsSection } from "@/components/user/CandidateDetailsSection";
import { getUserByIdAction } from "@/lib/modules/user";
import { CandidateNotFound } from "@/components/user/CandidateNotFound";
import { ApplicationListView } from "@/components/application/ApplicationListView";
import { ApplicationStatusFilter } from "@/components/application/ApplicationStatusFilter";

export default async function JobApplicationsPage(
  props: PageProps<"/jobs/[id]/applications">,
) {
  return (
    <div className="flex min-h-0 flex-col md:h-dvh">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col pb-4">
        <section className="w-full max-w-lg pb-4 mx-auto">
          <div className="mt-10 mb-7">
            <BackButton />
          </div>

          <Suspense fallback={<JobHeaderFallback />}>
            <JobHeader params={props.params} />
          </Suspense>
        </section>

        <hr className="mt-8 mb-4 border-background-500 md:mb-0" />

        <div className="grid min-h-dvh flex-1 md:gap-4 md:grid-cols-[minmax(320px,1fr)_2fr] md:grid-rows-[minmax(0,1fr)]">
          <section className="min-w-0 md:pr-2 md:pt-2 md:overflow-y-auto">
            <Suspense fallback={null}>
              <CandidateListContent
                params={props.params}
                searchParams={props.searchParams}
              />
            </Suspense>
          </section>

          <div className="relative min-w-0 md:pt-12 md:overflow-y-auto">
            <Suspense
              fallback={<SkeletonProfileContent /> }
            >
              <CandidateDetailsContent searchParams={props.searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

async function JobHeader({ params }: { params: Params }) {
  const jobId = (await params).id;
  const jobResponse = await getJobByIdAction(jobId);
  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw new Error(`Failed to load header for job ID: ${jobId}`);
  }

  return (
    <>
      <CompanyProfile company={jobResponse.data.company} type="readonly" />
      <p className="mt-3 text-xl font-semibold">{jobResponse.data.title}</p>
      <JobInfoTags
        level={jobResponse.data.level}
        modality={jobResponse.data.modality}
      />
    </>
  );
}

async function CandidateListContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const queries = await searchParams;
  const jobId = (await params).id;
  const filter = ApplicationURLFilterSchema.parse({ ...queries, jobId });

  const jobAppStatuses = await getJobApplicationStatusesAction(jobId);
    if (!jobAppStatuses.success) {
    if (jobAppStatuses.status === 404) notFound();
    else throw new Error(`Failed to load job application statuses for job ID: ${jobId}`);
  }

  return (
    <>
      <div className="mb-6 md:mb-0">
        <ApplicationStatusFilter
          jobApplicationStatuses={jobAppStatuses.data}
        />
      </div>
      <ApplicationListView filter={filter} cardType="CANDIDATE" />
    </>
  );
}

async function CandidateDetailsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queries = await searchParams;
  const candidateId = getSearchParam(queries, "candidateId");
  if (!candidateId) {
    return (
      <div>
        <p className="hidden text-sm text-background-300 md:block">
          Selecione um usuário da lista e veja seu nome, email, habilidades
          cadastradas e as empresas em que participa
        </p>
      </div>
    );
  }

  const candidateResponse = await getUserByIdAction(candidateId);
  if (!candidateResponse.success)
    return <CandidateNotFound closeButtonQuery="userId" />;

  return <CandidateDetailsSection candidate={candidateResponse.data} />;
}

export async function generateMetadata(
  props: PageProps<"/jobs/[id]/applications">,
): Promise<Metadata> {
  const jobId = (await props.params).id;
  const jobResponse = await getJobByIdAction(jobId);

  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw new Error(`Failed to generate metadata for job ID: ${jobId}`);
  }

  return {
    title: `Suas candidaturas da vaga para ${truncateText(jobResponse.data.title, 35)} | TypeHire`,
    description: `Veja todas as candidaturas para a sua vaga de ${truncateText(jobResponse.data.title, 35)}, filtre os candidatos e escolha quem melhor se encaixar.`,
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
