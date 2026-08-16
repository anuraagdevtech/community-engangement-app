"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LocationPicker } from "@/components/map/location-picker";
import { CATEGORIES } from "@/lib/service-categories";
import { toWKTPoint } from "@/lib/geo";
import { createClient } from "@/lib/supabase/client";
import { useActiveLocation } from "@/components/providers/location-provider";
import type { ServiceCategory } from "@/lib/types/database.types";

export function NewProviderForm() {
  const router = useRouter();
  const { center: activeCenter } = useActiveLocation();
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<ServiceCategory>("home_services");
  const [description, setDescription] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [location, setLocation] = React.useState(activeCenter);
  const [address, setAddress] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in again.");
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase
      .from("service_providers")
      .insert({
        owner_id: user.id,
        name,
        category,
        description: description || null,
        phone: phone || null,
        website: website || null,
        address: address || null,
        location: toWKTPoint(location) as unknown as never,
      })
      .select("id")
      .single();

    setSubmitting(false);
    if (error || !data) {
      toast.error(error?.message ?? "Couldn't save this listing.");
      return;
    }

    toast.success("Listing published");
    router.push(`/services/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="provider-name">Business or provider name</Label>
        <Input id="provider-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Sharma Plumbing Services" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Category</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as ServiceCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="provider-description">Description</Label>
        <Textarea
          id="provider-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What do they do, and why should a neighbour trust them?"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="provider-phone">Phone (optional)</Label>
        <Input id="provider-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="provider-website">Website (optional)</Label>
        <Input id="provider-website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
      </div>

      <div>
        <Label className="mb-2 block">Where are they located?</Label>
        <LocationPicker
          value={location}
          onChange={(loc, addr) => {
            setLocation(loc);
            if (addr) setAddress(addr);
          }}
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Publish listing
      </Button>
    </form>
  );
}
