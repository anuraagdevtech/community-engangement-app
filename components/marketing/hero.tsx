import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPin, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:items-center lg:gap-8 lg:pb-28 lg:pt-16">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Now piloting in one Bengaluru pincode
        </div>
        <h1 className="font-display text-4xl font-semibold leading-[1.08] sm:text-5xl">
          The 500m–5km around you, <span className="text-primary">finally organised.</span>
        </h1>
        <p className="mt-5 max-w-md text-lg text-muted-foreground">
          One geo-verified feed, one services directory, one marketplace — instead of six overlapping WhatsApp
          groups and a noticeboard nobody reads.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/signup">
              Join your street <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>
        <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-secondary" /> Geo-verified residents
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" /> 500m–5km radius control
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-secondary/10 blur-2xl" />
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="h-2 w-2 rounded-full bg-destructive/70" />
            <span className="h-2 w-2 rounded-full bg-primary/70" />
            <span className="h-2 w-2 rounded-full bg-success/70" />
            <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Mohalla Pulse · 7:30am
            </span>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <div className="rounded-xl bg-muted/70 p-3">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                Safety
              </p>
              <p className="mt-2 text-sm font-medium">Water tanker delayed till 6pm, Block C</p>
              <p className="mt-1 text-xs text-muted-foreground">340m away · 4 min ago</p>
            </div>
            <div className="rounded-xl bg-muted/70 p-3">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Services
              </p>
              <p className="mt-2 flex items-center justify-between text-sm font-medium">
                Sharma Plumbing
                <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" /> 4.8
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Verified · 900m away</p>
            </div>
            <div className="rounded-xl bg-muted/70 p-3">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary">
                Circle
              </p>
              <p className="mt-2 text-sm font-medium">6 neighbours want Sat 6pm badminton</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-secondary">
                <MessageCircle className="h-3 w-3" /> Confirm the slot
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
