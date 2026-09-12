import { getUserSession } from "@/lib/data";
import { APP_URLS } from "@/utils/constants";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const session = await getUserSession();

  if (!session) {
    redirect(APP_URLS.login);
  }

  return children;
}
