"use client";

import { useRef, useState, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { createApplicationAction } from "@/lib/modules/application";
import { CheckIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";
import { useToast } from "@/contexts/ToastContext";

export function ApplicationCreateWrapper({
  jobId,
  userRole,
  userHasApplied,
}: {
  jobId: string;
  userRole: "USER" | "CREATOR" | "MEMBER";
  userHasApplied: boolean;
}) {
  const { showToast } = useToast();
  const dialogRef = useRef<DialogRef>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRedirecting, startTransition] = useTransition();
  const isBusy = isLoading || isRedirecting;

  const handleOptionClick = async (confirm: boolean) => {
    if (!confirm) {
      dialogRef.current?.closeModal();
      return;
    }

    try {
      setIsLoading(true);
      const applicationResponse = await createApplicationAction({ jobId });
      if (!applicationResponse.success) throw Error();

      dialogRef.current?.closeModal();
      showToast("success", "Candidatura enviada com sucesso.");
      startTransition(() => router.refresh());
    } catch (err) {
      showToast("error", "Não foi possível enviar sua candidatura.");
      dialogRef.current?.closeModal();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {userRole === "CREATOR" ? (
        <Button
          text="Ver candidaturas"
          href={APP_URLS.jobApplications(jobId)}
        />
      ) : (
        <Button
          text={
            userRole === "MEMBER" ? (
              "Ação bloqueada"
            ) : userHasApplied ? (
              <>
                Candidatura enviada <CheckIcon size={24} aria-hidden="true" />
              </>
            ) : (
              "Candidate-se agora"
            )
          }
          disabled={userRole === "MEMBER" || userHasApplied}
          onClick={() => dialogRef.current?.openModal()}
        />
      )}

      <Dialog
        title="Enviar candidatura?"
        description="Seu perfil, currículo e dados de contato serão disponibilizados para o recrutador. A candidatura não pode ser desfeita."
        confirmText="Enviar"
        onOptionClick={handleOptionClick}
        ref={dialogRef}
        isPending={isBusy}
      />
    </>
  );
}
