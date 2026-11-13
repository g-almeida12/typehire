import { SkillList } from "@/components/common/SkillList";
import { Skill } from "@/database/generated/enums";

interface ProfileSkillsProps {
  skills: Skill[];
  isOwner?: boolean;
}

export function ProfileSkillsSection({
  skills,
  isOwner = false,
}: ProfileSkillsProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-medium">
        {isOwner ? "Suas habilidades" : "Habilidades do usuário"}
      </h2>
      <SkillList skills={skills} />
    </section>
  );
}
