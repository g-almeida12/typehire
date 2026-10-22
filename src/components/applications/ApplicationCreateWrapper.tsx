"use client";

import { useRef, useTransition } from "react";
import { Dialog, DialogRef } from "../common/Dialog";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { createApplicationAction } from "@/lib/modules/application";
import { CheckIcon } from "@/components/icons";
import { APP_URLS } from "@/utils/constants";

export function ApplicationCreateWrapper({
  jobId,
  isUserCreator,
  userHasApplied,
}: {
  jobId: string;
  isUserCreator: boolean;
  userHasApplied: boolean;
}) {
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
        await createApplicationAction({ jobId });
        dialogRef.current?.closeModal();

        router.refresh();
      } catch (err) {
        //! Substituir por um toast
        console.error("'createApplicationAction' failed: ", err);
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
                Candidatura enviada <CheckIcon />
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
