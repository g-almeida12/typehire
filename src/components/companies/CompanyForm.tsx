"use client";

import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import {
  BuildingIcon,
  AtSignIcon,
  PackageIcon,
  GlobeIcon,
  XIcon,
} from "@/components/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { createCompanyAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import {
  CompanyCreatePayload,
  CompanyCreateSchema,
  CompanyResponsePayload,
} from "@/lib/schemas/company";
import { UserPublicResponsePayload } from "@/lib/schemas";
import { UsersDropdownSelect } from "./UserDropdownSelect";
import { UserProfile } from "../common/UserProfile";

interface CompanyFormProps {
  company?: CompanyResponsePayload;
}

export function CompanyForm({ company }: CompanyFormProps) {
  const {
    formState: { errors },
    setError,
    handleSubmit,
    register,
    reset,
  } = useForm<CompanyCreatePayload>({
    resolver: zodResolver(CompanyCreateSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<
    UserPublicResponsePayload[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    if (company) {
      reset({});
    }
  }, [company, reset]);

  const handleButtonClick = async (data: CompanyCreatePayload) => {
    try {
      if (company) {
        //TODO: adicionar server action para update de empresas
      } else {
        const response = await createCompanyAction({
          ...data,
          members: selectedUsers,
        });
        if (!response.success) {
          if (response.status === 409 && response.field === "cnpj") {
            setError("cnpj", { message: "CNPJ já cadastrado." });
          } else {
            throw new Error("");
          }

          return;
        }

        router.replace(APP_URLS.company(response.data.id));
      }
    } catch (err) {
      setError("root", {
        message: `Não foi possível ${company ? "atualizar" : "criar"} a empresa.`,
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

      {/* Company base info */}
      <fieldset>
        <legend className="text-xl font-medium mb-3">
          {company ? "Atualize" : "Preencha"} os dados da sua empresa
        </legend>
        <div className="flex flex-col gap-2">
          <Input
            {...register("name")}
            Icon={AtSignIcon}
            label="Nome da empresa"
            placeholder="Digite o nome da empresa"
            error={errors.name?.message}
            disabled={isLoading}
          />
          <Input
            {...register("cnpj")}
            Icon={BuildingIcon}
            label="CNPJ"
            placeholder="Ex.: 12.345.678/0001-99"
            error={errors.cnpj?.message}
            disabled={isLoading}
          />
          <Input
            {...register("size")}
            Icon={PackageIcon}
            label="Tamanho da empresa"
            placeholder="Selecione o tamanho da empresa"
            error={errors.size?.message}
            disabled={isLoading}
          />
          <Input
            {...register("website")}
            Icon={GlobeIcon}
            label="Site da empresa"
            placeholder="Ex.: sua-empresa.com.br"
            helperText="Campo opcional"
            error={errors.website?.message}
            disabled={isLoading}
          />
          <TextArea
            {...register("bio")}
            label="Descrição da empresa"
            helperText="Campo opcional"
            error={errors.bio?.message}
            placeholder="Descreva sua empresa"
            disabled={isLoading}
          />
        </div>
      </fieldset>

      {/* Memberships */}
      <fieldset>
        <legend className="text-xl font-medium">Convide sua equipe</legend>
        <p className="mb-3">
          Associe outras pessoas para lhe ajudar no gerenciamento de vagas.
        </p>

        <UsersDropdownSelect
          label="Digite o email do associado"
          selectedUsersEmail={selectedUsers.map((u) => u.email)}
          onUserClick={(user) => setSelectedUsers((prev) => [...prev, user])}
        />

        <div className="mt-4">
          {selectedUsers.length > 0 ? (
            <ul className="flex flex-row flex-wrap gap-0 rounded-md bg-background-700">
              {selectedUsers.map((user, idx) => (
                <li className="w-full" key={`user-${user.id}`}>
                  {idx >= 1 && <hr className="my-1 mx-2 text-background-500" />}

                  <div className="flex flex-row w-full items-start gap-2 px-2 py-1 rounded-sm bg-background-700 text-sm text-background-300 font-semibold">
                    <UserProfile user={user} type="list" />
                    <button
                      className="cursor-pointer"
                      type="button"
                      onClick={() =>
                        setSelectedUsers(
                          selectedUsers.filter((u) => u.id !== user.id),
                        )
                      }
                      aria-label="Remover usuário da associação"
                    >
                      <XIcon size={20} className="mt-1" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-background-300">
              Que tal tentar adicionar algum membro para ajudar?
            </p>
          )}
        </div>
      </fieldset>

      <div className="mt-10">
        <Button
          text={
            isLoading
              ? company
                ? "Atualizando dados da empresa..."
                : "Criando nova empresa..."
              : company
                ? "Atualizar empresa"
                : "Criar nova empresa"
          }
          type="submit"
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
