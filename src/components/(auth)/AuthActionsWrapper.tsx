"use client";

import { useRef, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import { useToast } from "@/contexts/ToastContext";
import { signOutAction } from "@/lib/modules/auth";
import { deleteUserAction } from "@/lib/modules/user";
import { Button } from "../common/Button";

export function AuthActionsWrapper() {
  const { showToast } = useToast();
  const router = useRouter();
  const signOutDialogRef = useRef<DialogRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async (confirm: boolean) => {
    if (!confirm) {
      signOutDialogRef.current?.closeModal();
      return;
    }

    startTransition(async () => {
      try {
        const result = await signOutAction();
        if (!result.success) throw new Error();

        startTransition(() => router.replace(APP_URLS.LOGIN));
      } catch (_err) {
        showToast("error", "Não foi possível desconectar sua conta.");
      } finally {
        signOutDialogRef.current?.closeModal();
      }
    });
  };

  const handleDeleteUser = async (confirm: boolean) => {
    if (!confirm) {
      deleteDialogRef.current?.closeModal();
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteUserAction();
        if (!result.success) throw new Error();

        startTransition(() => router.replace(APP_URLS.REGISTER));
      } catch (_err) {
        showToast("error", "Não foi possível deletar sua conta.");
      } finally {
        deleteDialogRef.current?.closeModal();
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          text="Desconectar-se"
          onClick={() => signOutDialogRef.current?.openModal()}
          variant="ghost"
        />
        <Button
          text="Deletar sua conta"
          onClick={() => deleteDialogRef.current?.openModal()}
          className="border-red-500 bg-red-500 text-background-100 hover:border-[#d81e27] hover:bg-[#d81e27] hover:text-background-200 active:border-[#bb161e] active:bg-[#bb161e] active:text-background-300"
        />
      </div>

      {/* Sign out dialog */}
      <Dialog
        title="Desconectar-se?"
        description="Você sairá da sua conta neste dispositivo e precisará entrar novamente para acessar suas candidaturas."
        confirmText="Desconectar"
        onOptionClick={handleSignOut}
        ref={signOutDialogRef}
        isPending={isPending}
      />

      {/* Delete dialog */}
      <Dialog
        title="Deletar sua conta?"
        description="Seu perfil, currículo e candidaturas serão apagados permanentemente. Esta ação não pode ser desfeita."
        confirmText="Deletar conta"
        onOptionClick={handleDeleteUser}
        ref={deleteDialogRef}
        isPending={isPending}
      />
    </>
  );
}
