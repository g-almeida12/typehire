import { ResendEmailVerificationButton } from "@/components/(auth)/ResendEmailVerificationButton";
import { Navbar } from "@/components/ui/Navbar";
import { authServer } from "@/lib/auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EmailVerificationPage(
  props: PageProps<"/email-verify">,
) {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (session?.user?.emailVerified) redirect(APP_URLS.home);

  const rawEmail = (await props.searchParams).email;
  if (!rawEmail) redirect(APP_URLS.register);

  const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;
  return (
    <>
      <Navbar onlyBrand />
      <main className="pt-10">
        <h1 className="mt-8 mb-4 text-2xl font-medium">Verifique seu email</h1>
        <p>
          Um email de verificação foi enviado para{" "}
          <span className="font-semibold">{email}</span> com expiração em até 30
          minutos.
        </p>

        <p className="mt-10 mb-2 text-sm text-background-300">
          O email ainda não chegou?
        </p>
        <ResendEmailVerificationButton email={email} />
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title: "Verifique seu email",
  description:
    "Termine a criação da sua conta clicando no botão enviado para seu email e comece a buscar seu novo emprego.",
};
