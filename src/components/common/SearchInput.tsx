"use client";

import { SlidersIcon, SearchIcon } from "@/components/icons";
import { JobLevel, JobModality, JobType } from "@/database/generated/enums";
import {
  JobFormFilterInputPayload,
  JobFormFilterOutputPayload,
  JobFormFilterSchema,
} from "@/lib/modules/job";
import {
  jobLevelMapper,
  jobModalityMapper,
  jobTypeMapper,
} from "@/utils/mappers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./Button";

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
  const searchParams = useSearchParams();
  const [isRouterLoading, startRouterTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  const handleSearchSubmit = (filter: JobFormFilterOutputPayload) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(filter).forEach(([key, value]) => {
      params.delete(key);

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else if (value) {
        params.set(key, value);
      }
    });

    setIsFilterOpen(false);
    startRouterTransition(() => router.push(`?${params.toString()}`));
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
      className="relative max-w-full"
      autoComplete="off"
    >
      <div
        className={`max-w-full flex flex-row gap-2 items-center justify-between px-2 py-2 text-background-800 ${isFilterOpen ? "rounded-t-md rounded-b-0" : "rounded-md"} ${isRouterLoading ? "border-background-300 bg-background-300" : "border-background-200 bg-background-200"}`}
      >
        <div className="flex flex-row gap-2 max-w-full min-w-0">
          <div className="w-6 h-6 text-background-800">
            <button
              type="submit"
              disabled={isRouterLoading}
              className="cursor-pointer"
            >
              <SearchIcon size={24} aria-hidden="true" />
            </button>
          </div>
          <input
            type="search"
            className="min-w-0 max-w-full focus:outline-none"
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
        <div className="w-6 h-6 text-background-800">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            aria-controls="search-filter"
            aria-expanded={isFilterOpen}
            aria-label="Abrir filtro de pesquisa"
          >
            <SlidersIcon size={24} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isFilterOpen && !isRouterLoading && (
        <div
          className="absolute z-10 top-full left-0 right-0 flex flex-col gap-4 overflow-y-scroll h-50 border-t px-2 py-2 shadow-lg rounded-b-md border-background-400 bg-background-200"
          id="search-filter"
          key={resetKey}
        >
          {/* Modality */}
          <fieldset>
            <legend className="text-background-500 font-medium">
              Modalidade
            </legend>
            <div className="flex flex-col gap-0">
              {Object.values(JobModality).map((mod) => (
                <label
                  className="flex flex-row gap-2 text-background-800"
                  key={`radio-${mod}`}
                >
                  <input type="radio" value={mod} {...register("modality")} />
                  {jobModalityMapper[mod as JobModality]}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Level */}
          <fieldset>
            <legend className="text-background-500 font-medium">
              Experiência necessária
            </legend>
            <div className="flex flex-col gap-0">
              {Object.values(JobLevel).map((lv) => (
                <label
                  className="flex flex-row gap-2 text-background-800"
                  key={`radio-${lv}`}
                >
                  <input type="radio" value={lv} {...register("level")} />
                  {jobLevelMapper[lv as JobLevel]}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Type */}
          <fieldset>
            <legend className="text-background-500 font-medium">Tipo</legend>
            <div className="flex flex-col gap-0">
              {Object.values(JobType).map((tp) => (
                <label
                  className="flex flex-row gap-2 text-background-800"
                  key={`radio-${tp}`}
                >
                  <input type="radio" value={tp} {...register("type")} />
                  {jobTypeMapper[tp as JobType]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2 mt-5">
            <Button text="Pesquisar" type="submit" />
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-accent-300 cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
