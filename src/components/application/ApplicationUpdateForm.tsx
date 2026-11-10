"use client";

import { useController, useForm } from "react-hook-form";
import { ApplicationStatusDropdown } from "./ApplicationStatusDropdown";
import {
  ApplicationUpdatePayload,
  ApplicationUpdateSchema,
  updateApplicationByIdAction,
} from "@/lib/modules/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { ApplicationStatus } from "@/database/generated/enums";
import { ApplicationStatusTag } from "./ApplicationStatusTag";
import { ArrowRightIcon } from "@/components/icons";
import { TextArea } from "../common/TextArea";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";

interface ApplicationUpdateFormProps {
  initialStatus: ApplicationStatus;
  candidateName: string;
  applicationId: string;
}

export function ApplicationUpdateForm({
  initialStatus,
  candidateName,
  applicationId,
}: ApplicationUpdateFormProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setValue,
  } = useForm<ApplicationUpdatePayload>({
    resolver: zodResolver(ApplicationUpdateSchema),
    defaultValues: {
      status: initialStatus,
      feedback: "",
    },
  });
  const { field: statusField } = useController({ control, name: "status" });
  const [isRefreshing, startTransition] = useTransition();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | null>(null);
  const router = useRouter();
  const isBusy = isSubmitting || isRefreshing;
  const error =
    errors.status?.message || errors.feedback?.message || errors.root?.message;

  useEffect(() => {
    if (isFeedbackOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFeedbackOpen]);

  const handleApplicationUpdate = async (data: ApplicationUpdatePayload) => {
    try {
      const updateResponse = await updateApplicationByIdAction(applicationId, {
        ...data,
        status: newStatus!,
      });
      if (!updateResponse.success) {
        if (updateResponse.status === 422) {
          setError(updateResponse.field as keyof ApplicationUpdatePayload, {
            message: updateResponse.message,
          });
          statusField.onChange(initialStatus);
          return;
        }

        throw new Error();
      }

      setIsFeedbackOpen(false);
      setValue("feedback", "");
      startTransition(() => router.refresh());
    } catch (_err) {
      statusField.onChange(initialStatus);
      setError("root", {
        message: "Não foi possível alterar o estado da candidatura.",
      });
    }
  };

  const handleStatusSelect = (status: ApplicationStatus) => {
    setIsFeedbackOpen(true);
    setNewStatus(status);
  };

  return (
    <form onSubmit={handleSubmit(handleApplicationUpdate)} className="w-max">
      <ApplicationStatusDropdown
        control={control}
        initialStatus={initialStatus}
        onSelect={handleStatusSelect}
        isLoading={isBusy}
      />

      {isFeedbackOpen && (
        <>
          <div className="fixed z-1000 left-1/2 top-1/2 -translate-1/2 w-[calc(100%-2rem)] p-2 rounded-md bg-background-800">
            <div className="flex flex-row items-center gap-2 mb-4">
              <ApplicationStatusTag status={initialStatus} />
              <ArrowRightIcon size={20} aria-hidden="true" />
              <ApplicationStatusTag status={newStatus!} />
            </div>

            {newStatus === "REVIEW" && initialStatus === "PENDING" ? (
              <>
                <h2 className="mb-1 text-2xl font-medium">
                  Confirme a nova etapa
                </h2>
                <p className="mb-4 text-sm text-background-300">
                  Feedback não é necessário para marcar como "Em análise".
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-1 text-2xl font-medium">
                  Adicione um feedback
                </h2>
                <p className="mb-4 text-sm text-background-300">
                  Escreva um feedback para o candidato{" "}
                  <span className="font-semibold">{candidateName}</span>.
                </p>

                <TextArea
                  {...register("feedback")}
                  label=""
                  error=""
                  placeholder="Informe ao candidato sobre a mudança do estado da candidatura"
                  disabled={isBusy}
                />
              </>
            )}

            {error && (
              <p className="text-left text-sm text-red-500 w-full">{error}</p>
            )}

            <hr className="my-6" />

            <div className="flex flex-col gap-1">
              <Button
                text="Cancelar"
                variant="ghost"
                onClick={() => {
                  statusField.onChange(initialStatus);
                  clearErrors();
                  setIsFeedbackOpen(false);
                }}
                disabled={isBusy}
              />
              <Button
                text={isBusy ? "Atualizando..." : "Atualizar"}
                type="submit"
                disabled={isBusy}
              />
            </div>
          </div>
          <div className="fixed z-500 inset-0 bg-[#00000060] select-none pointer-none:"></div>
        </>
      )}
    </form>
  );
}
