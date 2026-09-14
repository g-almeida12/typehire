"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Voltar"
      className="size-6 cursor-pointer"
    >
      <ArrowLeftIcon />
    </button>
  );
}
