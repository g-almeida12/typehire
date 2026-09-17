import { Navbar } from "@/components/ui/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TypeHire | Entrar na sua Conta",
  description: "Acesse sua conta para acompanhar o status das suas candidaturas em vagas de tecnologia.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar onlyBrand />
      <main className="pb-8 px-4 text-center">{children}</main>
    </>
  );
}
