"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/map/location-picker";
import { createClient } from "@/lib/supabase/client";
import { toWKTPoint } from "@/lib/geo";
import { RADIUS_OPTIONS, DEFAULT_CENTER } from "@/lib/google-maps";
import { cn } from "@/lib/utils";
import { useActiveLocation, type LatLng } from "@/components/providers/location-provider";

export function OnboardingForm({ initialDisplayName }: { initialDisplayName: string }) {
  const router = useRouter();
  const { setCenter: setActiveCenter, setRadiusM: setActiveRadius } = useActiveLocation();
  const [displayName, setDisplayName] = React.useState(initialDisplayName);
  const [center, setCenter] = React.useState<LatLng>(DEFAULT_CENTER);
  const [address, setAddress] = React.useState("");
  const [radius, setRadius] = React.useState(1000);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const { data: geofence, error: geoError } = await supabase
      .from("geofences")
      .insert({
        label: address || "Home",
        center: toWKTPoint(center) as unknown as never,
        radius_m: radius,
        type: "home",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (geoError || !geofence) {
      setError(geoError?.message ?? "Couldn't save your location. Please try again.");
      setSubmitting(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: displayName, home_geofence_id: geofence.id })
      .eq("id", user.id);

    if (profileError) {
      setError(profileError.message);
      setSubmitting(false);
      return;
    }

    setActiveCenter(center, address || "Home");
    setActiveRadius(radius);
    router.replace("/feed");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display-name">Display name</Label>
        <Input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </div>

      <div>
        <Label className="mb-2 block">Your location</Label>
        <LocationPicker value={center} onChange={(loc, addr) => {
          setCenter(loc);
          if (addr) setAddress(addr);
        }} />
      </div>

      <div>
        <Label className="mb-2 block">Default radius</Label>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRadius(opt.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                radius === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-accent",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Enter my Mohalla
      </Button>
    </form>
  );
}
