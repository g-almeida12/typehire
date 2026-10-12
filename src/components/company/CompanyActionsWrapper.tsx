"use client";

import { useRef, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { deleteCompanyByIdAction } from "@/lib/modules/company";
import { EditIcon, TrashIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import { MoreOptions } from "../common/MoreOptions";

export function CompanyActionsWrapper({ companyId }: { companyId: string }) {
  const dialogRef = useRef<DialogRef>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const OPTIONS = [
    {
      text: (
        <>
          <EditIcon size={20} /> Atualizar empresa
        </>
      ),
      onClick: () => router.push(APP_URLS.companyUpdate(companyId)),
    },
    {
      text: (
        <>
          <TrashIcon size={20} /> Deletar empresa
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
        await deleteCompanyByIdAction(companyId);
        dialogRef.current?.closeModal();

        router.replace("/");
      } catch (err) {
        //! Substituir por um toast
        console.error("'deleteCompanyByIdAction' failed: ", err);
        dialogRef.current?.closeModal();
      }
    });
  };

  return (
    <>
      <MoreOptions options={OPTIONS} />
      <Dialog
        title="Deletar empresa?"
        description="Você deseja mesmo deletar sua empresa? Essa ação não pode ser desfeita"
        confirmText="Deletar"
        onOptionClick={handleOptionClick}
        ref={dialogRef}
        isPending={isPending}
      />
    </>
  );
}
