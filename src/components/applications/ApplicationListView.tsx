"use client";

import {
  ApplicationFormFilterOutputPayload,
  ApplicationResponsePayload,
  getApplicationsAction,
} from "@/lib/modules/application";
import { ModuleListView, type ModuleResponse } from "../ui/ModulesListView";
import { ApplicationCard } from "./ApplicationCard";

interface ApplicationListViewProps {
  filter: ApplicationFormFilterOutputPayload;
  initialApplications: ApplicationResponsePayload[];
  initialHasMore: boolean;
}

export function ApplicationListView({
  filter,
  initialApplications,
  initialHasMore,
}: ApplicationListViewProps) {
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
      modulesListEndMessage="Todas as suas candidaturas estão aqui."
      getModulesAction={handleModulesAction}
      filter={filter}
      renderItem={(application) => (
        <ApplicationCard application={application} />
      )}
      initialModules={initialApplications}
      initialHasMore={initialHasMore}
    />
  );
}
