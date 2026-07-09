import { revalidatePath } from "next/cache";
import { getCertificateSettings, upsertCertificateSettings } from "@/lib/queries";
import { CertificateStyleForm } from "@/components/admin/certificate-style-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Certificate Styles — Admin" };

async function saveCertificateStyles(data: {
  firstBg?: string | null; secondBg?: string | null; thirdBg?: string | null;
  firstTextColor?: string | null; firstOverlay?: number | null; firstFont?: string | null;
  secondTextColor?: string | null; secondOverlay?: number | null; secondFont?: string | null;
  thirdTextColor?: string | null; thirdOverlay?: number | null; thirdFont?: string | null;
  firstCustomCss?: string | null; secondCustomCss?: string | null; thirdCustomCss?: string | null;
  firstLayout?: string | null; secondLayout?: string | null; thirdLayout?: string | null;
}) {
  "use server";
  await upsertCertificateSettings(data);
  revalidatePath("/admin/certificates");
}

export default async function CertificateSettingsPage() {
  const s = await getCertificateSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={
            <Link href="/admin/certificates">
              <ArrowLeft className="size-4" />
              Back to Certificates
            </Link>
          }
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Certificate Styles</h1>
        <p className="text-sm text-muted-foreground">
          Customise background image, text colour, overlay darkness, and font per prize position.
        </p>
      </div>

      <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <strong className="text-foreground">Tips:</strong> Upload an A4 landscape image (2480 × 1754 px). Adjust the
        overlay opacity so text is readable against the background. The preview is a rough approximation.
      </div>

      <CertificateStyleForm
        firstBg={s?.firstBg ?? null}
        secondBg={s?.secondBg ?? null}
        thirdBg={s?.thirdBg ?? null}
        firstTextColor={s?.firstTextColor ?? null}
        firstOverlay={s?.firstOverlay ?? null}
        firstFont={s?.firstFont ?? null}
        secondTextColor={s?.secondTextColor ?? null}
        secondOverlay={s?.secondOverlay ?? null}
        secondFont={s?.secondFont ?? null}
        thirdTextColor={s?.thirdTextColor ?? null}
        thirdOverlay={s?.thirdOverlay ?? null}
        thirdFont={s?.thirdFont ?? null}
        firstCustomCss={s?.firstCustomCss ?? null}
        secondCustomCss={s?.secondCustomCss ?? null}
        thirdCustomCss={s?.thirdCustomCss ?? null}
        firstLayout={s?.firstLayout ?? null}
        secondLayout={s?.secondLayout ?? null}
        thirdLayout={s?.thirdLayout ?? null}
        action={saveCertificateStyles}
      />
    </div>
  );
}
