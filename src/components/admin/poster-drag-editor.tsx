"use client";

import * as React from "react";
import {
  Eye, EyeOff, RotateCcw, ChevronDown, ChevronUp,
  Plus, Trash2, Check, X, Bold, Italic,
  AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";

function ClassicCanvasBg() {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "42%", left: "58%",
        transform: "translate(-50%,-50%)", width: "85%", height: "85%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(160,30,30,0.32) 0%, rgba(160,30,30,0.10) 45%, transparent 70%)",
      }} />
      {/* Top header row */}
      <div style={{ position: "absolute", top: "6%", left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.9rem", padding: "0 1.2rem" }}>
        <img src="/images/because-we-are.svg" alt="" style={{ height: "2.2em", objectFit: "contain" }} />
        <div style={{ width: "1px", height: "2em", background: "rgba(255,255,255,0.35)" }} />
        <img src="/images/sahi-2026-date.svg" alt="" style={{ height: "2.2em", objectFit: "contain" }} />
      </div>
      {/* Bottom cream strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(245,237,218,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "5.5rem", color: "rgba(180,160,110,0.45)", fontWeight: 900,
        overflow: "hidden", height: "10%", userSelect: "none",
        letterSpacing: "0.5rem",
      }}>VII VII VII</div>
    </div>
  );
}

export type PosterBlockConfig = {
  x: number;
  y: number;
  visible: boolean;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  align?: "left" | "center" | "right";
};

export type PosterLayout = { [blockId: string]: PosterBlockConfig };

export type PosterBlockMeta = {
  label: string;
  editable: boolean;
  dynamic: boolean;
  defaultText: string;
  sampleText: string;
  defaultFontSize: number;
};

export const POSTER_BLOCKS: Record<string, PosterBlockMeta> = {
  orgName:      { label: "Organisation Name",    editable: true,  dynamic: false, defaultText: "SSF Malappuram West", sampleText: "SSF Malappuram West", defaultFontSize: 0.65 },
  eventTitle:   { label: "Event Title",          editable: true,  dynamic: false, defaultText: "SAHITYOTSAV 2026",    sampleText: "SAHITYOTSAV 2026",    defaultFontSize: 1.4  },
  resultNumber: { label: "Result Number",        editable: false, dynamic: true,  defaultText: "",                    sampleText: "001",                 defaultFontSize: 2.5  },
  itemName:     { label: "Competition Name",     editable: false, dynamic: true,  defaultText: "",                    sampleText: "English Elocution",   defaultFontSize: 1.3  },
  category:     { label: "Category",             editable: false, dynamic: true,  defaultText: "",                    sampleText: "High School",         defaultFontSize: 0.7  },
  firstPlace:   { label: "1st Place — Name",     editable: false, dynamic: true,  defaultText: "",                    sampleText: "Ahmed Riyadh",        defaultFontSize: 0.9  },
  firstTeam:    { label: "1st Place — Team",     editable: false, dynamic: true,  defaultText: "",                    sampleText: "Unit A",              defaultFontSize: 0.65 },
  secondPlace:  { label: "2nd Place — Name",     editable: false, dynamic: true,  defaultText: "",                    sampleText: "Sara Fathima",        defaultFontSize: 0.9  },
  secondTeam:   { label: "2nd Place — Team",     editable: false, dynamic: true,  defaultText: "",                    sampleText: "Unit B",              defaultFontSize: 0.65 },
  thirdPlace:   { label: "3rd Place — Name",     editable: false, dynamic: true,  defaultText: "",                    sampleText: "Zain Ali",            defaultFontSize: 0.9  },
  thirdTeam:    { label: "3rd Place — Team",     editable: false, dynamic: true,  defaultText: "",                    sampleText: "Unit C",              defaultFontSize: 0.65 },
  date:         { label: "Date",                 editable: false, dynamic: true,  defaultText: "",                    sampleText: "January 2026",        defaultFontSize: 0.6  },
};

export const DEFAULT_POSTER_LAYOUT: PosterLayout = {
  orgName:      { x: 50, y: 8,  visible: true, bold: false, italic: false, align: "center" },
  eventTitle:   { x: 50, y: 17, visible: true, bold: true,  italic: false, align: "center" },
  resultNumber: { x: 50, y: 27, visible: true, bold: true,  italic: false, align: "center" },
  itemName:     { x: 50, y: 38, visible: true, bold: true,  italic: false, align: "center" },
  category:     { x: 50, y: 46, visible: true, bold: false, italic: false, align: "center" },
  firstPlace:   { x: 50, y: 56, visible: true, bold: true,  italic: false, align: "center" },
  firstTeam:    { x: 50, y: 62, visible: true, bold: false, italic: false, align: "center" },
  secondPlace:  { x: 50, y: 70, visible: true, bold: true,  italic: false, align: "center" },
  secondTeam:   { x: 50, y: 76, visible: true, bold: false, italic: false, align: "center" },
  thirdPlace:   { x: 50, y: 83, visible: true, bold: true,  italic: false, align: "center" },
  thirdTeam:    { x: 50, y: 89, visible: true, bold: false, italic: false, align: "center" },
  date:         { x: 50, y: 95, visible: true, bold: false, italic: false, align: "center" },
};

export function parsePosterLayout(raw: string | null | undefined): PosterLayout {
  try { if (raw) return { ...DEFAULT_POSTER_LAYOUT, ...JSON.parse(raw) }; } catch {}
  return { ...DEFAULT_POSTER_LAYOUT };
}

const BLOCK_COLORS: Record<string, string> = {
  orgName: "#3b82f6", eventTitle: "#1d4ed8",
  resultNumber: "#7c3aed",
  itemName: "#10b981", category: "#059669",
  firstPlace: "#d97706", firstTeam: "#b45309",
  secondPlace: "#6b7280", secondTeam: "#4b5563",
  thirdPlace: "#92400e", thirdTeam: "#78350f",
  date: "#64748b",
};
function blockColor(id: string) { return BLOCK_COLORS[id] ?? "#64748b"; }

export const FONT_OPTIONS = [
  { value: "georgia",    label: "Georgia (Classic)",     css: "Georgia, 'Times New Roman', serif" },
  { value: "sans",       label: "System Sans-serif",     css: "system-ui, Arial, sans-serif" },
  { value: "playfair",   label: "Playfair Display",      css: "'Playfair Display', Georgia, serif" },
  { value: "cinzel",     label: "Cinzel (Decorative)",   css: "'Cinzel', Georgia, serif" },
  { value: "montserrat", label: "Montserrat",            css: "'Montserrat', system-ui, sans-serif" },
  { value: "poppins",    label: "Poppins",               css: "'Poppins', system-ui, sans-serif" },
  { value: "raleway",    label: "Raleway",               css: "'Raleway', system-ui, sans-serif" },
  { value: "lato",       label: "Lato",                  css: "'Lato', system-ui, sans-serif" },
  { value: "dancing",    label: "Dancing Script",        css: "'Dancing Script', cursive" },
  { value: "greatvibes", label: "Great Vibes",           css: "'Great Vibes', cursive" },
];

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;700&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Poppins:ital,wght@0,400;0,700;1,400&family=Raleway:ital,wght@0,400;0,700;1,400&family=Lato:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Great+Vibes&display=swap";

export function fontFamily(fn?: string): string {
  return FONT_OPTIONS.find(f => f.value === fn)?.css ?? "Georgia, 'Times New Roman', serif";
}

interface Props {
  layout: PosterLayout;
  bgImage?: string | null;
  onChange: (layout: PosterLayout) => void;
  templateName?: string;
}

export function PosterFontsLoader() {
  return (
    <style>{`@import url('${GOOGLE_FONTS_URL}');`}</style>
  );
}

export function PosterDragEditor({ layout, bgImage, onChange, templateName = "" }: Props) {
  const isClassic = templateName.trim().toLowerCase() === "classic";
  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggingId = React.useRef<string | null>(null);
  const layoutRef = React.useRef(layout);
  React.useEffect(() => { layoutRef.current = layout; }, [layout]);

  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [addingText, setAddingText] = React.useState("");
  const [showAdd, setShowAdd] = React.useState(false);

  React.useEffect(() => {
    function onMove(e: MouseEvent) {
      const id = draggingId.current;
      if (!id || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const x = Math.max(3, Math.min(97, ((e.clientX - r.left) / r.width) * 100));
      const y = Math.max(2, Math.min(98, ((e.clientY - r.top) / r.height) * 100));
      const cur = layoutRef.current;
      onChange({ ...cur, [id]: { ...cur[id], x, y } });
    }
    function onUp() { draggingId.current = null; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [onChange]);

  function update(id: string, patch: Partial<PosterBlockConfig>) {
    const cur = layoutRef.current;
    onChange({ ...cur, [id]: { ...cur[id], ...patch } });
  }

  function toggle(id: string) { update(id, { visible: !layout[id]?.visible }); }

  function addBlock() {
    if (!addingText.trim()) return;
    const id = `custom_${Date.now()}`;
    onChange({ ...layoutRef.current, [id]: { x: 50, y: 50, visible: true, text: addingText.trim(), fontSize: 0.85, fontFamily: "sans" } });
    setAddingText("");
    setShowAdd(false);
  }

  function removeBlock(id: string) {
    const n = { ...layoutRef.current };
    delete n[id];
    onChange(n);
  }

  const builtInIds = Object.keys(POSTER_BLOCKS);
  const customIds = Object.keys(layout).filter(id => !POSTER_BLOCKS[id]);

  function BlockStylePanel({ id }: { id: string }) {
    const b = layout[id] ?? DEFAULT_POSTER_LAYOUT[id] ?? { x: 50, y: 50, visible: true };
    const meta = POSTER_BLOCKS[id];
    const defaultFontSize = meta?.defaultFontSize ?? 0.85;

    return (
      <div className="border-t bg-muted/30 px-2 py-2 space-y-2">
        {/* Text content (editable blocks + custom blocks) */}
        {(meta?.editable || !meta) && (
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide block mb-1">Text</label>
            <input
              className="w-full rounded border bg-background px-2 py-1 text-xs"
              value={b.text ?? meta?.defaultText ?? ""}
              onChange={e => update(id, { text: e.target.value || undefined })}
              placeholder={meta?.defaultText ?? "Custom text…"}
            />
          </div>
        )}

        {/* Font size */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide shrink-0">Size</label>
          <input
            type="range" min={0.3} max={3} step={0.05}
            value={b.fontSize ?? defaultFontSize}
            onChange={e => update(id, { fontSize: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="text-[10px] w-6 text-right text-muted-foreground">{(b.fontSize ?? defaultFontSize).toFixed(1)}</span>
        </div>

        {/* Font family */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide block mb-1">Font</label>
          <select
            value={b.fontFamily ?? "georgia"}
            onChange={e => update(id, { fontFamily: e.target.value })}
            className="w-full rounded border bg-background px-1.5 py-1 text-xs"
            style={{ fontFamily: fontFamily(b.fontFamily ?? "georgia") }}
          >
            {FONT_OPTIONS.map(f => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.css }}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Alignment + Bold + Italic + Color */}
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide shrink-0">Align</label>
          {(["left", "center", "right"] as const).map(a => (
            <button
              key={a}
              type="button"
              onClick={() => update(id, { align: a })}
              className={`rounded border p-1 transition-colors ${(b.align ?? "center") === a ? "bg-foreground text-background" : "hover:bg-muted"}`}
              title={a}
            >
              {a === "left"   && <AlignLeft   className="size-3" />}
              {a === "center" && <AlignCenter  className="size-3" />}
              {a === "right"  && <AlignRight   className="size-3" />}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => update(id, { bold: !b.bold })}
              className={`rounded border p-1 font-bold transition-colors ${b.bold ? "bg-foreground text-background" : "hover:bg-muted"}`}
              title="Bold"
            >
              <Bold className="size-3" />
            </button>
            <button
              type="button"
              onClick={() => update(id, { italic: !b.italic })}
              className={`rounded border p-1 italic transition-colors ${b.italic ? "bg-foreground text-background" : "hover:bg-muted"}`}
              title="Italic"
            >
              <Italic className="size-3" />
            </button>
            <input
              type="color"
              value={b.color ?? "#ffffff"}
              onChange={e => update(id, { color: e.target.value })}
              className="size-6 cursor-pointer rounded border bg-transparent"
              title="Text colour"
            />
          </div>
        </div>
      </div>
    );
  }

  function BlockRow({ id, label, isCustom }: { id: string; label: string; isCustom?: boolean }) {
    const b = layout[id] ?? DEFAULT_POSTER_LAYOUT[id] ?? { x: 50, y: 50, visible: true };
    const isExpanded = expandedId === id;
    const meta = POSTER_BLOCKS[id];

    return (
      <div className={`rounded-md border text-sm transition-opacity ${!b.visible ? "opacity-40" : ""}`}>
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <span className="size-2 rounded-full shrink-0" style={{ background: blockColor(id) }} />
          <span className="flex-1 text-xs font-medium truncate">{label}</span>
          {meta?.dynamic && <span className="rounded bg-muted px-1 text-[9px] text-muted-foreground">auto</span>}
          <button type="button" onClick={() => toggle(id)} className="text-muted-foreground hover:text-foreground" title={b.visible ? "Hide" : "Show"}>
            {b.visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          </button>
          {isCustom && (
            <button type="button" onClick={() => removeBlock(id)} className="text-destructive hover:opacity-80">
              <Trash2 className="size-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpandedId(isExpanded ? null : id)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        </div>
        {isExpanded && <BlockStylePanel id={id} />}
      </div>
    );
  }

  const SAMPLE_TEXT: Record<string, string> = {
    orgName:      layout.orgName?.text     ?? "SSF Malappuram West",
    eventTitle:   layout.eventTitle?.text  ?? "SAHITYOTSAV 2026",
    resultNumber: "001",
    itemName:     "English Elocution",
    category:     "High School",
    firstPlace:  "Ahmed Riyadh",
    firstTeam:   "Unit A",
    secondPlace: "Sara Fathima",
    secondTeam:  "Unit B",
    thirdPlace:  "Zain Ali",
    thirdTeam:   "Unit C",
    date:        "January 2026",
  };

  function canvasBlk(id: string): React.CSSProperties {
    const b = layout[id];
    const meta = POSTER_BLOCKS[id];
    const align = b?.align ?? "center";
    const xTranslate = align === "left" ? "0%" : align === "right" ? "-100%" : "-50%";
    const tc = "#ffffff";
    return {
      position: "absolute",
      left: `${b?.x ?? 50}%`,
      top: `${b?.y ?? 50}%`,
      transform: `translate(${xTranslate},-50%)`,
      textAlign: align,
      width: "88%",
      maxWidth: align === "center" ? "88%" : undefined,
      pointerEvents: "none",
      display: b?.visible === false ? "none" : undefined,
      fontSize: `${b?.fontSize ?? meta?.defaultFontSize ?? 0.85}em`,
      fontFamily: fontFamily(b?.fontFamily),
      fontWeight: b?.bold ? "bold" : "normal",
      fontStyle: b?.italic ? "italic" : "normal",
      color: b?.color ?? tc,
      textShadow: "0 1px 4px rgba(0,0,0,0.8)",
      lineHeight: 1.3,
    };
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <PosterFontsLoader />
      {/* Canvas */}
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Drag text to reposition. Edits update live.</p>
        <div
          ref={containerRef}
          className="relative w-full select-none overflow-hidden rounded-lg border shadow-inner"
          style={{ aspectRatio: "3/4", background: bgImage ? "transparent" : (isClassic ? "#2355b8" : "#1e293b"), fontSize: "1.5vw" }}
        >
          {bgImage && (
            <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
          )}
          {isClassic && !bgImage && (
            <ClassicCanvasBg />
          )}

          {/* Live text layer — exact same positions as poster output */}
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 5 }}>
            <div style={canvasBlk("orgName")}>
              <p style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>{SAMPLE_TEXT.orgName}</p>
            </div>
            <div style={canvasBlk("eventTitle")}>
              <p style={{ letterSpacing: "0.08em" }}>{SAMPLE_TEXT.eventTitle}</p>
              <div style={{ width: "40%", height: "1px", margin: "0.4em auto 0", background: `linear-gradient(to right,transparent,${layout.eventTitle?.color ?? "#ffffff"}80,transparent)` }} />
            </div>
            <div style={canvasBlk("resultNumber")}><p>{SAMPLE_TEXT.resultNumber}</p></div>
            <div style={canvasBlk("itemName")}><p>{SAMPLE_TEXT.itemName}</p></div>
            <div style={canvasBlk("category")}><p style={{ textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.8 }}>{SAMPLE_TEXT.category}</p></div>
            <div style={canvasBlk("firstPlace")}><p>{SAMPLE_TEXT.firstPlace}</p></div>
            <div style={canvasBlk("firstTeam")}><p style={{ opacity: 0.75 }}>{SAMPLE_TEXT.firstTeam}</p></div>
            <div style={canvasBlk("secondPlace")}><p>{SAMPLE_TEXT.secondPlace}</p></div>
            <div style={canvasBlk("secondTeam")}><p style={{ opacity: 0.75 }}>{SAMPLE_TEXT.secondTeam}</p></div>
            <div style={canvasBlk("thirdPlace")}><p>{SAMPLE_TEXT.thirdPlace}</p></div>
            <div style={canvasBlk("thirdTeam")}><p style={{ opacity: 0.75 }}>{SAMPLE_TEXT.thirdTeam}</p></div>
            <div style={canvasBlk("date")}><p style={{ opacity: 0.65 }}>{SAMPLE_TEXT.date}</p></div>
            {Object.keys(layout).filter(id => !POSTER_BLOCKS[id]).map(id => {
              const b = layout[id];
              if (!b?.visible || !b.text) return null;
              return <div key={id} style={canvasBlk(id)}><p>{b.text}</p></div>;
            })}
          </div>

          {/* Draggable handles — sit on top of text */}
          {Object.keys(layout).map(id => {
            const b = layout[id];
            if (!b?.visible) return null;
            return (
              <div
                key={id}
                onMouseDown={e => { e.preventDefault(); draggingId.current = id; }}
                style={{ position: "absolute", left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%,-50%)", cursor: "grab", zIndex: 20 }}
              >
                <div style={{
                  background: blockColor(id),
                  opacity: 0.85,
                  color: "#fff",
                  fontSize: "7px", fontWeight: 700,
                  padding: "1px 5px", borderRadius: "2px",
                  whiteSpace: "nowrap",
                  border: "1px solid rgba(255,255,255,0.3)", lineHeight: 1.6,
                }}>
                  ⠿
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={() => onChange({ ...DEFAULT_POSTER_LAYOUT })} className="flex items-center gap-1 text-xs text-muted-foreground hover:underline">
          <RotateCcw className="size-3" /> Reset positions
        </button>
      </div>

      {/* Block manager */}
      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "520px" }}>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Blocks</p>
        <p className="text-[10px] text-muted-foreground">Click ▼ on a block to edit its style.</p>

        <div className="space-y-1">
          {builtInIds.map(id => (
            <BlockRow key={id} id={id} label={POSTER_BLOCKS[id].label} />
          ))}
        </div>

        {customIds.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground pt-1">Custom</p>
            {customIds.map(id => (
              <BlockRow key={id} id={id} label={layout[id]?.text ?? "Custom"} isCustom />
            ))}
          </div>
        )}

        {showAdd ? (
          <div className="flex gap-1 pt-1">
            <input
              autoFocus placeholder="Custom text…" value={addingText}
              onChange={e => setAddingText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addBlock(); if (e.key === "Escape") setShowAdd(false); }}
              className="flex-1 rounded border bg-background px-2 py-1 text-xs"
            />
            <button type="button" onClick={addBlock} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
              <Check className="size-3" />
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="rounded border px-2 py-1 text-xs">
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <button
            type="button" onClick={() => setShowAdd(true)}
            className="flex w-full items-center gap-1.5 rounded-md border border-dashed px-2 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="size-3.5" /> Add Custom Text Block
          </button>
        )}
      </div>
    </div>
  );
}

