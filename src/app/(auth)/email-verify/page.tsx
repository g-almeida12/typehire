import { ResendEmailVerificationButton } from "@/components/(auth)/ResendEmailVerificationButton";
import { BackButton } from "@/components/common/BackButton";
import { Navbar } from "@/components/ui/Navbar";
import { authServer } from "@/lib/better-auth/auth-server";
import { APP_URLS } from "@/utils/constants";
import { CircleAlertIcon } from "@/components/icons";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, React.ReactNode> = {
  INVALID_TOKEN: (
    <>
      Este link é inválido ou já foi usado. Se você já confirmou seu email, é só
      <Link href={APP_URLS.LOGIN} className="underline">
        entrar na sua conta
      </Link>
      .
    </>
  ),
  TOKEN_EXPIRED: (
    <>
      Este link expirou. Reenvie o link abaixo ou, se já confirmou,{" "}
      <Link href={APP_URLS.LOGIN} className="underline">
        entre na sua conta
      </Link>
      .
    </>
  ),
  USER_NOT_FOUND: (
    <>
      Não encontramos uma conta para este link. Se ainda não começou a criar uma
      conta,{" "}
      <Link href={APP_URLS.REGISTER} className="underline">
        crie uma agora
      </Link>
      .
    </>
  ),
};

export default function EmailVerificationPage(
  props: PageProps<"/email-verify">,
) {
  return (
    <Suspense fallback={null}>
      <EmailVerificationContent props={props} />
    </Suspense>
  );
}

async function EmailVerificationContent({
  props,
}: {
  props: PageProps<"/email-verify">;
}) {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });
  if (session?.user?.emailVerified) redirect(APP_URLS.HOME);

  const { email: rawEmail, error: rawError } = await props.searchParams;
  if (!rawEmail) redirect(APP_URLS.REGISTER);
  const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;
  const error = Array.isArray(rawError) ? rawError[0] : rawError;

  return (
    <>
      <Navbar onlyBrand />
      <main className="">
        <section>
          <div className="size-6 mt-4 mb-10">
            <BackButton />
          </div>

          <h1 className="mt-8 mb-4 text-2xl font-medium">
            Verifique seu email
          </h1>
          <p>
            Um email de verificação foi enviado para{" "}
            <span className="font-semibold">{email}</span> com expiração em até
            30 minutos.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 flex gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-3"
            >
              <CircleAlertIcon
                className="mt-0.5 size-5 shrink-0 text-red-400"
                aria-hidden="true"
              />
              <div className="text-sm">
                <p className="font-medium text-red-300">
                  Não foi possível confirmar seu email
                </p>
                <p className="mt-1">
                  {ERROR_MESSAGES[error] ??
                    "Algo deu errado ao confirmar seu email"}{" "}
                </p>
              </div>
            </div>
          )}

          <p className="mt-10 mb-2 text-sm text-background-300">
            O email ainda não chegou?
          </p>
          <ResendEmailVerificationButton email={email} />
        </section>
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title: "Verifique seu email",
  description:
    "Termine a criação da sua conta clicando no link enviado para seu email e comece a buscar seu novo emprego.",
};
