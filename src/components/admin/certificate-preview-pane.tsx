"use client";

import * as React from "react";
import type { CertLayout } from "./certificate-drag-editor";
import { BUILT_IN_BLOCKS } from "./certificate-drag-editor";

const RANK_META = {
  1: { label: "First Place",  color: "#d97706", emoji: "🥇" },
  2: { label: "Second Place", color: "#6b7280", emoji: "🥈" },
  3: { label: "Third Place",  color: "#92400e", emoji: "🥉" },
} as const;

function ff(font: string) {
  if (font === "sans") return "system-ui, Arial, sans-serif";
  if (font === "script") return "Palatino Linotype, Palatino, Georgia, cursive";
  return "Georgia, 'Times New Roman', serif";
}

interface Props {
  rank: 1 | 2 | 3;
  bgImage: string | null;
  textColor: string;
  overlay: number;
  font: string;
  layout: CertLayout;
}

const SAMPLE = {
  participantName: "Ahmed Riyadh",
  leaderName: "Mohammed Yasir",
  teamName: "Unit A",
  competitionName: "English Elocution",
  category: "High School",
  grade: "A",
  point: 5,
};

export function CertificatePreviewPane({ rank, bgImage, textColor: tc, overlay, font, layout }: Props) {
  const meta = RANK_META[rank];
  const hasCustomBg = Boolean(bgImage);
  const col = (a = 1) => hasCustomBg ? (a < 1 ? `${tc}${Math.round(a * 255).toString(16).padStart(2, "0")}` : tc) : undefined;
  const sh = hasCustomBg ? "0 1px 5px rgba(0,0,0,0.6)" : "none";

  function blk(id: keyof typeof BUILT_IN_BLOCKS | string, extra?: React.CSSProperties): React.CSSProperties {
    const b = layout[id];
    if (!b) return { display: "none" };
    return {
      position: "absolute",
      left: `${b.x}%`, top: `${b.y}%`,
      transform: "translate(-50%,-50%)",
      textAlign: "center", width: "88%",
      display: b.visible ? undefined : "none",
      ...extra,
    };
  }

  // Gather custom blocks
  const customIds = Object.keys(layout).filter(id => !BUILT_IN_BLOCKS[id]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border shadow" style={{ aspectRatio: "297/210" }}>
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", fontFamily: ff(font), overflow: "hidden", backgroundColor: hasCustomBg ? "transparent" : "#fff" }}>

        {hasCustomBg && <img src={bgImage!} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />}
        {!hasCustomBg && (
          <>
            <div style={{ position: "absolute", inset: "3%", border: `2px solid ${meta.color}`, borderRadius: "1.5%", zIndex: 1 }} />
            <div style={{ position: "absolute", inset: "4%", border: `1px solid ${meta.color}40`, borderRadius: "1%", zIndex: 1 }} />
          </>
        )}
        {hasCustomBg && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${overlay})`, zIndex: 1 }} />}

        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>

          {/* orgName */}
          <div style={blk("orgName")}>
            <p style={{ fontSize: "0.5vw", letterSpacing: "0.3em", textTransform: "uppercase", color: col(0.75) ?? "#6b7280", textShadow: sh }}>
              {layout.orgName?.text ?? "SSF Malappuram West"}
            </p>
          </div>

          {/* eventTitle */}
          <div style={blk("eventTitle")}>
            <p style={{ fontSize: "1.2vw", fontWeight: "bold", letterSpacing: "0.1em", color: col() ?? "#064e3b", textShadow: hasCustomBg ? "0 2px 8px rgba(0,0,0,0.7)" : "none" }}>
              {layout.eventTitle?.text ?? "SAHITYOTSAV 2026"}
            </p>
            <div style={{ width: "25%", height: "1px", margin: "0.5% auto 0", background: hasCustomBg ? `linear-gradient(to right,transparent,${tc}80,transparent)` : `linear-gradient(to right,transparent,${meta.color},transparent)` }} />
          </div>

          {/* certSubtitle */}
          <div style={blk("certSubtitle")}>
            <p style={{ fontSize: "0.65vw", letterSpacing: "0.3em", textTransform: "uppercase", color: col(0.85) ?? "#374151", textShadow: sh }}>
              {layout.certSubtitle?.text ?? "Certificate of Achievement"}
            </p>
          </div>

          {/* participantName */}
          <div style={blk("participantName")}>
            <p style={{ fontSize: "0.5vw", marginBottom: "0.4%", color: col(0.75) ?? "#6b7280", textShadow: sh }}>This is to certify that</p>
            <p style={{ fontSize: "1.5vw", fontWeight: "bold", fontStyle: "italic", color: col() ?? "#111827", textShadow: hasCustomBg ? "0 2px 10px rgba(0,0,0,0.75)" : "none" }}>
              {SAMPLE.participantName}
            </p>
          </div>

          {/* leaderName */}
          <div style={blk("leaderName")}>
            <p style={{ fontSize: "0.5vw", color: col(0.65) ?? "#9ca3af", textShadow: sh }}>Leader: {SAMPLE.leaderName}</p>
          </div>

          {/* teamName */}
          <div style={blk("teamName")}>
            <p style={{ fontSize: "0.5vw", marginBottom: "0.3%", color: col(0.75) ?? "#374151", textShadow: sh }}>representing</p>
            <p style={{ fontSize: "0.85vw", fontWeight: "600", color: col() ?? "#064e3b", textShadow: sh }}>{SAMPLE.teamName}</p>
          </div>

          {/* rankBadge */}
          <div style={blk("rankBadge")}>
            <p style={{ fontSize: "0.5vw", marginBottom: "0.4%", color: col(0.75) ?? "#6b7280", textShadow: sh }}>has secured</p>
            <p style={{ fontSize: "1.2vw", fontWeight: "bold", color: col() ?? meta.color, textShadow: hasCustomBg ? "0 2px 10px rgba(0,0,0,0.8)" : "none" }}>
              {meta.emoji} {meta.label}
            </p>
          </div>

          {/* competitionName */}
          <div style={blk("competitionName")}>
            <p style={{ fontSize: "0.5vw", marginBottom: "0.3%", color: col(0.75) ?? "#6b7280", textShadow: sh }}>in</p>
            <p style={{ fontSize: "0.85vw", fontWeight: "bold", color: col() ?? "#111827", textShadow: sh }}>{SAMPLE.competitionName}</p>
          </div>

          {/* category */}
          <div style={blk("category")}>
            <p style={{ fontSize: "0.5vw", color: col(0.65) ?? "#9ca3af", textShadow: sh }}>{SAMPLE.category}</p>
          </div>

          {/* gradePoints */}
          <div style={blk("gradePoints", { display: layout.gradePoints?.visible ? "flex" : "none", justifyContent: "center", gap: "2%" })}>
            {["A", "5 pts"].map((v, i) => (
              <div key={i} style={{ padding: "0.5% 1.5%", border: `1px solid ${hasCustomBg ? `${tc}70` : meta.color}`, borderRadius: "0.5%", background: hasCustomBg ? "rgba(255,255,255,0.10)" : "transparent" }}>
                <p style={{ fontSize: "0.4vw", textTransform: "uppercase", letterSpacing: "0.1em", color: col(0.65) ?? "#6b7280" }}>{i === 0 ? "Grade" : "Points"}</p>
                <p style={{ fontSize: "0.7vw", fontWeight: "bold", color: col() ?? meta.color }}>{v}</p>
              </div>
            ))}
          </div>

          {/* signatures */}
          <div style={blk("signatures", { display: layout.signatures?.visible ? "flex" : "none", justifyContent: "space-around" })}>
            {["Organizer", "Principal / HM", "Coordinator"].map(lbl => (
              <div key={lbl} style={{ textAlign: "center", minWidth: "15%" }}>
                <div style={{ borderBottom: `1px solid ${hasCustomBg ? `${tc}60` : "#9ca3af"}`, marginBottom: "0.4%", height: "2.5%" }} />
                <p style={{ fontSize: "0.4vw", color: col(0.6) ?? "#9ca3af" }}>{lbl}</p>
              </div>
            ))}
          </div>

          {/* Custom blocks */}
          {customIds.map(id => {
            const b = layout[id];
            if (!b?.visible) return null;
            return (
              <div key={id} style={blk(id)}>
                <p style={{ fontSize: "0.65vw", color: col() ?? "#374151", textShadow: sh }}>{b.text}</p>
              </div>
            );
          })}

        </div>

        <p style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontSize: "0.35vw", zIndex: 3, color: hasCustomBg ? `${tc}40` : "#e5e7eb" }}>
          SSF Malappuram West Sahityotsav 2026 · Official Certificate
        </p>
      </div>
    </div>
  );
}
