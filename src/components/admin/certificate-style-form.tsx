"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, Trash2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificateDragEditor, DEFAULT_LAYOUT } from "./certificate-drag-editor";
import type { CertLayout } from "./certificate-drag-editor";
import { CertificatePreviewPane } from "./certificate-preview-pane";
import { Eye, EyeOff } from "lucide-react";

const POSITIONS = [
  { bg: "firstBg",  tc: "firstTextColor",  ov: "firstOverlay",  fn: "firstFont",  css: "firstCustomCss",  lay: "firstLayout",  label: "1st Place", emoji: "🥇", border: "border-amber-400" },
  { bg: "secondBg", tc: "secondTextColor", ov: "secondOverlay", fn: "secondFont", css: "secondCustomCss", lay: "secondLayout", label: "2nd Place", emoji: "🥈", border: "border-gray-400" },
  { bg: "thirdBg",  tc: "thirdTextColor",  ov: "thirdOverlay",  fn: "thirdFont",  css: "thirdCustomCss",  lay: "thirdLayout",  label: "3rd Place", emoji: "🥉", border: "border-amber-800" },
] as const;

const FONTS = [
  { value: "serif",  label: "Serif (Classic)" },
  { value: "sans",   label: "Sans-serif (Modern)" },
  { value: "script", label: "Script (Elegant)" },
];

type StyleData = {
  firstBg?: string | null; secondBg?: string | null; thirdBg?: string | null;
  firstTextColor?: string | null; firstOverlay?: number | null; firstFont?: string | null;
  secondTextColor?: string | null; secondOverlay?: number | null; secondFont?: string | null;
  thirdTextColor?: string | null; thirdOverlay?: number | null; thirdFont?: string | null;
  firstCustomCss?: string | null; secondCustomCss?: string | null; thirdCustomCss?: string | null;
  firstLayout?: string | null; secondLayout?: string | null; thirdLayout?: string | null;
};

interface Props {
  firstBg: string | null; secondBg: string | null; thirdBg: string | null;
  firstTextColor: string | null; firstOverlay: number | null; firstFont: string | null;
  secondTextColor: string | null; secondOverlay: number | null; secondFont: string | null;
  thirdTextColor: string | null; thirdOverlay: number | null; thirdFont: string | null;
  firstCustomCss: string | null; secondCustomCss: string | null; thirdCustomCss: string | null;
  firstLayout: string | null; secondLayout: string | null; thirdLayout: string | null;
  action: (data: StyleData) => Promise<void>;
}

function parseLayout(raw: string | null): CertLayout {
  try { if (raw) return { ...DEFAULT_LAYOUT, ...JSON.parse(raw) }; } catch {}
  return { ...DEFAULT_LAYOUT };
}

export function CertificateStyleForm(props: Props) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [showPreview, setShowPreview] = React.useState(false);

  const [images, setImages] = React.useState<Record<string, string | null>>({
    firstBg: props.firstBg, secondBg: props.secondBg, thirdBg: props.thirdBg,
  });
  const [textColors, setTextColors] = React.useState<Record<string, string>>({
    firstTextColor: props.firstTextColor ?? "#ffffff",
    secondTextColor: props.secondTextColor ?? "#ffffff",
    thirdTextColor: props.thirdTextColor ?? "#ffffff",
  });
  const [overlays, setOverlays] = React.useState<Record<string, number>>({
    firstOverlay: props.firstOverlay ?? 0.3,
    secondOverlay: props.secondOverlay ?? 0.3,
    thirdOverlay: props.thirdOverlay ?? 0.3,
  });
  const [fonts, setFonts] = React.useState<Record<string, string>>({
    firstFont: props.firstFont ?? "serif",
    secondFont: props.secondFont ?? "serif",
    thirdFont: props.thirdFont ?? "serif",
  });
  const [customCss, setCustomCss] = React.useState<Record<string, string>>({
    firstCustomCss: props.firstCustomCss ?? "",
    secondCustomCss: props.secondCustomCss ?? "",
    thirdCustomCss: props.thirdCustomCss ?? "",
  });
  const [layouts, setLayouts] = React.useState<Record<string, CertLayout>>({
    firstLayout: parseLayout(props.firstLayout),
    secondLayout: parseLayout(props.secondLayout),
    thirdLayout: parseLayout(props.thirdLayout),
  });

  const [uploading, setUploading] = React.useState<Record<string, boolean>>({});
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const inputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

  async function handleFile(key: string, file: File) {
    setUploading((u) => ({ ...u, [key]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "certificates");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) setImages((prev) => ({ ...prev, [key]: json.url }));
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await props.action({
        firstBg: images.firstBg, secondBg: images.secondBg, thirdBg: images.thirdBg,
        firstTextColor: textColors.firstTextColor, firstOverlay: overlays.firstOverlay, firstFont: fonts.firstFont,
        secondTextColor: textColors.secondTextColor, secondOverlay: overlays.secondOverlay, secondFont: fonts.secondFont,
        thirdTextColor: textColors.thirdTextColor, thirdOverlay: overlays.thirdOverlay, thirdFont: fonts.thirdFont,
        firstCustomCss: customCss.firstCustomCss || null,
        secondCustomCss: customCss.secondCustomCss || null,
        thirdCustomCss: customCss.thirdCustomCss || null,
        firstLayout: JSON.stringify(layouts.firstLayout),
        secondLayout: JSON.stringify(layouts.secondLayout),
        thirdLayout: JSON.stringify(layouts.thirdLayout),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  const pos = POSITIONS[activeTab];
  const img = images[pos.bg];
  const isUploading = uploading[pos.bg];
  const tc = textColors[pos.tc] ?? "#ffffff";
  const ov = overlays[pos.ov] ?? 0.3;
  const fn = fonts[pos.fn] ?? "serif";
  const cc = customCss[pos.css] ?? "";
  const lay = layouts[pos.lay];

  return (
    <div className="space-y-6">
      {/* Tab selector + preview toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 rounded-lg border bg-muted/40 p-1">
          {POSITIONS.map((p, i) => (
            <button
              key={p.bg}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === i
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{p.emoji}</span> {p.label}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant={showPreview ? "default" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => setShowPreview((v) => !v)}
        >
          {showPreview ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {showPreview ? "Hide Preview" : "Preview Certificate"}
        </Button>
      </div>

      <div className={`rounded-xl border-2 ${pos.border} bg-card overflow-hidden`}>
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <span className="text-xl">{pos.emoji}</span>
          <span className="font-semibold">{pos.label} — Style &amp; Layout</span>
        </div>

        <div className="grid gap-6 p-4 lg:grid-cols-[1fr_340px]">
          {/* LEFT: Drag editor */}
          <CertificateDragEditor
            layout={lay}
            bgImage={img}
            overlay={ov}
            onChange={(newLayout) => setLayouts((p) => ({ ...p, [pos.lay]: newLayout }))}
          />

          {/* RIGHT: Controls */}
          <div className="space-y-4">
            {/* Background upload */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Background Image</p>
              {img ? (
                <div className="relative aspect-[297/210] overflow-hidden rounded-lg border">
                  <Image src={img} alt="bg" fill className="object-cover" unoptimized />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                      <Loader2 className="size-5 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-[297/210] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 text-muted-foreground">
                  <Upload className="size-5" />
                  <p className="text-xs">No background — default design will be used</p>
                </div>
              )}
              <div className="mt-2 flex gap-2">
                <input
                  ref={(el) => { inputRefs.current[pos.bg] = el; }}
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(pos.bg, f); e.target.value = ""; }}
                />
                <Button type="button" variant="outline" size="sm" className="flex-1 gap-1.5"
                  disabled={isUploading} onClick={() => inputRefs.current[pos.bg]?.click()}>
                  <Upload className="size-3.5" />
                  {img ? "Change Image" : "Upload Image"}
                </Button>
                {img && (
                  <Button type="button" variant="outline" size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setImages((prev) => ({ ...prev, [pos.bg]: null }))}>
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Text color */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Text Color</p>
              <div className="flex items-center gap-2">
                <input
                  type="color" value={tc}
                  onChange={(e) => setTextColors((p) => ({ ...p, [pos.tc]: e.target.value }))}
                  className="size-8 cursor-pointer rounded border"
                />
                <span className="font-mono text-xs">{tc}</span>
                <button type="button"
                  onClick={() => setTextColors((p) => ({ ...p, [pos.tc]: "#ffffff" }))}
                  className="rounded border px-2 py-0.5 text-[11px] hover:bg-muted">White</button>
                <button type="button"
                  onClick={() => setTextColors((p) => ({ ...p, [pos.tc]: "#000000" }))}
                  className="rounded border px-2 py-0.5 text-[11px] hover:bg-muted">Black</button>
              </div>
            </div>

            {/* Overlay */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Overlay Darkness — {Math.round(ov * 100)}%
              </p>
              <input
                type="range" min={0} max={1} step={0.05} value={ov}
                onChange={(e) => setOverlays((p) => ({ ...p, [pos.ov]: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Font */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Font</p>
              <select
                value={fn}
                onChange={(e) => setFonts((p) => ({ ...p, [pos.fn]: e.target.value }))}
                className="w-full rounded border bg-background px-2 py-1.5 text-sm"
              >
                {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            {/* Custom CSS */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Custom CSS</p>
              <textarea
                rows={4}
                value={cc}
                onChange={(e) => setCustomCss((p) => ({ ...p, [pos.css]: e.target.value }))}
                placeholder=".certificate-page { border: 4px solid gold; }"
                className="w-full rounded border bg-background px-2 py-1.5 font-mono text-xs resize-y"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live preview */}
      {showPreview && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Certificate Preview</h3>
            <span className="text-xs text-muted-foreground">(sample data — actual values will show when printing)</span>
          </div>
          <CertificatePreviewPane
            rank={(activeTab + 1) as 1 | 2 | 3}
            bgImage={img}
            textColor={tc}
            overlay={ov}
            font={fn}
            layout={lay}
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            ✓ Styles saved
          </p>
        )}
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Saving…" : "Save All Styles"}
        </Button>
      </div>
    </div>
  );
}
