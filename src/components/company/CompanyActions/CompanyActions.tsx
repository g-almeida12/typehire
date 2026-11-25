import { BackButton } from "@/components/common/BackButton";
import { CompanyActionsWrapper } from "./CompanyActionsWrapper";
import { CompanyResponsePayload } from "@/lib/modules/company";

interface CompanyActionsProps {
  company: CompanyResponsePayload;
  userId: string;
}

export function CompanyActions({ company, userId }: CompanyActionsProps) {
  return (
    <div className="size-6">
      <BackButton />
      {company.createdBy === userId && (
        <div className="mb-2">
          <CompanyActionsWrapper companyId={company.id} />
        </div>
      )}
    </div>
  );
}
