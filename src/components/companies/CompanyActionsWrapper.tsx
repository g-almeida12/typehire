"use client";

import { useRef } from "react";
import { DialogRef } from "../common/Dialog";
import { CompanyMoreOptions } from "./CompanyMoreOptions";
import { CompanyDeleteDialog } from "./CompanyDeleteDialog";

export function CompanyActionsWrapper({ companyId }: { companyId: string }) {
  const deleteDialogRef = useRef<DialogRef>(null);

  return (
    <>
      <CompanyMoreOptions
        companyId={companyId}
        onDeleteClick={() => deleteDialogRef.current?.openModal()}
      />
      <CompanyDeleteDialog ref={deleteDialogRef} companyId={companyId} />
    </>
  );
}
