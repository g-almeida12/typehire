import { UserProfile } from "@/components/user/UserProfile";
import { CompanyResponsePayload } from "@/lib/modules/company";

interface CompanyMembersSectionProps {
  userRole: "USER" | "CREATOR" | "MEMBER";
  currentUserId: string;
  company: CompanyResponsePayload;
}

export function CompanyMembersSection({
  userRole,
  currentUserId,
  company,
}: CompanyMembersSectionProps) {
  const companyCreator = company.members.filter(
    (m) => m.id === company.createdBy,
  )[0];

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-medium">
        {userRole !== "USER" ? "Sua equipe" : "Nossa equipe"}
      </h2>

      <h3 className="mb-2 font-medium text-background-300">
        Criador {userRole === "CREATOR" && "(você)"}
      </h3>
      <UserProfile
        user={companyCreator}
        type={userRole === "CREATOR" ? "readonly" : "link"}
      />

      <h3 className="mb-2 mt-4 font-medium text-background-300">Membros</h3>
      <ul className="flex flex-col gap-4">
        {company.members.length === 1 ? (
          <p className="text-center text-sm text-background-300">
            Não há nenhum membro nessa empresa.
          </p>
        ) : (
          company.members
            .filter((m) => m.id !== company.createdBy)
            .map((m, idx) => (
              <li key={`user-${idx}`}>
                <UserProfile
                  user={m}
                  type="link"
                  isCurrentUserProfile={m.id === currentUserId}
                />
              </li>
            ))
        )}
      </ul>
    </section>
  );
}
