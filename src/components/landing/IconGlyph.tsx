import {
  Archive,
  Bot,
  CheckCircle2,
  Clock3,
  Globe2,
  MessagesSquare,
  Plug,
  Puzzle,
  ShieldCheck,
  Smartphone,
  UsersRound
} from "lucide-react";

interface IconGlyphProps {
  name: string;
  size?: number;
}

export function IconGlyph({ name, size = 24 }: IconGlyphProps) {
  const normalized = name.toLowerCase();
  if (normalized.includes("clock")) return <Clock3 size={size} aria-hidden="true" />;
  if (normalized.includes("globe") || normalized.includes("browser")) return <Globe2 size={size} aria-hidden="true" />;
  if (normalized.includes("plug") || normalized.includes("connector")) return <Plug size={size} aria-hidden="true" />;
  if (normalized.includes("puzzle") || normalized.includes("skill")) return <Puzzle size={size} aria-hidden="true" />;
  if (normalized.includes("message") || normalized.includes("channel")) return <MessagesSquare size={size} aria-hidden="true" />;
  if (normalized.includes("phone") || normalized.includes("pair")) return <Smartphone size={size} aria-hidden="true" />;
  if (normalized.includes("user") || normalized.includes("team")) return <UsersRound size={size} aria-hidden="true" />;
  if (normalized.includes("shield")) return <ShieldCheck size={size} aria-hidden="true" />;
  if (normalized.includes("check")) return <CheckCircle2 size={size} aria-hidden="true" />;
  if (normalized.includes("archive") || normalized.includes("audit")) return <Archive size={size} aria-hidden="true" />;
  return <Bot size={size} aria-hidden="true" />;
}
