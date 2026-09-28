import { InfoIcon } from "@/components/icons";

interface InfoTagProps {
  label: string;
}

export function InfoTag({ label }: InfoTagProps) {
  return (
    <span className="w-max flex flex-row items-center gap-2 px-2 py-1 mb-2 rounded-md bg-accent-400">
      <InfoIcon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </span>
  );
}
