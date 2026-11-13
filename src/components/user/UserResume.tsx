import { ArrowUpRightIcon, FileIcon } from "@/components/icons";

interface UserResumeProps {
  name: string;
  resumeUrl: string | null;
}

export function UserResume({ name, resumeUrl }: UserResumeProps) {
  return (
    <a
      href={resumeUrl ?? ""}
      target="_blank"
      download={`${name.replaceAll(" ", "-")}.pdf`}
      className="flex flex-row items-center justify-between w-full px-2 py-1 rounded-md border border-background-500 bg-background-500"
      style={{ pointerEvents: resumeUrl ? "auto" : "none" }}
    >
      <div className="flex flex-row items-center gap-2">
        <FileIcon
          size={20}
          className="text-background-900"
          aria-hidden="true"
        />
        <span
          className={`font-medium text-background-900 ${resumeUrl ? "" : " italic"}`}
        >
          {resumeUrl ? "Acessar currículo" : `Currículo não informado`}
        </span>
      </div>
      {resumeUrl && (
        <ArrowUpRightIcon
          className="text-background-900"
          size={20}
          aria-hidden="true"
        />
      )}
    </a>
  );
}
