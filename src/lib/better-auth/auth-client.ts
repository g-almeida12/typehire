import { ENV_CLIENT } from "@/utils/env/env.client";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: ENV_CLIENT.NEXT_PUBLIC_BASE_URL,
});
