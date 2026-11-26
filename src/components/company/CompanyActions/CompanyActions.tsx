import { BackButton } from "@/components/common/BackButton";
import { CompanyActionsWrapper } from "./CompanyActionsWrapper";
import { CompanyResponsePayload } from "@/lib/modules/company";

interface CompanyActionsProps {
  company: CompanyResponsePayload;
  userId: string;
}

export function CompanyActions({ company, userId }: CompanyActionsProps) {
  return (
    <div className="h-6 flex flex-row items-center justify-between">
      <BackButton />
      {company.createdBy === userId && (
        <div className="mb-2 ml-auto">
          <CompanyActionsWrapper companyId={company.id} />
        </div>
      )}
    </div>
  );
}
