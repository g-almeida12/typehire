"use client";

import {
  signUpByEmailAction,
  AuthRegisterPayload,
  AuthRegisterSchema,
} from "@/lib/modules/auth";
import { APP_URLS } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
import Link from "next/link";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import {
  IdCardIcon,
  KeyRoundIcon,
  MailIcon,
  UserCircleIcon,
} from "@/components/icons";

export function RegisterForm() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    register,
  } = useForm<AuthRegisterPayload>({
    defaultValues: {
      email: "",
      name: "",
      cpf: "",
      agreeToTerms: false,
      image: null,
      password: "",
    },
    resolver: zodResolver(AuthRegisterSchema),
  });
  const [isRedirecting, startTransition] = useTransition();
  const router = useRouter();
  const isBusy = isSubmitting || isRedirecting;

  const handleSignUpByEmail = async (data: AuthRegisterPayload) => {
    try {
      const response = await signUpByEmailAction(data);
      if (!response.success) {
        if (response.status === 409) {
          setError("root", { message: response.message });
          return;
        }

        throw new Error();
      }

      startTransition(() =>
        router.replace(APP_URLS.EMAIL_VERIFICATION(data.email)),
      );
    } catch (_err) {
      setError("root", {
        message: "Desculpe, mas não foi possível registrar sua conta.",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSignUpByEmail)}
        className="flex flex-col gap-10 mt-6"
        autoComplete="off"
      >
        {errors.root?.message && (
          <p className="text-left text-sm text-red-500 w-full">
            {errors.root?.message}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Input
            {...register("name")}
            label="Nome completo"
            Icon={UserCircleIcon}
            placeholder="Seu nome completo"
            error={errors.name?.message}
            disabled={isBusy}
          />
          <Input
            {...register("email")}
            label="Email"
            Icon={MailIcon}
            placeholder="exemplo@gmail.com"
            error={errors.email?.message}
            disabled={isBusy}
            type="email"
            inputMode="email"
          />
          <Input
            {...register("cpf")}
            label="CPF"
            Icon={IdCardIcon}
            placeholder="123.456.789-00"
            error={errors.cpf?.message}
            disabled={isBusy}
            inputMode="numeric"
          />
          <Input
            {...register("password")}
            label="Senha"
            Icon={KeyRoundIcon}
            placeholder="Sua senha pessoal"
            error={errors.password?.message}
            disabled={isBusy}
            showVisibilityToggle
          />
        </div>

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
            text={isBusy ? "Cadastrando usuário..." : "Cadastrar usuário"}
            variant="primary"
            disabled={isBusy}
            type="submit"
          />
        </div>
      </form>

      <div className="relative mt-12">
        <hr />
        <span className="absolute top-[50%] left-[50%] px-2 translate-x-[-50%] translate-y-[-50%] bg-background-1000">
          ou
        </span>
      </div>

      <div className="mt-12">
        <GoogleOAuthButton
          callbackURL={APP_URLS.AUTH_CALLBACK}
          disabled={isBusy}
        />
      </div>

      <p className="mt-17 text-sm text-background-300 text-center">
        Já possui uma conta? Então{" "}
        <Link
          href={APP_URLS.LOGIN}
          className="text-accent-100 font-medium"
          type="button"
        >
          Conecte-se agora
        </Link>
        .
      </p>
    </>
  );
}
