import { Wrench, HeartPulse, GraduationCap, Landmark, Building2, ShoppingBag, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { ServiceCategory } from "@/lib/types/database.types";

export interface CategoryMeta {
  value: ServiceCategory;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { value: "home_services", label: "Home Services", icon: Wrench, color: "#c65a24" },
  { value: "health", label: "Health", icon: HeartPulse, color: "#c23b3b" },
  { value: "education", label: "Education", icon: GraduationCap, color: "#2c6e63" },
  { value: "community_faith", label: "Community & Faith", icon: Landmark, color: "#b98a1f" },
  { value: "government", label: "Government & Civic", icon: Building2, color: "#5b6bc0" },
  { value: "retail", label: "Retail & Shops", icon: ShoppingBag, color: "#7c3aed" },
  { value: "food_beverage", label: "Food & Beverage", icon: UtensilsCrossed, color: "#d97706" },
];

export function categoryMeta(value: ServiceCategory): CategoryMeta {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[0];
}
