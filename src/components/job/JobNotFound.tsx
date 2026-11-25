import { ModuleNotFound } from "../ui/ModuleNotFound";

export function JobNotFound() {
  return (
    <ModuleNotFound
      title="A vaga selecionada não foi encontrada."
      description="Esta vaga pode ter sido descontinuada pelo criador, não existir em
          nossa base de dados ou o link acessado conter um identificador
          inválido."
    />
  );
}
