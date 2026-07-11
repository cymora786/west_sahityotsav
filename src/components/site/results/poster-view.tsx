"use client";

import * as React from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Download,
  Share2,
  ImageDown,
  Expand,
  Copy,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { SITE_NAME } from "@/lib/constants";
import {
  POSTER_COMPONENTS,
  POSTER_TEMPLATES,
  resolveTemplateKey,
  CustomLayoutPoster,
  type PosterTemplateKey,
  type ResultDetail,
} from "@/components/site/results/poster-templates";
import { cn } from "@/lib/utils";
import type { getPosterTemplates } from "@/lib/queries";

const TEMPLATE_PREVIEW_CLASSNAMES: Record<PosterTemplateKey, string> = {
  classic: "bg-gradient-to-br from-blue-100 to-blue-300",
  modern: "bg-gradient-to-br from-[#1d4e8f] to-[#2e6ab1]",
  minimal: "bg-gradient-to-br from-neutral-50 to-neutral-200 border",
  festive: "bg-gradient-to-br from-amber-100 to-blue-100",
  bold: "bg-gradient-to-br from-[#2e6ab1] to-slate-900",
};

type PosterTemplate = Awaited<ReturnType<typeof getPosterTemplates>>[number];

type ShareSettings = {
  whatsappTemplate?: string | null;
  instagramCaption?: string | null;
};

function applyTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

export function PosterView({
  result,
  templates,
  shareSettings,
  customPosterImage,
}: {
  result: ResultDetail;
  templates: PosterTemplate[];
  shareSettings?: ShareSettings;
  customPosterImage?: string | null;
}) {
  const posterRef = React.useRef<HTMLDivElement>(null);
  // Track selection by DB template id to avoid key collision when names don't match hardcoded keys
  const [selectedId, setSelectedId] = React.useState<string>(
    result.template?.id ?? templates[0]?.id ?? ""
  );

  const selectedTemplate = React.useMemo(
    () => templates.find((t) => t.id === selectedId) ?? result.template,
    [selectedId, templates, result.template]
  );

  const templateKey: PosterTemplateKey = resolveTemplateKey(selectedTemplate?.name);
  const PosterComponent = POSTER_COMPONENTS[templateKey];
  const displayResult: ResultDetail = { ...result, template: selectedTemplate };
  const useCustomLayout = Boolean(selectedTemplate?.layout);

  const handleDownload = async (type: "png" | "jpeg") => {
    if (!posterRef.current) return;
    const { toPng, toJpeg } = await import("html-to-image");
    const dataUrl =
      type === "png"
        ? await toPng(posterRef.current, { pixelRatio: 2 })
        : await toJpeg(posterRef.current, { pixelRatio: 2, quality: 0.95 });
    const link = document.createElement("a");
    link.download = `${result.item.name.replace(/\s+/g, "-").toLowerCase()}-result.${type}`;
    link.href = dataUrl;
    link.click();
  };

  const handleDownloadPdf = async () => {
    if (!posterRef.current) return;
    const { toPng } = await import("html-to-image");
    const jspdfModule = await import("jspdf");
    const JsPDF = jspdfModule.jsPDF ?? jspdfModule.default;
    const dataUrl = await toPng(posterRef.current, { pixelRatio: 2 });
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => { img.onload = resolve; });
    const pdf = new JsPDF({
      orientation: img.width > img.height ? "landscape" : "portrait",
      unit: "px",
      format: [img.width, img.height],
    });
    pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
    pdf.save(`${result.item.name.replace(/\s+/g, "-").toLowerCase()}-result.pdf`);
  };

  const [shareUrl, setShareUrl] = React.useState("");
  React.useEffect(() => { setShareUrl(window.location.href); }, []);

  const shareVars: Record<string, string> = {
    competition: result.item.name,
    category: result.category.name,
    winner1: result.firstPlaceName ?? result.division.name ?? "",
    winner2: result.secondPlaceName ?? "",
    winner3: result.thirdPlaceName ?? "",
    team1: result.division.name ?? "",
    team2: result.secondPlaceDivision?.name ?? "",
    team3: result.thirdPlaceDivision?.name ?? "",
    url: shareUrl,
  };

  const defaultWhatsapp = [
    `*${result.item.name}* - ${result.category.name}`,
    `*${SITE_NAME}*`,
    ``,
    `* 1st: ${shareVars.winner1}`,
    result.secondPlaceName ? `* 2nd: ${result.secondPlaceName}` : null,
    result.thirdPlaceName ? `* 3rd: ${result.thirdPlaceName}` : null,
    ``,
    `View result: ${shareUrl}`,
  ].filter(Boolean).join("\n");

  const shareText = shareSettings?.whatsappTemplate
    ? applyTemplate(shareSettings.whatsappTemplate, shareVars)
    : defaultWhatsapp;

  const instagramText = shareSettings?.instagramCaption
    ? applyTemplate(shareSettings.instagramCaption, shareVars)
    : shareUrl;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };

  const handleShareWhatsapp = async () => {
    if (posterRef.current) {
      try {
        const { toPng } = await import("html-to-image");
        const dataUrl = await toPng(posterRef.current, { pixelRatio: 2 });
        const blob = await (await fetch(dataUrl)).blob();
        const fileName = `${result.item.name.replace(/\s+/g, "-").toLowerCase()}-result.png`;
        const file = new File([blob], fileName, { type: "image/png" });

        if (navigator.canShare?.({ files: [file] })) {
          // Copy caption to clipboard first so user can paste it as WhatsApp caption
          try { await navigator.clipboard.writeText(shareText); } catch {}
          // Share image only — text in navigator.share causes WhatsApp to send two separate messages
          await navigator.share({ files: [file] });
          toast.success("Caption copied to clipboard — paste it as your WhatsApp caption");
          return;
        }

        // Desktop: download image + open WhatsApp text link
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        link.click();
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const handleShareInstagram = async () => {
    await navigator.clipboard.writeText(instagramText);
    toast.success("Caption copied — paste it in your Instagram post or story");
    window.open("https://www.instagram.com/", "_blank");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Poster preview */}
      <div className="group relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
        <div ref={posterRef} className="aspect-[4/5] w-full">
          {customPosterImage ? (
            <img
              src={customPosterImage}
              alt={`${result.item.name} poster`}
              className="w-full h-full object-cover"
            />
          ) : useCustomLayout ? (
            <CustomLayoutPoster result={displayResult} />
          ) : (
            <PosterComponent result={displayResult} />
          )}
        </div>

        {/* Expand overlay button */}
        <Dialog>
          <DialogTrigger
            render={
              <button
                type="button"
                className="absolute inset-0 flex items-end justify-end p-4 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="View full poster"
              >
                <span className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  <Expand className="size-4" />
                  Full View
                </span>
              </button>
            }
          />
          <DialogContent className="max-w-lg p-2">
            <DialogTitle className="sr-only">
              {result.item.name} — {result.category.name} poster
            </DialogTitle>
            <div className="aspect-[4/5] overflow-hidden rounded-xl">
              {customPosterImage ? (
                <img
                  src={customPosterImage}
                  alt={`${result.item.name} poster`}
                  className="w-full h-full object-cover"
                />
              ) : useCustomLayout ? (
                <CustomLayoutPoster result={displayResult} />
              ) : (
                <PosterComponent result={displayResult} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Template picker — only show when no custom poster overrides */}
      {!customPosterImage && templates.length > 1 && (
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Choose Style
          </p>
          <div className="flex flex-wrap gap-2">
            {templates.map((tmpl) => {
              const key = resolveTemplateKey(tmpl.name);
              const thumbnail = tmpl.thumbnail || tmpl.backgroundImage;
              const active = selectedId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedId(tmpl.id)}
                  className={cn(
                    "group flex flex-col items-center gap-2 rounded-xl border-2 p-2 transition-all w-24",
                    active
                      ? "border-primary shadow-sm shadow-primary/20"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <span
                    className={cn(
                      "relative aspect-[4/5] w-full overflow-hidden rounded-lg",
                      TEMPLATE_PREVIEW_CLASSNAMES[key] ?? "bg-muted"
                    )}
                  >
                    {thumbnail && (
                      <NextImage
                        src={thumbnail}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover opacity-60"
                      />
                    )}
                    {active && (
                      <span className="absolute inset-0 flex items-center justify-center bg-primary/20">
                        <span className="size-2 rounded-full bg-primary" />
                      </span>
                    )}
                  </span>
                  <span className={cn("text-[10px] font-semibold", active ? "text-primary" : "text-muted-foreground")}>
                    {tmpl.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Download */}
      <div className="rounded-xl border bg-muted/30 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Download Poster
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload("jpeg")}>
            <ImageDown className="size-4" />
            JPG
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload("png")}>
            <Download className="size-4" />
            PNG
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleDownloadPdf}>
            <FileDown className="size-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Share */}
      <div className="rounded-xl border bg-muted/30 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Share Result
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="flex-1 bg-[#25D366] text-white hover:bg-[#20b858]"
            onClick={handleShareWhatsapp}
          >
            <Share2 className="size-4" />
            WhatsApp
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-[#1877F2] text-white hover:bg-[#1668d4]"
            onClick={handleShareFacebook}
          >
            <Share2 className="size-4" />
            Facebook
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleShareInstagram}>
            <Share2 className="size-4" />
            Instagram
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleCopyLink}>
            <Copy className="size-4" />
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
}

