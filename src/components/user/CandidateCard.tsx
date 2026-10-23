import { UserPublicResponsePayload } from "@/lib/modules/user";
import { APP_URLS } from "@/utils/constants";
import Link from "next/link";
import { UserProfile } from "./UserProfile";
import {
  ArrowUpRightIcon,
  FileIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
} from "../icons";
import { ApplicationStatusTag } from "../applications/ApplicationStatus";
import { ApplicationStatus } from "@/database/generated/enums";
import { formatRelativeTime } from "@/utils/date";

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
  status: ApplicationStatus;
  createdAt: Date;
  jobId: string;
}

export function CandidateCard({
  candidate,
  status,
  createdAt,
  jobId,
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
    <Link href={APP_URLS.candidate(jobId, candidate.id)} prefetch={false}>
      <div className="px-4 py-4 border-y border-y-background-700">
        <UserProfile user={candidate} type="list" />

        {/* Resume */}
        <div className="mt-2 mb-5">
          <span className="flex flex-row items-center justify-between w-full px-1 py-0.5 rounded-md border border-background-500 bg-background-500">
            <div className="flex flex-row items-center gap-2">
              <FileIcon size={18} className="text-background-900" />
              <span
                className={`text-sm font-medium text-background-900 ${candidate.resumeUrl ? "" : " italic"}`}
              >
                {candidate.resumeUrl
                  ? "Acessar currículo"
                  : `Currículo não informado`}
              </span>
            </div>
            {candidate.resumeUrl && (
              <ArrowUpRightIcon className="text-background-900" size={18} />
            )}
          </span>
        </div>

        {/* Social medias */}
        <ul className="flex flex-col gap-1">
          {userSocialMedias.map(({ Icon, url, name }) => {
            if (!url) return null;

            return (
              <li className="w-full rounded-md" key={name}>
                <span className="flex flex-row items-center justify-between w-full px-1 py-0.5 rounded-md border border-background-500 bg-background-800">
                  <div className="flex flex-row items-center gap-2">
                    <Icon size={18} />
                    <span className="text-background-100 text-sm">{name}</span>
                  </div>
                  {url && <ArrowUpRightIcon size={18} />}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-row items-center justify-between mt-8">
          <ApplicationStatusTag status={status} />
          <span className="text-sm text-background-300">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
