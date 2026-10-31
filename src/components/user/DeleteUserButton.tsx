"use client";

import { APP_URLS } from "@/utils/constants";
import { deleteUserAction } from "@/lib/modules/user/index";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

export function DeleteUserButton() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleDeleteUser = async () => {
    try {
      const result = await deleteUserAction();
      if (!result.success) throw new Error();

      router.replace(APP_URLS.register);
    } catch (err) {
      showToast("error", "Não foi possível deletar sua conta.");
      console.error(err);
    }
  };

  return (
    <Button
      text="Deletar sua conta"
      onClick={handleDeleteUser}
      className="border-red-500 bg-red-500 text-background-100 hover:border-[#d81e27] hover:bg-[#d81e27] hover:text-background-200 active:border-[#bb161e] active:bg-[#bb161e] active:text-background-300"
    />
  );
}
