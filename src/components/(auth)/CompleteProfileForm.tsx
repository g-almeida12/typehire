"use client";

import {
  finishUserRegisterAction,
  AuthCompleteProfilePayload,
  AuthCompleteProfileSchema,
} from "@/lib/modules/auth";
import { APP_URLS } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../common/Input";
import { IdCardIcon } from "@/components/icons";
import { Button } from "../common/Button";
import Link from "next/link";

export function CompleteProfileForm() {
  const [isRedirecting, startTransition] = useTransition();
  const router = useRouter();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    register,
    reset,
  } = useForm<AuthCompleteProfilePayload>({
    defaultValues: { cpf: "", agreeToTerms: false },
    resolver: zodResolver(AuthCompleteProfileSchema),
  });
  const isBusy = isRedirecting || isSubmitting;

  // Cleanup on dismount
  useEffect(() => {
    return () =>
      reset({
        cpf: "",
      });
  }, []);

  const handleUpdateProfile = async (data: AuthCompleteProfilePayload) => {
    try {
      const response = await finishUserRegisterAction(data);
      if (!response.success) {
        if (response.status === 409) {
          setError("cpf", { message: response.message });
          return;
        }

        throw new Error();
      }

      startTransition(() => router.replace(APP_URLS.HOME));
    } catch (_err) {
      setError("root", {
        message:
          "Desculpe, mas não foi possível completar o registro da sua conta.",
      });
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
          disabled={isBusy}
        />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row align-start gap-2">
              <input
                {...register("agreeToTerms")}
                type="checkbox"
                className="relative top-1 h-3.5 w-3.5"
                id="agree-to-terms"
                disabled={isBusy}
              />
              <label
                htmlFor="agree-to-terms"
                className="text-sm text-background-300 text-left"
              >
                Concordo que li e aceito os{" "}
                <Link
                  href={APP_URLS.CONDITIONS}
                  className="font-medium text-accent-100 cursor-pointer"
                >
                  Termos de Condições
                </Link>{" "}
                e a{" "}
                <Link
                  href={APP_URLS.PRIVACY}
                  className="font-medium text-accent-100 cursor-pointer"
                >
                  Política de Privacidade
                </Link>
                .
              </label>
            </div>
            {errors.agreeToTerms?.message && (
              <p className="text-left text-sm text-red-500 w-full">
                {errors.agreeToTerms?.message}
              </p>
            )}
          </div>

          <Button
            text={isBusy ? "Completando cadastro..." : "Completar cadastro"}
            variant="primary"
            disabled={isBusy}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}
