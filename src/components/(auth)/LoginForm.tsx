"use client";

import {
  signInByEmailAction,
  UserLoginPayload,
  UserLoginSchema,
} from "@/lib/modules/user";
import { APP_URLS } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../common/Input";
import { KeyRoundIcon, MailIcon } from "@/components/icons";
import { Button } from "../common/Button";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
import Link from "next/link";

export function LoginForm() {
  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
    reset,
  } = useForm<UserLoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(UserLoginSchema),
  });
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    reset({
      email: "",
      password: "",
    });
  }, [pathname, reset]);

  const handleSignInByEmail = async (data: UserLoginPayload) => {
    try {
      setIsLoading(true);
      const response = await signInByEmailAction(data);

      if (!response.success) {
        if (response.status === 401) {
          setError("root", { message: response.message });
          setIsLoading(false);
          return;
        }

        throw new Error();
      }

      router.replace(APP_URLS.home);
    } catch (_err) {
      setError("root", {
        message: "Desculpe, mas não foi possível conectar na sua conta.",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
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
            type="email"
            inputMode="email"
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

        <Button
          text={isLoading ? "Conectando-se..." : "Conecte-se"}
          variant="primary"
          disabled={isLoading}
        />
      </form>

      <div className="relative mt-12">
        <hr />
        <span className="absolute top-[50%] left-[50%] px-2 translate-x-[-50%] translate-y-[-50%] bg-background-1000">
          ou
        </span>
      </div>

      <div className="mt-12">
        <GoogleOAuthButton callbackURL={APP_URLS.authCallback} disabled={isLoading} />
      </div>

      <p className="mt-17 text-sm text-background-300 text-center">
        Ainda não possui uma conta no TypeHire? Então{" "}
        <Link
          href={APP_URLS.register}
          className="text-accent-100 font-medium"
          type="button"
        >
          Registre-se agora
        </Link>
        .
      </p>
    </>
  );
}
