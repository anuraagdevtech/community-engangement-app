import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Comparison } from "@/components/marketing/comparison";
import { FinalCta } from "@/components/marketing/final-cta";
import { SiteFooter } from "@/components/marketing/site-footer";

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/feed");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <Hero />
      <FeatureGrid />
      <Comparison />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
