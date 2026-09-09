"use client";

import { type UserRegisterPayload, UserRegisterSchema } from "@/utils/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, GoogleOAuthButton, Input } from "@/components/common";
import { UserCircleIcon, MailIcon, IdCardIcon, KeyRoundIcon } from "@/components/icons";
import { signUpByEmail } from "@/lib/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_URLS } from "@/utils/constants";

export default function RegisterPage() {
  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
  } = useForm<UserRegisterPayload>({
    resolver: zodResolver(UserRegisterSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignUpByEmail = async (data: UserRegisterPayload) => {
    try {
      setIsLoading(true);
      const response = await signUpByEmail(data);
      if (!response.success) {
        setError("root", { message: response.message });
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError("root", {
        message: "Desculpe, mas não foi possível registrar sua conta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mt-8 text-2xl font-medium">Crie sua conta</h1>
      <p className="text-sm/tight text-background-300">
        Preencha seus dados pessoais necessários e registre suas informações
        básicas.
      </p>

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
          />
          <Input
            {...register("cpf")}
            label="CPF"
            Icon={IdCardIcon}
            placeholder="123.456.789-00"
            error={errors.cpf?.message}
            disabled={isLoading}
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
                <a className="font-medium text-accent-100 cursor-pointer">
                  Termos de Condições
                </a>{" "}
                e a{" "}
                <a className="font-medium text-accent-100 cursor-pointer">
                  Política de Privacidade
                </a>
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
            text="Cadastrar usuário"
            variant="ghost"
            disabled={isLoading}
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
        <GoogleOAuthButton callbackURL="/complete-profile" disabled={isLoading} />
      </div>

      <p className="mt-17 text-sm text-background-300">
        Já possui uma conta? Então{" "}
        <Link href={APP_URLS.login} className="text-accent-100 font-medium">
          Conecte-se agora
        </Link>
        .
      </p>
    </div>
  );
}
