import { SearchInput } from "@/components/common";
import { Navbar } from "@/components/ui";
import { authServer } from "@/utils/auth/auth-server";
import { headers } from "next/headers";

export default async function HomePage() {
  const session = (await authServer.api.getSession({
    headers: await headers(),
  }))!;

  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-col gap-2 mt-10">
          <p className="text-xl font-medium text-center">
            Olá, {session.user.name}.
          </p>
          <SearchInput placeholder="Encontre sua próxima vaga" />
        </div>
      </main>
    </>
  );
}
