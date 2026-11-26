import { ModuleNotFound } from "@/components/ui/ModuleNotFound";

export default function CompanyNotFoundPage() {
  return (
    <ModuleNotFound
      title="A empresa selecionada não foi encontrada."
      description="Talvez ela tenha encerrado suas atividades em nossa plataforma ou o
            link acessado contenha um identificador inválido."
      applyFullPageStyles
    />
  );
}
