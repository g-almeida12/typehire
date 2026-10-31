import { ToastStatus, type Toast } from "@/contexts/ToastContext";
import { XIcon } from "@/components/icons";

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  const toastStyles: Record<ToastStatus, string> = {
    success: "bg-green-600",
    error: "bg-red-700",
    info: "bg-background-600",
  };

  return (
    <aside
      className="fixed top-4 z-1000 flex flex-col items-center gap-1 max-w-sm w-full m-auto "
      aria-label="Notificações"
    >
      {toasts.map((t) => (
        <div
          className={`relative flex flex-row items-start gap-2 rounded-md p-2 w-80 shadow-lg ${toastStyles[t.status]}`}
          key={t.id}
        >
          <span className="flex-1 font-medium">{t.message}</span>
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
