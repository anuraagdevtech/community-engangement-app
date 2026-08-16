"use client";

import Link from "next/link";
import { Star, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryMeta } from "@/lib/service-categories";
import { formatDistance } from "@/lib/utils";
import { useBusinessFollows } from "@/hooks/use-business-follows";
import { useActiveLocation } from "@/components/providers/location-provider";
import type { FollowedProvider } from "@/lib/types/database.types";

function FollowedCard({ provider }: { provider: FollowedProvider }) {
  const meta = categoryMeta(provider.category);
  const Icon = meta.icon;

  return (
    <Link href={`/services/${provider.id}`}>
      <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-soft">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold">{provider.name}</p>
          <p className="text-xs text-muted-foreground">{meta.label}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-medium tabular-nums text-foreground">
              {provider.rating_count > 0 ? provider.rating_avg.toFixed(1) : "New"}
            </span>
          </div>
          {provider.distance_m != null && (
            <Badge variant="outline" className="font-normal">
              {formatDistance(provider.distance_m)}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function FollowedBusinesses() {
  const { center } = useActiveLocation();
  const { followed, loading } = useBusinessFollows(center);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (followed.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
        <UserPlus className="h-7 w-7 text-muted-foreground" />
        <p className="font-display text-base font-semibold">No connections yet</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Browse nearby businesses and click <strong>Connect</strong> to follow them here.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/services">Discover businesses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {followed.map((p) => (
        <FollowedCard key={p.id} provider={p} />
      ))}
    </div>
  );
}
