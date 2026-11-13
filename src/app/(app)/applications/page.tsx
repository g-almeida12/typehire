import { Navbar } from "@/components/ui/Navbar";
import { BackButton } from "@/components/common/BackButton";
import {
  ApplicationURLFilterSchema,
  getApplicationsAction,
} from "@/lib/modules/application";
import { ApplicationListView } from "@/components/application/ApplicationListView";
import { ApplicationFilterDropdown } from "@/components/application/ApplicationFilterDropdown";
import { Metadata } from "next";
import { Suspense } from "react";
import { SkeletonApplicationCard } from "@/components/skeletons";

export default async function ApplicationsPage(
  props: PageProps<"/applications">,
) {
  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section>
          <div className="flex flex-row items-center justify-between">
            <div className="size-6 mt-4">
              <BackButton />
            </div>
          </div>

          <div className="mt-6 mb-12">
            <div className="mt-8">
              <h1 className="mb-2 text-xl font-medium">Suas candidaturas</h1>
              <ApplicationFilterDropdown />
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center px-4 text-center">
          <Suspense fallback={<ApplicationListFallback />}>
            <ApplicationListContent props={props} />
          </Suspense>
        </section>
      </main>
    </>
  );
}

async function ApplicationListContent({
  props,
}: {
  props: PageProps<"/applications">;
}) {
  const searchParams = await props.searchParams;
  const filter = ApplicationURLFilterSchema.parse(searchParams);
  const applicationResponse = await getApplicationsAction(filter, 1, 10);

  if (!applicationResponse.success) {
    return (
      <>
        <p className="text-background-300 text-lg/[22px]">
          Não foi possível carregar suas candidaturas no momento.
        </p>
        <p className="text-sm text-background-400 mt-2">
          Tente recarregar a página mais tarde.
        </p>
      </>
    );
  }

  return (
    <ApplicationListView
      filter={filter}
      initialApplications={applicationResponse.data.applications}
      initialHasMore={applicationResponse.data.pagination.hasNextPage}
    />
  );
}

function ApplicationListFallback() {
  return (
    <div
      className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]"
      aria-busy="true"
    >
      {Array.from({ length: 4 }).map((_, idx) => (
        <SkeletonApplicationCard key={`job-${idx}`} />
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Suas aplicações | Typehire",
  description:
    "Visualize todas as suas candidaturas organizando por filtro para melhores resultados.",
};
