import "server-only";

import { ApplicationInfiniteList } from "./ApplicationInfiniteList";
import { Suspense } from "react";
import {
  SkeletonApplicationCard,
  SkeletonCandidateCard,
} from "@/components/skeletons";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import {
  ApplicationURLFilterPayload,
  getApplicationsAction,
} from "@/lib/modules/application";

interface ApplicationListViewProps {
  filter: ApplicationURLFilterPayload;
  cardType: "CANDIDATE" | "APPLICATION";
}

export function ApplicationListView({
  filter,
  cardType,
}: ApplicationListViewProps) {
  return (
    <Suspense fallback={<ApplicationListFallback cardType={cardType} />}>
      <ApplicationListContent filter={filter} cardType={cardType} />
    </Suspense>
  );
}

async function ApplicationListContent({
  filter,
  cardType,
}: ApplicationListViewProps) {
  const appResponse = await getApplicationsAction(filter, {
    page: 1,
    size: 10,
  });

  if (!appResponse.success) {
    return (
      <ErrorMessage
        message={`Não foi possível carregar ${cardType === "CANDIDATE" ? "as candidaturas" : "os candidatos"} disponíveis. Tente novamente mais tarde.`}
      />
    );
  }

  return (
    <ApplicationInfiniteList
      filter={filter}
      initialApplications={appResponse.data.applications}
      initialHasMore={appResponse.data.pagination.hasNextPage}
      key={JSON.stringify(filter)}
      cardType={cardType}
    />
  );
}

function ApplicationListFallback({
  cardType,
}: {
  cardType: "CANDIDATE" | "APPLICATION";
}) {
  return (
    <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
      {Array.from({ length: 4 }).map((_, idx) => {
        if (cardType === "CANDIDATE") {
          return <SkeletonCandidateCard key={`candidate-${idx}`} />;
        } else {
          return <SkeletonApplicationCard key={`application-${idx}`} />;
        }
      })}
    </div>
  );
}
