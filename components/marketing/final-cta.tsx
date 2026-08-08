import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-14 text-center text-secondary-foreground sm:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 30%, white 0, transparent 40%), radial-gradient(circle at 85% 60%, white 0, transparent 40%)",
          }}
        />
        <h2 className="relative font-display text-3xl font-semibold sm:text-4xl">Your street is more organised than this.</h2>
        <p className="relative mx-auto mt-3 max-w-md text-sm text-secondary-foreground/80">
          It just doesn&apos;t have a home yet. Be one of the first verified residents in your pincode.
        </p>
        <Button asChild size="lg" className="relative mt-7 bg-card text-foreground hover:bg-card/90">
          <Link href="/signup">
            Join your Mohalla <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
