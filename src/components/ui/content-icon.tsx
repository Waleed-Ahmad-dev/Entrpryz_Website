import {
  BadgeCheck, BarChart3, Bell, BookOpen, Bot, Boxes, Briefcase, Building2, ClipboardCheck, Cloud, Code2,
  Compass, Cpu, Database, Eye, FileSearch, FileText, Gauge, Handshake, HardDrive, Inbox, Layers, LifeBuoy,
  ListChecks, Lock, Map, MessageSquare, Network, Plug, Presentation, Puzzle, RefreshCw, Rocket, Route, Scale,
  Search, Server, Settings, ShieldCheck, Smartphone, Sparkles, Stethoscope, Target, TrendingUp, Users,
  Workflow, Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/icon-names";

const ICONS: Record<IconName, LucideIcon> = {
  database: Database, workflow: Workflow, chart: BarChart3, stethoscope: Stethoscope, code: Code2,
  smartphone: Smartphone, plug: Plug, bot: Bot, server: Server, shield: ShieldCheck, cloud: Cloud,
  lifebuoy: LifeBuoy, map: Map, wrench: Wrench, message: MessageSquare, "file-search": FileSearch,
  search: Search, "file-text": FileText, bell: Bell, route: Route, users: Users, lock: Lock, layers: Layers,
  gauge: Gauge, handshake: Handshake, target: Target, compass: Compass, eye: Eye, sparkles: Sparkles,
  briefcase: Briefcase, building: Building2, rocket: Rocket, refresh: RefreshCw, clipboard: ClipboardCheck,
  book: BookOpen, cpu: Cpu, "trending-up": TrendingUp, settings: Settings, inbox: Inbox,
  "list-checks": ListChecks, "badge-check": BadgeCheck, scale: Scale, "hard-drive": HardDrive,
  network: Network, presentation: Presentation, puzzle: Puzzle, boxes: Boxes,
};

/** Icon in a soft brand-tinted tile. */
export function IconTile({ name, size = "md" }: { name: IconName; size?: "sm" | "md" }) {
  const Icon = ICONS[name];
  return (
    <span
      className={
        size === "sm"
          ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange ring-1 ring-inset ring-brand-orange/20"
          : "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange ring-1 ring-inset ring-brand-orange/20"
      }
      aria-hidden="true"
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </span>
  );
}
