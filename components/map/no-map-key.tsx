import { MapPinOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function NoMapKey({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/60 p-8 text-center",
        className,
      )}
    >
      <MapPinOff className="h-6 w-6 text-muted-foreground" />
      <p className="max-w-xs text-sm text-muted-foreground">
        Map view needs a Google Maps API key. Add{" "}
        <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
        to <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">.env.local</code> — it&apos;s free to start
        (Google Maps Platform&apos;s $200/month credit covers a pilot neighbourhood many times over).
      </p>
    </div>
  );
}
