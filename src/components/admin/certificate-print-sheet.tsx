"use client";

import * as React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiCompetition, ApiCompetitionResult } from "@/lib/sahityotsav-api";
import { parseLayout, BUILT_IN_BLOCKS } from "./certificate-drag-editor";
import type { CertLayout } from "./certificate-drag-editor";

const RANK_META: Record<number, { label: string; color: string; emoji: string }> = {
  1: { label: "First Place",  color: "#d97706", emoji: "🥇" },
  2: { label: "Second Place", color: "#6b7280", emoji: "🥈" },
  3: { label: "Third Place",  color: "#92400e", emoji: "🥉" },
};

interface PositionStyle {
  bg: string | null;
  textColor: string;
  overlay: number;
  font: string;
  customCss?: string | null;
  layout?: string | null; // JSON
}

interface Styles {
  first: PositionStyle;
  second: PositionStyle;
  third: PositionStyle;
}

interface Props {
  competition: ApiCompetition;
  winners: ApiCompetitionResult[];
  styles: Styles;
}

function styleFor(rank: number, styles: Styles): PositionStyle {
  if (rank === 1) return styles.first;
  if (rank === 2) return styles.second;
  return styles.third;
}

function fontFamily(fn: string) {
  if (fn === "sans") return "system-ui, Arial, sans-serif";
  if (fn === "script") return "Palatino Linotype, Palatino, Georgia, cursive";
  return "Georgia, 'Times New Roman', serif";
}

function absBlock(lay: CertLayout, id: string, extraStyle?: React.CSSProperties): React.CSSProperties {
  const b = lay[id];
  return {
    position: "absolute",
    left: `${b?.x ?? 50}%`,
    top: `${b?.y ?? 50}%`,
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    width: "88%",
    display: (b?.visible === false) ? "none" : undefined,
    ...extraStyle,
  };
}

export function CertificatePrintSheet({ competition, winners, styles }: Props) {
  return (
    <>
      <div className="no-print fixed right-6 top-6 z-50 flex gap-2">
        <Button onClick={() => window.print()} className="gap-2 shadow-lg">
          <Printer className="size-4" />
          Print All Certificates
        </Button>
        <Button variant="outline" onClick={() => window.close()} className="shadow-lg">
          Close
        </Button>
      </div>

      {winners.map((winner) => {
        const meta = RANK_META[winner.rank] ?? { label: `Rank ${winner.rank}`, color: "#1a1a1a", emoji: "" };
        const style = styleFor(winner.rank, styles);
        const hasCustomBg = Boolean(style.bg);
        const tc = style.textColor;
        const ff = fontFamily(style.font);
        const lay = parseLayout(style.layout);

        const name = winner.participantName ?? winner.groupName ?? "—";

        // Helpers for colored text with shadow
        const col = (alpha = 1) =>
          hasCustomBg
            ? alpha < 1
              ? `${tc}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`
              : tc
            : undefined;

        const shadow = hasCustomBg ? "0 1px 5px rgba(0,0,0,0.6)" : "none";

        return (
          <div
            key={winner.rank}
            className="certificate-page"
            style={{
              width: "297mm",
              height: "210mm",
              margin: "0 auto 16mm",
              position: "relative",
              fontFamily: ff,
              overflow: "hidden",
              border: hasCustomBg ? "none" : "1px solid #e5e7eb",
              backgroundColor: hasCustomBg ? "transparent" : "#fff",
            }}
          >
            {/* Background image */}
            {hasCustomBg && (
              <img
                src={style.bg!}
                alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
              />
            )}

            {/* Decorative border (no bg) */}
            {!hasCustomBg && (
              <>
                <div style={{ position: "absolute", inset: "6mm", border: `3px solid ${meta.color}`, borderRadius: "4mm", zIndex: 1 }} />
                <div style={{ position: "absolute", inset: "8mm", border: `1px solid ${meta.color}40`, borderRadius: "3mm", zIndex: 1 }} />
              </>
            )}

            {/* Overlay */}
            {hasCustomBg && (
              <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${style.overlay})`, zIndex: 1 }} />
            )}

            {/* ── Content blocks — absolutely positioned via saved layout ── */}
            <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>

              {/* orgName */}
              <div style={absBlock(lay, "orgName")}>
                <p style={{ fontSize: "7pt", letterSpacing: "5px", textTransform: "uppercase", color: col(0.75) ?? "#6b7280", textShadow: shadow }}>
                  {lay.orgName?.text ?? "SSF Malappuram West"}
                </p>
              </div>

              {/* eventTitle */}
              <div style={absBlock(lay, "eventTitle")}>
                <p style={{ fontSize: "19pt", fontWeight: "bold", letterSpacing: "2px", color: col() ?? "#064e3b", textShadow: hasCustomBg ? "0 2px 8px rgba(0,0,0,0.7)" : "none" }}>
                  {lay.eventTitle?.text ?? "SAHITYOTSAV 2026"}
                </p>
                <div style={{ width: "60mm", height: "1px", margin: "2.5mm auto 0", background: hasCustomBg ? `linear-gradient(to right,transparent,${tc}80,transparent)` : `linear-gradient(to right,transparent,${meta.color},transparent)` }} />
              </div>

              {/* certSubtitle */}
              <div style={absBlock(lay, "certSubtitle")}>
                <p style={{ fontSize: "11pt", letterSpacing: "5px", textTransform: "uppercase", color: col(0.85) ?? "#374151", textShadow: shadow }}>
                  {lay.certSubtitle?.text ?? "Certificate of Achievement"}
                </p>
              </div>

              {/* participantName */}
              <div style={absBlock(lay, "participantName")}>
                <p style={{ fontSize: "9pt", marginBottom: "2mm", color: col(0.75) ?? "#6b7280", textShadow: shadow }}>This is to certify that</p>
                <p style={{ fontSize: "22pt", fontWeight: "bold", fontStyle: "italic", color: col() ?? "#111827", textShadow: hasCustomBg ? "0 2px 10px rgba(0,0,0,0.75)" : "none" }}>
                  {name}
                </p>
              </div>

              {/* leaderName */}
              {winner.leaderName && (
                <div style={absBlock(lay, "leaderName")}>
                  <p style={{ fontSize: "8pt", color: col(0.65) ?? "#9ca3af", textShadow: shadow }}>
                    Leader: {winner.leaderName}
                  </p>
                </div>
              )}

              {/* teamName */}
              <div style={absBlock(lay, "teamName")}>
                <p style={{ fontSize: "9pt", marginBottom: "1mm", color: col(0.75) ?? "#374151", textShadow: shadow }}>representing</p>
                <p style={{ fontSize: "13pt", fontWeight: "600", color: col() ?? "#064e3b", textShadow: hasCustomBg ? "0 2px 6px rgba(0,0,0,0.6)" : "none" }}>
                  {winner.teamName}
                </p>
              </div>

              {/* rankBadge */}
              <div style={absBlock(lay, "rankBadge")}>
                <p style={{ fontSize: "9pt", marginBottom: "1mm", color: col(0.75) ?? "#6b7280", textShadow: shadow }}>has secured</p>
                <p style={{ fontSize: "20pt", fontWeight: "bold", color: col() ?? meta.color, textShadow: hasCustomBg ? "0 2px 10px rgba(0,0,0,0.8)" : "none" }}>
                  {meta.emoji} {meta.label}
                </p>
              </div>

              {/* competitionName */}
              <div style={absBlock(lay, "competitionName")}>
                <p style={{ fontSize: "9pt", marginBottom: "1mm", color: col(0.75) ?? "#6b7280", textShadow: shadow }}>in</p>
                <p style={{ fontSize: "13pt", fontWeight: "bold", color: col() ?? "#111827", textShadow: hasCustomBg ? "0 2px 6px rgba(0,0,0,0.7)" : "none" }}>
                  {competition.name}
                </p>
              </div>

              {/* category */}
              <div style={absBlock(lay, "category")}>
                <p style={{ fontSize: "9pt", color: col(0.65) ?? "#9ca3af", textShadow: shadow }}>
                  {competition.category}{competition.stage ? ` · ${competition.stage}` : ""}
                </p>
              </div>

              {/* gradePoints */}
              {(winner.grade || winner.point > 0) && (
                <div style={{ ...absBlock(lay, "gradePoints"), display: lay.gradePoints?.visible === false ? "none" : "flex", justifyContent: "center", gap: "6mm" }}>
                  {winner.grade && (
                    <div style={{ padding: "1.5mm 5mm", border: `1px solid ${hasCustomBg ? `${tc}70` : meta.color}`, borderRadius: "2mm", background: hasCustomBg ? "rgba(255,255,255,0.10)" : "transparent" }}>
                      <p style={{ fontSize: "7pt", letterSpacing: "2px", textTransform: "uppercase", color: col(0.65) ?? "#6b7280" }}>Grade</p>
                      <p style={{ fontSize: "12pt", fontWeight: "bold", color: col() ?? meta.color, textShadow: shadow }}>{winner.grade}</p>
                    </div>
                  )}
                  {winner.point > 0 && (
                    <div style={{ padding: "1.5mm 5mm", border: `1px solid ${hasCustomBg ? `${tc}70` : meta.color}`, borderRadius: "2mm", background: hasCustomBg ? "rgba(255,255,255,0.10)" : "transparent" }}>
                      <p style={{ fontSize: "7pt", letterSpacing: "2px", textTransform: "uppercase", color: col(0.65) ?? "#6b7280" }}>Points</p>
                      <p style={{ fontSize: "12pt", fontWeight: "bold", color: col() ?? meta.color, textShadow: shadow }}>{winner.point}</p>
                    </div>
                  )}
                </div>
              )}

              {/* signatures */}
              <div style={{ ...absBlock(lay, "signatures"), display: lay.signatures?.visible === false ? "none" : "flex", justifyContent: "space-around" }}>
                {["Organizer", "Principal / HM", "Event Coordinator"].map((lbl) => (
                  <div key={lbl} style={{ textAlign: "center", minWidth: "45mm" }}>
                    <div style={{ borderBottom: `1px solid ${hasCustomBg ? `${tc}60` : "#9ca3af"}`, marginBottom: "1.5mm", height: "7mm" }} />
                    <p style={{ fontSize: "7pt", color: col(0.6) ?? "#9ca3af", textShadow: shadow }}>{lbl}</p>
                  </div>
                ))}
              </div>

              {/* Custom text blocks */}
              {Object.keys(lay).filter(id => !BUILT_IN_BLOCKS[id]).map(id => {
                const b = lay[id];
                if (!b?.visible || !b.text) return null;
                return (
                  <div key={id} style={absBlock(lay, id)}>
                    <p style={{ fontSize: "10pt", color: col() ?? "#374151", textShadow: shadow }}>{b.text}</p>
                  </div>
                );
              })}

            </div>

            {/* Watermark */}
            <p style={{
              position: "absolute", bottom: "5mm", left: 0, right: 0, textAlign: "center",
              fontSize: "6pt", letterSpacing: "1px", zIndex: 3,
              color: hasCustomBg ? `${tc}40` : "#e5e7eb",
              textShadow: hasCustomBg ? "0 1px 3px rgba(0,0,0,0.5)" : "none",
            }}>
              SSF Malappuram West Sahityotsav 2026 · Official Certificate
            </p>
          </div>
        );
      })}

      <style>{`
        @page { size: A4 landscape; margin: 0; }
        body { background: #f3f4f6; }

        @media print {
          .no-print, header, nav, aside, [data-sidebar] { display: none !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          main, #__next, [data-nextjs-scroll-focus-boundary] { all: unset !important; display: block !important; }
          .certificate-page {
            margin: 0 !important; border: none !important; overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .certificate-page img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        ${winners.map((w) => {
          const st = styleFor(w.rank, styles);
          return st.customCss ? st.customCss : "";
        }).filter(Boolean).join("\n")}
      `}</style>
    </>
  );
}
