"use client";

import { useRef, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { useRouter } from "next/navigation";
import { deleteJobByIdAction } from "@/lib/modules/job";
import { EditIcon, TrashIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";
import { MoreOptions } from "../common/MoreOptions";

export function JobActionsWrapper({ jobId }: { jobId: string }) {
  const dialogRef = useRef<DialogRef>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const OPTIONS = [
    {
      text: (
        <>
          <EditIcon size={20} /> Atualizar vaga
        </>
      ),
      onClick: () => router.push(APP_URLS.jobUpdate(jobId)),
    },
    {
      text: (
        <>
          <TrashIcon size={20} /> Deletar vaga
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
        await deleteJobByIdAction(jobId);
        dialogRef.current?.closeModal();

        router.replace("/");
      } catch (err) {
        //! Substituir por um toast
        console.error("'deleteJobByIdAction' failed: ", err);
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
