"use client";

import { ModuleListView, type ModuleResponse } from "../ui/ModulesListView";
import { CandidateCard } from "../user/CandidateCard";
import {
  ApplicationFormFilterOutputPayload,
  ApplicationResponsePayload,
  getApplicationsAction,
} from "@/lib/modules/application";

interface CandidateListViewProps {
  filter: ApplicationFormFilterOutputPayload;
  initialApplications: ApplicationResponsePayload[];
  initialHasMore: boolean;
}

export function CandidateListView({
  filter,
  initialApplications,
  initialHasMore,
}: CandidateListViewProps) {
  const handleModulesAction = async (
    filter: any,
    page?: number,
    pageSize?: number,
  ): Promise<ModuleResponse<ApplicationResponsePayload>> => {
    const result = await getApplicationsAction(filter, page, pageSize);
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
      errorMessage="Não foi possível carregar mais candidaturas."
      modulesListEndMessage="Parece que a lista de candidatos chegou ao fim."
      getModulesAction={handleModulesAction}
      filter={filter}
      renderItem={(application) => (
        <CandidateCard
          candidate={application.candidate}
          applicationId={application.id}
          status={application.status}
          createdAt={application.createdAt}
        />
      )}
      initialModules={initialApplications}
      initialHasMore={initialHasMore}
      key={JSON.stringify(filter)}
    />
  );
}
