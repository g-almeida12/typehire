"use client";

import { InputHTMLAttributes, useState } from "react";
import { Input } from "../common/Input";
import { DollarIcon } from "../icons";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { JobClientCreatePayload, JobUpdatePayload } from "@/lib/modules/job";

interface JobSalaryInputProps extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<JobClientCreatePayload | JobUpdatePayload>;
  label: string;
  setValue: UseFormSetValue<JobClientCreatePayload | JobUpdatePayload>;
  disabled?: boolean;
  error?: string;
  defaultSalaryType?: "fixed" | "hourly" | "interval";
}

export function JobSalaryInput({
  control,
  label,
  setValue,
  disabled = false,
  error,
  defaultSalaryType,
  ...props
}: JobSalaryInputProps) {
  const [selectedSalaryType, setSelectedSalaryType] = useState<
    "fixed" | "hourly" | "interval"
  >(defaultSalaryType ?? "fixed");

  const parseStrictNumber = (value: string) => {
    if (!value) return NaN;
    const handledValue = value.trim().replace(",", ".");
    return Number(Number(handledValue).toFixed(2));
  };

  return (
    <div className="w-full flex flex-col items-start gap-1">
      <label
        htmlFor={props.id}
        className="w-full text-left text-sm text-background-300"
      >
        {label}
      </label>

      <div
        className={`w-full flex flex-col gap-2 px-2 py-1 mb-1 rounded-md ${disabled ? "border-background-900 bg-background-900" : "border-background-800 bg-background-800"}`}
      >
        <div className="flex flex-row gap-2">
          {(["fixed", "hourly", "interval"] as const).map((type) => (
            <button
              className={`flex-1 rounded-md py-1 text-sm font-medium ${selectedSalaryType === type ? (disabled ? "bg-background-700 text-background-400" : "bg-background-600") : "text-background-300"} ${disabled ? "cursor-default" : "cursor-pointer"}`}
              type="button"
              onClick={() => {
                if (disabled) return;

                setSelectedSalaryType(type);
                setValue("fixedSalary", null);
                setValue("hourlySalary", null);
                setValue("intervalSalary", null);
              }}
              key={type}
            >
              {type === "fixed" && "Fixo"}
              {type === "hourly" && "Por hora"}
              {type === "interval" && "Intervalo"}
            </button>
          ))}
        </div>
      </div>

      {selectedSalaryType === "fixed" && (
        <Controller
          name="fixedSalary"
          control={control}
          render={({ field }) => (
            <Input
              Icon={DollarIcon}
              placeholder="Ex.: 3500,99"
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                const parsedValue = parseStrictNumber(e.target.value);
                if (isNaN(parsedValue)) return;

                field.onChange(parsedValue);
              }}
              error={error}
              inputMode="decimal"
              type="number"
              disabled={disabled}
            />
          )}
        />
      )}

      {selectedSalaryType === "hourly" && (
        <Controller
          name="hourlySalary"
          control={control}
          render={({ field }) => (
            <Input
              Icon={DollarIcon}
              placeholder="Ex.: 30,50"
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                const parsedValue = parseStrictNumber(e.target.value);
                if (isNaN(parsedValue)) return;

                field.onChange(parsedValue);
              }}
              error={error}
              inputMode="decimal"
              type="number"
              disabled={disabled}
            />
          )}
        />
      )}

      {selectedSalaryType === "interval" && (
        <Controller
          name="intervalSalary"
          control={control}
          defaultValue={["" as unknown as number, "" as unknown as number]}
          render={({ field }) => {
            const [minValue, maxValue] = Array.isArray(field.value)
              ? field.value
              : ["", ""];

            return (
              <div className="w-full flex flex-col gap-1">
                <Input
                  Icon={DollarIcon}
                  placeholder="Valor mínimo"
                  value={minValue}
                  onChange={(e) => {
                    const parsedValue = parseStrictNumber(e.target.value);
                    if (isNaN(parsedValue)) return;

                    field.onChange([parsedValue, maxValue]);
                  }}
                  error={error}
                  inputMode="decimal"
                  type="number"
                  disabled={disabled}
                />
                <Input
                  Icon={DollarIcon}
                  placeholder="Valor máximo"
                  value={maxValue}
                  onChange={(e) => {
                    const parsedValue = parseStrictNumber(e.target.value);
                    if (isNaN(parsedValue)) return;

                    field.onChange([minValue, parsedValue]);
                  }}
                  error={error}
                  inputMode="decimal"
                  type="number"
                  disabled={disabled}
                />
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
