import type { LucideIcon } from "lucide-react";
import { Home, Wrench, Users, ShoppingBag } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/circles", label: "Circles", icon: Users },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
];
