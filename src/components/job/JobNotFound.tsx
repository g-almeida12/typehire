import { ModuleNotFound } from "../ui/ModuleNotFound";

interface JobNotFoundProps {
  applyFullPageStyles?: boolean;
  closeButtonQuery?: string;
}

export function JobNotFound({
  applyFullPageStyles = false,
  closeButtonQuery = undefined,
}: JobNotFoundProps) {
  return (
    <ModuleNotFound
      title="A vaga selecionada não foi encontrada."
      description="Esta vaga pode ter sido descontinuada pelo criador, não existir em
          nossa base de dados ou o link acessado conter um identificador
          inválido."
      closeButtonQuery={closeButtonQuery}
      applyFullPageStyles={applyFullPageStyles}
    />
  );
}
