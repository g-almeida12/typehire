import { BackButton } from "@/components/common/BackButton";
import { Navbar } from "@/components/ui/Navbar";
import { getJobByIdAction } from "@/lib/modules/job/index";
import { getCurrentUserData } from "@/lib/data/user/index";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobActionsWrapper } from "@/components/job/JobActionsWrapper";
import { JobHeaderSection } from "@/components/job/sections/JobHeaderSection";
import { JobInfoSection } from "@/components/job/sections/JobInfoSection";
import { Suspense } from "react";
import {
  SkeletonCompanyProfile,
  SkeletonText,
  SkeletonSkills,
  SkeletonDescription,
} from "@/components/skeletons";
import { truncateText } from "@/utils/string";

export default function JobPage(props: PageProps<"/jobs/[id]">) {
  return (
    <>
      <Navbar />
      <main className="pb-4">
        <section className="w-full flex flex-row items-center justify-between mt-4">
          <div className="size-6">
            <BackButton />
          </div>
          <Suspense fallback={null}>
            <JobActionsWrapperContent props={props} />
          </Suspense>
        </section>

        <Suspense fallback={<JobContentFallback />}>
          <JobContent props={props} />
        </Suspense>
      </main>
    </>
  );
}

async function JobActionsWrapperContent({
  props,
}: {
  props: PageProps<"/jobs/[id]">;
}) {
  const jobId = (await props.params).id;
  const [user, jobResponse] = await Promise.all([
    getCurrentUserData(),
    getJobByIdAction(jobId),
  ]);

  // Handle get job request exceptions
  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else
      throw new Error(
        `Failed to load job actions wrapper for job ID: ${jobId}`,
      );
  }

  if (jobResponse.data.creator.id !== user!.id) return null;

  return (
    <div className="size-6">
      <JobActionsWrapper jobId={jobId} />
    </div>
  );
}

async function JobContent({ props }: { props: PageProps<"/jobs/[id]"> }) {
  const jobId = (await props.params).id;
  const [user, jobResponse] = await Promise.all([
    getCurrentUserData(),
    getJobByIdAction(jobId),
  ]);

  // Handle get job request exceptions
  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else
      throw new Error(`Failed to load job page content for job ID: ${jobId}`);
  }

  const job = jobResponse.data;
  const userRole =
    job.creator.id === user!.id || job.company.createdBy === user!.id
      ? "CREATOR"
      : job.company.memberIds.includes(user!.id)
        ? "MEMBER"
        : "USER";

  return (
    <>
      <JobHeaderSection
        userRole={userRole}
        currentUserId={user!.id}
        job={job}
      />
      <hr className="my-8" />
      <JobInfoSection skills={user!.skills} job={job} />
    </>
  );
}

export async function generateMetadata(
  props: PageProps<"/jobs/[id]">,
): Promise<Metadata> {
  const jobId = (await props.params).id;
  const jobResponse = await getJobByIdAction(jobId);

  if (!jobResponse.success) {
    if (jobResponse.status === 404) notFound();
    else throw new Error(`Failed to generate metadata for job ID: ${jobId}`);
  }

  const job = jobResponse.data;
  return {
    title: `${truncateText(job.title, 35)} na ${truncateText(job.company.name, 35)} | TypeHire`,
    description: truncateText(job.description),
  };
}

function JobContentFallback() {
  return (
    <div className="mt-4">
      {/* Company profile */}
      <SkeletonCompanyProfile type="link" />

      {/* Job main info */}
      <div className="mt-11">
        {/* Title */}
        <SkeletonText customClassName="w-80 h-6 rounded-md bg-background-200" />

        {/* Tags */}
        <div className="flex flex-row gap-2 mt-2">
          <SkeletonText customClassName="w-20 h-7 bg-background-700" />
          <SkeletonText customClassName="w-20 h-7 bg-background-700" />
        </div>

        {/* Salary and modality */}
        <div className="flex flex-col gap-2 mt-5">
          <SkeletonText customClassName="w-40 h-7 rounded-md bg-background-200" />
          <SkeletonText customClassName="w-20 h-3 bg-background-700" />
        </div>

        <div className="block w-full h-9 mt-6 rounded-sm bg-accent-400 animate-pulse"></div>
      </div>

      <hr className="my-8 animate-pulse" />

      {/* Job skills */}
      <div className="mt-8">
        <SkeletonText customClassName="w-50 h-6 mb-4 rounded-md bg-background-200" />
        <div className="flex flex-row flex-wrap gap-2">
          <SkeletonSkills />
        </div>
      </div>

      {/* Job description */}
      <SkeletonText customClassName="w-60 h-6 mt-8 mb-4 rounded-md bg-background-200" />
      <div className="w-[calc(100%+2rem)] p-4 -ml-4 bg-background-800">
        <SkeletonText customClassName="w-80 h-6 mb-4 rounded-md bg-background-200" />
        <SkeletonDescription customKey="desc-1" />

        <SkeletonText customClassName="w-80 h-6 mb-4 mt-8 rounded-md bg-background-200" />
        <SkeletonDescription customKey="desc-2" length={2} />
      </div>
    </div>
  );
}
