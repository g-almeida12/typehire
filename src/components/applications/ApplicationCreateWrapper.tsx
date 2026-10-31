"use client";

import { useRef, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { createApplicationAction } from "@/lib/modules/application";
import { CheckIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";
import { useToast } from "@/contexts/ToastContext";

export function ApplicationCreateWrapper({
  jobId,
  isUserCreator,
  userHasApplied,
}: {
  jobId: string;
  isUserCreator: boolean;
  userHasApplied: boolean;
  }) {
  const { showToast } = useToast();
  const dialogRef = useRef<DialogRef>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleOptionClick = (confirm: boolean) => {
    if (!confirm) {
      dialogRef.current?.closeModal();
      return;
    }

    startTransition(async () => {
      try {
        const applicationResponse = await createApplicationAction({ jobId });
        if (!applicationResponse.success) throw Error();

        dialogRef.current?.closeModal();
        showToast("success", "Candidatura enviada com sucesso.");
        router.refresh();
      } catch (err) {
        showToast("error", "Não foi possível enviar sua candidatura.");
        dialogRef.current?.closeModal();
      }
    });
  };

  return (
    <>
      {isUserCreator ? (
        <Button
          text="Ver candidaturas"
          href={APP_URLS.jobApplications(jobId)}
        />
      ) : (
        <Button
          text={
            userHasApplied ? (
              <>
                Candidatura enviada <CheckIcon size={24} aria-hidden="true" />
              </>
            ) : (
              "Candidate-se agora"
            )
          }
          disabled={isUserCreator || userHasApplied}
          onClick={() => dialogRef.current?.openModal()}
        />
      )}

      <Dialog
        title="Enviar candidatura?"
        description="Seu perfil, currículo e dados de contato serão disponibilizados para o recrutador. A candidatura não pode ser desfeita."
        confirmText="Enviar"
        onOptionClick={handleOptionClick}
        ref={dialogRef}
        isPending={isPending}
      />
    </>
  );
}
