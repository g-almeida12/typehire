"use client";

import Image from "next/image";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import { Navbar } from "./Navbar";
import { LockBodyScroll } from "./LockBodyScroll";
import { CloseButtonByQueryRemove } from "../common/CloseButtonByQueryRemove";

interface ModuleNotFoundProps {
  title: string;
  description: string;
  applyFullPageStyles?: boolean;
  closeButtonQuery?: string;
}

export function ModuleNotFound({
  title,
  description,
  applyFullPageStyles = false,
  closeButtonQuery = undefined,
}: ModuleNotFoundProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-100 bg-background-1000 md:static md:bg-transparent">
      <LockBodyScroll device="MOBILE" />
      {applyFullPageStyles && (
        <div className="mb-10">
          <Navbar />
        </div>
      )}

      {!applyFullPageStyles && closeButtonQuery && (
        <div className="m-4 md:hidden">
          <CloseButtonByQueryRemove searchParam={closeButtonQuery} />
        </div>
      )}
      <div
        className={`flex flex-col items-center p-4  ${applyFullPageStyles ? "" : "md:p-2 md:border md:rounded-md md:border-background-500"}`}
      >
        <div className="w-full max-w-80 flex items-center justify-center">
          <Image
            src="/images/global-not-found-img.png"
            alt="Ilustração de erro"
            width={500}
            height={500}
            priority
          />
        </div>

        <div className="flex flex-col items-center mt-5">
          <h1 className="text-2xl font-bold text-center">{title}</h1>
          <p className="max-w-md mt-2 mb-10 text-background-300 text-sm leading-relaxed text-center">
            {description}
          </p>

          {applyFullPageStyles && (
            <Button
              text="Voltar para o início"
              onClick={() => router.replace(APP_URLS.JOBS)}
            />
          )}
        </div>

        <a
          href="https://storyset.com/internet"
          className="mt-10 text-[12px] text-background-300 text-center"
        >
          Internet illustrations by Storyset
        </a>
      </div>
    </div>
  );
}
