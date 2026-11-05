"use client";

import { useToast } from "@/contexts/ToastContext";
import { authClient } from "@/lib/auth/auth-client";
import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

interface GoogleOAuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  callbackURL: string;
}

export function GoogleOAuthButton({
  callbackURL,
  ...props
}: GoogleOAuthButtonProps) {
  const { showToast } = useToast();

  const handleGoogleSignup = async () => {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      if (!result.data) throw new Error();
    } catch (_err) {
      showToast("error", "Não foi possível acessar sua conta do Google.");
    }
  };

  return (
    <button
      onClick={handleGoogleSignup}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#131314] border border-[#8E918F] rounded-lg text-[#E3E3E3] ${props.disabled ? "cursor-default" : "cursor-pointer"}`}
      {...props}
    >
      <Image
        src="/google-icon.svg"
        alt="Google"
        loading="eager"
        width={24}
        height={24}
      />
      Continuar com o Google
    </button>
  );
}
