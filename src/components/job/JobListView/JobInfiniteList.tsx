"use client";
// Internal use of JobListView. Import JobListView into the pages.

import { ModuleListView, ModuleResponse } from "@/components/ui/ModuleListView";
import {
  getJobsAction,
  JobResponsePayload,
  JobURLFilterPayload,
} from "@/lib/modules/job";
import { JobCard } from "../JobCard";
import { usePathname, useSearchParams } from "next/navigation";

interface JobInfiniteListProps {
  filter: JobURLFilterPayload;
  initialJobs: JobResponsePayload[];
  initialHasMore: boolean;
}

export function JobInfiniteList({
  filter,
  initialJobs,
  initialHasMore,
}: JobInfiniteListProps) {
  const location = usePathname();
  const searchParams = useSearchParams();

  const handleJobsAction = async (
    filter: any,
    page?: number,
    size?: number,
  ): Promise<ModuleResponse<JobResponsePayload>> => {
    const result = await getJobsAction(filter, { page, size });
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
      getModulesAction={handleJobsAction}
      filter={filter}
      renderItem={(job) => {
        const sp = new URLSearchParams(searchParams);
        sp.set("jobId", job.id);

        return <JobCard job={job} navigateTo={`${location}?${sp.toString()}`} />;
      }}
      initialModules={initialJobs}
      initialHasMore={initialHasMore}
      key={JSON.stringify(filter)}
    />
  );
}
