"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { getResultById } from "@/lib/queries";

export type ResultDetail = NonNullable<Awaited<ReturnType<typeof getResultById>>>;

export type PosterTemplateKey =
  | "classic"
  | "modern"
  | "minimal"
  | "festive"
  | "bold";

export const POSTER_TEMPLATES: { key: PosterTemplateKey; label: string }[] = [
  { key: "classic", label: "Classic" },
  { key: "modern", label: "Modern" },
  { key: "minimal", label: "Minimal" },
  { key: "festive", label: "Festive" },
  { key: "bold", label: "Bold" },
];

type TemplateStyle = {
  id: string;
  primaryColor?: string | null;
  accentColor?: string | null;
  textColor?: string | null;
  backgroundImage?: string | null;
  customCss?: string | null;
} | null | undefined;

function getPosterStyle(template: TemplateStyle): CSSProperties | undefined {
  if (!template?.primaryColor) return undefined;
  return {
    background: `linear-gradient(135deg, ${template.primaryColor}, ${template.accentColor ?? template.primaryColor})`,
    color: template.textColor ?? undefined,
  };
}

function getPosterClassName(template: TemplateStyle) {
  return template ? `poster poster-${template.id}` : "poster";
}

function PosterCustomCss({ template }: { template: TemplateStyle }) {
  if (!template?.customCss) return null;
  return <style>{`.poster-${template.id} {\n${template.customCss}\n}`}</style>;
}

/** Winners list — colored bullet dots matching reference design */
function WinnersList({
  result,
  dot1,
  dot2,
  dot3,
  nameColor = "text-white",
  divColor = "text-white/60",
}: {
  result: ResultDetail;
  dot1: string;
  dot2: string;
  dot3: string;
  nameColor?: string;
  divColor?: string;
}) {
  const winners = [
    result.firstPlaceName
      ? { name: result.firstPlaceName, div: result.division.name, dot: dot1 }
      : null,
    result.secondPlaceName
      ? { name: result.secondPlaceName, div: result.secondPlaceDivision?.name, dot: dot2 }
      : null,
    result.thirdPlaceName
      ? { name: result.thirdPlaceName, div: result.thirdPlaceDivision?.name, dot: dot3 }
      : null,
  ].filter(Boolean) as { name: string; div?: string | null; dot: string }[];

  return (
    <div className="space-y-4">
      {winners.map((w, i) => (
        <div key={i} className="flex items-start gap-4">
          <span
            className="mt-1.5 size-4 shrink-0 rounded-full"
            style={{ background: w.dot }}
          />
          <div>
            <p className={cn("text-lg font-black uppercase leading-tight tracking-wide", nameColor)}>
              {w.name}
            </p>
            {w.div && (
              <p className={cn("text-sm font-medium leading-tight", divColor)}>{w.div}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Shared poster shell — background + content
───────────────────────────────────────────── */
function PosterShell({
  result,
  fallback,
  scrim,
  categoryColor,
  itemColor,
  dot1,
  dot2,
  dot3,
  nameColor,
  divColor,
  children,
}: {
  result: ResultDetail;
  fallback: string;
  scrim?: string;
  categoryColor: string;
  itemColor: string;
  dot1: string;
  dot2: string;
  dot3: string;
  nameColor?: string;
  divColor?: string;
  children?: React.ReactNode;
}) {
  const bg = result.template?.backgroundImage;

  return (
    <div
      className={cn(
        getPosterClassName(result.template),
        "relative flex h-full flex-col overflow-hidden rounded-2xl",
        !bg && fallback
      )}
      style={getPosterStyle(result.template)}
    >
      <PosterCustomCss template={result.template} />

      {/* Background — use CSS backgroundImage so html-to-image captures text layers correctly */}
      {bg && (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          {scrim && <div className={cn("absolute inset-0", scrim)} />}
        </div>
      )}

      {/* Content — left-aligned, positioned in lower-left */}
      <div className="relative z-10 flex h-full flex-col justify-end p-8 pb-10">
        {/* Category */}
        <p className={cn("mb-1 text-sm font-bold uppercase tracking-widest", categoryColor)}>
          {result.category.name}
        </p>

        {/* Item name */}
        <h2 className={cn("mb-8 text-4xl font-black leading-tight tracking-tight", itemColor)}>
          {result.item.name}
        </h2>

        {/* Winners */}
        <WinnersList
          result={result}
          dot1={dot1}
          dot2={dot2}
          dot3={dot3}
          nameColor={nameColor}
          divColor={divColor}
        />

        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CLASSIC  — amber/lime on warm bg
───────────────────────────────────────────── */
export function ClassicPoster({ result }: { result: ResultDetail }) {
  return (
    <PosterShell
      result={result}
      fallback="bg-gradient-to-b from-amber-900 via-orange-900 to-amber-950"
      scrim="bg-gradient-to-r from-black/50 via-black/20 to-transparent"
      categoryColor="text-white/70"
      itemColor="text-lime-400"
      dot1="#f97316"
      dot2="#c2713a"
      dot3="#9ca3af"
      nameColor="text-white"
      divColor="text-white/60"
    />
  );
}

/* ─────────────────────────────────────────────
   MODERN  — cyan accent on dark bg
───────────────────────────────────────────── */
export function ModernPoster({ result }: { result: ResultDetail }) {
  return (
    <PosterShell
      result={result}
      fallback="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950"
      scrim="bg-gradient-to-r from-black/60 via-black/25 to-transparent"
      categoryColor="text-cyan-300/80"
      itemColor="text-cyan-300"
      dot1="#06b6d4"
      dot2="#0e7490"
      dot3="#64748b"
      nameColor="text-white"
      divColor="text-white/55"
    />
  );
}

/* ─────────────────────────────────────────────
   MINIMAL  — white on light overlay
───────────────────────────────────────────── */
export function MinimalPoster({ result }: { result: ResultDetail }) {
  return (
    <PosterShell
      result={result}
      fallback="bg-gradient-to-b from-slate-700 to-slate-900"
      scrim="bg-gradient-to-r from-black/55 via-black/20 to-transparent"
      categoryColor="text-white/60"
      itemColor="text-white"
      dot1="#e2e8f0"
      dot2="#94a3b8"
      dot3="#475569"
      nameColor="text-white"
      divColor="text-white/55"
    />
  );
}

/* ─────────────────────────────────────────────
   FESTIVE  — gold/amber on warm bg
───────────────────────────────────────────── */
export function FestivePoster({ result }: { result: ResultDetail }) {
  return (
    <PosterShell
      result={result}
      fallback="bg-gradient-to-b from-amber-950 via-orange-950 to-black"
      scrim="bg-gradient-to-r from-black/55 via-black/20 to-transparent"
      categoryColor="text-amber-300/80"
      itemColor="text-amber-300"
      dot1="#f59e0b"
      dot2="#d97706"
      dot3="#92400e"
      nameColor="text-white"
      divColor="text-white/60"
    />
  );
}

/* ─────────────────────────────────────────────
   BOLD  — bright green on dark bg
───────────────────────────────────────────── */
export function BoldPoster({ result }: { result: ResultDetail }) {
  return (
    <PosterShell
      result={result}
      fallback="bg-gradient-to-b from-emerald-900 to-black"
      scrim="bg-gradient-to-r from-black/65 via-black/25 to-transparent"
      categoryColor="text-emerald-400/80"
      itemColor="text-emerald-400"
      dot1="#4ade80"
      dot2="#16a34a"
      dot3="#064e3b"
      nameColor="text-white"
      divColor="text-white/55"
    />
  );
}

export const POSTER_COMPONENTS: Record<
  PosterTemplateKey,
  (props: { result: ResultDetail }) => React.JSX.Element
> = {
  classic: ClassicPoster,
  modern: ModernPoster,
  minimal: MinimalPoster,
  festive: FestivePoster,
  bold: BoldPoster,
};

export function resolveTemplateKey(name?: string | null): PosterTemplateKey {
  const match = POSTER_TEMPLATES.find(
    (t) => t.label.toLowerCase() === name?.toLowerCase()
  );
  return match?.key ?? "classic";
}
