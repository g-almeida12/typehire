import { Navbar } from "@/components/ui/Navbar";
import { Metadata } from "next";
import { RegisterForm } from "@/components/(auth)/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Navbar onlyBrand />
      <main className="pb-4">
        <h1 className="mt-8 text-2xl font-medium text-center">Crie sua conta</h1>
        <p className="text-sm/tight text-background-300 text-center">
          Preencha seus dados pessoais necessários e registre suas informações
          básicas.
        </p>

        <RegisterForm />
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title: "TypeHire | Registrar uma nova conta",
  description:
    "Crie uma conta no Typehire e comece a buscar seu novo emprego em questão de segundos.",
};
