import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "success";

export function Button({
  className,
  variant = "primary",
  asChild,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: boolean;
}) {
  const base =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50";
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-slate-950 text-white hover:bg-slate-800 shadow-soft",
    secondary: "bg-slate-100 text-slate-950 hover:bg-slate-200",
    outline: "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-soft"
  };

  if (asChild && isValidElement(props.children)) {
    const child = props.children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(base, styles[variant], child.props.className, className)
    });
  }

  return <button type={type} className={cn(base, styles[variant], className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_22px_72px_-34px_rgba(15,23,42,0.28)]",
        className
      )}
      {...props}
    />
  );
}

export function SoftPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[28px] border border-slate-200/80 bg-white/80 shadow-soft backdrop-blur", className)} {...props} />;
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "orange" | "green" | "slate" | "success" | "info" | "warning";
}) {
  const tones: Record<NonNullable<typeof tone>, string> = {
    neutral: "bg-slate-100 text-slate-700",
    orange: "bg-orange-100 text-orange-800",
    green: "bg-green-100 text-green-800",
    slate: "bg-slate-200 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    info: "bg-sky-100 text-sky-800",
    warning: "bg-amber-100 text-amber-800"
  };

  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-ring/15",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: HTMLAttributes<HTMLTextAreaElement> & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-ring/15",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: HTMLAttributes<HTMLSelectElement> & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/15",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Avatar({
  name,
  className
}: {
  name: string;
  className?: string;
}) {
  return (
    <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm", className)}>
      {name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  tone = "neutral"
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "orange" | "green";
}) {
  const accents = {
    neutral: "bg-slate-100 text-slate-700",
    orange: "bg-orange-100 text-orange-800",
    green: "bg-green-100 text-green-800"
  };

  return (
    <Card className="min-h-[132px] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        {delta ? <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", accents[tone])}>{delta}</span> : null}
      </div>
    </Card>
  );
}

export function NavLink({
  href,
  active,
  children,
  icon
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
        active ? "bg-slate-950 text-white shadow-soft" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export function InlineStat({
  label,
  value,
  subtext
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-insetSoft">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-[1.05rem] font-semibold tracking-tight text-slate-950">{value}</p>
      {subtext ? <p className="mt-1 text-xs text-slate-500">{subtext}</p> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
        <span className="text-lg font-semibold">No data</span>
      </div>
      <p className="mt-4 text-base font-semibold text-slate-950">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function StatStrip({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/90 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-1.5 text-lg font-semibold tracking-tight text-slate-950">{value}</p>
      {detail ? <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p> : null}
    </div>
  );
}
