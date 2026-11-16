"use client";

import { useToast } from "@/contexts/ToastContext";
import { authClient } from "@/lib/better-auth/auth-client";
import { APP_URLS } from "@/utils/constants";
import { Button } from "../common/Button";
import { useTransition } from "react";

interface ResendEmailVerificationButtonProps {
  email: string;
}

export function ResendEmailVerificationButton({
  email,
}: ResendEmailVerificationButtonProps) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  async function handleResendEmail(email: string) {
    startTransition(async () => {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: APP_URLS.HOME,
      });

      if (error) {
        showToast("error", "Não foi possível reenviar o e-mail.");
      } else {
        showToast("success", "Novo link de verificação enviado.");
      }
    });
  }

  return (
    <Button
      text={isPending ? "Reenviando link..." : "Reenviar link"}
      onClick={() => handleResendEmail(email)}
      disabled={isPending}
    />
  );
}
