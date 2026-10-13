import { BackButton } from "@/components/common/BackButton";
import { CompanyProfile } from "@/components/company/CompanyProfile";
import { JobForm } from "@/components/job/JobForm";
import { Skill } from "@/database/generated/enums";
import { getJobByIdAction } from "@/lib/modules/job";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function JobUpdatePage(
  props: PageProps<"/jobs/[id]/update">,
) {
  const jobId = (await props.params).id;
  const jobResponse = await getJobByIdAction(jobId);
  if (!jobResponse.success) {
    if (jobResponse.status === 404) {
      notFound();
    } else {
      throw new Error();
    }
  }

  return (
    <main className="pb-4">
      <section>
        <div className="size-6 mt-4">
          <BackButton />
        </div>

        <div className="my-8">
          <CompanyProfile
            company={jobResponse.data.company}
            type="readonly"
            visualOnlyWebsiteLink={false}
          />
        </div>

        <h1 className="mt-8 mb-4 text-2xl font-semibold">
          Atualize os dados da sua vaga
        </h1>
      </section>

      <section>
        <JobForm
          skills={Object.values(Skill).toSorted()}
          job={jobResponse.data}
          companyId={jobResponse.data.company.id}
          key={`${jobResponse.data.id} - ${jobResponse.data.company.id}`}
        />
      </section>
    </main>
  );
}

export async function generateMetadata(
  props: PageProps<"/jobs/[id]/update">,
): Promise<Metadata> {
  try {
    const jobId = (await props.params).id;
    const jobResponse = await getJobByIdAction(jobId);
    if (!jobResponse.success) {
      if (jobResponse.status === 404) {
        notFound();
      } else {
        throw new Error();
      }
    }

    return {
      title: `Atualizar vaga da empresa ${jobResponse.data.company.name} | TypeHire`,
      description: "Atualize os dados da vaga da empresa.",
    };
  } catch (_err) {
    return {
      title: "TypeHire - Portal de Vagas",
    };
  }
}
