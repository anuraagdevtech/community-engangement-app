import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { channelMeta } from "@/lib/channels";
import { formatDistance } from "@/lib/utils";
import type { NearbyPost } from "@/lib/types/database.types";

export function PostCard({ post }: { post: NearbyPost }) {
  const meta = channelMeta(post.channel);
  const Icon = meta.icon;
  const initials = post.author_display_name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className="animate-fade-up p-5">
      <div className="flex items-start gap-3">
        <Avatar>
          {post.author_avatar_url && <AvatarImage src={post.author_avatar_url} alt={post.author_display_name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="font-medium">{post.author_display_name}</p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs font-medium text-muted-foreground">{formatDistance(post.distance_m)} away</p>
          </div>

          <div
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
          >
            <Icon className="h-3 w-3" />
            {meta.label}
          </div>

          <h3 className="mt-2 font-display text-base font-semibold leading-snug">{post.title}</h3>
          {post.body && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{post.body}</p>}

          {post.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image_url}
              alt=""
              className="mt-3 max-h-72 w-full rounded-xl border border-border object-cover"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
