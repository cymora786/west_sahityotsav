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
  type PosterTemplateKey,
  type ResultDetail,
} from "@/components/site/results/poster-templates";
import { cn } from "@/lib/utils";
import type { getPosterTemplates } from "@/lib/queries";

const TEMPLATE_PREVIEW_CLASSNAMES: Record<PosterTemplateKey, string> = {
  classic: "bg-gradient-to-br from-emerald-100 to-emerald-300",
  modern: "bg-gradient-to-br from-emerald-700 to-emerald-950",
  minimal: "bg-gradient-to-br from-neutral-50 to-neutral-200 border",
  festive: "bg-gradient-to-br from-amber-100 to-emerald-100",
  bold: "bg-gradient-to-br from-emerald-600 to-slate-900",
};

type PosterTemplate = Awaited<ReturnType<typeof getPosterTemplates>>[number];

export function PosterView({
  result,
  templates,
}: {
  result: ResultDetail;
  templates: PosterTemplate[];
}) {
  const posterRef = React.useRef<HTMLDivElement>(null);
  const [templateKey, setTemplateKey] = React.useState<PosterTemplateKey>(
    resolveTemplateKey(result.template?.name)
  );

  const templatesByKey = React.useMemo(() => {
    const map = new Map<PosterTemplateKey, PosterTemplate>();
    for (const template of templates) {
      map.set(resolveTemplateKey(template.name), template);
    }
    return map;
  }, [templates]);

  const PosterComponent = POSTER_COMPONENTS[templateKey];
  const selectedTemplate = templatesByKey.get(templateKey) ?? result.template;
  const displayResult: ResultDetail = { ...result, template: selectedTemplate };

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

  const shareText = [
    `🏆 *${result.item.name}* — ${result.category.name}`,
    `📍 *${SITE_NAME}*`,
    ``,
    `🥇 1st: *${result.firstPlaceName ?? result.division.name}*`,
    result.secondPlaceName ? `🥈 2nd: *${result.secondPlaceName}*` : null,
    result.thirdPlaceName ? `🥉 3rd: *${result.thirdPlaceName}*` : null,
    ``,
    `🔗 View full result:`,
  ]
    .filter(Boolean)
    .join("\n");
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

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
        const file = new File(
          [blob],
          `${result.item.name.replace(/\s+/g, "-").toLowerCase()}-result.png`,
          { type: "image/png" }
        );
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${result.item.name} — ${SITE_NAME}`,
            text: shareText,
            url: shareUrl,
          });
          return;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
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
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied — paste it in your Instagram story or bio");
    window.open("https://www.instagram.com/", "_blank");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Poster preview */}
      <div className="group relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
        <div ref={posterRef} className="aspect-[4/5] w-full">
          <PosterComponent result={displayResult} />
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
              <PosterComponent result={displayResult} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Template picker */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Choose Style
        </p>
        <div className="grid grid-cols-5 gap-2">
          {POSTER_TEMPLATES.map((template) => {
            const templateData = templatesByKey.get(template.key);
            const thumbnail = templateData?.thumbnail || templateData?.backgroundImage;
            const active = templateKey === template.key;
            return (
              <button
                key={template.key}
                type="button"
                onClick={() => setTemplateKey(template.key)}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-xl border-2 p-1.5 transition-all",
                  active
                    ? "border-primary shadow-sm shadow-primary/20"
                    : "border-transparent hover:border-border"
                )}
              >
                <span
                  className={cn(
                    "relative aspect-[4/5] w-full overflow-hidden rounded-lg",
                    TEMPLATE_PREVIEW_CLASSNAMES[template.key]
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
                  {template.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
