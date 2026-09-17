import Link from "next/link";
import { ArrowUpRightIcon, EditIcon } from "../icons";
import { APP_URLS } from "@/utils/constants";
import { CompanyResponsePayload } from "@/lib/schemas/company";
import { companySizeMapper } from "@/utils/mappers";

interface CompanyProfileProps {
  company: Pick<
    CompanyResponsePayload,
    "image" | "name" | "website" | "size" | "id"
  > & { createdBy?: CompanyResponsePayload["createdBy"] };
  type: "readonly" | "edit" | "link";
}

export async function CompanyProfile({ company, type }: CompanyProfileProps) {
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
        <div className="max-w-[calc(100%-50px-1rem)] flex flex-col gap-0">
          <p className="font-medium truncate">
            {company.name} ({companySizeMapper[company.size]})
          </p>
          <p className="-mt-px text-sm text-background-300 italic truncate">
            <a
              target="_blank"
              href={
                company.website
                  ? company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                  : ""
              }
            >
              {company.website}
            </a>
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {type === "edit" ? (
        <Link href={APP_URLS.companyUpdate(company.id)} className="shrink-0 mt-1">
          <EditIcon size={20} className="shrink-0 text-background-300" />
        </Link>
      ) : (
        type === "link" && (
          <Link href={APP_URLS.company(company.id)} className="shrink-0 mt-1">
            <ArrowUpRightIcon
              size={24}
              className="shrink-0 text-background-300"
            />
          </Link>
        )
      )}
    </div>
  );
}
