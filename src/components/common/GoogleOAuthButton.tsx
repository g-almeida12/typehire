"use client";

import { authClient } from "@/utils/auth/auth-client";
import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

interface GoogleSignUpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function GoogleSignUpButton({ ...props }: GoogleSignUpButtonProps) {
  const handleGoogleSignup = async () => {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      console.log("Result: ", result);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <button
      onClick={handleGoogleSignup}
      className="w-full flex items-center justify-center gap-2 mt-17 px-4 py-2 bg-[#131314] border border-[#8E918F] rounded-lg text-[#E3E3E3] cursor-pointer"
      {...props}
    >
      <Image src="/google-icon.svg" alt="Google" width={24} height={24} />
      Continuar com o Google
    </button>
  );
}
