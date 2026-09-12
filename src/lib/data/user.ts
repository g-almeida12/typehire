import { authServer } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export async function getUserSession() {
  return (await authServer.api.getSession({
    headers: await headers(),
  }))!;
}
