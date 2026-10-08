"use client";

import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Navbar } from "@/components/ui/Navbar";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";

export default function JobNotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center text-center">
        <div className="w-full max-w-120 flex items-center justify-center mt-15">
          <Image
            src="/images/global-not-found-img.png"
            alt="Ilustração de erro"
            width={500}
            height={500}
            priority
          />
        </div>

        <div className="mt-5">
          <h1 className="text-2xl font-bold">
            A vaga selecionada não foi encontrada.
          </h1>
          <p className="mt-2 mb-10 text-background-300 text-sm leading-relaxed">
            Esta vaga pode ter sido descontinuada pelo criador, não existir
            em nossa base de dados ou o link acessado conter um identificador
            inválido.
          </p>

          <Button
            text="Voltar para o início"
            onClick={() => router.replace(APP_URLS.home)}
          />
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
