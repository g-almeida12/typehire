"use client";

import { deleteUserAction } from "@/lib/actions";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";

export function DeleteUserButton() {
  const router = useRouter();

  const handleDeleteUser = async () => {
    try {
      await deleteUserAction();

      router.replace(APP_URLS.register);
    } catch (err) {
      //! Substituir por um toast
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
