"use client";

import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import {
  AtSignIcon,
  GlobeIcon,
  XIcon,
  PinIcon,
  ClockIcon,
  AwardIcon,
} from "@/components/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import {
  type JobClientCreatePayload,
  JobClientCreateSchema,
  type JobResponsePayload,
  type JobUpdatePayload,
  JobUpdateSchema,
  createJobAction,
  updateJobByIdAction,
} from "@/lib/modules/job/index";
import { SkillsDropdownSelect } from "../common/SkillsDropdownSelect";
import {
  JobLevel,
  JobModality,
  JobType,
  Skill,
} from "@/database/generated/enums";
import {
  jobLevelMapper,
  jobModalityMapper,
  jobTypeMapper,
  skillMapper,
} from "@/utils/mappers";
import { JobSalaryInput } from "./JobSalaryInput";
import { Dropdown } from "../common/Dropdown";

interface JobFormProps {
  skills: Skill[];
  companyId?: string;
  job?: JobResponsePayload;
}

export function JobForm({ job, companyId, skills }: JobFormProps) {
  const {
    formState: { errors },
    setError,
    handleSubmit,
    register,
    control,
  } = useForm<JobClientCreatePayload | JobUpdatePayload>({
    defaultValues: job ?? {
      modality: "REMOTO",
      type: "INTEGRAL",
      level: "ESTAGIÁRIO",
      skills: [],
    },
    resolver: zodResolver(job ? JobUpdateSchema : JobClientCreateSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const selectedModality = useWatch({
    control,
    name: "modality",
  });

  const handleButtonClick = async (
    data: JobClientCreatePayload | JobUpdatePayload,
  ) => {
    try {
      setIsLoading(true);

      // Update action
      if (job) {
        const updateResponse = await updateJobByIdAction(
          job.id,
          data as JobUpdatePayload,
        );

        if (!updateResponse.success) {
          throw new Error();
        }

        router.replace(APP_URLS.job(updateResponse.data.id));
      }
      // Create action
      else {
        const createResponse = await createJobAction({
          ...(data as JobClientCreatePayload),
          companyId: companyId!,
        });
        if (!createResponse.success) {
          throw new Error();
        }

        router.replace(APP_URLS.job(createResponse.data.id));
      }
    } catch (err) {
      setError("root", {
        message: `Não foi possível ${job ? "atualizar" : "criar"} a vaga.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleButtonClick)}
      className="flex flex-col gap-8 mt-6"
      autoComplete="off"
    >
      {errors.root?.message && (
        <p className="text-left text-sm text-red-500 w-full">
          {errors.root?.message}
        </p>
      )}

      {/* Job base info */}
      <fieldset>
        <legend className="text-xl font-medium mb-3">
          {job ? "Atualize" : "Preencha"} os dados da sua vaga
        </legend>
        <div className="flex flex-col gap-2">
          <Input
            {...register("title")}
            Icon={AtSignIcon}
            label="Título da vaga"
            placeholder="Digite o título da vaga"
            error={errors.title?.message}
            disabled={isLoading}
          />
          <TextArea
            {...register("description")}
            label="Descrição da vaga"
            placeholder="Descreva brevemente sua empresa e os requisitos da vaga em Markdown"
            error={errors.description?.message}
            disabled={isLoading}
          />
          <JobSalaryInput
            label="Selecione o tipo de salário"
            control={control}
            error={
              errors.fixedSalary?.message ||
              errors.hourlySalary?.message ||
              errors.intervalSalary?.message
            }
          />
          <Controller
            name="modality"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Modalidade"
                Icon={GlobeIcon}
                options={Object.values(JobModality).map(
                  (mod) => jobModalityMapper[mod],
                )}
                value={jobModalityMapper[field.value as JobModality]}
                onOptionClick={(selectedOption) => {
                  const enumKey = Object.keys(jobModalityMapper).find(
                    (key) =>
                      jobModalityMapper[key as JobModality] === selectedOption,
                  );
                  field.onChange(enumKey);
                }}
                error={errors.modality?.message}
              />
            )}
          />
          {["PRESENCIAL", "HÍBRIDO"].includes(selectedModality || "") && (
            <Input
              {...register("location")}
              Icon={PinIcon}
              label="Localização da vaga"
              placeholder="Ex.: Recife, PE"
              error={errors.location?.message}
              disabled={isLoading}
            />
          )}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Período de duração do trabalho"
                Icon={ClockIcon}
                options={Object.values(JobType).map((tp) => jobTypeMapper[tp])}
                value={jobTypeMapper[field.value as JobType]}
                onOptionClick={(selectedOption) => {
                  const enumKey = Object.keys(jobTypeMapper).find(
                    (key) => jobTypeMapper[key as JobType] === selectedOption,
                  );
                  field.onChange(enumKey);
                }}
                error={errors.type?.message}
              />
            )}
          />
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Experiência necessária"
                Icon={AwardIcon}
                options={Object.values(JobLevel).map(
                  (lv) => jobLevelMapper[lv],
                )}
                value={jobLevelMapper[field.value as JobLevel]}
                onOptionClick={(selectedOption) => {
                  const enumKey = Object.keys(jobLevelMapper).find(
                    (key) => jobLevelMapper[key as JobLevel] === selectedOption,
                  );
                  field.onChange(enumKey);
                }}
                error={errors.level?.message}
              />
            )}
          />
        </div>
      </fieldset>

      {/* Skills */}
      <fieldset>
        <legend className="text-xl font-medium">Habilidades necessárias</legend>
        <Controller
          name="skills"
          control={control}
          render={({ field }) => {
            const currentSkills = field.value ?? [];

            const skillsInfo = skills.map((s) => ({
              text: skillMapper[s],
              value: s,
              isSelected: currentSkills.includes(s),
            }));

            return (
              <>
                <SkillsDropdownSelect
                  label="Adicione uma nova habilidade"
                  skills={skillsInfo}
                  onSkillClick={(skill) =>
                    field.onChange([...currentSkills, skill])
                  }
                  placeholder="Digite uma habilidade"
                  disabled={isLoading}
                />
                <div className="mt-4">
                  {currentSkills.length > 0 ? (
                    <ul className="flex flex-row flex-wrap gap-2">
                      {currentSkills.map((s) => (
                        <li
                          className="flex flex-row items-center gap-2 px-2 py-1 rounded-sm bg-background-700 text-sm text-background-300 font-semibold"
                          key={s}
                        >
                          <span>{skillMapper[s]}</span>
                          <button
                            className="cursor-pointer"
                            type="button"
                            onClick={() =>
                              field.onChange(
                                currentSkills.filter((skill) => skill !== s),
                              )
                            }
                            aria-label="Remover habilidade"
                          >
                            <XIcon size={18} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-background-300">
                      Que tal tentar adicionar uma nova habilidade?
                    </p>
                  )}
                </div>
              </>
            );
          }}
        />
      </fieldset>

      <div className="mt-10">
        <Button
          text={
            isLoading
              ? job
                ? "Atualizando dados da vaga..."
                : "Criando nova vaga..."
              : job
                ? "Atualizar vaga"
                : "Criar nova vaga"
          }
          type="submit"
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
