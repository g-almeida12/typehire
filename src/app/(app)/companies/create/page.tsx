import { BackButton } from "@/components/common/BackButton";
import { CompanyForm } from "@/components/company/CompanyForm";
import {
  SkeletonText,
  SkeletonInput,
  SkeletonUserProfile,
} from "@/components/skeletons";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { Suspense } from "react";

export default function CompanyCreatePage() {
  return (
    <main className="pb-4">
      <section>
        <div className="size-6 mt-4">
          <BackButton />
        </div>

        <h1 className="mt-8 mb-4 text-2xl font-semibold">
          Crie a conta da sua empresa no TypeHire
        </h1>
        <p>
          Ao registrar uma nova empresa, você se torna o responsável por ela no
          TypeHire, pode gerenciar vagas e convidar outros para trabalhar com
          você.
        </p>
      </section>

      <section>
        <Suspense fallback={<CompanyFormSectionFallback />}>
          <CompanyFormContent />
        </Suspense>
      </section>
    </main>
  );
}

async function CompanyFormContent() {
  const user = (await getCurrentUserData())!;

  return <CompanyForm currentUserEmail={user.email} />;
}

function CompanyFormSectionFallback() {
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
    </div>
  );
}

export const metadata: Metadata = {
  title: "Crie uma nova empresa | Typehire",
};
