import { SearchInput } from "@/components/common/SearchInput";
import { JobListView } from "@/components/job/JobListView";
import { Navbar } from "@/components/ui/Navbar";
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
import { SkeletonCompanyProfile } from "@/components/skeletons";
import { truncateText } from "@/utils/string";
import { JobDetailsSection } from "@/components/job/JobDetailsSection";
import { Params, SearchParams } from "@/utils/types";
import { JobURLFilterSchema } from "@/lib/modules/job";

export default function CompanyJobsPage(
  props: PageProps<"/companies/[id]/jobs">,
) {
  return (
    <div className="flex min-h-0 flex-col md:h-dvh">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col pb-4">
        <div className="w-full max-w-lg pb-4 mx-auto">
          <div className="min-h-0 mt-10 mb-4 shrink-0">
            <Suspense fallback={<CompanyHeaderFallback />}>
              <CompanyJobsHeader props={props} />
            </Suspense>
          </div>
          <div className="shrink-0">
            <hr className="border-px border-background-500" />
            <h1 className="mb-2 mt-8 text-lg font-medium text-left text-background-300">
              Pesquise por vagas
            </h1>
            <SearchInput placeholder="Encontre sua próxima vaga" />
          </div>
        </div>

        <hr className="opacity-0 md:opacity-100 mt-8 border-background-500" />

        <div className="grid min-h-dvh flex-1 md:gap-4 md:grid-cols-[minmax(320px,1fr)_2fr] md:grid-rows-[minmax(0,1fr)]">
          <section className="min-w-0 md:pr-2 md:pt-2 md:overflow-y-auto">
            <JobListContent params={props.params} searchParams={props.searchParams} />
          </section>

          <div className="relative min-w-0 md:pt-2 md:overflow-y-auto">
            <JobDetailsSection searchParams={props.searchParams} />
          </div>
        </div>
      </main>
    </div>
  );
}

async function JobListContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const companyId = (await params).id;
  const queries = await searchParams;
  const filter = JobURLFilterSchema.parse({ ...queries, companyId });

  return <JobListView filter={filter} />
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
        <BackButton />

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
