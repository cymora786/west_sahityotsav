import {
  PenTool,
  Mic,
  Palette,
  MessageSquare,
  BookOpen,
  Music,
  HelpCircle,
  FileText,
  Mic2,
  Drama,
  Pencil,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const KEYWORD_ICONS: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["essay"], icon: PenTool },
  { keywords: ["speech", "elocution"], icon: Mic },
  { keywords: ["drawing", "painting", "art"], icon: Palette },
  { keywords: ["debate"], icon: MessageSquare },
  { keywords: ["story", "novel"], icon: BookOpen },
  { keywords: ["music", "song", "qawwali", "mappila"], icon: Music },
  { keywords: ["quiz"], icon: HelpCircle },
  { keywords: ["poem", "poetry", "kavitha"], icon: FileText },
  { keywords: ["recitation", "qirath"], icon: Mic2 },
  { keywords: ["drama", "skit", "mono act", "mimicry"], icon: Drama },
  { keywords: ["calligraphy", "handwriting"], icon: Pencil },
];

const COLOR_PALETTE = [
  "bg-violet-100 text-violet-600",
  "bg-blue-100 text-blue-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-blue-100 text-blue-700",
  "bg-cyan-100 text-cyan-600",
  "bg-fuchsia-100 text-fuchsia-600",
  "bg-orange-100 text-orange-600",
];

export function getItemIcon(name: string): {
  Icon: LucideIcon;
  className: string;
} {
  const lower = name.toLowerCase();
  const match = KEYWORD_ICONS.find(({ keywords }) =>
    keywords.some((keyword) => lower.includes(keyword))
  );

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % COLOR_PALETTE.length;
  }

  return {
    Icon: match?.icon ?? Trophy,
    className: COLOR_PALETTE[hash],
  };
}
