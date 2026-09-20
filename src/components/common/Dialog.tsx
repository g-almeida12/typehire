"use client";

import {
  DialogHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Button } from "./Button";

export interface DialogRef {
  openModal: () => void;
  closeModal: () => void;
}

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  title: string;
  description: string;
  onOptionClick: (confirm: boolean) => void;
  isPending: boolean;
  confirmText: string;
  cancelText?: string;
}

export const Dialog = forwardRef<DialogRef, DialogProps>(
  (
    {
      title,
      description,
      onOptionClick,
      isPending,
      confirmText,
      cancelText = "Cancelar",
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Expose only the methods to open and close the dialog to the parent component
    useImperativeHandle(ref, () => ({
      closeModal: () => {
        dialogRef.current?.close();
        document.body.style.overflow = "auto";
      },
      openModal: () => {
        document.body.style.overflow = "hidden";
        dialogRef.current?.showModal();
      },
    }));

    return (
      <dialog
        className="relative min-w-82 w-[calc(100%-2rem)] max-w-90 p-2 rounded-md bg-background-700 text-center text-background-100 left-1/2 top-1/2 -translate-1/2"
        ref={dialogRef}
      >
        <h3 className="text-xl font-medium">{title}</h3>
        <hr className="mt-1 mb-2" />
        <p>{description}</p>

        <div className="flex flex-row items-center justify-between gap-4 mt-8">
          <Button
            text={cancelText}
            onClick={() => onOptionClick(false)}
            variant="ghost"
            disabled={isPending}
          />
          <Button
            text={confirmText}
            onClick={() => onOptionClick(true)}
            disabled={isPending}
          />
        </div>
      </dialog>
    );
  },
);
