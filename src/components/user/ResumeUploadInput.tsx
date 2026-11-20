import { useRef, useState, useTransition } from "react";
import { IdCardIcon, QuestionMarkIcon } from "../icons";
import { ErrorMessage } from "../common/ErrorMessage";
import { useRouter } from "next/navigation";
import {
  removeResumeAction,
  uploadResumeAction,
  UserResumeSchema,
} from "@/lib/modules/user";
import { useToast } from "@/contexts/ToastContext";

interface ResumeUploadInputProps {
  resumeUrl: string | null;
}

export function ResumeUploadInput({ resumeUrl }: ResumeUploadInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [isRemoving, startRemoveTransition] = useTransition();
  const isBusy = isUploading || isRemoving;
  const inputFileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const fileValidation = await UserResumeSchema.safeParseAsync(file);
    console.log("FILE VALIDATION: ", fileValidation);
    if (!fileValidation.success) {
      setError(fileValidation.error.issues[0].message);
      return;
    }

    e.target.value = "";
    startUploadTransition(async () => {
      const formData = new FormData();
      formData.append("resume", fileValidation.data);
      const uploadResponse = await uploadResumeAction(formData);
      if (!uploadResponse.success) {
        if (typeof uploadResponse.field === "object") {
          setError(uploadResponse.field.resumeUrl[0]);
        } else {
          setError("Não foi possível enviar a o currículo.");
        }

        return;
      }

      startUploadTransition(() => {
        router.refresh();
        showToast(
          "info",
          "Funcionalidade de upload de currículo ainda não implementada. Apenas o nome do arquivo foi salvo.",
        );
      });
    });
  };

  const handleResumeRemove = () => {
    setError(null);
    startRemoveTransition(async () => {
      const removeResponse = await removeResumeAction();
      if (!removeResponse.success) {
        setError("Não foi possível remover o currículo.");
        return;
      }

      startRemoveTransition(() => router.refresh());
    });
  };

  return (
    <>
      <input
        ref={inputFileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        aria-hidden="true"
        onChange={handleResumeUpload}
      />

      <div className="max-w-full flex flex-col gap-2">
        <p className="w-full text-left text-sm text-background-300">
          {resumeUrl
            ? "Seu currículo já está registrado."
            : "Envie um PDF de até 5 MB."}
        </p>

        {resumeUrl ? (
          // Display user resume file name
          <div className="flex flex-row items-center justify-between gap-4 rounded-md bg-background-800 px-3 py-3.5 border border-background-800">
            <div className="min-w-0 shrink flex-1 flex flex-row gap-2">
              <IdCardIcon
                className="size-5 shrink-0 text-background-300"
                aria-hidden
              />
              <span
                className={
                  isBusy
                    ? "text-background-300 text-sm"
                    : "min-w-0 shrink cursor-default truncate text-sm select-none"
                }
              >
                {isUploading
                  ? "Enviando..."
                  : isRemoving
                    ? "Removendo..."
                    : resumeUrl}
              </span>
            </div>

            <div className="flex shrink-0 flex-row gap-2">
              <button
                type="button"
                onClick={() => inputFileRef.current?.click()}
                className="cursor-pointer text-sm text-primary-400 hover:underline"
                disabled={isBusy}
              >
                Trocar
              </button>
              <button
                type="button"
                onClick={handleResumeRemove}
                className="cursor-pointer text-sm text-red-400 hover:underline"
                disabled={isBusy}
              >
                Remover
              </button>
            </div>
          </div>
        ) : (
          // Display button for upload user resume
          <button
            type="button"
            onClick={() => inputFileRef.current?.click()}
            disabled={isBusy}
            className="flex flex-row w-full items-center justify-between rounded-md border border-dashed border-background-500 px-2 py-3 text-left cursor-pointer hover:bg-background-800/50 disabled:cursor-default disabled:bg-background-900"
          >
            <div className="flex-1 flex flex-row gap-2 items-center">
              <IdCardIcon
                className="size-6 shrink-0 text-background-300"
                aria-hidden
                size={24}
              />
              <span
                className={`block text-sm font-medium ${isBusy ? "text-background-300" : ""}`}
              >
                {isBusy ? "Enviando..." : "Enviar currículo"}
              </span>
            </div>
            <span title="Campo opcional" className="cursor-help">
              <QuestionMarkIcon
                size={16}
                className={`shrink-0 ${isBusy ? "text-background-500" : "text-background-300"}`}
                aria-hidden="true"
              />
            </span>
          </button>
        )}
        {error && <ErrorMessage message={error} />}
      </div>
    </>
  );
}
