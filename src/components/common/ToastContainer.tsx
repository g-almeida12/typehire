import { ToastStatus, type Toast } from "@/contexts/ToastContext";
import { XIcon, InfoIcon, AlertIcon, CheckIcon } from "@/components/icons";

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  const toastStyles: Record<ToastStatus, string> = {
    success: "bg-green-700 text-green-200",
    error: "bg-red-700 text-red-200",
    info: "bg-sky-700 text-sky-200",
  };

  return (
    <aside
      className="fixed top-4 z-1000 flex flex-col items-center gap-1 max-w-sm w-full m-auto "
      aria-label="Notificações"
    >
      {toasts.map((t) => (
        <div
          className={`relative flex flex-row items-start gap-3 rounded-md p-2 w-80 shadow-lg ${toastStyles[t.status]}`}
          key={t.id}
        >
          {/* Icon */}
          {t.status === "info" ? (
            <InfoIcon size={20} aria-hidden className="self-center" />
          ) : t.status === "success" ? (
            <CheckIcon size={20} aria-hidden className="self-center" />
          ) : (
            <AlertIcon size={20} aria-hidden className="self-center" />
          )}
          <span className="flex-1 text-base/[22px]">{t.message}</span>
          <button
            onClick={() => onRemoveToast(t.id)}
            aria-label="Fechar notificação"
            className="relative top-1 cursor-pointer pointer-events-auto"
          >
            <XIcon size={20} aria-hidden="true" />
          </button>
        </div>
      ))}
    </aside>
  );
}
