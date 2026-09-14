import { UserPublicResponsePayload } from "@/lib/schemas";
import Link from "next/link";
import { ArrowUpRightIcon, EditIcon } from "../icons";
import { APP_URLS } from "@/utils/constants";

interface UserProfileProps {
  user: UserPublicResponsePayload;
  type: "readonly" | "edit" | "link";
}

export async function UserProfile({ user, type }: UserProfileProps) {
  const userAvatar =
    user.name.split(" ").length >= 2
      ? user.name.split(" ")[0][0] + user.name.split(" ")[1][0]
      : user.name.split(" ")[0][0] + user.name.split(" ")[0][1];

  return (
    <div className="max-w-full flex flex-1 flex-row items-start justify-between mt-6">
      <div
        className={`${type === "readonly" ? "max-w-full" : "max-w-[calc(100%-20px)]"} flex flex-1 flex-row gap-2`}
      >
        {/* Profile avatar */}
        <div
          className="shrink-0 flex justify-center items-center size-12.5 rounded-full bg-accent-600"
          aria-label="Avatar com iniciais do nome"
        >
          <span
            className="tracking-wider text-2xl font-semibold text-accent-100"
            aria-hidden="true"
          >
            {userAvatar}
          </span>
        </div>

        {/* User name and email */}
        <div className="max-w-[calc(100%-50px-1rem)] flex flex-col gap-0">
          <p className="text-lg font-medium truncate">{user.name}</p>
          <p className="-mt-px text-sm text-background-300 italic truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {type === "edit" ? (
        <Link href={APP_URLS.profileUpdate} className="shrink-0 mt-1">
          <EditIcon size={20} className="shrink-0 text-background-300" />
        </Link>
      ) : (
        type === "link" && (
          <Link href={APP_URLS.user(user.id)} className="shrink-0 mt-1">
            <ArrowUpRightIcon
              size={24}
              className="shrink-0 text-background-300"
            />
          </Link>
        )
      )}
    </div>
  );
}
