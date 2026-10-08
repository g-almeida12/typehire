"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Navbar } from "@/components/ui/Navbar";

export default function AppErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  //! Remover no build
  useEffect(() => console.error("ERROR CATCHED: ", error), [error]);

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center text-center">
        <div className="w-full max-w-120 flex items-center justify-center">
          <Image
            src="/images/global-error-img(2).png"
            alt="Ilustração de erro"
            width={500}
            height={500}
            priority
          />
        </div>

        <div className="mt-5">
          <h1 className="text-2xl font-bold">
            Um "bug" de quatro patas atacou novamente.
          </h1>
          <p className="mt-2 mb-10 text-background-300 text-sm leading-relaxed">
            O culpado já foi identificado na cena do crime, mas o erro continua
            aqui. Tente recarregar a página para ver se tudo volta ao normal.
          </p>

          <Button text="Tentar novamente" onClick={retry} />
        </div>
      </main>

      <a
        href="https://storyset.com/internet"
        className="mt-10 text-[12px] text-background-300 text-center"
      >
        Internet illustrations by Storyset
      </a>
    </div>
  );
}
