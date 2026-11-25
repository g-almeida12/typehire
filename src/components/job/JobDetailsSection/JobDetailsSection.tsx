import { JobResponsePayload } from "@/lib/modules/job";
import { Suspense } from "react";
import { JobHeaderSection } from "./JobHeaderSection";
import { JobInfoSection } from "./JobInfoSection";
import { UserPublicResponsePayload } from "@/lib/modules/user";
import { Navbar } from "../../ui/Navbar";
import { LockMobileBodyScroll } from "../../ui/LockMobileBodyScroll";
import { JobActions } from "../JobActions";

interface JobDetailsProps {
  job: JobResponsePayload;
  user: Pick<UserPublicResponsePayload, "id" | "skills">;
}

export function JobDetailsSection({ job, user }: JobDetailsProps) {
  return (
    <Suspense>
      <JobContent job={job} user={user} />
    </Suspense>
  );
}

async function JobContent({ job, user }: JobDetailsProps) {
  const userRole =
    job.creator.id === user!.id || job.company.createdBy === user!.id
      ? "CREATOR"
      : job.company.memberIds.includes(user!.id)
        ? "MEMBER"
        : "USER";

  return (
    <section className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-background-1000 md:static md:z-auto md:p-2 md:overscroll-auto md:border md:rounded-md md:border-background-500">
      <div className="md:hidden">
        <Navbar />
      </div>
      <div className="p-4 md:p-2">
        <LockMobileBodyScroll />

        <JobActions job={job} userId={user.id} />
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
