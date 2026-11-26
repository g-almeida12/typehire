import { getJobByIdAction } from "@/lib/modules/job";
import { Suspense } from "react";
import { JobHeaderSection } from "./JobHeaderSection";
import { JobInfoSection } from "./JobInfoSection";
import { Navbar } from "../../ui/Navbar";
import { LockBodyScroll } from "../../ui/LockBodyScroll";
import { JobActions } from "../JobActions";
import { SearchParams } from "@/utils/types";
import { getSearchParam } from "@/utils/string";
import { JobNotFound } from "../JobNotFound";
import { getCurrentUserData } from "@/lib/data/user";

interface JobDetailsProps {
  searchParams: SearchParams;
}

export function JobDetailsSection({ searchParams }: JobDetailsProps) {
  return (
    <Suspense fallback={<JobSectionFallback />}>
      <JobContent searchParams={searchParams} />
    </Suspense>
  );
}

async function JobContent({ searchParams }: { searchParams: SearchParams }) {
  const queries = await searchParams;
  const jobId = getSearchParam(queries, "jobId");
  if (!jobId) return <JobSectionFallback />;

  const [user, jobResponse] = await Promise.all([
    getCurrentUserData(),
    getJobByIdAction(jobId),
  ]);

  if (!jobResponse.success) return <JobNotFound closeButtonQuery="jobId" />;

  const job = jobResponse.data;
  const userRole =
    job.creator.id === user!.id || job.company.createdBy === user!.id
      ? "CREATOR"
      : job.company.memberIds.includes(user!.id)
        ? "MEMBER"
        : "USER";

  return (
    <section className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-background-1000 md:static md:z-auto md:p-2 md:pb-4 md:overscroll-auto md:border md:rounded-md md:border-background-500">
      <div className="md:hidden">
        <Navbar />
      </div>
      <div className="p-4 md:p-2">
        <LockBodyScroll device="MOBILE" />

        <JobActions job={job} userId={user!.id} />
        <div>
          <>
            <JobHeaderSection
              userRole={userRole}
              currentUserId={user!.id}
              job={job}
            />
            <hr className="my-8" />
            <JobInfoSection skills={user!.skills} job={job} />
          </>
        </div>
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
