import { notFound } from "next/navigation";
import { getPublishedCompetitions, getCompetitionResults } from "@/lib/sahityotsav-api";
import { getCertificateSettings } from "@/lib/queries";
import { CertificatePrintSheet } from "@/components/admin/certificate-print-sheet";

export default async function CertificatePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [competitions, results, s] = await Promise.all([
    getPublishedCompetitions(),
    getCompetitionResults(id),
    getCertificateSettings(),
  ]);

  const comp = competitions?.find((c) => c.id === id);
  if (!comp || !results || results.length === 0) notFound();

  const winners = results.filter((r) => r.rank <= 3);

  const styles = {
    first:  { bg: s?.firstBg  ?? null, textColor: s?.firstTextColor  ?? "#ffffff", overlay: s?.firstOverlay  ?? 0.3, font: s?.firstFont  ?? "serif", customCss: s?.firstCustomCss  ?? null, layout: s?.firstLayout  ?? null },
    second: { bg: s?.secondBg ?? null, textColor: s?.secondTextColor ?? "#ffffff", overlay: s?.secondOverlay ?? 0.3, font: s?.secondFont ?? "serif", customCss: s?.secondCustomCss ?? null, layout: s?.secondLayout ?? null },
    third:  { bg: s?.thirdBg  ?? null, textColor: s?.thirdTextColor  ?? "#ffffff", overlay: s?.thirdOverlay  ?? 0.3, font: s?.thirdFont  ?? "serif", customCss: s?.thirdCustomCss  ?? null, layout: s?.thirdLayout  ?? null },
  };

  return <CertificatePrintSheet competition={comp} winners={winners} styles={styles} />;
}
