"use client";

import { useRouter } from "next/navigation";
import { MoreOptions } from "../common/MoreOptions";
import { EditIcon, TrashIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";

interface CompanyMoreOptionsProps {
  companyId: string;
  onDeleteClick: () => void;
}

export function CompanyMoreOptions({
  companyId,
  onDeleteClick,
}: CompanyMoreOptionsProps) {
  const router = useRouter();

  const options = [
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
      //! Substituir por um dialog
      onClick: onDeleteClick,
    },
  ];

  return <MoreOptions options={options} />;
}
