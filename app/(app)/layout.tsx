import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, karma_score, home_geofence_id")
    .eq("id", user.id)
    .single();

  if (!profile?.home_geofence_id) redirect("/onboarding");

  return (
    <AppShell
      displayName={profile?.display_name ?? "Neighbour"}
      avatarUrl={profile?.avatar_url ?? null}
      karma={profile?.karma_score ?? 0}
    >
      {children}
    </AppShell>
  );
}
