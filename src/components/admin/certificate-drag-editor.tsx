"use client";

import * as React from "react";
import { Eye, EyeOff, Edit2, Check, Plus, Trash2, X } from "lucide-react";

export type BlockConfig = {
  x: number;
  y: number;
  visible: boolean;
  text?: string;
};

export type CertLayout = { [blockId: string]: BlockConfig };

export type BlockMeta = {
  label: string;
  editable: boolean;
  dynamic: boolean;
  defaultText: string;
  sampleText: string;
};

export const BUILT_IN_BLOCKS: Record<string, BlockMeta> = {
  orgName:         { label: "Organisation Name",   editable: true,  dynamic: false, defaultText: "SSF Malappuram West",        sampleText: "SSF Malappuram West" },
  eventTitle:      { label: "Event Title",         editable: true,  dynamic: false, defaultText: "SAHITYOTSAV 2026",           sampleText: "SAHITYOTSAV 2026" },
  certSubtitle:    { label: "Certificate Subtitle",editable: true,  dynamic: false, defaultText: "Certificate of Achievement", sampleText: "Certificate of Achievement" },
  participantName: { label: "Participant Name",    editable: false, dynamic: true,  defaultText: "",                           sampleText: "Ahmed Riyadh" },
  leaderName:      { label: "Leader Name",         editable: false, dynamic: true,  defaultText: "",                           sampleText: "Leader: Mohammed Yasir" },
  teamName:        { label: "Team / Division",     editable: false, dynamic: true,  defaultText: "",                           sampleText: "Unit A" },
  rankBadge:       { label: "Prize & Rank",        editable: false, dynamic: true,  defaultText: "",                           sampleText: "🥇 First Place" },
  competitionName: { label: "Competition Name",    editable: false, dynamic: true,  defaultText: "",                           sampleText: "English Elocution" },
  category:        { label: "Category",            editable: false, dynamic: true,  defaultText: "",                           sampleText: "High School" },
  gradePoints:     { label: "Grade & Points",      editable: false, dynamic: true,  defaultText: "",                           sampleText: "Grade A  ·  5 pts" },
  signatures:      { label: "Signature Lines",     editable: false, dynamic: false, defaultText: "",                           sampleText: "──── Organizer | HM | Coordinator ────" },
};

export const DEFAULT_LAYOUT: CertLayout = {
  orgName:         { x: 50, y: 8,  visible: true },
  eventTitle:      { x: 50, y: 15, visible: true },
  certSubtitle:    { x: 50, y: 25, visible: true },
  participantName: { x: 50, y: 37, visible: true },
  leaderName:      { x: 50, y: 44, visible: true },
  teamName:        { x: 50, y: 51, visible: true },
  rankBadge:       { x: 50, y: 60, visible: true },
  competitionName: { x: 50, y: 68, visible: true },
  category:        { x: 50, y: 74, visible: true },
  gradePoints:     { x: 50, y: 82, visible: true },
  signatures:      { x: 50, y: 91, visible: true },
};

const BLOCK_COLORS: Record<string, string> = {
  orgName: "#3b82f6", eventTitle: "#1d4ed8", certSubtitle: "#8b5cf6",
  participantName: "#10b981", leaderName: "#059669", teamName: "#0d9488",
  rankBadge: "#f59e0b", competitionName: "#ef4444", category: "#dc2626",
  gradePoints: "#06b6d4", signatures: "#6b7280",
};

function blockColor(id: string) { return BLOCK_COLORS[id] ?? "#64748b"; }

export function parseLayout(raw: string | null | undefined): CertLayout {
  try { if (raw) return { ...DEFAULT_LAYOUT, ...JSON.parse(raw) }; } catch {}
  return { ...DEFAULT_LAYOUT };
}

interface Props {
  layout: CertLayout;
  bgImage?: string | null;
  overlay?: number;
  onChange: (layout: CertLayout) => void;
}

export function CertificateDragEditor({ layout, bgImage, overlay = 0.3, onChange }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggingId = React.useRef<string | null>(null);
  const layoutRef = React.useRef(layout);
  React.useEffect(() => { layoutRef.current = layout; }, [layout]);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
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

  function toggle(id: string) {
    const c = layoutRef.current;
    onChange({ ...c, [id]: { ...c[id], visible: !c[id].visible } });
  }

  function startEdit(id: string) {
    const meta = BUILT_IN_BLOCKS[id];
    setEditingId(id);
    setEditText(layout[id].text ?? meta?.defaultText ?? "");
  }

  function saveEdit() {
    if (!editingId) return;
    const c = layoutRef.current;
    onChange({ ...c, [editingId]: { ...c[editingId], text: editText.trim() || undefined } });
    setEditingId(null);
  }

  function addBlock() {
    if (!addingText.trim()) return;
    const id = `custom_${Date.now()}`;
    onChange({ ...layoutRef.current, [id]: { x: 50, y: 50, visible: true, text: addingText.trim() } });
    setAddingText("");
    setShowAdd(false);
  }

  function removeCustom(id: string) {
    const n = { ...layoutRef.current };
    delete n[id];
    onChange(n);
  }

  const builtInIds = Object.keys(BUILT_IN_BLOCKS);
  const customIds = Object.keys(layout).filter(id => !BUILT_IN_BLOCKS[id]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      {/* Canvas */}
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Drag coloured blocks to reposition. Eye icon toggles visibility.</p>
        <div
          ref={containerRef}
          className="relative w-full select-none overflow-hidden rounded-lg border shadow-inner"
          style={{ aspectRatio: "297/210", background: bgImage ? "transparent" : "#f1f5f9" }}
        >
          {bgImage && (
            <>
              <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
              <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay})` }} />
            </>
          )}
          {/* Grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
            {[25, 50, 75].map(v => (
              <React.Fragment key={v}>
                <div className="absolute top-0 bottom-0 border-l border-slate-500" style={{ left: `${v}%` }} />
                <div className="absolute left-0 right-0 border-t border-slate-500" style={{ top: `${v}%` }} />
              </React.Fragment>
            ))}
          </div>
          {/* Draggable chips */}
          {Object.keys(layout).map(id => {
            const b = layout[id];
            if (!b.visible) return null;
            const label = BUILT_IN_BLOCKS[id]?.label ?? (b.text ?? "Custom");
            return (
              <div
                key={id}
                onMouseDown={(e) => { e.preventDefault(); draggingId.current = id; }}
                style={{ position: "absolute", left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%,-50%)", cursor: "grab", zIndex: 20 }}
              >
                <div style={{
                  background: blockColor(id), color: "#fff",
                  fontSize: "9px", fontWeight: 700,
                  padding: "2px 7px", borderRadius: "3px",
                  whiteSpace: "nowrap", boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.2)", lineHeight: 1.6,
                }}>
                  ⠿ {label}
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={() => onChange(DEFAULT_LAYOUT)} className="text-xs text-muted-foreground hover:underline">
          Reset all positions
        </button>
      </div>

      {/* Block manager */}
      <div className="space-y-3 overflow-y-auto max-h-[320px] lg:max-h-none">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Content Blocks</p>

        {/* Built-in */}
        <div className="space-y-1">
          {builtInIds.map(id => {
            const b = layout[id] ?? { ...DEFAULT_LAYOUT[id] };
            const meta = BUILT_IN_BLOCKS[id];
            const isEditing = editingId === id;
            return (
              <div key={id} className={`rounded-md border text-sm transition-opacity ${!b.visible ? "opacity-40" : ""}`}>
                <div className="flex items-center gap-1.5 px-2 py-1.5">
                  <span className="size-2 rounded-full shrink-0" style={{ background: blockColor(id) }} />
                  <span className="flex-1 text-xs font-medium truncate">{meta.label}</span>
                  {meta.dynamic && <span className="rounded bg-muted px-1 text-[9px] text-muted-foreground">auto</span>}
                  {meta.editable && !isEditing && (
                    <button type="button" onClick={() => startEdit(id)} className="text-muted-foreground hover:text-foreground" title="Edit text">
                      <Edit2 className="size-3" />
                    </button>
                  )}
                  <button type="button" onClick={() => toggle(id)} className="text-muted-foreground hover:text-foreground" title={b.visible ? "Hide" : "Show"}>
                    {b.visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                  </button>
                </div>
                {isEditing && (
                  <div className="flex gap-1 border-t px-2 py-1.5">
                    <input
                      autoFocus value={editText} onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                      className="flex-1 rounded border bg-background px-1.5 py-0.5 text-xs"
                      placeholder={meta.defaultText}
                    />
                    <button type="button" onClick={saveEdit} className="rounded bg-primary px-2 text-primary-foreground">
                      <Check className="size-3" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded border px-2">
                      <X className="size-3" />
                    </button>
                  </div>
                )}
                {!isEditing && meta.editable && b.text && (
                  <p className="border-t px-2 py-0.5 text-[10px] text-muted-foreground italic truncate">"{b.text}"</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom blocks */}
        {customIds.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Custom</p>
            {customIds.map(id => {
              const b = layout[id];
              const isEditing = editingId === id;
              return (
                <div key={id} className={`rounded-md border text-sm transition-opacity ${!b.visible ? "opacity-40" : ""}`}>
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    <span className="size-2 rounded-full shrink-0 bg-slate-500" />
                    <span className="flex-1 text-xs font-medium truncate">{b.text ?? "Custom"}</span>
                    <button type="button" onClick={() => startEdit(id)} className="text-muted-foreground hover:text-foreground"><Edit2 className="size-3" /></button>
                    <button type="button" onClick={() => toggle(id)} className="text-muted-foreground hover:text-foreground">
                      {b.visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                    </button>
                    <button type="button" onClick={() => removeCustom(id)} className="text-destructive hover:opacity-80"><Trash2 className="size-3" /></button>
                  </div>
                  {isEditing && (
                    <div className="flex gap-1 border-t px-2 py-1.5">
                      <input
                        autoFocus value={editText} onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                        className="flex-1 rounded border bg-background px-1.5 py-0.5 text-xs"
                      />
                      <button type="button" onClick={saveEdit} className="rounded bg-primary px-2 text-primary-foreground"><Check className="size-3" /></button>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded border px-2"><X className="size-3" /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add block */}
        {showAdd ? (
          <div className="flex gap-1">
            <input
              autoFocus placeholder="Custom text…" value={addingText}
              onChange={e => setAddingText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addBlock(); if (e.key === "Escape") setShowAdd(false); }}
              className="flex-1 rounded border bg-background px-2 py-1 text-xs"
            />
            <button type="button" onClick={addBlock} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Add</button>
            <button type="button" onClick={() => setShowAdd(false)} className="rounded border px-2 py-1 text-xs">✕</button>
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
