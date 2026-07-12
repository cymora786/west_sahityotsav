export const revalidate = 60;

import { getCertificateSettings } from "@/lib/queries";
import { CertificatePrintSheet } from "@/components/admin/certificate-print-sheet";
import type { ApiCompetition, ApiCompetitionResult } from "@/lib/sahityotsav-api";

export default async function PublicCertificatePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const p = await searchParams;

  const name = p.name ?? "";
  const team = p.team ?? "";
  const item = p.item ?? "";
  const cat = p.cat ?? "";
  const stage = p.stage ?? "";
  const rank = Number(p.rank ?? "1");
  const grade = p.grade ?? "";
  const pts = Number(p.pts ?? "0");
  const prize = p.prize ?? null;

  if (!name || !item || rank < 1 || rank > 3) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center text-muted-foreground">
        Invalid certificate link. Please use the participant lookup to download your certificate.
      </div>
    );
  }

  const s = await getCertificateSettings();

  const styles = {
    first:  { bg: s?.firstBg  ?? null, textColor: s?.firstTextColor  ?? "#ffffff", overlay: s?.firstOverlay  ?? 0.3, font: s?.firstFont  ?? "serif", customCss: s?.firstCustomCss  ?? null, layout: s?.firstLayout  ?? null },
    second: { bg: s?.secondBg ?? null, textColor: s?.secondTextColor ?? "#ffffff", overlay: s?.secondOverlay ?? 0.3, font: s?.secondFont ?? "serif", customCss: s?.secondCustomCss ?? null, layout: s?.secondLayout ?? null },
    third:  { bg: s?.thirdBg  ?? null, textColor: s?.thirdTextColor  ?? "#ffffff", overlay: s?.thirdOverlay  ?? 0.3, font: s?.thirdFont  ?? "serif", customCss: s?.thirdCustomCss  ?? null, layout: s?.thirdLayout  ?? null },
  };

  const competition: ApiCompetition = {
    id: "",
    name: item,
    category: cat,
    type: "Individual",
    stage,
    resultNumber: 0,
  };

  const winner: ApiCompetitionResult = {
    rank,
    participantName: name,
    teamName: team,
    grade,
    point: pts,
    prize: rank === 1 ? "FIRST" : rank === 2 ? "SECOND" : "THIRD",
  };

  return <CertificatePrintSheet competition={competition} winners={[winner]} styles={styles} />;
}
