"use client";

import { useRef, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { useRouter } from "next/navigation";
import { deleteJobByIdAction } from "@/lib/modules/job";
import { EditIcon, TrashIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";
import { MoreOptions } from "../common/MoreOptions";
import { useToast } from "@/contexts/ToastContext";

export function JobActionsWrapper({ jobId }: { jobId: string }) {
  const dialogRef = useRef<DialogRef>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const OPTIONS = [
    {
      text: (
        <>
          <EditIcon size={20} aria-hidden="true" /> Atualizar vaga
        </>
      ),
      onClick: () => router.push(APP_URLS.jobUpdate(jobId)),
    },
    {
      text: (
        <>
          <TrashIcon size={20} aria-hidden="true" /> Deletar vaga
        </>
      ),
      onClick: () => dialogRef.current?.openModal(),
    },
  ];

  const handleOptionClick = (confirm: boolean) => {
    if (!confirm) {
      dialogRef.current?.closeModal();
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteJobByIdAction(jobId);
        if (!result.success) throw new Error();

        dialogRef.current?.closeModal();
        showToast("success", "Vaga deletada com sucesso.");
        router.replace("/");
      } catch (err) {
        showToast("error", "Não foi possível deletar a vaga.");
        dialogRef.current?.closeModal();
      }
    });
  };

  return (
    <>
      <MoreOptions options={OPTIONS} />
      <Dialog
        title="Deletar Vaga?"
        description="Você deseja mesmo deletar essa vaga? Essa ação não pode ser desfeita"
        confirmText="Deletar"
        onOptionClick={handleOptionClick}
        ref={dialogRef}
        isPending={isPending}
      />
    </>
  );
}
