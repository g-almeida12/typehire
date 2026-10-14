import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  PhoneIcon,
  PinIcon,
  FileIcon,
} from "@/components/icons";
import { DeleteUserButton } from "@/components/user/DeleteUserButton";
import { SignOutUserButton } from "@/components/user/SignOutUserButton";
import { UserProfile } from "@/components/user/UserProfile";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { APP_URLS } from "@/utils/constants";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { SkillList } from "@/components/common/SkillList";

export const metadata: Metadata = {
  title: "Perfil do usuário | TypeHire",
  description:
    "Veja suas informações pessoais como nome, email e descrição que serão vistas pelos recrutadores.",
};

export default async function ProfilePage() {
  const user = (await getCurrentUserData())!;

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
    <main className="pb-4">
      <section>
        <div className="size-6 mt-4">
          <BackButton />
        </div>
      </section>

      {/* Profile */}
      <section className="mt-8">
        <UserProfile user={user} type="edit" />

        {/* Main user info */}
        <div className="w-full flex flex-row items-center gap-4 mt-2">
          <p className="flex flex-row gap-2 items-center text-sm text-background-300">
            <PhoneIcon size={18} />
            {user.phoneNumber ? user.phoneNumber : "Não informado"}
          </p>
          <p className="flex flex-row gap-2 items-center text-sm text-background-300">
            <PinIcon size={18} />
            {user.location ? user.location : "Não informado"}
          </p>
        </div>

        {/* Resume */}
        <div className="mt-2">
          <a
            href={user.resumeUrl ?? ""}
            target="_blank"
            download={`${user.name.replaceAll(" ", "-")}.pdf`}
            className="flex flex-row items-center justify-between w-full px-2 py-1 rounded-md border border-background-500 bg-background-500"
            style={{ pointerEvents: user.resumeUrl ? "auto" : "none" }}
          >
            <div className="flex flex-row items-center gap-2">
              <FileIcon size={20} className="text-background-900" />
              <span
                className={`font-medium text-background-900 ${user.resumeUrl ? "" : " italic"}`}
              >
                {user.resumeUrl
                  ? "Acessar currículo"
                  : `Currículo não informado`}
              </span>
            </div>
            {user.resumeUrl && (
              <ArrowUpRightIcon className="text-background-900" size={20} />
            )}
          </a>
        </div>

        {/* Bio */}
        <p className="mt-4">{user.bio ?? ""}</p>
      </section>

      <hr className="mt-4 mb-8" />

      {/* Social medias */}
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
              >
                <div className="flex flex-row items-center gap-2">
                  <Icon size={20} />
                  <span
                    className={`${url ? "text-background-100" : "text-background-300 italic"}`}
                  >
                    {url ?? `${name} não informado`}
                  </span>
                </div>
                {url && <ArrowUpRightIcon size={20} />}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section className="mt-8">
        <h2 className="mb-2 text-xl font-medium">Suas habilidades</h2>
        <SkillList skills={user.skills} />
      </section>

      {/* Memberships */}
      <section className="mt-8">
        <h2 className="mb-2 text-xl font-medium">Empresas em que participa</h2>
        {user.companies.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {user.companies.map((c) => (
              <li className="flex flex-row gap-2" key={c.id}>
                <CompanyProfile
                  company={c}
                  type="link"
                  showCompanySize={false}
                  showUserMembership={
                    c.createdBy === user.id ? "CREATOR" : "MEMBER"
                  }
                  visualOnlyWebsiteLink={false}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-background-300">
            Você ainda não participa de nenhuma empresa.
          </p>
        )}

        <div className="mt-2">
          <Button
            text="Registrar uma nova empresa"
            variant="ghost"
            href={APP_URLS.companyCreate}
          />
        </div>
      </section>

      {/* Session */}
      <section className="mt-8">
        <h2 className="mb-2 text-xl font-medium">Gerenciamento da sessão</h2>
        <div className="flex flex-col gap-2">
          <SignOutUserButton />
          <DeleteUserButton />
        </div>
      </section>
    </main>
  );
}
