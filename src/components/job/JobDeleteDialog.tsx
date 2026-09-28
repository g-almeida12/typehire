"use client";

import { useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { useRouter } from "next/navigation";
import { deleteJobByIdAction } from "@/lib/modules/job";

interface JobDeleteDialogProps {
  jobId: string;
  ref: React.RefObject<DialogRef | null>;
}

export function JobDeleteDialog({ jobId, ref }: JobDeleteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleOptionClick = (confirm: boolean) => {
    if (!confirm) {
      ref.current?.closeModal();
      return;
    }

    startTransition(async () => {
      try {
        await deleteJobByIdAction(jobId);
        ref.current?.closeModal();

        router.replace("/");
      } catch (err) {
        //! Substituir por um toast
        console.error("'deleteJobByIdAction' failed: ", err);
        ref.current?.closeModal();
      }
    });
  };

  return (
    <Dialog
      title="Deletar Vaga?"
      description="Você deseja mesmo deletar essa vaga? Essa ação não pode ser desfeita"
      confirmText="Deletar"
      onOptionClick={handleOptionClick}
      ref={ref}
      isPending={isPending}
    />
  );
}
