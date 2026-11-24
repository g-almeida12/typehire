import { JobResponsePayload } from "@/lib/modules/job";
import { Suspense } from "react";
import { JobHeaderSection } from "./sections/JobHeaderSection";
import { JobInfoSection } from "./sections/JobInfoSection";
import { UserPublicResponsePayload } from "@/lib/modules/user";

interface JobDetailsProps {
  job: JobResponsePayload;
  user: Pick<UserPublicResponsePayload, "id" | "skills">;
}

export function JobDetails({ job, user }: JobDetailsProps) {
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
    <>
      <JobHeaderSection
        userRole={userRole}
        currentUserId={user!.id}
        job={job}
      />
      <hr className="my-8" />
      <JobInfoSection skills={user!.skills} job={job} />
    </>
  );
}
