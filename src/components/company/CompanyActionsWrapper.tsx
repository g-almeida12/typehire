"use client";

import { useRef, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { deleteCompanyByIdAction } from "@/lib/modules/company";
import { EditIcon, TrashIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import { MoreOptions } from "../common/MoreOptions";
import { useToast } from "@/contexts/ToastContext";

export function CompanyActionsWrapper({ companyId }: { companyId: string }) {
  const dialogRef = useRef<DialogRef>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const OPTIONS = [
    {
      text: (
        <>
          <EditIcon size={20} aria-hidden="true" /> Atualizar empresa
        </>
      ),
      onClick: () => router.push(APP_URLS.companyUpdate(companyId)),
    },
    {
      text: (
        <>
          <TrashIcon size={20} aria-hidden="true" /> Deletar empresa
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
        const result = await deleteCompanyByIdAction(companyId);
        if (!result.success) throw new Error();

        dialogRef.current?.closeModal();
        showToast("success", "Empresa deletada com sucesso.");
        router.replace("/");
      } catch (err) {
        showToast("error", "Não foi possível deletar a empresa.");
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
