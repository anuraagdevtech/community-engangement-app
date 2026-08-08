import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Circles" };

export default function CirclesPage() {
  return (
    <ComingSoon
      icon={Users}
      eyebrow="Roadmap · Phase 2"
      title="Interest & Social Circles"
      description="Sports, hobbies, and support groups scoped to your radius — with quorum-based meetup matching, not another dead group chat."
      points={[
        "Join a Circle by topic + radius (badminton, book club, new parents…)",
        "Auto-suggested meetups once enough neighbours confirm interest",
        "In-person plans limited to verified residents, with optional buddy check-in",
      ]}
    />
  );
}
