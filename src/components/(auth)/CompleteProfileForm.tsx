"use client";

import {
  finishUserRegisterAction,
  UserCompleteProfilePayload,
  UserCompleteProfileSchema,
} from "@/lib/modules/user";
import { APP_URLS } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../common/Input";
import { IdCardIcon } from "@/components/icons";
import { Button } from "../common/Button";

export function CompleteProfileForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
  } = useForm<UserCompleteProfilePayload>({
    defaultValues: { cpf: "" },
    resolver: zodResolver(UserCompleteProfileSchema),
  });

  const handleUpdateProfile = async (data: UserCompleteProfilePayload) => {
    try {
      setIsLoading(true);
      const response = await finishUserRegisterAction(data);
      if (!response.success) {
        if (response.status === 409) {
          setError("cpf", { message: response.message });
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        throw new Error();
      }

      router.replace(APP_URLS.home);
    } catch (_err) {
      setError("root", {
        message:
          "Desculpe, mas não foi possível completar o registro da sua conta.",
      });
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdateProfile)}
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
  );
}
