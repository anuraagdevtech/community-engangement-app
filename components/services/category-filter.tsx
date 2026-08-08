"use client";

import { CATEGORIES } from "@/lib/service-categories";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/lib/types/database.types";

export function CategoryFilter({
  value,
  onChange,
}: {
  value: ServiceCategory | "all";
  onChange: (value: ServiceCategory | "all") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
          value === "all" ? "border-transparent bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:bg-accent",
        )}
      >
        All
      </button>
      {CATEGORIES.map((c) => {
        const Icon = c.icon;
        const active = value === c.value;
        return (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              active ? "border-transparent text-white" : "border-border bg-card text-muted-foreground hover:bg-accent",
            )}
            style={active ? { backgroundColor: c.color } : undefined}
          >
            <Icon className="h-3.5 w-3.5" />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
