import { SearchInput } from "@/components/common/SearchInput";
import { JobListView } from "@/components/job/JobListView";
import { Navbar } from "@/components/ui/Navbar";
import { getJobsAction, JobURLFilterSchema } from "@/lib/modules/job/index";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Suspense } from "react";
import { SkeletonJobCard } from "@/components/skeletons";

export default function HomePage(props: PageProps<"/">) {
  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section className="flex flex-col gap-2 mt-10 mb-12">
          <Suspense
            fallback={<p className="text-xl font-medium text-center">Olá.</p>}
          >
            <Greeting />
          </Suspense>
          <SearchInput placeholder="Encontre sua próxima vaga" />
        </section>

        <section>
          <Suspense fallback={<JobListFallback />}>
            <JobList props={props} />
          </Suspense>
        </section>
      </main>
    </>
  );
}

async function Greeting() {
  const user = await getCurrentUserData();

  return (
    <p className="text-xl font-medium text-center">
      {user?.name ? `Olá, ${user.name.split(" ")[0]}.` : "Olá"}
    </p>
  );
}

async function JobList({ props }: { props: PageProps<"/"> }) {
  const searchParams = await props.searchParams;
  const filter = JobURLFilterSchema.parse(searchParams);
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
      key={JSON.stringify(filter)}
    />
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
