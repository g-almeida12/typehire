import { SearchInput } from "@/components/common/SearchInput";
import { JobListView } from "@/components/job/JobListView";
import { Navbar } from "@/components/ui/Navbar";
import { getJobsAction, JobURLFilterSchema } from "@/lib/modules/job/index";
import { getCurrentUserId } from "@/lib/data/user/index";
import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { ArrowLeftIcon, CreateIcon } from "@/components/icons";
import { getCompanyByIdAction } from "@/lib/modules/company";
import { notFound } from "next/navigation";
import { InfoTag } from "@/components/common/InfoTag";
import Link from "next/link";
import { APP_URLS } from "@/utils/constants";
import { Metadata } from "next";
import { Suspense } from "react";
import {
  SkeletonCompanyProfile,
  SkeletonJobCard,
} from "@/components/skeletons";
import { truncateText } from "@/utils/string";

export default async function CompanyJobsPage(
  props: PageProps<"/companies/[id]/jobs">,
) {
  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section className="mb-12">
          <Suspense fallback={<CompanyHeaderFallback />}>
            <CompanyJobsHeader props={props} />
          </Suspense>

          <div className="mt-8">
            <h1 className="mb-2 text-xl font-medium">Pesquise por vagas</h1>
            <SearchInput placeholder="Digite o título da vaga" />
          </div>
        </section>

        <section>
          <Suspense fallback={<JobListFallback />}>
            <JobListContent props={props} />
          </Suspense>
        </section>
      </main>
    </>
  );
}

async function CompanyJobsHeader({
  props,
}: {
  props: PageProps<"/companies/[id]/jobs">;
}) {
  const companyId = (await props.params).id;
  const [userId, companyResponse] = await Promise.all([
    getCurrentUserId(),
    getCompanyByIdAction(companyId),
  ]);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to load company jobs header for company ID: ${companyId}`,
      );
  }

  const USER_ROLE =
    companyResponse.data.createdBy === userId
      ? "CREATOR"
      : companyResponse.data.members.map((m) => m.id).includes(userId!)
        ? "MEMBER"
        : "USER";

  return (
    <div className="mt-4">
      <div className="flex flex-row items-center justify-between">
        <div className="size-6">
          <BackButton />
        </div>

        {USER_ROLE !== "USER" && (
          <Link
            href={APP_URLS.JOB_CREATE(companyId)}
            aria-label="Criar nova vaga"
            title="Criar nova vaga"
          >
            <CreateIcon aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="mt-6">
        {USER_ROLE !== "USER" && (
          <InfoTag
            label={USER_ROLE === "CREATOR" ? "Sua empresa" : "Você é membro"}
          />
        )}
        <CompanyProfile
          company={companyResponse.data}
          type="readonly"
          showCompanySize={false}
          visualOnlyWebsiteLink={false}
        />
      </div>
    </div>
  );
}

async function JobListContent({
  props,
}: {
  props: PageProps<"/companies/[id]/jobs">;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const filter = JobURLFilterSchema.parse({
    ...searchParams,
    companyId: params.id,
  });
  const jobResponse = await getJobsAction(filter, { page: 1, size: 10 });

  if (!jobResponse.success) {
    return (
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <p className="text-background-300 text-lg/[22px]">
          Não foi possível carregar mais vagas.
        </p>
        <p className="text-sm text-background-400 mt-2">
          Tente recarregar a página mais tarde.
        </p>
      </div>
    );
  }

  return (
    <JobListView
      initialJobs={jobResponse.data.jobs}
      initialHasMore={jobResponse.data.pagination.hasNextPage}
      filter={filter}
    />
  );
}

export async function generateMetadata(
  props: PageProps<"/companies/[id]/jobs">,
): Promise<Metadata> {
  const companyId = (await props.params).id;
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to generate metadata for company ID: ${companyId}`,
      );
  }

  const company = companyResponse.data;
  return {
    title: `Vagas da ${truncateText(company.name, 35)} | TypeHire`,
    description: truncateText(company.bio),
  };
}

function CompanyHeaderFallback() {
  return (
    <div className="mt-4">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="size-6">
          <ArrowLeftIcon
            size={24}
            className="animate-pulse"
            aria-hidden="true"
          />
        </div>
        <div className="size-6">
          <CreateIcon size={24} className="animate-pulse" aria-hidden="true" />
        </div>
      </div>

      <SkeletonCompanyProfile />
    </div>
  );
}

function JobListFallback() {
  return (
    <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
      {Array.from({ length: 4 }).map((_, idx) => (
        <SkeletonJobCard key={`job-${idx}`} />
      ))}
    </div>
  );
}
