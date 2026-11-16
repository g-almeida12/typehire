"use client";

import {
  signInByEmailAction,
  AuthLoginPayload,
  AuthLoginSchema,
} from "@/lib/modules/auth";
import { APP_URLS } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../common/Input";
import { KeyRoundIcon, MailIcon } from "@/components/icons";
import { Button } from "../common/Button";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

export function LoginForm() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    register,
  } = useForm<AuthLoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(AuthLoginSchema),
  });
  const { showToast } = useToast();
  const [isRedirecting, startTransition] = useTransition();
  const router = useRouter();
  const isBusy = isSubmitting || isRedirecting;

  const handleSignInByEmail = async (data: AuthLoginPayload) => {
    try {
      const response = await signInByEmailAction(data);

      if (!response.success) {
        if (response.status === 401) {
          setError("root", { message: response.message });
          return;
        }
        if (response.status === 403) {
          showToast(
            "info",
            "Email não verificado. Por favor, verifique seu email para acessar sua conta.",
          );
          startTransition(() =>
            router.replace(APP_URLS.EMAIL_VERIFICATION(data.email)),
          );
          return;
        }

        throw new Error();
      }

      startTransition(() => router.replace(APP_URLS.HOME));
    } catch (_err) {
      setError("root", {
        message: "Desculpe, mas não foi possível conectar na sua conta.",
      });
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
            disabled={isBusy}
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

        <Button
          text={isBusy ? "Conectando-se..." : "Conecte-se"}
          variant="primary"
          disabled={isBusy}
        />
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
        Ainda não possui uma conta no TypeHire? Então{" "}
        <Link
          href={APP_URLS.REGISTER}
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
