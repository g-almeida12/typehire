"use client";

import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import { PinHouseIcon, GitHubIcon, LinkedInIcon } from "@/components/icons";
import {
  type UserPrivateResponsePayload,
  type UserUpdatePayload,
  UserUpdateSchema,
  updateUserAction,
} from "@/lib/modules/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCircleIcon,
  MailIcon,
  PhoneIcon,
  GlobeIcon,
} from "@/components/icons";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import { SkillList } from "../common/SkillList";
import { SkillsDropdown } from "../common/SkillsDropdown";
import { ErrorMessage } from "../common/ErrorMessage";
import { ResumeUploadInput } from "./ResumeUploadInput";

interface ProfileUpdateFormProps {
  user: UserPrivateResponsePayload;
}

export function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
  const {
    formState: { errors, isSubmitting },
    setError,
    handleSubmit,
    register,
    control,
  } = useForm<UserUpdatePayload>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: user,
  });
  const router = useRouter();
  const [isRedirecting, startTransition] = useTransition();
  const isBusy = isRedirecting || isSubmitting;

  const handleUserUpdate = async (data: UserUpdatePayload) => {
    try {
      await updateUserAction(data);

      startTransition(() => router.replace(APP_URLS.PROFILE));
    } catch (_err) {
      setError("root", { message: "Não foi possível atualizar seus dados." });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUserUpdate)}
      className="flex flex-col gap-8 mt-6"
      autoComplete="off"
    >
      {errors.root?.message && <ErrorMessage message={errors.root?.message} />}
      <fieldset>
        <legend className="text-xl font-medium">Informações pessoais</legend>
        <div className="flex flex-col gap-2 mt-3">
          <Input
            {...register("name")}
            Icon={UserCircleIcon}
            label="Nome completo"
            placeholder="Seu nome completo"
            error={errors.name?.message}
            disabled={isBusy}
            defaultValue={user.name}
          />
          <Input
            {...register("email")}
            Icon={MailIcon}
            label="Email"
            placeholder="Ex.: exemplo@gmail.com"
            error={errors.email?.message}
            disabled={isBusy}
            defaultValue={user.email}
          />
          <Input
            {...register("location")}
            Icon={PinHouseIcon}
            label="Localização"
            placeholder="Ex.: Recife, PE"
            helperText="Campo opcional"
            error={errors.location?.message}
            disabled={isBusy}
            defaultValue={user.location ?? ""}
          />
          <Input
            {...register("phoneNumber")}
            Icon={PhoneIcon}
            label="Telefone"
            placeholder="Ex.: (99) 91234-5678"
            helperText="Campo opcional"
            error={errors.phoneNumber?.message}
            disabled={isBusy}
            defaultValue={user.phoneNumber ?? ""}
          />
          <TextArea
            {...register("bio")}
            label="Descrição"
            helperText="Campo opcional"
            error={errors.bio?.message}
            placeholder="Fale um pouco sobre você"
            disabled={isBusy}
            defaultValue={user.bio ?? ""}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-medium">Suas redes sociais</legend>
        <div className="flex flex-col gap-2 mt-3">
          <Input
            {...register("githubUrl")}
            Icon={GitHubIcon}
            label="GitHub"
            helperText="Campo opcional"
            error={errors.githubUrl?.message}
            placeholder="Ex.: www.github.com/user123"
            disabled={isBusy}
            defaultValue={user.githubUrl ?? ""}
          />
          <Input
            {...register("linkedinUrl")}
            Icon={LinkedInIcon}
            label="LinkedIn"
            helperText="Campo opcional"
            error={errors.linkedinUrl?.message}
            placeholder="Ex.: www.linkedin.com/in/user123"
            disabled={isBusy}
            defaultValue={user.linkedinUrl ?? ""}
          />
          <Input
            {...register("portfolioUrl")}
            Icon={GlobeIcon}
            label="Portfóflio"
            helperText="Campo opcional"
            error={errors.portfolioUrl?.message}
            placeholder="Ex.: www.user123.dev"
            disabled={isBusy}
            defaultValue={user.portfolioUrl ?? ""}
          />
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className="mb-3 text-xl font-medium">Currículo</legend>
        <ResumeUploadInput resumeUrl={user.resumeUrl} />
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xl font-medium">
          Habilidades registradas
        </legend>
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
          text={isBusy ? "Atualizando dados..." : "Atualizar meus dados"}
          type="submit"
          disabled={isBusy}
        />
      </div>
    </form>
  );
}
