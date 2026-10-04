import { SearchInput } from "@/components/common/SearchInput";
import { JobListView } from "@/components/ui/JobListView";
import { Navbar } from "@/components/ui/Navbar";
import { getJobsAction } from "@/lib/modules/job/index";
import { getCurrentUserId } from "@/lib/data/user/index";
import { Suspense } from "react";
import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/common/CompanyProfile";
import { CreateIcon } from "@/components/icons";
import { getCompanyByIdAction } from "@/lib/modules/company";
import { notFound } from "next/navigation";
import { InfoTag } from "@/components/common/InfoTag";
import Link from "next/link";
import { APP_URLS } from "@/utils/constants";

export default async function CompanyJobsPage(
  props: PageProps<"/companies/[id]/jobs">,
) {
  const companyId = (await props.params).id;
  const [userId, jobsResponse, companyResponse] = await Promise.all([
    getCurrentUserId(),
    getJobsAction({ companyId }, 1, 10),
    getCompanyByIdAction(companyId),
  ]);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) {
      notFound();
    } else {
      throw new Error();
    }
  }
  const isError = !jobsResponse.success;

  const jobs = !isError ? jobsResponse.data.jobs : [];
  const hasMoreJobs = !isError
    ? jobsResponse.data.pagination.hasNextPage
    : false;

  const company = companyResponse.data;
  const companyCreator = company.members.filter(
    (m) => m.id === company.createdBy,
  )[0];
  const USER_ROLE =
    companyCreator.id === userId
      ? "CREATOR"
      : company.members.map((m) => m.id).includes(userId!)
        ? "MEMBER"
        : "USER";

  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section>
          <div className="flex flex-row items-center justify-between">
            <div className="size-6 mt-4">
              <BackButton />
            </div>

            {USER_ROLE !== "USER" && (
              <Link
                href={APP_URLS.jobCreate(companyId)}
                aria-label="Criar nova vaga"
                title="Criar nova vaga"
              >
                <CreateIcon />
              </Link>
            )}
          </div>

          <div className="my-6">
            {USER_ROLE !== "USER" && (
              <InfoTag
                label={
                  USER_ROLE === "CREATOR"
                    ? "Sua empresa"
                    : "Associado nessa empresa"
                }
              />
            )}
            <CompanyProfile
              company={company}
              type="readonly"
              showCompanySize={false}
            />

            <div className="mt-8">
              <h1 className="mb-4 text-xl font-medium">Pesquise por vagas</h1>
              <SearchInput placeholder="Digite o título da vaga" />
            </div>
          </div>
        </section>

        <section>
          {isError ? (
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <p className="text-background-300 text-lg/[22px]">
                Não foi possível carregar as vagas no momento.
              </p>
              <p className="text-sm text-background-400 mt-2">
                Tente recarregar a página mais tarde.
              </p>
            </div>
          ) : (
            <Suspense fallback={JobListViewFallback()}>
              <JobListView
                initialJobs={jobs}
                initialHasMore={hasMoreJobs}
                filter={{}}
                key={jobs.map((j) => j.id).join(",")}
              />
            </Suspense>
          )}
        </section>
      </main>
    </>
  );
}

function JobListViewFallback() {
  return (
    <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
      {/* Job card list */}
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          className="px-4 py-4 border-y border-y-background-700 not-first:-mt-px"
          key={idx}
        >
          {/* Company profile */}
          <div className="flex flex-row gap-2">
            <div className="shrink-0 size-10 bg-background-100 rounded-md animate-pulse"></div>
            <div className="flex flex-col gap-1 w-full">
              <span className="block h-5 w-[80%] rounded-sm bg-background-200 animate-pulse"></span>
              <span className="block h-3 w-40 rounded-sm bg-background-300 animate-pulse"></span>
            </div>
          </div>

          {/* Job tags */}
          <div className="flex flex-row gap-2 mt-3">
            <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
            <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
          </div>

          {/* Job salary and creation date */}
          <div className="flex flex-row justify-between items-baseline mt-6">
            <span className="h-7 w-30 rounded-md bg-background-100 animate-pulse"></span>
            <span className="h-3 w-15 rounded-sm bg-background-300 animate-pulse"></span>
          </div>
        </div>
      ))}
    </div>
  );
}
