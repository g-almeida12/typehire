import "server-only";
import { getJobsAction, JobURLFilterSchema } from "@/lib/modules/job";
import { JobInfiniteList } from "./JobInfiniteList";
import { Suspense } from "react";
import { SkeletonJobCard } from "@/components/skeletons";
import { SearchParams } from "@/utils/types/page";

export function JobListView({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<JobListFallback />}>
      <JobListContent searchParams={searchParams} />
    </Suspense>
  );
}

async function JobListContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = await searchParams;
  const filter = JobURLFilterSchema.parse(search);
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
    <JobInfiniteList
      filter={filter}
      initialJobs={jobResponse.data.jobs}
      initialHasMore={jobResponse.data.pagination.hasNextPage}
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
