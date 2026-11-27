import { Navbar } from "../ui/Navbar";
import { UserPublicResponsePayload } from "@/lib/modules/user";
import { ProfileHeaderSection } from "./sections/ProfileHeaderSection";
import { ProfileSocialMediasSection } from "./sections/ProfileSocialMediasSection";
import { ProfileSkillsSection } from "./sections/ProfileSkillsSection";
import { ProfileMembershipsSection } from "./sections/ProfileMembershipsSection";
import { CloseButtonByQueryRemove } from "../common/CloseButtonByQueryRemove";

interface CandidateDetailsProps {
  candidate: UserPublicResponsePayload;
}

export function CandidateDetailsSection({ candidate }: CandidateDetailsProps) {
  return (
    <section className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-background-1000 md:static md:z-auto md:p-2 md:pb-4 md:overscroll-auto md:border md:rounded-md md:border-background-500">
      <div className="md:hidden">
        <Navbar />
      </div>
      <div className="p-4 md:p-0">
        <div className="mb-2 mt-4 md:hidden md:mb-0">
          <CloseButtonByQueryRemove searchParam="candidateId" />
        </div>

        <ProfileHeaderSection user={candidate} />

        <hr className="mt-4 mb-8" />

        <div className="space-y-8">
          <ProfileSocialMediasSection user={candidate} />
          <ProfileSkillsSection skills={candidate.skills} />
          <ProfileMembershipsSection
            companies={candidate.companies}
            userId={candidate.id}
          />
        </div>
      </div>
    </section>
  );
}
