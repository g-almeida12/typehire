"use client";

import { Skill } from "@/database/generated/enums";
import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import {
  PinHouseIcon,
  GitHubIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons";
import {
  UserPrivateResponsePayload,
  UserUpdatePayload,
  UserUpdateSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCircleIcon,
  MailIcon,
  IdCardIcon,
  PhoneIcon,
  GlobeIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SkillsDropdownSelect } from "../common/SkillsDropdownSelect";
import { skillMapper } from "@/utils/mappers";
import { Button } from "../common/Button";
import { updateUserAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";

interface ProfileUpdateFormProps {
  user: UserPrivateResponsePayload;
  skills: Skill[];
}

export function ProfileUpdateForm({ user, skills }: ProfileUpdateFormProps) {
  const {
    formState: { errors },
    setError,
    handleSubmit,
    register,
    reset,
  } = useForm<UserUpdatePayload>({
    resolver: zodResolver(UserUpdateSchema),
  });
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(user.skills);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        bio: user.bio,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl,
        cpf: user.cpf,
      });
    }
  }, [user, reset]);

  const skillsInfo = skills.map((s) => ({
    text: skillMapper[s],
    value: s,
    isInUserSkills: selectedSkills.includes(s) || user.skills.includes(s),
  }));

  const handleUserUpdate = async (data: UserUpdatePayload) => {
    try {
      setIsLoading(true);
      await updateUserAction({ ...data, skills: selectedSkills });

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
        <SkillsDropdownSelect
          label="Adicione uma nova habilidade"
          skills={skillsInfo}
          onSkillClick={(skill) =>
            setSelectedSkills((prev) => [...prev, skill])
          }
          placeholder="Digite uma habilidade"
          disabled={isLoading}
        />

        <div className="mt-4">
          {selectedSkills.length > 0 ? (
            <ul className="flex flex-row flex-wrap gap-2">
              {selectedSkills.map((s) => (
                <li
                  className="flex flex-row items-center gap-2 px-2 py-1 rounded-sm bg-background-700 text-sm text-background-300 font-semibold"
                  key={s}
                >
                  <span>{skillMapper[s]}</span>
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={() =>
                      setSelectedSkills(
                        selectedSkills.filter((skill) => skill !== s),
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
