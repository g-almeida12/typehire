import { UseFormRegisterReturn } from "react-hook-form";

type RadioGroupProps<T extends string> = {
  legend: string;
  values: T[];
  labels: Record<T, string>;
  registration: UseFormRegisterReturn;
};

export function RadioGroup<T extends string>({
  legend,
  values,
  labels,
  registration,
}: RadioGroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-1 font-medium tracking-wide text-background-300">
        {legend}
      </legend>
      <div className="flex flex-col gap-1">
        {values.map((value) => (
          <label
            key={`${registration.name}-${value}`}
            className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1 text-background-100 hover:bg-background-800 has-checked:bg-background-800"
          >
            <input
              type="radio"
              value={value}
              {...registration}
              className="h-4 w-4 accent-accent-500"
            />
            {labels[value]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}