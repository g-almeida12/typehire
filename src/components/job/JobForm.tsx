"use client";

import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import { AtSignIcon, PinIcon } from "@/components/icons";
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
import { JobSalaryInput } from "./JobSalaryInput";
import { JobLevelDropdown } from "./JobLevelDropdown";
import { JobTypeDropdown } from "./JobTypeDropdown";
import { JobModalityDropdown } from "./JobModalityDropdown";
import { SkillsDropdown } from "../common/SkillsDropdown";
import { SkillList } from "../common/SkillList";

interface JobFormProps {
  companyId?: string;
  job?: JobResponsePayload;
}

export function JobForm({ job, companyId }: JobFormProps) {
  const {
    formState: { errors },
    setError,
    setValue,
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
  const salaryType = job
    ? job.fixedSalary
      ? "fixed"
      : job.intervalSalary
        ? "interval"
        : "hourly"
    : undefined;

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
          Informações públicas
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
            defaultSalaryType={salaryType}
            setValue={setValue}
            control={control}
            error={
              errors.fixedSalary?.message ||
              errors.hourlySalary?.message ||
              errors.intervalSalary?.message
            }
            disabled={isLoading}
          />
          <JobModalityDropdown
            control={control}
            error={errors.modality?.message}
            isLoading={isLoading}
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
          <JobTypeDropdown
            control={control}
            error={errors.type?.message}
            isLoading={isLoading}
          />
          <JobLevelDropdown
            control={control}
            error={errors.level?.message}
            isLoading={isLoading}
          />
        </div>
      </fieldset>

      {/* Skills */}
      <fieldset>
        <legend className="text-xl font-medium">Habilidades necessárias</legend>
        <SkillsDropdown
          label="Adicione uma nova habilidade"
          control={control}
          error={errors.skills?.message}
          isLoading={isLoading}
        />
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <div className="mt-4">
              <SkillList
                skills={field.value ?? []}
                updateMode={{
                  isLoading,
                  setSkills: (skills) => field.onChange(skills),
                }}
              />
            </div>
          )}
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
