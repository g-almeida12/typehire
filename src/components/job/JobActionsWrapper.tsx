"use client";

import { useRef } from "react";
import { DialogRef } from "../common/Dialog";
import { JobMoreOptions } from "./JobMoreOptions"
import { JobDeleteDialog } from "./JobDeleteDialog";

export function JobActionsWrapper({ jobId }: { jobId: string }) {
  const deleteDialogRef = useRef<DialogRef>(null);

  return (
    <>
      <JobMoreOptions
        jobId={jobId}
        onDeleteClick={() => deleteDialogRef.current?.openModal()}
      />
      <JobDeleteDialog ref={deleteDialogRef} jobId={jobId} />
    </>
  );
}
