"use client";

import {
  JobFormFilterOutputPayload,
  JobResponsePayload,
  getJobsAction,
} from "@/lib/modules/job";
import { ModuleListView, type ModuleResponse } from "../ui/ModulesListView";
import { JobCard } from "./JobCard";
import { SkeletonJobCard } from "../skeletons";

interface JobListViewProps {
  filter: JobFormFilterOutputPayload;
  initialJobs: JobResponsePayload[];
  initialHasMore: boolean;
}

export function JobListView({
  filter,
  initialJobs,
  initialHasMore,
}: JobListViewProps) {
  const handleModulesAction = async (
    filter: any,
    page?: number,
    pageSize?: number,
  ): Promise<ModuleResponse<JobResponsePayload>> => {
    const result = await getJobsAction(filter, page, pageSize);
    if (result.success) {
      return {
        success: true,
        data: {
          modules: result.data.jobs,
          pagination: result.data.pagination,
        },
      };
    }

    return { success: false, message: result.message };
  };

  return (
    <ModuleListView
      errorMessage="Não foi possível carregar mais vagas."
      modulesListEndMessage="Infelizmente não temos mais vagas para mostrar."
      getModulesAction={handleModulesAction}
      filter={filter}
      renderItem={(job) => <JobCard job={job} />}
      initialModules={initialJobs}
      initialHasMore={initialHasMore}
      SuspenseFallback={<JobListViewFallback />}
      key={JSON.stringify(filter)}
    />
  );
}

function JobListViewFallback() {
  return (
    <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
      {Array.from({ length: 4 }).map((_, idx) => (
        <SkeletonJobCard key={`job-${idx}`} />
      ))}
    </div>
  );
}
