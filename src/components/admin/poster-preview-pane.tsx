"use client";

import * as React from "react";
import type { PosterLayout } from "./poster-drag-editor";
import { POSTER_BLOCKS, fontFamily, GOOGLE_FONTS_URL } from "./poster-drag-editor";

const SAMPLE = {
  orgName:     "SSF Malappuram West",
  eventTitle:  "SAHITYOTSAV 2026",
  itemName:    "English Elocution",
  category:    "High School",
  firstPlace:  "Ahmed Riyadh",
  firstTeam:   "Unit A",
  secondPlace: "Sara Fathima",
  secondTeam:  "Unit B",
  thirdPlace:  "Zain Ali",
  thirdTeam:   "Unit C",
  date:        "January 2026",
};

interface Props {
  layout: PosterLayout;
  bgImage: string | null;
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
}

export function PosterPreviewPane({
  layout,
  bgImage,
  primaryColor = "#16a34a",
  accentColor = "#fde047",
  textColor = "#ffffff",
}: Props) {
  const hasBg = Boolean(bgImage);

  function blk(id: string): React.CSSProperties {
    const b = layout[id];
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
      fontFamily: fontFamily(b?.fontFamily),
      fontWeight: b?.bold ? "bold" : "normal",
      fontStyle: b?.italic ? "italic" : "normal",
      color: b?.color ?? textColor,
      textShadow: hasBg ? "0 1px 4px rgba(0,0,0,0.7)" : "none",
      lineHeight: 1.3,
    };
  }

  const customIds = Object.keys(layout).filter(id => !POSTER_BLOCKS[id]);

  const bg = hasBg
    ? "transparent"
    : `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border shadow-lg" style={{ aspectRatio: "3/4" }}>
      <style>{`@import url('${GOOGLE_FONTS_URL}');`}</style>
      <div style={{ position: "absolute", inset: 0, background: bg, fontSize: "1.5vw" }}>
        {hasBg && (
          <>
            <img src={bgImage!} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1 }} />
          </>
        )}

        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>

          <div style={blk("orgName")}>
            <p style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>
              {layout.orgName?.text ?? SAMPLE.orgName}
            </p>
          </div>

          <div style={blk("eventTitle")}>
            <p style={{ letterSpacing: "0.08em" }}>{layout.eventTitle?.text ?? SAMPLE.eventTitle}</p>
            <div style={{ width: "40%", height: "1px", margin: "4% auto 0", background: `linear-gradient(to right,transparent,${layout.eventTitle?.color ?? textColor}80,transparent)` }} />
          </div>

          <div style={blk("itemName")}>
            <p>{SAMPLE.itemName}</p>
          </div>

          <div style={blk("category")}>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.8 }}>{SAMPLE.category}</p>
          </div>

          <div style={blk("firstPlace")}><p>{SAMPLE.firstPlace}</p></div>
          <div style={blk("firstTeam")}><p style={{ opacity: 0.75 }}>{SAMPLE.firstTeam}</p></div>
          <div style={blk("secondPlace")}><p>{SAMPLE.secondPlace}</p></div>
          <div style={blk("secondTeam")}><p style={{ opacity: 0.75 }}>{SAMPLE.secondTeam}</p></div>
          <div style={blk("thirdPlace")}><p>{SAMPLE.thirdPlace}</p></div>
          <div style={blk("thirdTeam")}><p style={{ opacity: 0.75 }}>{SAMPLE.thirdTeam}</p></div>

          <div style={blk("date")}>
            <p style={{ opacity: 0.65 }}>{SAMPLE.date}</p>
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

        <p style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontSize: "0.4em", zIndex: 3, color: hasBg ? `${textColor}50` : "rgba(0,0,0,0.3)" }}>
          Sample preview — actual data fills in when published
        </p>
      </div>
    </div>
  );
}
