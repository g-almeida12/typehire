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
import { JobDetailsSection } from "@/components/job/JobDetailsSection";

export default async function ApplicationsPage(
  props: PageProps<"/applications">,
) {
  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section className="w-full max-w-lg pb-4 mx-auto">
          <div className="mt-10 mb-7">
            <BackButton />
          </div>

          <h1 className="mb-2 text-xl font-medium">Suas candidaturas</h1>
          <ApplicationFilterDropdown />
        </section>

        <hr className="mt-8 mb-2 border-background-500 md:mb-0" />

        <div className="grid min-h-dvh flex-1 md:gap-4 md:grid-cols-[minmax(320px,1fr)_2fr] md:grid-rows-[minmax(0,1fr)]">
          <section className="min-w-0 md:pr-2 md:pt-2 md:overflow-y-auto">
            <Suspense fallback={<ApplicationListFallback />}>
              <ApplicationListContent props={props} />
            </Suspense>
          </section>

          <div className="relative min-w-0 md:pt-12 md:overflow-y-auto">
            <JobDetailsSection searchParams={props.searchParams} />
          </div>
        </div>
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
  const {jobId, ...filter} = ApplicationURLFilterSchema.parse(searchParams);
  const applicationResponse = await getApplicationsAction(filter, {
    page: 1,
    size: 10,
  });

  if (!applicationResponse.success) {
    return (
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <p className="text-background-300 text-lg/[22px]">
          Não foi possível carregar suas candidaturas no momento.
        </p>
        <p className="text-sm text-background-400 mt-2">
          Tente recarregar a página mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div>
      {applicationResponse.data.pagination.total > 0 && (
        <p className="mb-4 text-background-300">
          {applicationResponse.data.pagination.total}{" "}
          {applicationResponse.data.pagination.total === 1
            ? "candidatura encontrada"
            : "candidaturas encontradas"}
          .
        </p>
      )}

      <ApplicationListView filter={filter} cardType="APPLICATION" />
    </div>
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
