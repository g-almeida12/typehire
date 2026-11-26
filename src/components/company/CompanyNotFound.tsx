import { ModuleNotFound } from "../ui/ModuleNotFound";

export default function CompanyNotFound() {
  return (
    <ModuleNotFound
      title="A empresa selecionada não foi encontrada."
      description="Talvez ela tenha encerrado suas atividades em nossa plataforma ou o
            link acessado contenha um identificador inválido."
      applyFullPageStyles
    />
  );
}
