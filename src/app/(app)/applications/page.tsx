import { Navbar } from "@/components/ui/Navbar";
import { BackButton } from "@/components/common/BackButton";
import {
  ApplicationURLFilterSchema,
  getApplicationsAction,
} from "@/lib/modules/application";
import { ApplicationListView } from "@/components/applications/ApplicationListView";
import { ApplicationFilterDropdown } from "@/components/applications/ApplicationFilterDropdown";
import { Metadata } from "next";

export default async function ApplicationsPage(
  props: PageProps<"/applications">,
) {
  const searchParams = await props.searchParams;
  const filter = ApplicationURLFilterSchema.parse(searchParams);

  const applicationsResponse = await getApplicationsAction(filter, 1, 10);
  const isError = !applicationsResponse.success;
  const applications = !isError ? applicationsResponse.data.applications : [];
  const hasMoreApplications = !isError
    ? applicationsResponse.data.pagination.hasNextPage
    : false;

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

        <section>
          {isError ? (
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <p className="text-background-300 text-lg/[22px]">
                Não foi possível carregar suas candidaturas no momento.
              </p>
              <p className="text-sm text-background-400 mt-2">
                Tente recarregar a página mais tarde.
              </p>
            </div>
          ) : (
            <ApplicationListView
              filter={filter}
              initialApplications={applications}
              initialHasMore={hasMoreApplications}
              key={JSON.stringify(searchParams)}
            />
          )}
        </section>
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title: "Suas aplicações | Typehire",
  description:
    "Visualize todas as suas candidaturas organizando por filtro para melhores resultados.",
};
