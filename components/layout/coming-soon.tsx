import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  eyebrow,
  title,
  description,
  points,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="mb-1 font-mono text-xs uppercase tracking-wider text-primary">{eyebrow}</p>
        <h1 className="font-display text-xl font-semibold">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="flex flex-col gap-1.5 text-left text-sm text-muted-foreground">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
