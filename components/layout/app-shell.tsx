"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { LocationSwitcher } from "@/components/layout/location-switcher";
import { UserMenu } from "@/components/layout/user-menu";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  displayName: string;
  avatarUrl: string | null;
  karma: number;
}

export function AppShell({ children, displayName, avatarUrl, karma }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-card/60 px-4 py-6 backdrop-blur lg:flex">
        <Link href="/feed" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-base font-bold text-primary-foreground">
            M
          </span>
          <span className="font-display text-lg font-semibold">Mohalla</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-xl bg-secondary/10 p-3 text-xs text-secondary">
          <p className="font-medium">🌱 {karma} Karma</p>
          <p className="mt-0.5 text-secondary/80">Help a neighbour to earn boosts &amp; badges.</p>
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:pl-64 lg:pr-8">
        <Link href="/feed" className="flex items-center gap-2 lg:hidden">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            M
          </span>
        </Link>
        <LocationSwitcher />
        <UserMenu displayName={displayName} avatarUrl={avatarUrl} karma={karma} />
      </header>

      <main className="pb-20 lg:pb-8 lg:pl-60">
        <div className="mx-auto max-w-4xl px-4 py-6">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
