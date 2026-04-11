import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Target, List } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { href: "/app/overview", label: "Обзор", icon: LayoutGrid },
  { href: "/app/strategy", label: "Стратегия", icon: Target },
  { href: "/app/operations", label: "Операции", icon: List },
];
