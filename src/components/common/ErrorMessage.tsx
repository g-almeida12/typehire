import { CircleAlertIcon } from "@/components/icons";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex gap-2 items-start w-full rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1"
    >
      <CircleAlertIcon
        size={20}
        className="size-5 shrink-0 text-red-400"
        aria-hidden="true"
      />
      <p className="text-sm text-red-300">{message}</p>
    </div>
  );
}
