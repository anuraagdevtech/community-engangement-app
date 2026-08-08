import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Marketplace" };

export default function MarketplacePage() {
  return (
    <ComingSoon
      icon={ShoppingBag}
      eyebrow="Roadmap · Phase 2"
      title="Micro-Marketplace"
      description="Buy, sell, and find flatmates within your radius — with an optional Safe Pay escrow for anything above ₹2,000."
      points={[
        "AI-assisted pricing from recent comparable local listings",
        "Safe Pay escrow: funds released on confirmation or after 48 hours",
        "Flatmate & rental filters gated behind resident verification",
      ]}
    />
  );
}
