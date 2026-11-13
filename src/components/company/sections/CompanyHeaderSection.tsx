import { InfoTag } from "@/components/common/InfoTag";
import ReactMarkdown from "react-markdown";
import { CompanyProfile } from "../CompanyProfile";
import { CompanyResponsePayload } from "@/lib/modules/company";

interface CompanyHeaderSectionProps {
  userRole: "USER" | "CREATOR" | "MEMBER";
  company: CompanyResponsePayload;
}

export function CompanyHeaderSection({
  userRole,
  company,
}: CompanyHeaderSectionProps) {
  return (
    <section className="mt-4">
      {userRole !== "USER" && (
        <InfoTag
          label={userRole === "CREATOR" ? "Sua empresa" : "Você é membro"}
        />
      )}
      <CompanyProfile
        company={company}
        type="readonly"
        visualOnlyWebsiteLink={false}
      />

      <h2 className="mt-8 mb-4 text-xl font-medium">Sobre a empresa</h2>
      <div className="space-y-4 leading-relaxed">
        <ReactMarkdown>{company.bio}</ReactMarkdown>
      </div>
    </section>
  );
}
