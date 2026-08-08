import type { Metadata } from "next";
import { Database, MapPin, Terminal } from "lucide-react";
import { hasGoogleMapsKey } from "@/lib/google-maps";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Finish setup" };

function StepCard({
  icon: Icon,
  done,
  title,
  children,
}: {
  icon: typeof Database;
  done: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${done ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${done ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
          {done ? "Configured" : "Needed"}
        </span>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="mb-1 font-mono text-xs uppercase tracking-wider text-primary">Almost there</p>
        <h1 className="font-display text-3xl font-semibold">Connect Mohalla&apos;s free-tier services</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This screen only shows up in development, before <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.env.local</code> is filled in. See{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">README.md</code> for the full walkthrough.
        </p>
      </div>

      <StepCard icon={Database} done={isSupabaseConfigured} title="1. Supabase project">
        <p>
          Create a free project at{" "}
          <a href="https://supabase.com/dashboard" className="text-primary hover:underline">
            supabase.com/dashboard
          </a>
          , run <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">supabase/migrations/0001_init.sql</code> in
          the SQL editor, then copy the Project URL and anon key into{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </p>
      </StepCard>

      <StepCard icon={MapPin} done={hasGoogleMapsKey} title="2. Google Maps API key (optional)">
        <p>
          Create a key at{" "}
          <a href="https://console.cloud.google.com/google/maps-apis" className="text-primary hover:underline">
            console.cloud.google.com
          </a>{" "}
          with Maps JavaScript, Places, and Geocoding APIs enabled — Google&apos;s $200/month credit covers a pilot
          neighbourhood many times over. The app runs without it; map views just show a placeholder until it&apos;s set.
        </p>
      </StepCard>

      <StepCard icon={Terminal} done={false} title="3. Restart the dev server">
        <p>
          After editing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.env.local</code>, stop and re-run{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">npm run dev</code> — Next.js only reads env
          files on boot.
        </p>
      </StepCard>
    </div>
  );
}
