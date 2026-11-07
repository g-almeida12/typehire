import { BackButton } from "@/components/common/BackButton";
import {
  ApplicationURLFilterSchema,
  getApplicationsAction,
  getJobApplicationStatusesAction,
} from "@/lib/modules/application";
import { Metadata } from "next";
import { getJobByIdAction } from "@/lib/modules/job";
import { notFound } from "next/navigation";
import { ApplicationStatusFilter } from "@/components/applications/ApplicationStatusFilter";
import { CandidateListView } from "@/components/user/CandidateListView";
import { JobInfoTags } from "@/components/job/JobInfoTags";

export default async function JobApplicationsPage(
  props: PageProps<"/jobs/[id]/applications">,
) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const [jobResponse, jobApplicationStatusesResponse] = await Promise.all([
    getJobByIdAction(params.id),
    getJobApplicationStatusesAction(params.id),
  ]);
  if (!jobResponse.success) {
    if (jobResponse.status === 404) {
      notFound();
    } else {
      throw Error();
    }
  }
  if (!jobApplicationStatusesResponse.success) {
    throw Error()
  }

  const filter = ApplicationURLFilterSchema.parse({
    status: searchParams.status,
    jobId: jobResponse.data.id,
  });
  const applicationsResponse = await getApplicationsAction(filter, 1, 10);
  const isError = !applicationsResponse.success;
  const applications = !isError ? applicationsResponse.data.applications : [];
  const hasMoreApplications = !isError
    ? applicationsResponse.data.pagination.hasNextPage
    : false;
  const job = jobResponse.data;

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
          <p className="text-2xl font-medium">{job.title}</p>

          {/* Job level and modality tags */}
          <JobInfoTags level={job.level} modality={job.modality} />
        </section>

        <section>
          <div className="mb-12">
            <p className="mb-1">Selecione o filtro</p>
            <ApplicationStatusFilter
              jobApplicationStatuses={jobApplicationStatusesResponse.data}
            />
          </div>

          {isError ? (
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
              initialApplications={applications}
              initialHasMore={hasMoreApplications}
              key={JSON.stringify(searchParams)}
            />
          )}
        </section>
      </main>
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
