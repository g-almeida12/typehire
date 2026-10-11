import { SearchInput } from "@/components/common/SearchInput";
import { JobListView } from "@/components/job/JobListView";
import { Navbar } from "@/components/ui/Navbar";
import { getJobsAction, JobURLFilterSchema } from "@/lib/modules/job/index";
import { getCurrentUserData } from "@/lib/data/user/index";

export default async function HomePage(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const filter = JobURLFilterSchema.parse(searchParams);

  const [user, jobsResult] = await Promise.all([
    getCurrentUserData(),
    getJobsAction(filter, 1, 10),
  ]);

  const isError = !jobsResult.success;
  const jobs = !isError ? jobsResult.data.jobs : [];
  const hasMoreJobs = !isError ? jobsResult.data.pagination.hasNextPage : false;

  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section className="flex flex-col gap-2 mt-10 mb-12">
          <p className="text-xl font-medium text-center">
            {user?.name ? `Olá, ${user.name}.` : "Olá"}
          </p>
          <SearchInput placeholder="Encontre sua próxima vaga" />
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
