import { Button } from "@/components/common/Button";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { UserPublicResponsePayload } from "@/lib/modules/user";
import { APP_URLS } from "@/utils/constants";

interface ProfileMembershipsProps {
  companies: UserPublicResponsePayload["companies"];
  userId: string;
  isOwner?: boolean;
}
export function ProfileMembershipsSection({
  companies,
  userId,
  isOwner = false,
}: ProfileMembershipsProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-medium">Empresas em que participa</h2>
      {companies.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {companies.map((c) => (
            <li className="flex flex-row gap-2" key={c.id}>
              <CompanyProfile
                company={c}
                type="link"
                showCompanySize={false}
                showUserMembership={
                  c.createdBy === userId ? "CREATOR" : "MEMBER"
                }
                visualOnlyWebsiteLink={false}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-background-300">
          {isOwner ? "Você" : "O usuário"} ainda não participa de nenhuma
          empresa.
        </p>
      )}

      {isOwner && (
        <div className="mt-2">
          <Button
            text="Registrar uma nova empresa"
            variant="ghost"
            href={APP_URLS.COMPANY_CREATE}
          />
        </div>
      )}
    </section>
  );
}
