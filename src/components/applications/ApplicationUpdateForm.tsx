"use client";

import { useController, useForm } from "react-hook-form";
import { ApplicationStatusDropdown } from "./ApplicationStatusDropdown";
import {
  ApplicationUpdatePayload,
  ApplicationUpdateSchema,
  updateApplicationByIdAction,
} from "@/lib/modules/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
  } = useForm<ApplicationUpdatePayload>({
    resolver: zodResolver(ApplicationUpdateSchema),
  });
  const { field: statusField } = useController({ control, name: "status" });
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isFeedbackOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFeedbackOpen]);

  const handleApplicationUpdate = async (data: ApplicationUpdatePayload) => {
    try {
      const applicationResponse = await updateApplicationByIdAction(
        applicationId,
        data,
      );
      if (!applicationResponse.success) {
        throw new Error();
      }

      setIsFeedbackOpen(false);
      router.refresh();
    } catch (err) {
      setError("root", {
        message: "Não foi possível alterar o estado da candidatura.",
      });
      statusField.onChange(initialStatus);
    }
  };

  const handleStatusSelect = (status: ApplicationStatus) => {
    if (status !== "REVIEW") {
      setIsFeedbackOpen(true);
      setNewStatus(status);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleApplicationUpdate)} className="w-max">
      {errors.root?.message && (
        <p className="text-left text-sm text-red-500 w-full">
          {errors.root?.message}
        </p>
      )}

      <ApplicationStatusDropdown
        control={control}
        initialStatus={initialStatus}
        onSelect={handleStatusSelect}
        error={errors.status?.message}
        isLoading={isSubmitting}
      />

      {isFeedbackOpen && (
        <>
          <div className="fixed z-1000 left-1/2 top-1/2 -translate-1/2 w-[calc(100%-2rem)] p-2 rounded-md bg-background-800">
            <div className="flex flex-row items-center gap-2 mb-4">
              <ApplicationStatusTag status={initialStatus} />
              <ArrowRightIcon size={20} />
              <ApplicationStatusTag status={newStatus!} />
            </div>

            <h2 className="mb-1 text-2xl font-medium">Adicione um feedback</h2>
            <p className="mb-4 text-sm text-background-300">
              Escreva um feedback para o candidato{" "}
              <span className="font-semibold">{candidateName}</span>.
            </p>

            <TextArea
              {...register("feedback")}
              label=""
              error={errors.feedback?.message}
              placeholder="Informe ao candidato sobre a mudança do estado da candidatura"
              disabled={isSubmitting}
            />

            <hr className="my-6" />

            <div className="flex flex-col gap-1">
              <Button
                text="Cancelar"
                variant="ghost"
                onClick={() => {
                  statusField.onChange(initialStatus);
                  setIsFeedbackOpen(false);
                }}
                disabled={isSubmitting}
              />
              <Button
                text="Confirmar"
                type="submit"
                onClick={() => statusField.onChange(newStatus)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="fixed z-500 inset-0 bg-[#00000060] select-none pointer-none:"></div>
        </>
      )}
    </form>
  );
}
