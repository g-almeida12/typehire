import { SearchInput } from "@/components/common";
import { Navbar } from "@/components/ui";
import { authServer } from "@/utils/auth/auth-server";
import { headers } from "next/headers";

export default async function HomePage() {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <Navbar />
      <main>
        <p>Olá, {session!.user.name}.</p>
        <SearchInput placeholder="Encontre sua próxima vaga"/>
      </main>
    </>
  );
}
