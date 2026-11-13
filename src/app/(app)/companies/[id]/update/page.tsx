import { BackButton } from "@/components/common/BackButton";
import { CompanyForm } from "@/components/company/CompanyForm";
import { getCompanyByIdAction } from "@/lib/modules/company/index";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  SkeletonText,
  SkeletonInput,
  SkeletonUserProfile,
  SkeletonButton,
} from "@/components/skeletons";
import { truncateText } from "@/utils/string";

export default async function CompanyUpdatePage(
  props: PageProps<"/companies/[id]/update">,
) {
  return (
    <main className="pb-4">
      <section>
        <div className="size-6 mt-4">
          <BackButton />
        </div>

        <h1 className="mt-8 mb-6 text-2xl font-semibold">
          Atualize os dados da sua empresa
        </h1>
      </section>

      <section>
        <Suspense fallback={<CompanyFormContentFallback />}>
          <CompanyFormContent props={props} />
        </Suspense>
      </section>
    </main>
  );
}

async function CompanyFormContent({
  props,
}: {
  props: PageProps<"/companies/[id]/update">;
}) {
  const companyId = (await props.params).id;
  const [user, companyResponse] = await Promise.all([
    getCurrentUserData(),
    getCompanyByIdAction(companyId),
  ]);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to load form content for company ID: ${companyId}`,
      );
  }

  return (
    <CompanyForm
      company={companyResponse.data}
      currentUserEmail={user!.email}
      key={companyResponse.data.id}
    />
  );
}

function CompanyFormContentFallback() {
  return (
    <div className="flex flex-col gap-8 mt-6">
      {/* Company base info */}
      <div>
        <SkeletonText customClassName="w-60 h-5 mb-6 rounded-md bg-background-200" />

        <div className="flex flex-col gap-2 mb-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonInput variant="input" key={`input-${idx}`} />
          ))}
        </div>
        <SkeletonInput variant="textarea" />
      </div>

      {/* Memberships */}
      <div>
        <SkeletonText customClassName="w-60 h-5 mb-3 rounded-md bg-background-200" />
        <SkeletonText customClassName="w-full h-4 mb-1 rounded-sm bg-background-200" />
        <SkeletonText customClassName="w-40 h-4 mb-5 rounded-sm bg-background-200" />

        <SkeletonInput variant="input" />
        <ul className="flex flex-row flex-wrap gap-0 mt-4 rounded-md bg-background-700">
          {Array.from({ length: 2 }).map((_, idx) => (
            <li
              className="w-full rounded-sm px-2 py-1 bg-background-700"
              key={`user-${idx}`}
            >
              {idx >= 1 && <hr className="mb-2 mx-2 text-background-500" />}

              <SkeletonUserProfile />
            </li>
          ))}
        </ul>
      </div>

      <SkeletonButton />
    </div>
  );
}

export async function generateMetadata(
  props: PageProps<"/companies/[id]/update">,
): Promise<Metadata> {
  const companyId = (await props.params).id;
  const companyResponse = await getCompanyByIdAction(companyId);

  if (!companyResponse.success) {
    if (companyResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to generate metadata for company ID: ${companyId}`,
      );
  }

  return {
    title: `Atualizar empresa ${truncateText(companyResponse.data.name, 35)} | TypeHire`,
    description:
      "Atualize os dados da sua empresa para dar total transparência aos candidatos.",
  };
}
