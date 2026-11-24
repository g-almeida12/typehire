import { APP_URLS } from "@/utils/constants";
import { redirect } from "next/navigation";

export function GET() {
  return redirect(APP_URLS.JOBS);
}
