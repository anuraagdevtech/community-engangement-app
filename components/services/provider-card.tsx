import Link from "next/link";
import { Star, ShieldCheck, PhoneCall } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categoryMeta } from "@/lib/service-categories";
import { formatDistance } from "@/lib/utils";
import type { NearbyProvider } from "@/lib/types/database.types";

const TIER_LABEL = ["Unverified", "Phone-verified", "Document-verified"];

export function ProviderCard({ provider }: { provider: NearbyProvider }) {
  const meta = categoryMeta(provider.category);
  const Icon = meta.icon;

  return (
    <Link href={`/services/${provider.id}`}>
      <Card className="flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          {provider.verification_tier > 0 && (
            <Badge variant="success" className="shrink-0">
              <ShieldCheck className="h-3 w-3" /> {TIER_LABEL[provider.verification_tier]}
            </Badge>
          )}
        </div>

        <div>
          <h3 className="font-display text-base font-semibold leading-snug">{provider.name}</h3>
          <p className="text-xs text-muted-foreground">{meta.label}</p>
        </div>

        {provider.description && <p className="line-clamp-2 text-sm text-muted-foreground">{provider.description}</p>}

        <div className="mt-auto flex items-center justify-between pt-1 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-current text-primary" />
            <span className="font-medium tabular-nums text-foreground">
              {provider.rating_count > 0 ? provider.rating_avg.toFixed(1) : "New"}
            </span>
            {provider.rating_count > 0 && <span>({provider.rating_count})</span>}
          </div>
          <span className="font-medium text-muted-foreground">{formatDistance(provider.distance_m)} away</span>
        </div>

        {provider.phone && (
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <PhoneCall className="h-3 w-3" /> {provider.phone}
          </div>
        )}
      </Card>
    </Link>
  );
}
