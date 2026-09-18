import { UserPublicResponsePayload } from "@/lib/schemas";
import Link from "next/link";
import { ArrowUpRightIcon, EditIcon } from "../icons";
import { APP_URLS } from "@/utils/constants";

interface UserProfileProps {
  user: UserPublicResponsePayload;
  type: "readonly" | "edit" | "link" | "list";
}

export function UserProfile({ user, type }: UserProfileProps) {
  const userAvatar =
    user.name.split(" ").length >= 2
      ? user.name.split(" ")[0][0] + user.name.split(" ")[1][0]
      : user.name.split(" ")[0][0] + user.name.split(" ")[0][1];

  return (
    <div className="max-w-full flex flex-1 flex-row items-start justify-between">
      <div
        className={`flex flex-1 flex-row gap-2 ${type === "readonly" ? "max-w-full" : "max-w-[calc(100%-20px)]"} ${type === "list" ? "items-center" : "items-start"}`}
      >
        {/* Profile avatar */}
        <div
          className={`shrink-0 flex justify-center items-center rounded-full bg-accent-600 ${type === "list" ? "size-10" : "size-12.5"}`}
          aria-label="Avatar com iniciais do nome"
        >
          <span
            className="text-xl/[20px] font-semibold text-accent-100"
            aria-hidden="true"
          >
            {userAvatar}
          </span>
        </div>

        {/* User name and email */}
        <div className="max-w-[calc(100%-50px-1rem)] flex flex-col gap-0">
          <p
            className={`font-medium truncate text-bg-1000 ${type === "list" ? "text-base" : "text-lg"}`}
          >
            {user.name}
          </p>
          <p
            className={`-mt-px text-sm italic truncate ${type === "list" && "font-normal text-back"}`}
          >
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
