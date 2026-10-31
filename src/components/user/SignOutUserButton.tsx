"use client";

import { signOutAction } from "@/lib/modules/user/index";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import { useToast } from "@/contexts/ToastContext";

export function SignOutUserButton() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSignOut = async () => {
    try {
      const result = await signOutAction();
      if (!result.success) throw new Error();

      router.replace(APP_URLS.login);
    } catch (err) {
      showToast("error", "Não foi possível desconectar sua conta.");
    }
  };

  return (
    <Button text="Desconectar-se" onClick={handleSignOut} variant="ghost" />
  );
}
