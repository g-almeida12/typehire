import { Button } from "@/components/common/Button";
import { JobCard } from "@/components/job/JobCard";
import { CompanyResponsePayload } from "@/lib/modules/company";
import { APP_URLS } from "@/utils/constants";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

interface CompanyJobsSectionProps {
  userRole: "USER" | "CREATOR" | "MEMBER";
  company: CompanyResponsePayload;
}

export function CompanyJobsSection({
  userRole,
  company,
}: CompanyJobsSectionProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-medium">Vagas abertas no momento</h2>

      <ul className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
        {company.jobs.length === 0 ? (
          <p className="text-center text-sm text-background-300">
            {userRole === "CREATOR"
              ? "Que tal postar sua primeira vaga?"
              : "Essa empresa não postou nenhuma vaga ainda."}
          </p>
        ) : (
          company.jobs.map((j, idx) => (
            <li className="not-first:-mt-px" key={`job-${idx}`}>
              <JobCard job={{ ...j, company }} />
            </li>
          ))
        )}
      </ul>

      <div className="flex flex-col gap-2 items-center mt-4">
        {userRole !== "USER" && (
          <Button text="Criar nova vaga" href={APP_URLS.jobCreate(company.id)} />
        )}

        <Link
          href={APP_URLS.companyJobs(company.id)}
          className="flex flex-row gap-2 items-center justify-center text-center text-accent-100 text-sm"
        >
          Ver todas as vagas
          <ArrowUpRightIcon
            size={20}
            className="text-accent-200"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
