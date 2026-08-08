import { MessageCircle, ShieldAlert, Tag, SearchCheck, PartyPopper, type LucideIcon } from "lucide-react";
import type { Channel } from "@/lib/types/database.types";

export interface ChannelMeta {
  value: Channel;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const CHANNELS: ChannelMeta[] = [
  { value: "general", label: "General", description: "Everyday neighbourhood chatter", icon: MessageCircle, color: "#2c6e63" },
  { value: "safety", label: "Safety", description: "Alerts that need fast eyes", icon: ShieldAlert, color: "#c23b3b" },
  { value: "buy_sell", label: "Buy & Sell", description: "Quick local listings", icon: Tag, color: "#c65a24" },
  { value: "lost_found", label: "Lost & Found", description: "Reunite pets, keys, and people", icon: SearchCheck, color: "#5b6bc0" },
  { value: "events", label: "Events", description: "Meetups happening nearby", icon: PartyPopper, color: "#b98a1f" },
];

export function channelMeta(value: Channel): ChannelMeta {
  return CHANNELS.find((c) => c.value === value) ?? CHANNELS[0];
}
