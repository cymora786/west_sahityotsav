"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { getResultById } from "@/lib/queries";
import { parsePosterLayout } from "@/components/admin/poster-drag-editor";

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

import { POSTER_BLOCKS, fontFamily as posterFontFamily, GOOGLE_FONTS_URL } from "@/components/admin/poster-drag-editor";
import type { PosterBlockConfig } from "@/components/admin/poster-drag-editor";

export function CustomLayoutPoster({ result }: { result: ResultDetail }) {
  const layout = parsePosterLayout(result.template?.layout ?? null);
  const bg = result.template?.backgroundImage;
  const tc = result.template?.textColor ?? "#ffffff";
  const primary = result.template?.primaryColor ?? "#16a34a";
  const hasBg = Boolean(bg);

  function blk(id: string): CSSProperties {
    const b: PosterBlockConfig | undefined = layout[id];
    const meta = POSTER_BLOCKS[id];
    return {
      position: "absolute",
      left: `${b?.x ?? 50}%`,
      top: `${b?.y ?? 50}%`,
      transform: "translate(-50%,-50%)",
      textAlign: b?.align ?? "center",
      width: "88%",
      display: b?.visible === false ? "none" : undefined,
      fontSize: `${b?.fontSize ?? meta?.defaultFontSize ?? 0.85}em`,
      fontFamily: posterFontFamily(b?.fontFamily),
      fontWeight: b?.bold ? "bold" : undefined,
      fontStyle: b?.italic ? "italic" : undefined,
      color: b?.color ?? tc,
      textShadow: hasBg ? "0 1px 4px rgba(0,0,0,0.7)" : "none",
    };
  }

  const winners = [
    result.firstPlaceName ? { name: result.firstPlaceName, div: result.division.name } : null,
    result.secondPlaceName ? { name: result.secondPlaceName, div: result.secondPlaceDivision?.name ?? result.division.name } : null,
    result.thirdPlaceName ? { name: result.thirdPlaceName, div: result.thirdPlaceDivision?.name ?? result.division.name } : null,
  ].filter(Boolean) as { name: string; div: string }[];

  const customIds = Object.keys(layout).filter(id => !POSTER_BLOCKS[id]);

  return (
    <div
      className={getPosterClassName(result.template)}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        overflow: "hidden",
        fontSize: "1.5vw",
        background: hasBg ? "transparent" : `linear-gradient(135deg, ${primary}, ${result.template?.accentColor ?? primary})`,
        ...getPosterStyle(result.template),
      }}
    >
      <style>{`@import url('${GOOGLE_FONTS_URL}');`}</style>
      <PosterCustomCss template={result.template} />
      {hasBg && (
        <>
          <img src={bg!} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1 }} />
        </>
      )}

      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <div style={blk("orgName")}>
          <p style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>
            {layout.orgName?.text ?? "SSF Malappuram West"}
          </p>
        </div>
        <div style={blk("eventTitle")}>
          <p style={{ letterSpacing: "0.08em" }}>{layout.eventTitle?.text ?? "SAHITYOTSAV 2026"}</p>
          <div style={{ width: "40%", height: "1px", margin: "0.4em auto 0", background: `linear-gradient(to right,transparent,${layout.eventTitle?.color ?? tc}80,transparent)` }} />
        </div>
        <div style={blk("itemName")}>
          <p>{result.item.name}</p>
        </div>
        <div style={blk("category")}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.8 }}>{result.category.name}</p>
        </div>
        {winners[0] && (
          <>
            <div style={blk("firstPlace")}><p>{winners[0].name}</p></div>
            <div style={blk("firstTeam")}><p style={{ opacity: 0.75 }}>{winners[0].div}</p></div>
          </>
        )}
        {winners[1] && (
          <>
            <div style={blk("secondPlace")}><p>{winners[1].name}</p></div>
            <div style={blk("secondTeam")}><p style={{ opacity: 0.75 }}>{winners[1].div}</p></div>
          </>
        )}
        {winners[2] && (
          <>
            <div style={blk("thirdPlace")}><p>{winners[2].name}</p></div>
            <div style={blk("thirdTeam")}><p style={{ opacity: 0.75 }}>{winners[2].div}</p></div>
          </>
        )}
        <div style={blk("date")}>
          <p style={{ opacity: 0.65 }}>
            {result.publishedDate ? new Date(result.publishedDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : ""}
          </p>
        </div>
        {customIds.map(id => {
          const b = layout[id];
          if (!b?.visible || !b.text) return null;
          return (
            <div key={id} style={blk(id)}>
              <p>{b.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
