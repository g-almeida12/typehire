"use client";

import {
  updateUserAction,
  UserCompleteCPFSchema,
  type UserCompleteCPFPayload,
} from "@/lib/modules/user";
import { IdCardIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
  } = useForm<UserCompleteCPFPayload>({
    defaultValues: { cpf: "" },
    resolver: zodResolver(UserCompleteCPFSchema),
  });

  const handleUpdateCPF = async (data: UserCompleteCPFPayload) => {
    try {
      setIsLoading(true);
      const response = await updateUserAction(data);
      if (!response.success) {
        if (response.status === 409) {
          setError("root", { message: response.message });
          return;
        }

        throw new Error();
      }

      router.replace(APP_URLS.home);
    } catch (err: any) {
      setError("root", {
        message:
          "Desculpe, mas não foi possível completar o registro da sua conta.",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="mt-8 text-2xl font-medium">Termine de criar sua conta</h1>
      <p className="text-sm/tight text-background-300">
        Apenas insira o seu CPF e já pode ir na busca de novas vagas.
      </p>

      <form
        onSubmit={handleSubmit(handleUpdateCPF)}
        className="flex flex-col gap-10 mt-6"
        autoComplete="off"
      >
        {/* Debug: mostra erros de validação */}
        {errors.root?.message && (
          <p className="text-left text-sm text-red-500 w-full">
            {errors.root?.message}
          </p>
        )}
        <div className="flex flex-col gap-8">
          <Input
            {...register("cpf")}
            label="CPF"
            Icon={IdCardIcon}
            placeholder="123.456.789-00"
            error={errors.cpf?.message}
            disabled={isLoading}
          />

          <Button
            text={isLoading ? "Completando cadastro..." : "Completar cadastro"}
            variant="primary"
            disabled={isLoading}
            type="submit"
          />
        </div>
      </form>
    </>
  );
}
