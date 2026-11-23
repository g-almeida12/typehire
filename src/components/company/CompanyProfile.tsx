import Link from "next/link";
import { ArrowUpRightIcon, EditIcon } from "../icons";
import { APP_URLS } from "@/utils/constants";
import { CompanyResponsePayload } from "@/lib/modules/company/index";
import { COMPANY_SIZE_LABELS } from "@/utils/mappers";

interface CompanyProfileProps {
  company: Pick<CompanyResponsePayload, "image" | "name" | "id"> & {
    website?: CompanyResponsePayload["website"];
    size?: CompanyResponsePayload["size"];
  };
  type: "readonly" | "edit" | "link";
  showCompanySize?: boolean;
  showUserMembership?: "CREATOR" | "MEMBER";
  visualOnlyWebsiteLink?: boolean;
}

const USER_MEMBERSHIP_MAP = {
  CREATOR: "Criador",
  MEMBER: "Membro",
};

export function CompanyProfile({
  company,
  type,
  showCompanySize = true,
  showUserMembership = undefined,
  visualOnlyWebsiteLink = true,
}: CompanyProfileProps) {
  const companyAvatar =
    company.name.split(" ").length >= 2
      ? company.name.split(" ")[0][0] + company.name.split(" ")[1][0]
      : company.name.split(" ")[0][0] + company.name.split(" ")[0][1];

  return (
    <div className="max-w-full flex flex-1 flex-row items-start justify-between">
      <div
        className={`${type === "readonly" ? "max-w-full" : "max-w-[calc(100%-20px)]"} flex flex-1 flex-row gap-2`}
      >
        {/* Company avatar */}
        <div
          className="shrink-0 flex justify-center items-center size-10 rounded-md bg-accent-600"
          aria-label="Logo da empresa"
        >
          <span
            className="tracking-wider text-xl font-semibold text-accent-100"
            aria-hidden="true"
          >
            {company.image ?? companyAvatar}
          </span>
        </div>

        {/* Company name and website */}
        <div className="min-w-0 flex-1 flex flex-col gap-0 items-start">
          <p className="w-full min-w-0 -mt-px font-medium text-sm truncate">
            {company.name}{" "}
            {showCompanySize && `(${COMPANY_SIZE_LABELS[company.size!]})`}
          </p>

          <p className="-mt-0.5 pr-1 text-sm text-background-300 italic truncate">
            {showUserMembership ? (
              USER_MEMBERSHIP_MAP[showUserMembership]
            ) : visualOnlyWebsiteLink ? (
              <span>{company.website}</span>
            ) : (
              company.website && (
                <a
                  target="_blank"
                  href={
                    company.website
                      ? company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                      : ""
                  }
                  aria-label="Acessar site da empresa"
                >
                  {company.website}
                </a>
              )
            )}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {type === "edit" ? (
        <Link
          href={APP_URLS.COMPANY_UPDATE(company.id)}
          className="shrink-0 mt-1"
          aria-label="Editar dados da empresa"
        >
          <EditIcon
            size={20}
            className="shrink-0 text-background-300"
            aria-hidden="true"
          />
        </Link>
      ) : (
        type === "link" && (
          <Link
            href={APP_URLS.COMPANY(company.id)}
            className="shrink-0 mt-1"
            aria-label="Ver dados da empresa"
          >
            <ArrowUpRightIcon
              size={24}
              className="shrink-0 text-background-300"
              aria-hidden="true"
            />
          </Link>
        )
      )}
    </div>
  );
}
