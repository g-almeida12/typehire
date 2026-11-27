import { ModuleNotFound } from "../ui/ModuleNotFound";

interface CandidateNotFoundProps {
  applyFullPageStyles?: boolean;
  closeButtonQuery?: string;
}

export function CandidateNotFound({
  applyFullPageStyles = false,
  closeButtonQuery = undefined,
}: CandidateNotFoundProps) {
  return (
    <ModuleNotFound
      title="O candidato selecionado não foi encontrado"
      description="Talvez ele tenha deletado a conta da nossa plataforma ou o link
            acessado contenha um identificador inválido."
      closeButtonQuery={closeButtonQuery}
      applyFullPageStyles={applyFullPageStyles}
    />
  );
}
