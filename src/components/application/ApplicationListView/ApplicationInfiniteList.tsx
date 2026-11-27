"use client";
import { usePathname, useSearchParams } from "next/navigation";
// Internal use of ApplicationListView. Import ApplicationListView into the pages.

import { ModuleListView, type ModuleResponse } from "../../ui/ModuleListView";
import { CandidateCard } from "../../user/CandidateCard";
import { ApplicationCard } from "@/components/application/ApplicationCard";
import {
  ApplicationFormFilterOutputPayload,
  ApplicationResponsePayload,
  getApplicationsAction,
} from "@/lib/modules/application";

interface ApplicationInfiniteListProps {
  filter: ApplicationFormFilterOutputPayload;
  initialApplications: ApplicationResponsePayload[];
  initialHasMore: boolean;
  cardType: "CANDIDATE" | "APPLICATION";
}

export function ApplicationInfiniteList({
  filter,
  initialApplications,
  initialHasMore,
  cardType,
}: ApplicationInfiniteListProps) {
  const location = usePathname();
  const searchParams = useSearchParams();

  const handleModulesAction = async (
    filter: any,
    page?: number,
    size?: number,
  ): Promise<ModuleResponse<ApplicationResponsePayload>> => {
    const result = await getApplicationsAction(filter, { page, size });
    if (result.success) {
      return {
        success: true,
        data: {
          modules: result.data.applications,
          pagination: result.data.pagination,
        },
      };
    }

    return { success: false, message: result.message };
  };

  return (
    <ModuleListView
      errorMessage={`Não foi possível carregar mais ${cardType === "CANDIDATE" ? "candidatos" : "candidaturas"}.`}
      modulesListEndMessage={`Parece que a lista de ${cardType === "CANDIDATE" ? "candidatos" : "candidaturas"} chegou ao fim.`}
      getModulesAction={handleModulesAction}
      filter={filter}
      renderItem={(application) => {
        const sp = new URLSearchParams(searchParams);

        if (cardType === "CANDIDATE") {
          sp.set("candidateId", application.candidateId);
          return (
            <CandidateCard
              candidate={application.candidate}
              applicationId={application.id}
              status={application.status}
              createdAt={application.createdAt}
              navigateTo={`${location}?${sp.toString()}`}
            />
          );
        } else {
          sp.set("jobId", application.jobId);
          return (
            <ApplicationCard
              application={application}
              navigateTo={`${location}?${sp.toString()}`}
            />
          );
        }
      }}
      initialModules={initialApplications}
      initialHasMore={initialHasMore}
      key={JSON.stringify(filter)}
    />
  );
}
