"use client";

import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import { BuildingIcon, AtSignIcon, GlobeIcon } from "@/components/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { useRouter } from "next/navigation";
import { APP_URLS } from "@/utils/constants";
import {
  type CompanyCreatePayload,
  CompanyCreateSchema,
  type CompanyResponsePayload,
  type CompanyUpdatePayload,
  CompanyUpdateSchema,
  createCompanyAction,
  updateCompanyByIdAction,
} from "@/lib/modules/company/index";
import { UserList } from "../user/UserList";
import { CompanySizeDropdown } from "./CompanySizeDropdown";
import { UsersDropdown } from "../user/UsersDropdown";
import { ErrorMessage } from "../common/ErrorMessage";

interface CompanyFormProps {
  company?: CompanyResponsePayload;
  currentUserEmail: string;
}

export function CompanyForm({ company, currentUserEmail }: CompanyFormProps) {
  const {
    formState: { errors, isSubmitting },
    setError,
    handleSubmit,
    register,
    control,
  } = useForm<CompanyCreatePayload | CompanyUpdatePayload>({
    defaultValues: company ?? {
      name: "",
      bio: "",
      cnpj: "",
      size: "STARTUP",
      website: "",
      members: [],
    },
    resolver: zodResolver(company ? CompanyUpdateSchema : CompanyCreateSchema),
  });
  const [isRedirecting, startTransition] = useTransition();
  const router = useRouter();
  const isBusy = isSubmitting || isRedirecting;

  const handleButtonClick = async (
    data: CompanyCreatePayload | CompanyUpdatePayload,
  ) => {
    try {
      // Update action
      if (company) {
        const updateResponse = await updateCompanyByIdAction(
          company.id,
          data as CompanyUpdatePayload,
        );

        if (!updateResponse.success) {
          if (
            updateResponse.status === 409 &&
            updateResponse.field === "cnpj"
          ) {
            setError("cnpj", { message: "CNPJ já cadastrado." });
            return;
          }

          throw new Error();
        }

        startTransition(() =>
          router.replace(APP_URLS.COMPANY(updateResponse.data.id)),
        );
      }
      // Create action
      else {
        const createResponse = await createCompanyAction({
          ...(data as CompanyCreatePayload),
        });
        if (!createResponse.success) {
          if (
            createResponse.status === 409 &&
            createResponse.field === "cnpj"
          ) {
            setError("cnpj", { message: "CNPJ já cadastrado." });
            return;
          }

          throw new Error();
        }

        startTransition(() =>
          router.replace(APP_URLS.COMPANY(createResponse.data.id)),
        );
      }
    } catch (_err) {
      setError("root", {
        message: `Não foi possível ${company ? "atualizar" : "criar"} a empresa.`,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleButtonClick)}
      className="flex flex-col gap-8 mt-6"
      autoComplete="off"
    >
      {errors.root?.message && <ErrorMessage message={errors.root?.message} />}

      {/* Company base info */}
      <fieldset>
        <legend className="text-xl font-medium mb-3">
          Informações públicas
        </legend>
        <div className="flex flex-col gap-2">
          <Input
            {...register("name")}
            Icon={AtSignIcon}
            label="Nome da empresa"
            placeholder="Digite o nome da empresa"
            error={errors.name?.message}
            disabled={isBusy}
            defaultValue={company?.name ?? ""}
          />
          {!company && (
            <Input
              {...register("cnpj")}
              Icon={BuildingIcon}
              label="CNPJ"
              placeholder="Ex.: 12.345.678/0001-99"
              error={"cnpj" in errors ? errors.cnpj?.message : undefined}
              disabled={isBusy}
            />
          )}

          <CompanySizeDropdown
            control={control}
            error={errors.size?.message}
            isLoading={isBusy}
          />
          <Input
            {...register("website")}
            Icon={GlobeIcon}
            label="Site da empresa"
            placeholder="Ex.: sua-empresa.com.br"
            helperText="Campo opcional"
            error={errors.website?.message}
            disabled={isBusy}
            defaultValue={company?.website ?? ""}
          />
          <TextArea
            {...register("bio")}
            label="Descrição da empresa"
            error={errors.bio?.message}
            placeholder="Descreva sua empresa"
            disabled={isBusy}
            defaultValue={company?.bio ?? ""}
          />
        </div>
      </fieldset>

      {/* Memberships */}
      <fieldset>
        <legend className="text-xl font-medium">Convide sua equipe</legend>
        <p className="mb-3">
          Associe outras pessoas para lhe ajudar no gerenciamento de vagas.
        </p>
        <UsersDropdown
          currentUserEmail={currentUserEmail}
          label="Adicione uma nova habilidade"
          control={control}
          error={errors.members?.message}
          isLoading={isBusy}
        />
        <Controller
          control={control}
          name="members"
          render={({ field }) => (
            <div className="mt-4">
              <UserList
                users={
                  field.value?.filter((u) => u.email !== currentUserEmail) ?? []
                }
                updateMode={{
                  isLoading: isBusy,
                  setUsers: (users) => field.onChange(users),
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
              ? company
                ? "Atualizando dados da empresa..."
                : "Criando nova empresa..."
              : company
                ? "Atualizar empresa"
                : "Criar nova empresa"
          }
          type="submit"
          disabled={isBusy}
        />
      </div>
    </form>
  );
}
