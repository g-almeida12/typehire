import { JobResponsePayload } from "@/lib/modules/job";
import { Suspense } from "react";
import { JobActionsWrapper } from "./JobActionsWrapper";
import { CloseButtonByQueryRemove } from "@/components/common/CloseButtonByQueryRemove";

interface JobActionsProps {
  job: JobResponsePayload;
  userId: string;
}

export function JobActions({ job, userId }: JobActionsProps) {
  return (
    <Suspense fallback={null}>
      <JobActionsContent job={job} userId={userId} />
    </Suspense>
  );
}

async function JobActionsContent({ job, userId }: JobActionsProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="mb-2 md:hidden md:mb-0">
        <CloseButtonByQueryRemove searchParam="jobId" />
      </div>
      {job.creator.id === userId && (
        <div className="mb-2 ml-auto">
          <JobActionsWrapper jobId={job.id} />
        </div>
      )}
    </div>
  );
}
