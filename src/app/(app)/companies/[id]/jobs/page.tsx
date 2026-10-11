import { SearchInput } from "@/components/common/SearchInput";
import { JobListView } from "@/components/job/JobListView";
import { Navbar } from "@/components/ui/Navbar";
import { getJobsAction, JobURLFilterSchema } from "@/lib/modules/job/index";
import { getCurrentUserId } from "@/lib/data/user/index";
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
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);
  const filter = JobURLFilterSchema.parse(searchParams);
  const companyId = params.id;

  const [userId, jobsResponse, companyResponse] = await Promise.all([
    getCurrentUserId(),
    getJobsAction({ ...filter, companyId }, 1, 10),
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

          <div className="mt-6 mb-12">
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
              visualOnlyWebsiteLink={false}
            />

            <div className="mt-8">
              <h1 className="mb-2 text-xl font-medium">Pesquise por vagas</h1>
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
            <JobListView
              initialJobs={jobs}
              initialHasMore={hasMoreJobs}
              filter={filter}
              key={JSON.stringify(filter)}
            />
          )}
        </section>
      </main>
    </>
  );
}
