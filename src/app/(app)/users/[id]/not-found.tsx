import { ModuleNotFound } from "@/components/ui/ModuleNotFound";

export default function UserNotFoundPage() {
  return (
    <ModuleNotFound
      title=" O usuário selecionado não foi encontrado."
      description="Talvez ele tenha deletado a conta da nossa plataforma ou o link
            acessado contenha um identificador inválido."
      applyFullPageStyles
    />
  );
}
