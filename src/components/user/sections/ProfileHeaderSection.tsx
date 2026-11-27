import { UserPublicResponsePayload } from "@/lib/modules/user";
import { PhoneIcon, PinIcon } from "@/components/icons";
import { UserProfile } from "../UserProfile";
import { UserResume } from "../UserResume";

interface ProfileHeaderSectionProps {
  user: UserPublicResponsePayload;
  userProfileType?: "readonly" | "edit" | "link" | "list";
}

export function ProfileHeaderSection({
  user,
  userProfileType = "readonly",
}: ProfileHeaderSectionProps) {
  return (
    <section>
      <UserProfile user={user} type={userProfileType} />

      {/* Main user info */}
      <div className="w-full flex flex-row items-center gap-4 mt-4 mb-2">
        <p className="flex flex-row gap-2 items-center text-sm text-background-300">
          <PhoneIcon size={18} aria-hidden="true" />
          {user.phoneNumber ? user.phoneNumber : "Não informado"}
        </p>
        <p className="flex flex-row gap-2 items-center text-sm text-background-300">
          <PinIcon size={18} aria-hidden="true" />
          {user.location ? user.location : "Não informado"}
        </p>
      </div>

      {/* Resume */}
      <UserResume name={user.name} resumeUrl={user.resumeUrl} />

      {/* Bio */}
      <p className="mt-4">{user.bio ?? ""}</p>
    </section>
  );
}
