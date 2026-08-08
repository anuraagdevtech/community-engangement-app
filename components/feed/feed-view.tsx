"use client";

import * as React from "react";
import { List, Map as MapIcon, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelFilter } from "@/components/feed/channel-filter";
import { PostCard } from "@/components/feed/post-card";
import { PostComposer } from "@/components/feed/post-composer";
import { EntityMap, type MapMarkerItem } from "@/components/map/entity-map";
import { useActiveLocation } from "@/components/providers/location-provider";
import { useNearbyPosts } from "@/hooks/use-nearby-posts";
import { channelMeta } from "@/lib/channels";
import type { Channel, NearbyPost } from "@/lib/types/database.types";

export function FeedView() {
  const { center, radiusM } = useActiveLocation();
  const [channel, setChannel] = React.useState<Channel | "all">("all");
  const [view, setView] = React.useState<"list" | "map">("list");
  const { posts, loading, refresh } = useNearbyPosts(center, radiusM, channel);

  const markers: MapMarkerItem[] = posts.map((p) => ({
    id: p.id,
    position: { lat: p.lat, lng: p.lng },
    color: channelMeta(p.channel).color,
    title: p.title,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-primary">The Mohalla Pulse</p>
          <h1 className="font-display text-2xl font-semibold">What&apos;s happening nearby</h1>
        </div>
        <PostComposer center={center} onPosted={refresh} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ChannelFilter value={channel} onChange={setChannel} />
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
            const p = posts.find((post) => post.id === item.id) as NearbyPost;
            return (
              <div className="max-w-[220px] p-1">
                <p className="font-display text-sm font-semibold">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.author_display_name}</p>
              </div>
            );
          }}
        />
      ) : loading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-12 text-center">
          <Sparkles className="h-6 w-6 text-muted-foreground" />
          <p className="font-display text-base font-semibold">It&apos;s quiet here — for now</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Be the first to post in this radius, or try widening it from the location switcher above.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
