import { UserPublicResponsePayload } from "@/lib/modules/user";
import { UserProfile } from "./UserProfile";
import {
  ArrowUpRightIcon,
  FileIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
} from "../icons";
import { ApplicationStatus } from "@/database/generated/enums";
import { formatRelativeTime } from "@/utils/date";
import { ApplicationUpdateForm } from "../applications/ApplicationUpdateForm";

interface CandidateCardProps {
  candidate: Pick<
    UserPublicResponsePayload,
    | "githubUrl"
    | "linkedinUrl"
    | "portfolioUrl"
    | "name"
    | "email"
    | "resumeUrl"
    | "id"
  >;
  applicationId: string;
  status: ApplicationStatus;
  createdAt: Date;
}

export function CandidateCard({
  candidate,
  applicationId,
  status,
  createdAt,
}: CandidateCardProps) {
  const userSocialMedias = [
    {
      Icon: GitHubIcon,
      url: candidate.githubUrl,
      name: "GitHub",
    },
    {
      Icon: LinkedInIcon,
      url: candidate.linkedinUrl,
      name: "LinkedIn",
    },
    {
      Icon: GlobeIcon,
      url: candidate.portfolioUrl,
      name: "Portfólio",
    },
  ];

  return (
    <div className="px-4 py-4 border-y border-y-background-700">
      <UserProfile user={candidate} type="link" />

      {/* Resume */}
      <div className="mt-2 mb-5">
        <a
          href={candidate.resumeUrl ?? ""}
          target="_blank"
          download={`${candidate.name.replaceAll(" ", "-")}.pdf`}
          className="flex flex-row items-center justify-between w-full px-1 py-0.5 rounded-md border border-background-500 bg-background-500"
          style={{ pointerEvents: candidate.resumeUrl ? "auto" : "none" }}
        >
          <div className="flex flex-row items-center gap-2">
            <FileIcon size={18} className="text-background-900" aria-hidden="true" />
            <span
              className={`text-sm font-medium text-background-900 ${candidate.resumeUrl ? "" : " italic"}`}
            >
              {candidate.resumeUrl
                ? "Acessar currículo"
                : `Currículo não informado`}
            </span>
          </div>
          {candidate.resumeUrl && (
            <ArrowUpRightIcon className="text-background-900" size={18} aria-hidden="true" />
          )}
        </a>
      </div>

      {/* Social medias */}
      <ul className="flex flex-col gap-1">
        {userSocialMedias.map(({ Icon, url, name }) => {
          if (!url) return null;

          return (
            <li className="w-full rounded-md" key={name}>
              <a
                href={
                  url ? (url.startsWith("http") ? url : `https://${url}`) : ""
                }
                target="_blank"
                className="flex flex-row items-center justify-between w-full px-1 py-0.5 rounded-md border border-background-500 bg-background-800"
                style={{ pointerEvents: url ? "auto" : "none" }}
                aria-label={`Acessar ${name}`}
              >
                <div className="flex flex-row items-center gap-2">
                  <Icon size={18} aria-hidden="true" />
                  <span className="text-background-100 text-sm">{name}</span>
                </div>
                {url && <ArrowUpRightIcon size={18} aria-hidden="true" />}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Status update */}
      <div className="flex flex-row items-center justify-between mt-8">
        <ApplicationUpdateForm
          initialStatus={status}
          candidateName={candidate.name}
          applicationId={applicationId}
        />
        <span className="text-sm text-background-300">
          {formatRelativeTime(createdAt)}
        </span>
      </div>
    </div>
  );
}
