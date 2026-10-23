import { SkeletonText, SkeletonCandidateCard } from "@/components/skeletons";
import { ArrowLeftIcon } from "@/components/icons";

export default function JobApplicationsLoading() {
  return (
    <main aria-busy="true">
      <ArrowLeftIcon className="mt-4 animate-pulse" />
      {/* Job info */}
      <div className="my-6">
        <SkeletonText height="7" width="[80%]" customClassName="mx-auto" />

        <div className="flex flex-row gap-2 mt-3">
          <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
          <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
        </div>
      </div>

      {/* Status filter */}
      <div className="mb-12">
        <SkeletonText customClassName="h-4 w-50" />

        <div className="w-[calc(100%+1rem)] flex flex-row gap-2 overflow-x-hidden mt-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <span
              className="shrink-0 w-20 h-8 rounded-md bg-background-700 animate-pulse"
              key={`status-${idx}`}
            ></span>
          ))}
        </div>
        <span className="w-25 h-7 rounded-md bg-background-700 animate-pulse"></span>
      </div>

      {/* Job card list */}
      <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonCandidateCard key={`job-${idx}`} />
        ))}
      </div>
    </main>
  );
}
