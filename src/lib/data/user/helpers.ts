import { authServer } from "@/lib/auth/auth-server";
import { headers } from "next/headers";
import { mapPrivateUserEntity } from "./index";
import { UserPrivateResponsePayload } from "@/lib/modules/user/index";
import { getCachedUser, getCachedUserId } from "./caches";

export async function getCurrentUserData(): Promise<UserPrivateResponsePayload | null> {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const user = await getCachedUser(session.user.id);
  if (!user) {
    return null;
  } else {
    return mapPrivateUserEntity(user);
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const userId = await getCachedUserId(session.user.id);
  if (!userId) {
    return null;
  } else {
    return userId;
  }
}
