"use client";

import * as React from "react";
import Link from "next/link";
import { List, Map as MapIcon, PlusCircle, Store } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "@/components/services/category-filter";
import { ProviderCard } from "@/components/services/provider-card";
import { FollowedBusinesses } from "@/components/services/followed-businesses";
import { EntityMap, type MapMarkerItem } from "@/components/map/entity-map";
import { useActiveLocation } from "@/components/providers/location-provider";
import { useNearbyProviders } from "@/hooks/use-nearby-providers";
import { categoryMeta } from "@/lib/service-categories";
import type { ServiceCategory } from "@/lib/types/database.types";

export function ServicesView() {
  const { center, radiusM } = useActiveLocation();
  const [category, setCategory] = React.useState<ServiceCategory | "all">("all");
  const [view, setView] = React.useState<"list" | "map">("list");
  const [tab, setTab] = React.useState<"discover" | "connections">("discover");
  const { providers, loading } = useNearbyProviders(center, radiusM, category);

  const markers: MapMarkerItem[] = providers.map((p) => ({
    id: p.id,
    position: { lat: p.lat, lng: p.lng },
    color: categoryMeta(p.category).color,
    title: p.name,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-primary">Local Services</p>
          <h1 className="font-display text-2xl font-semibold">Trusted help, close by</h1>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/services/new">
            <PlusCircle className="h-4 w-4" /> List a service
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "discover" | "connections")}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="discover" className="flex-1 sm:flex-none">Discover</TabsTrigger>
          <TabsTrigger value="connections" className="flex-1 sm:flex-none">My Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CategoryFilter value={category} onChange={setCategory} />
            <Tabs value={view} onValueChange={(v) => setView(v as "list" | "map")}>
              <TabsList>
                <TabsTrigger value="list">
                  <List className="h-3.5 w-3.5" /> List
                </TabsTrigger>
                <TabsTrigger value="map">
                  <MapIcon className="h-3.5 w-3.5" /> Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {view === "map" ? (
            <EntityMap
              center={center}
              radiusM={radiusM}
              markers={markers}
              className="h-[28rem] w-full overflow-hidden rounded-2xl border border-border"
              renderInfo={(item) => {
                const p = providers.find((prov) => prov.id === item.id)!;
                return (
                  <div className="max-w-[220px] p-1">
                    <p className="font-display text-sm font-semibold">{p.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{categoryMeta(p.category).label}</p>
                  </div>
                );
              }}
            />
          ) : loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-12 text-center">
              <Store className="h-6 w-6 text-muted-foreground" />
              <p className="font-display text-base font-semibold">No listings in this radius yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Know a great local plumber, doctor, or tutor? Be the first to list them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections" className="mt-4">
          <FollowedBusinesses onDiscover={() => setTab("discover")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
