import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClasses =
  "w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-[16px] text-ink placeholder:text-stone/60 transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_0_0_3px_rgb(255_139_61/0.25)] focus:outline-none aria-[invalid=true]:border-red-700 disabled:opacity-60";

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-stone">(optional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-stone">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hasHint: boolean, hasError: boolean) {
  const ids = [hasError && `${id}-error`, hasHint && `${id}-hint`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

type InputFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"input">, "id" | "className">;

/** Label + input + hint/error in one, for the many simple forms in the app. */
export function InputField({ id, label, hint, error, optional, className, ...rest }: InputFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={id}
        name={rest.name ?? id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
        className={inputClasses}
        {...rest}
      />
    </Field>
  );
}

type TextareaFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"textarea">, "id" | "className">;

export function TextareaField({ id, label, hint, error, optional, className, ...rest }: TextareaFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea
        id={id}
        name={rest.name ?? id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
        className={cn(inputClasses, "min-h-28 resize-y")}
        {...rest}
      />
    </Field>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"select">, "id" | "className" | "children">;

export function SelectField({ id, label, hint, error, optional, className, children, ...rest }: SelectFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <select
        id={id}
        name={rest.name ?? id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
        className={cn(inputClasses, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%235d564d%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27><path d=%27m6 9 6 6 6-6%27/></svg>')] bg-[length:16px] bg-[position:right_14px_center] bg-no-repeat pr-10")}
        {...rest}
      >
        {children}
      </select>
    </Field>
  );
}
