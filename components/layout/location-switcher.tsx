"use client";

import * as React from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { LocationPicker } from "@/components/map/location-picker";
import { useActiveLocation, type LatLng } from "@/components/providers/location-provider";
import { RADIUS_OPTIONS } from "@/lib/google-maps";
import { cn } from "@/lib/utils";

export function LocationSwitcher() {
  const { center, radiusM, label, setCenter, setRadiusM } = useActiveLocation();
  const [open, setOpen] = React.useState(false);
  const [draftCenter, setDraftCenter] = React.useState<LatLng>(center);
  const [draftLabel, setDraftLabel] = React.useState(label);
  const [draftRadius, setDraftRadius] = React.useState(radiusM);

  React.useEffect(() => {
    if (open) {
      setDraftCenter(center);
      setDraftLabel(label);
      setDraftRadius(radiusM);
    }
  }, [open, center, label, radiusM]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="max-w-[220px] justify-start gap-2 truncate"
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="truncate">{label}</span>
        <span className="shrink-0 text-muted-foreground">· {RADIUS_OPTIONS.find((r) => r.value === radiusM)?.label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Where&apos;s your radius centred?</DialogTitle>
          <DialogDescription>
            Everything you see — the feed, services, circles — is scoped to this point and distance.
          </DialogDescription>
        </DialogHeader>

        <LocationPicker
          value={draftCenter}
          onChange={(loc, address) => {
            setDraftCenter(loc);
            if (address) setDraftLabel(address);
          }}
        />

        <div>
          <p className="mb-2 text-sm font-medium">Radius</p>
          <div className="flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDraftRadius(opt.value)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  draftRadius === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              setCenter(draftCenter, draftLabel);
              setRadiusM(draftRadius);
              setOpen(false);
            }}
          >
            Update radius
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
