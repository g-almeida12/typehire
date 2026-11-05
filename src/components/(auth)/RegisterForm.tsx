"use client";

import {
  signUpByEmailAction,
  UserRegisterPayload,
  UserRegisterSchema,
} from "@/lib/modules/user";
import { APP_URLS } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    formState: { errors },
    handleSubmit,
    setError,
    register,
    reset,
  } = useForm<UserRegisterPayload>({
    defaultValues: {
      email: "",
      name: "",
      cpf: "",
      agreeToTerms: false,
      image: null,
      password: "",
    },
    resolver: zodResolver(UserRegisterSchema),
  });
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    reset({
      email: "",
      name: "",
      cpf: "",
      agreeToTerms: false,
      image: null,
      password: "",
    });
  }, [pathname, reset]);

  const handleSignUpByEmail = async (data: UserRegisterPayload) => {
    try {
      setIsLoading(true);
      const response = await signUpByEmailAction(data);
      if (!response.success) {
        if (response.status === 409) {
          setError("root", { message: response.message });
          setIsLoading(false);
          return;
        }

        throw new Error();
      }

      router.replace(APP_URLS.home);
    } catch (err: any) {
      setError("root", {
        message: "Desculpe, mas não foi possível registrar sua conta.",
      });
      setIsLoading(false);
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
            disabled={isLoading}
          />
          <Input
            {...register("email")}
            label="Email"
            Icon={MailIcon}
            placeholder="exemplo@gmail.com"
            error={errors.email?.message}
            disabled={isLoading}
            type="email"
            inputMode="email"
          />
          <Input
            {...register("cpf")}
            label="CPF"
            Icon={IdCardIcon}
            placeholder="123.456.789-00"
            error={errors.cpf?.message}
            disabled={isLoading}
            inputMode="numeric"
          />
          <Input
            {...register("password")}
            label="Senha"
            Icon={KeyRoundIcon}
            placeholder="Sua senha pessoal"
            error={errors.password?.message}
            disabled={isLoading}
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
                disabled={isLoading}
              />
              <label
                htmlFor="agree-to-terms"
                className="text-sm text-background-300 text-left"
              >
                Concordo que li e aceito os{" "}
                <Link
                  href={APP_URLS.conditions}
                  className="font-medium text-accent-100 cursor-pointer"
                >
                  Termos de Condições
                </Link>{" "}
                e a{" "}
                <Link
                  href={APP_URLS.privacy}
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
            text={isLoading ? "Cadastrando usuário..." : "Cadastrar usuário"}
            variant="primary"
            disabled={isLoading}
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
          callbackURL={APP_URLS.authCallback}
          disabled={isLoading}
        />
      </div>

      <p className="mt-17 text-sm text-background-300 text-center">
        Já possui uma conta? Então{" "}
        <Link
          href={APP_URLS.login}
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
