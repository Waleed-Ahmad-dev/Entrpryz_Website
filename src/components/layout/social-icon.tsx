import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import type { SiteContent } from "@/lib/content-schema";

type Platform = SiteContent["site"]["social"][number]["platform"];

const ICONS: Record<Platform, typeof Linkedin> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  x: Twitter,
  youtube: Youtube,
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
};

export function SocialIcon({ platform, className }: { platform: Platform; className?: string }) {
  const Icon = ICONS[platform];
  return <Icon className={className} aria-hidden="true" />;
}
