"use client";

import { UserLoginSchema, type UserLoginPayload } from "@/utils/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, GoogleOAuthButton, Input } from "@/components/common";
import { MailIcon, KeyRoundIcon } from "@/components/icons";
import { signInByEmail } from "@/lib/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_URLS } from "@/utils/constants";

export default function LoginPage() {
  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
  } = useForm<UserLoginPayload>({
    resolver: zodResolver(UserLoginSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignInByEmail = async (data: UserLoginPayload) => {
    try {
      setIsLoading(true);
      const response = await signInByEmail(data);

      if (!response.success) {
        setError("root", { message: response.message });
        return;
      }

      router.replace(APP_URLS.home);
    } catch (err: any) {
      setError("root", {
        message: "Desculpe, mas não foi possível conectar na sua conta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mt-8 text-2xl font-medium">Bem-vindo de volta</h1>
      <p className="text-sm/tight text-background-300">
        Faça login e continue a procurar pela sua próxima vaga.
      </p>

      <form
        onSubmit={handleSubmit(handleSignInByEmail)}
        className="flex flex-col gap-8 mt-6"
        autoComplete="off"
      >
        {errors.root?.message && (
          <p className="text-left text-sm text-red-500 w-full">
            {errors.root?.message}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Input
            {...register("email")}
            label="Email"
            Icon={MailIcon}
            placeholder="exemplo@gmail.com"
            error={errors.email?.message}
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

        <Button text="Conectar-se" variant="primary" disabled={isLoading} />
      </form>

      <div className="relative mt-12">
        <hr />
        <span className="absolute top-[50%] left-[50%] px-2 translate-x-[-50%] translate-y-[-50%] bg-background-1000">
          ou
        </span>
      </div>

      <div className="mt-12">
        <GoogleOAuthButton callbackURL="/" disabled={isLoading} />
      </div>

      <p className="mt-17 text-sm text-background-300">
        Ainda não possui uma conta no TypeHire? Então{" "}
        <Link href={APP_URLS.register} className="text-accent-100 font-medium">
          Registre-se agora
        </Link>
        .
      </p>
    </div>
  );
}
