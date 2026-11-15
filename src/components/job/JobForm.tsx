"use client";

import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import { AtSignIcon, PinIcon } from "@/components/icons";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useTransition } from "react";

interface JobFormProps {
  companyId?: string;
  job?: JobResponsePayload;
}

export function JobForm({ job, companyId }: JobFormProps) {
  const {
    formState: { errors, isSubmitting },
    setError,
    setValue,
    handleSubmit,
    register,
    control,
  } = useForm<JobClientCreatePayload | JobUpdatePayload>({
    defaultValues: job ?? {
      title: "",
      description: "",
      modality: "REMOTE",
      type: "FULL_TIME",
      level: "INTERN",
      skills: [],
    },
    resolver: zodResolver(job ? JobUpdateSchema : JobClientCreateSchema),
  });
  const router = useRouter();
  const [isRedirecting, startTransition] = useTransition();
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
  const isBusy = isSubmitting || isRedirecting;

  const handleButtonClick = async (
    data: JobClientCreatePayload | JobUpdatePayload,
  ) => {
    try {
      // Update action
      if (job) {
        const updateResponse = await updateJobByIdAction(
          job.id,
          data as JobUpdatePayload,
        );

        if (!updateResponse.success) throw new Error();

        startTransition(() =>
          router.replace(APP_URLS.JOB(updateResponse.data.id)),
        );
      }
      // Create action
      else {
        const createResponse = await createJobAction({
          ...(data as JobClientCreatePayload),
          companyId: companyId!,
        });
        if (!createResponse.success) throw new Error();

        startTransition(() =>
          router.replace(APP_URLS.JOB(createResponse.data.id)),
        );
      }
    } catch (_err) {
      setError("root", {
        message: `Não foi possível ${job ? "atualizar" : "criar"} a vaga.`,
      });
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
            disabled={isBusy}
            defaultValue={job?.title ?? ""}
          />
          <TextArea
            {...register("description")}
            label="Descrição da vaga"
            placeholder="Descreva brevemente sua empresa e os requisitos da vaga em Markdown"
            error={errors.description?.message}
            disabled={isBusy}
            defaultValue={job?.description ?? ""}
          />
          <JobSalaryInput
            label="Selecione o tipo de salário"
            defaultSalaryType={salaryType}
            setValue={setValue}
            control={control}
            disabled={isBusy}
            error={
              errors.fixedSalary?.message ||
              errors.hourlySalary?.message ||
              errors.intervalSalary?.message
            }
          />
          <JobModalityDropdown
            control={control}
            error={errors.modality?.message}
            isLoading={isBusy}
            onSelect={(mod) => {
              if (mod === "REMOTE") setValue("location", null);
            }}
          />
          {["PRESENCIAL", "HÍBRIDO"].includes(selectedModality || "") && (
            <Input
              {...register("location")}
              Icon={PinIcon}
              label="Localização da vaga"
              placeholder="Ex.: Recife, PE"
              error={errors.location?.message}
              disabled={isBusy}
            />
          )}
          <JobTypeDropdown
            control={control}
            error={errors.type?.message}
            isLoading={isBusy}
          />
          <JobLevelDropdown
            control={control}
            error={errors.level?.message}
            isLoading={isBusy}
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
          isLoading={isBusy}
        />
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <div className="mt-4">
              <SkillList
                skills={field.value ?? []}
                updateMode={{
                  isLoading: isBusy,
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
            isBusy
              ? job
                ? "Atualizando dados da vaga..."
                : "Criando nova vaga..."
              : job
                ? "Atualizar vaga"
                : "Criar nova vaga"
          }
          type="submit"
          disabled={isBusy}
        />
      </div>
    </form>
  );
}
