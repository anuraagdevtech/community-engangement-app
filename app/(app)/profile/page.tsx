import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditProfileForm } from "@/components/profile/edit-profile-form";

export const metadata: Metadata = { title: "Profile" };

const TIER_LABEL = ["Browsing (Tier 0)", "Verified Resident (Tier 1)", "Fully Verified (Tier 2)"];

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, trust_tier, karma_score, created_at")
    .eq("id", user.id)
    .single();

  const initials = (profile?.display_name ?? "N").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border border-border">
          {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.display_name ?? ""} />}
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-xl font-semibold">{profile?.display_name}</h1>
          <p className="text-sm text-muted-foreground">{user.email ?? user.phone ?? "No contact on file"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex flex-col items-start gap-1 p-5">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <p className="text-xs text-muted-foreground">Trust tier</p>
            <p className="font-display text-sm font-semibold">{TIER_LABEL[profile?.trust_tier ?? 0]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-start gap-1 p-5">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Karma points</p>
            <p className="font-display text-sm font-semibold">{profile?.karma_score ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProfileForm initialDisplayName={profile?.display_name ?? ""} />
        </CardContent>
      </Card>

      <Badge variant="outline" className="w-fit">
        Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—"}
      </Badge>
    </div>
  );
}
