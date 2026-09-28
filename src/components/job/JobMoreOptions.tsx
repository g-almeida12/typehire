"use client";

import { useRouter } from "next/navigation";
import { MoreOptions } from "../common/MoreOptions";
import { EditIcon, TrashIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";

interface JobMoreOptionsProps {
  jobId: string;
  onDeleteClick: () => void;
}

export function JobMoreOptions({ jobId, onDeleteClick }: JobMoreOptionsProps) {
  const router = useRouter();

  const options = [
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
      //! Substituir por um dialog
      onClick: onDeleteClick,
    },
  ];

  return <MoreOptions options={options} />;
}
