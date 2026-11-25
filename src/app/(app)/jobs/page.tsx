import { Greeting } from "@/components/common/Greeting";
import { SearchInput } from "@/components/common/SearchInput";
import { JobDetailsSection } from "@/components/job/JobDetailsSection/JobDetailsSection";
import { JobListView } from "@/components/job/JobListView";
import { Navbar } from "@/components/ui/Navbar";
import { JobURLFilterSchema } from "@/lib/modules/job";
import { SearchParams } from "@/utils/types";

export default function JobsPage(props: PageProps<"/jobs">) {
  return (
    <div className="flex min-h-0 flex-col md:h-dvh">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col pb-4">
        <div className="min-h-0 mt-10 mb-4 shrink-0">
          <Greeting />
        </div>
        <div className="shrink-0">
          <SearchInput placeholder="Encontre sua próxima vaga" />
        </div>

        <hr className="opacity-0 md:opacity-100 mt-8 border-background-500" />

        <div className="grid min-h-dvh flex-1 md:gap-4 md:grid-cols-[minmax(320px,1fr)_2fr] md:grid-rows-[minmax(0,1fr)]">
          <section className="min-w-0 md:pr-2 md:pt-2 md:overflow-y-auto">
            <JobListContent searchParams={props.searchParams} />
          </section>

          <div className="relative min-w-0 md:pt-2 md:overflow-y-auto">
            <JobDetailsSection searchParams={props.searchParams} />
          </div>
        </div>
      </main>
    </div>
  );
}

async function JobListContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queries = await searchParams;
  const filter = JobURLFilterSchema.parse(queries);

  return <JobListView filter={filter} />;
}
