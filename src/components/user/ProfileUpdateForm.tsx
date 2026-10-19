"use client";

import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import { PinHouseIcon, GitHubIcon, LinkedInIcon } from "@/components/icons";
import {
  type UserPrivateResponsePayload,
  type UserUpdatePayload,
  UserUpdateSchema,
  updateUserAction,
} from "@/lib/modules/user/index";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCircleIcon,
  MailIcon,
  IdCardIcon,
  PhoneIcon,
  GlobeIcon,
} from "@/components/icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import { SkillList } from "../common/SkillList";
import { SkillsDropdown } from "../common/SkillsDropdown";

interface ProfileUpdateFormProps {
  user: UserPrivateResponsePayload;
}

export function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
  const {
    formState: { errors },
    setError,
    handleSubmit,
    register,
    control,
  } = useForm<UserUpdatePayload>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: user,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleUserUpdate = async (data: UserUpdatePayload) => {
    try {
      setIsLoading(true);
      await updateUserAction(data);

      router.replace(APP_URLS.profile);
    } catch (err) {
      setError("root", { message: "Não foi possível atualizar seus dados." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUserUpdate)}
      className="flex flex-col gap-8 mt-6"
      autoComplete="off"
    >
      {errors.root?.message && (
        <p className="text-left text-sm text-red-500 w-full">
          {errors.root?.message}
        </p>
      )}
      <fieldset>
        <legend className="text-xl font-medium">Informações pessoais</legend>
        <div className="flex flex-col gap-2 mt-3">
          <Input
            {...register("name")}
            Icon={UserCircleIcon}
            label="Nome completo"
            placeholder="Seu nome completo"
            error={errors.name?.message}
            disabled={isLoading}
          />
          <Input
            {...register("email")}
            Icon={MailIcon}
            label="email"
            placeholder="Ex.: exemplo@gmail.com"
            error={errors.email?.message}
            disabled={isLoading}
          />
          <Input
            {...register("cpf")}
            Icon={IdCardIcon}
            label="CPF"
            placeholder="Ex.: 123.456.789-00"
            error={errors.cpf?.message}
            disabled={isLoading}
          />
          <Input
            {...register("location")}
            Icon={PinHouseIcon}
            label="Localização"
            placeholder="Ex.: Recife, PE"
            helperText="Campo opcional"
            error={errors.location?.message}
            disabled={isLoading}
          />
          <Input
            {...register("phoneNumber")}
            Icon={PhoneIcon}
            label="Telefone"
            placeholder="Ex.: (99) 91234-5678"
            helperText="Campo opcional"
            error={errors.phoneNumber?.message}
            disabled={isLoading}
          />
          <TextArea
            {...register("bio")}
            label="Descrição"
            helperText="Campo opcional"
            error={errors.bio?.message}
            placeholder="Fale um pouco sobre você"
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <Input
            {...register("linkedinUrl")}
            Icon={LinkedInIcon}
            label="LinkedIn"
            helperText="Campo opcional"
            error={errors.linkedinUrl?.message}
            placeholder="Ex.: www.linkedin.com/in/user123"
            disabled={isLoading}
          />
          <Input
            {...register("portfolioUrl")}
            Icon={GlobeIcon}
            label="Portfóflio"
            helperText="Campo opcional"
            error={errors.portfolioUrl?.message}
            placeholder="Ex.: www.user123.dev"
            disabled={isLoading}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-medium mb-3">
          Habilidades registradas
        </legend>
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
          text={isLoading ? "Atualizando dados..." : "Atualizar meus dados"}
          type="submit"
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
