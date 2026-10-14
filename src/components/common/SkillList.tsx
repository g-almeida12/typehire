import { Skill } from "@/database/generated/enums";
import { XIcon } from "@/components/icons";
import { skillMapper } from "@/utils/mappers";

interface SkillListProps {
  skills: Skill[];
  updateMode?: { isLoading: boolean; setSkills: (skills: Skill[]) => void };
}

export function SkillList({ skills, updateMode = undefined }: SkillListProps) {
  return skills.length > 0 ? (
    <ul className="flex flex-row flex-wrap gap-2">
      {skills.map((s) => (
        <li
          className={`flex flex-row items-center gap-2 px-2 py-1 rounded-sm  text-sm  font-semibold ${updateMode?.isLoading ? "bg-background-800 text-background-400" : "bg-background-700 text-background-300"}`}
          key={s}
        >
          <span>{skillMapper[s]}</span>
          {updateMode && (
            <button
              className={
                updateMode.isLoading ? "cursor-default" : "cursor-pointer"
              }
              type="button"
              onClick={() => {
                if (updateMode.isLoading) return;

                updateMode.setSkills(skills.filter((skill) => skill !== s));
              }}
              aria-label="Remover habilidade"
            >
              <XIcon size={18} />
            </button>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-background-300">
      Que tal tentar adicionar uma nova habilidade?
    </p>
  );
}
