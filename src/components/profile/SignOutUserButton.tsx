"use client";

import { signOutAction } from "@/lib/actions";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";

export function SignOutUserButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutAction();

      router.replace(APP_URLS.login);
    } catch (err) {
      //! Substituir por um toast
      console.error(err);
    }
  };

  return (
    <Button text="Desconectar-se" onClick={handleSignOut} variant="ghost" />
  );
}
