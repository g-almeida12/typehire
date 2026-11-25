import { CheckIcon, XIcon } from "@/components/icons";
import { Skill } from "@/database/generated/enums";
import { JobResponsePayload } from "@/lib/modules/job";
import { SKILL_LABELS } from "@/utils/mappers";
import ReactMarkdown from "react-markdown";

interface JobInfoSectionProps {
  job: JobResponsePayload;
  skills: Skill[];
}

export function JobInfoSection({ job, skills }: JobInfoSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Job Skills */}
      <section>
        <h2 className="mb-2 text-xl font-medium">Skills da vaga</h2>
        <ul className="flex flex-row flex-wrap gap-1">
          {job.skills.length > 0 ? (
            job.skills
              .slice()
              .sort((a, b) => {
                const userHasA = skills.includes(a) ? 1 : 0;
                const userHasB = skills.includes(b) ? 1 : 0;
                return userHasB - userHasA;
              })
              .map((s) => {
                const userHasSkill = skills.includes(s);
                const tagStyles = userHasSkill
                  ? "bg-green-400 text-green-950"
                  : "bg-red-400 text-red-800";

                return (
                  <li
                    className={`flex flex-row items-center gap-2 px-2 py-1 rounded-sm text-sm font-semibold ${tagStyles}`}
                    key={s}
                  >
                    <span>{SKILL_LABELS[s]}</span>
                    <span
                      className={`flex items-center justify-center size-5.5 rounded-full ${userHasSkill ? "bg-green-950" : "bg-red-800"}`}
                    >
                      {userHasSkill ? (
                        <CheckIcon
                          size={18}
                          className="text-green-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <XIcon
                          size={18}
                          className="text-red-400"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </li>
                );
              })
          ) : (
            <p className="text-sm text-background-300">
              Nenhuma skill registrada para essa vaga.
            </p>
          )}
        </ul>
      </section>

      {/* Job description */}
      <section>
        <h2 className="mb-2 mt-8 text-xl font-medium">Descrição da vaga</h2>
        <div className="prose prose-invert -mb-4 overflow-x-hidden">
          <ReactMarkdown>{job.description}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
}
