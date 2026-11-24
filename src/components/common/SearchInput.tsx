"use client";

import { SlidersIcon, SearchIcon } from "@/components/icons";
import { JobLevel, JobModality, JobType } from "@/database/generated/enums";
import {
  JobFormFilterInputPayload,
  JobFormFilterOutputPayload,
  JobFormFilterSchema,
} from "@/lib/modules/job";
import {
  JOB_LEVEL_LABELS,
  JOB_MODALITY_LABELS,
  JOB_TYPE_LABELS,
} from "@/utils/mappers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import { RadioContainer } from "./RadioContainer/RadioContainer";
import { RadioGroup } from "./RadioContainer/RadioGroup";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export function SearchInput({ placeholder }: { placeholder: string }) {
  const { register, handleSubmit, reset } = useForm<
    JobFormFilterInputPayload,
    unknown,
    JobFormFilterOutputPayload
  >({
    resolver: zodResolver(JobFormFilterSchema),
    defaultValues: {
      level: undefined,
      type: undefined,
      modality: undefined,
    },
  });
  const router = useRouter();
  const [isRouterLoading, startRouterTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);
  const searchRef = useRef<HTMLFormElement>(null);
  useClickOutside(searchRef, () => setIsFilterOpen(false));

  const handleSearchSubmit = (filter: JobFormFilterOutputPayload) => {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else if (value) {
        params.set(key, value);
      }
    });

    setIsFilterOpen(false);
    startRouterTransition(() => router.replace(`?${params.toString()}`));
  };

  const handleClearFilters = () => {
    reset({
      level: undefined,
      type: undefined,
      modality: undefined,
    });

    setResetKey((prev) => prev + 1);
  };

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(handleSearchSubmit)}
      className="relative mx-auto w-full max-w-lg"
      autoComplete="off"
      ref={searchRef}
    >
      {/* Search bar */}
      <div
        className={`flex max-w-full flex-row items-center justify-between gap-1 rounded-md px-1 py-1 text-background-800 ${
          isRouterLoading ? "bg-background-500" : "bg-background-400"
        }`}
      >
        <div className="flex min-w-0 w-full flex-row items-center gap-1">
          <button
            type="submit"
            disabled={isRouterLoading}
            aria-label="Pesquisar vagas"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center"
          >
            <SearchIcon size={24} aria-hidden="true" />
          </button>
          <input
            type="search"
            className="min-w-0 w-full text-background-900 placeholder:text-background-600 focus:outline-none"
            placeholder={placeholder}
            {...register("title")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(handleSearchSubmit)();
              }
            }}
            disabled={isRouterLoading}
          />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          aria-controls="search-filter"
          aria-expanded={isFilterOpen}
          aria-label="Abrir filtro de pesquisa"
        >
          <SlidersIcon size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Filter panel */}
      {isFilterOpen && !isRouterLoading && (
        <RadioContainer id="search-filter" key={resetKey}>
          <RadioGroup
            legend="Modalidade"
            values={Object.values(JobModality)}
            labels={JOB_MODALITY_LABELS}
            registration={register("modality")}
          />

          <RadioGroup
            legend="Experiência necessária"
            values={Object.values(JobLevel)}
            labels={JOB_LEVEL_LABELS}
            registration={register("level")}
          />

          <RadioGroup
            legend="Tipo"
            values={Object.values(JobType)}
            labels={JOB_TYPE_LABELS}
            registration={register("type")}
          />

          <div className="flex flex-col gap-2 border-t border-background-700 pt-4">
            <Button text="Pesquisar" type="submit" />
            <button
              type="button"
              onClick={handleClearFilters}
              className="cursor-pointer py-2 text-accent-300 hover:text-accent-200"
            >
              Limpar filtros
            </button>
          </div>
        </RadioContainer>
      )}
    </form>
  );
}
