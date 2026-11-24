"use client";

import { XIcon } from "@/components/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface CloseButtonByQueryRemoveProps {
  searchParam: string;
}

export function CloseButtonByQueryRemove({
  searchParam,
}: CloseButtonByQueryRemoveProps) {
  const currentSearchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleQueryRemove = () => {
    const params = new URLSearchParams(currentSearchParams);
    params.delete(searchParam);

    startTransition(() => router.replace(`?${params.toString()}`));
  };

  return (
    <button
      onClick={handleQueryRemove}
      aria-label="Voltar"
      className="size-6 cursor-pointer"
      disabled={isPending}
    >
      <XIcon size={24} aria-hidden="true" />
    </button>
  );
}
