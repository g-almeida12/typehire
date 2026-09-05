"use client";

import { UserRegisterPayload, UserRegisterSchema } from "@/utils/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, GoogleSignUpButton, Input } from "@/components/common";
import { UserCircle2, Mail, IdCard, KeyRound } from "lucide-react";
import { signUpByEmail } from "@/lib/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      await signUpByEmail(data);

      router.push('/');
    } catch (err: any) {
      setError("root", { message: err.error });
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
            Icon={UserCircle2}
            placeholder="Seu nome completo"
            error={errors.name?.message}
            disabled={isLoading}
          />
          <Input
            {...register("email")}
            label="Email"
            Icon={Mail}
            placeholder="exemplo@gmail.com"
            error={errors.email?.message}
            disabled={isLoading}
          />
          <Input
            {...register("cpf")}
            label="CPF"
            Icon={IdCard}
            placeholder="123.456.789-00"
            error={errors.cpf?.message}
            disabled={isLoading}
          />
          <Input
            {...register("password")}
            label="Senha"
            Icon={KeyRound}
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
                <a className="font-medium text-accent-300 cursor-pointer">
                  Termos de Condições
                </a>{" "}
                e a{" "}
                <a className="font-medium text-accent-300 cursor-pointer">
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

      <GoogleSignUpButton disabled={isLoading} />
    </div>
  );
}
