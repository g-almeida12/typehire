import { SkeletonButton } from "./SkeletonButton";
import { SkeletonCompanyProfile } from "./SkeletonCompanyProfile";
import { SkeletonDescription } from "./SkeletonDescription";
import { SkeletonSkills } from "./SkeletonSkills";
import { SkeletonSocialMedias } from "./SkeletonSocialMedias";
import { SkeletonText } from "./SkeletonText";
import { SkeletonUserProfile } from "./SkeletonUserProfile";

interface SkeletonProfileContentProps {
  isCurrentUser?: boolean;
}

export function SkeletonProfileContent({
  isCurrentUser = false,
}: SkeletonProfileContentProps) {
  return (
    <div aria-busy="true">
      <div className="mt-6">
        <SkeletonUserProfile type="edit" />
      </div>
      <div className="flex flex-row gap-4 mt-2">
        <SkeletonText customClassName="w-30 h-3 rounded-sm bg-background-200" />
        <SkeletonText customClassName="w-30 h-3 rounded-sm bg-background-200" />
      </div>

      {/* Resume */}
      <div className="w-full h-8 mt-3 rounded-md border border-background-500 bg-background-500 animate-pulse"></div>

      <SkeletonDescription />
      <hr className="mt-4 mb-8" />

      <SkeletonText customClassName="w-60 h-5 mb-2 rounded-md bg-background-200" />
      <SkeletonSocialMedias />

      <SkeletonText customClassName="w-60 h-5 mb-2 mt-8 rounded-md bg-background-200" />
      <SkeletonSkills />

      {/* Companies */}
      <div className="mt-8">
        <SkeletonText customClassName="w-80 h-6 mb-3 rounded-md bg-background-200" />

        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonCompanyProfile type="link" key={`company-${idx}`} />
          ))}
        </div>
      </div>

      {isCurrentUser && (
        <>
          {/* Session */}
          <SkeletonText customClassName="w-60 h-5 mb-4 mt-8 rounded-md bg-background-200" />
          <div className="flex flex-col gap-2">
            <SkeletonButton variant="ghost" />
            <SkeletonButton variant="critical" />
          </div>
        </>
      )}
    </div>
  );
}
