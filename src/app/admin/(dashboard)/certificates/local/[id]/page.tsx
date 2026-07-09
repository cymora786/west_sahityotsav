import { notFound } from "next/navigation";
import { getResultById, getCertificateSettings } from "@/lib/queries";
import { CertificatePrintSheet } from "@/components/admin/certificate-print-sheet";
import type { ApiCompetition, ApiCompetitionResult } from "@/lib/sahityotsav-api";

export default async function LocalCertificatePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [result, s] = await Promise.all([
    getResultById(id),
    getCertificateSettings(),
  ]);

  if (!result || result.status !== "PUBLISHED") notFound();

  // Build a competition object matching the ApiCompetition shape
  const competition: ApiCompetition = {
    id: result.id,
    name: result.item.name,
    category: result.category.name,
    type: "Individual",
    resultNumber: 0,
    publishedAt: result.publishedDate?.toISOString() ?? undefined,
  };

  // Build winner list from DB result fields
  const winners: ApiCompetitionResult[] = [];

  if (result.firstPlaceName) {
    winners.push({
      rank: 1,
      participantName: result.firstPlaceName,
      teamName: result.division.name,
      point: 0,
      grade: "",
      prize: "FIRST",
    });
  }
  if (result.secondPlaceName) {
    winners.push({
      rank: 2,
      participantName: result.secondPlaceName,
      teamName: result.secondPlaceDivision?.name ?? result.division.name,
      point: 0,
      grade: "",
      prize: "SECOND",
    });
  }
  if (result.thirdPlaceName) {
    winners.push({
      rank: 3,
      participantName: result.thirdPlaceName,
      teamName: result.thirdPlaceDivision?.name ?? result.division.name,
      point: 0,
      grade: "",
      prize: "THIRD",
    });
  }

  if (winners.length === 0) notFound();

  const styles = {
    first:  { bg: s?.firstBg  ?? null, textColor: s?.firstTextColor  ?? "#ffffff", overlay: s?.firstOverlay  ?? 0.3, font: s?.firstFont  ?? "serif", customCss: s?.firstCustomCss  ?? null, layout: s?.firstLayout  ?? null },
    second: { bg: s?.secondBg ?? null, textColor: s?.secondTextColor ?? "#ffffff", overlay: s?.secondOverlay ?? 0.3, font: s?.secondFont ?? "serif", customCss: s?.secondCustomCss ?? null, layout: s?.secondLayout ?? null },
    third:  { bg: s?.thirdBg  ?? null, textColor: s?.thirdTextColor  ?? "#ffffff", overlay: s?.thirdOverlay  ?? 0.3, font: s?.thirdFont  ?? "serif", customCss: s?.thirdCustomCss  ?? null, layout: s?.thirdLayout  ?? null },
  };

  return <CertificatePrintSheet competition={competition} winners={winners} styles={styles} />;
}
