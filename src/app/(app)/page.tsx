import { SearchInput } from "@/components/common/SearchInput";
import { JobListView } from "@/components/ui/JobListView";
import { Navbar } from "@/components/ui/Navbar";
import { getJobsAction } from "@/lib/actions";
import { getUserSession } from "@/lib/data";
import { Suspense } from "react";

export default async function HomePage() {
  const user = (await getUserSession()).user;

  const jobsResult = await getJobsAction(1, 10);
  const jobs = jobsResult.success ? jobsResult.data.jobs : [];
  const hasMoreJobs = jobsResult.success
    ? jobsResult.data.pagination.hasNextPage
    : false;

  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-col gap-2 mt-10 mb-12">
          <p className="text-xl font-medium text-center">
            {user?.name ? `Olá, ${user.name}.` : "Olá"}
          </p>
          <SearchInput placeholder="Encontre sua próxima vaga" />
        </div>

        <Suspense fallback={JobListViewFallback()}>
          <JobListView initialJobs={jobs} initialHasMore={hasMoreJobs} />
        </Suspense>
      </main>
    </>
  );
}

function JobListViewFallback() {
  return (
    <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
      {/* Job Card */}
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
