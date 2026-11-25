import "server-only";
import { getJobsAction, JobURLFilterPayload } from "@/lib/modules/job";
import { JobInfiniteList } from "./JobInfiniteList";
import { Suspense } from "react";
import { SkeletonJobCard } from "@/components/skeletons";
import { ErrorMessage } from "@/components/common/ErrorMessage";

interface JobListViewProps {
  filter: JobURLFilterPayload;
}

export function JobListView({ filter }: JobListViewProps) {
  return (
    <Suspense fallback={<JobListFallback />}>
      <JobListContent filter={filter} />
    </Suspense>
  );
}

async function JobListContent({ filter }: JobListViewProps) {
  const jobResponse = await getJobsAction(filter, { page: 1, size: 10 });

  if (!jobResponse.success) {
    return (
      <ErrorMessage message="Não foi possível carregar as vagas disponíveis. Tente novamente mais tarde." />
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
