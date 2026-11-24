import { Greeting } from "@/components/common/Greeting";
import { SearchInput } from "@/components/common/SearchInput";
import { JobActions } from "@/components/job/JobActions";
import { JobDetails } from "@/components/job/JobDetails";
import { JobListView } from "@/components/job/JobListView";
import { JobNotFoundContent } from "@/components/job/JobNotFoundContent";
import { LockMobileBodyScroll } from "@/components/ui/LockMobileBodyScroll";
import { Navbar } from "@/components/ui/Navbar";
import { getCurrentUserData } from "@/lib/data/user";
import { getJobByIdAction } from "@/lib/modules/job";
import { getSearchParam } from "@/utils/string";
import { SearchParams } from "@/utils/types";
import { Suspense } from "react";

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
            <JobListView searchParams={props.searchParams} />
          </section>

          <div className="relative min-w-0 md:pt-2 md:overflow-y-auto">
            <Suspense fallback={<JobSectionFallback />}>
              <JobSection searchParams={props.searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

async function JobSection({ searchParams }: { searchParams: SearchParams }) {
  const queries = await searchParams;
  const jobId = getSearchParam(queries, "job-id");
  if (!jobId) return <JobSectionFallback />;

  const [user, jobResponse] = await Promise.all([
    getCurrentUserData(),
    getJobByIdAction(jobId),
  ]);

  if (!jobResponse.success) return <JobNotFoundContent />;

  return (
    <section
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-background-1000 md:static md:z-auto md:p-2 md:overscroll-auto md:border md:rounded-md md:border-background-500"
      key={JSON.stringify(queries)}
    >
      <div className="p-4 md:p-2">
        <LockMobileBodyScroll />
        <JobActions job={jobResponse.data} userId={user!.id} />
        <JobDetails job={jobResponse.data} user={user!} />
      </div>
    </section>
  );
}

function JobSectionFallback() {
  return (
    <div>
      <p className="text-sm text-background-300">
        Selecione uma vaga da lista e veja todos os detalhes, como localização,
        experiência necessária, salário e descrição detalhada.
      </p>
    </div>
  );
}
