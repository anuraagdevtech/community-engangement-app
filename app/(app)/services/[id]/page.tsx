import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { PhoneCall, ShieldCheck, Star, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "@/components/services/review-form";
import { categoryMeta } from "@/lib/service-categories";

const TIER_LABEL = ["Unverified", "Phone-verified", "Document-verified"];

export default async function ProviderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: providerRows } = await supabase.rpc("get_provider", { provider_id: params.id });
  const provider = providerRows?.[0];
  if (!provider) notFound();

  const { data: reviews } = await supabase
    .from("service_reviews")
    .select("id, rating, comment, created_at, profiles(display_name)")
    .eq("provider_id", params.id)
    .order("created_at", { ascending: false });

  const meta = categoryMeta(provider.category);
  const Icon = meta.icon;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">{provider.name}</h1>
            {provider.verification_tier > 0 && (
              <Badge variant="success">
                <ShieldCheck className="h-3 w-3" /> {TIER_LABEL[provider.verification_tier]}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{meta.label}</p>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-medium tabular-nums">
              {provider.rating_count > 0 ? provider.rating_avg.toFixed(1) : "No ratings yet"}
            </span>
            {provider.rating_count > 0 && <span className="text-muted-foreground">({provider.rating_count} reviews)</span>}
          </div>
        </div>
      </div>

      {provider.description && <p className="text-sm leading-relaxed text-muted-foreground">{provider.description}</p>}

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
        {provider.phone && (
          <a href={`tel:${provider.phone}`} className="flex items-center gap-2 font-medium text-secondary hover:underline">
            <PhoneCall className="h-4 w-4" /> {provider.phone}
          </a>
        )}
        {provider.address && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {provider.address}
          </p>
        )}
      </div>

      <Separator />

      <ReviewForm providerId={provider.id} />

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold">Reviews</h2>
        {!reviews || reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet — be the first to share your experience.</p>
        ) : (
          reviews.map((review) => {
            // Supabase types embedded relations as arrays by default; this FK is one-to-one.
            const author = Array.isArray(review.profiles) ? review.profiles[0] : review.profiles;
            return (
              <div key={review.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {(author?.display_name ?? "N")[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{author?.display_name ?? "Neighbour"}</p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {review.comment && <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
