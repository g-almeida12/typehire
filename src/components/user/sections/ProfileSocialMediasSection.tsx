import {
  ArrowUpRightIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
} from "@/components/icons";
import { UserPublicResponsePayload } from "@/lib/modules/user";

interface ProfileSocialMediasProps {
  user: UserPublicResponsePayload;
}

export function ProfileSocialMediasSection({ user }: ProfileSocialMediasProps) {
  const userSocialMedias = [
    {
      Icon: GitHubIcon,
      url: user.githubUrl,
      name: "GitHub",
    },
    {
      Icon: LinkedInIcon,
      url: user.linkedinUrl,
      name: "LinkedIn",
    },
    {
      Icon: GlobeIcon,
      url: user.portfolioUrl,
      name: "Portfólio",
    },
  ];

  return (
    <section>
      <h2 className="mb-2 text-xl font-medium">Suas redes sociais</h2>
      <ul className="flex flex-col gap-2">
        {userSocialMedias.map(({ Icon, url, name }) => (
          <li className="w-full rounded-md" key={name}>
            <a
              href={
                url ? (url.startsWith("http") ? url : `https://${url}`) : ""
              }
              target="_blank"
              className="flex flex-row items-center justify-between w-full px-2 py-1 rounded-md border border-background-500 bg-background-800"
              style={{ pointerEvents: url ? "auto" : "none" }}
              aria-label={url ? `Acessar ${name}` : undefined}
            >
              <div className="flex flex-row items-center gap-2">
                <Icon size={20} aria-hidden="true" />
                <span
                  className={`${url ? "text-background-100" : "text-background-300 italic"}`}
                >
                  {url ?? `${name} não informado`}
                </span>
              </div>
              {url && <ArrowUpRightIcon size={20} aria-hidden="true" />}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
