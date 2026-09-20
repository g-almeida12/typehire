"use client";

import { useRef, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { deleteCompanyByIdAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";

interface CompanyDeleteDialogProps {
  companyId: string;
  ref: React.RefObject<DialogRef | null>;
}

export function CompanyDeleteDialog({
  companyId,
  ref,
}: CompanyDeleteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleOptionClick = (confirm: boolean) => {
    if (!confirm) {
      ref.current?.closeModal();
      return;
    }

    startTransition(async () => {
      try {
        await deleteCompanyByIdAction(companyId);
        ref.current?.closeModal();

        router.replace("/");
      } catch (err) {
        //! Substituir por um toast
        console.error("'deleteCompanyByIdAction' failed: ", err);
        ref.current?.closeModal();
      }
    });
  };

  return (
    <Dialog
      title="Deletar empresa?"
      description="Você deseja mesmo deletar sua empresa? Essa ação não pode ser desfeita"
      confirmText="Deletar"
      onOptionClick={handleOptionClick}
      ref={ref}
      isPending={isPending}
    />
  );
}
