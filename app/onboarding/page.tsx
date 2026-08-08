import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, home_geofence_id")
    .eq("id", user.id)
    .single();

  if (profile?.home_geofence_id) redirect("/feed");

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
      <div className="mb-6 text-center">
        <p className="mb-1 font-mono text-xs uppercase tracking-wider text-primary">Step 1 of 1</p>
        <h1 className="font-display text-2xl font-semibold">Where&apos;s your Mohalla?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This sets the centre point for your feed, services, and circles. You can change it any time.
        </p>
      </div>
      <OnboardingForm initialDisplayName={profile?.display_name ?? "Neighbour"} />
    </div>
  );
}
