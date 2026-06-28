import Link from "next/link";
import Image from "next/image";
import { getGallery } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Trophy, BarChart3 } from "lucide-react";

export async function Hero() {
  const [heroImage] = await getGallery(1);

  return (
    <section className="relative isolate overflow-hidden bg-emerald-950">
      <div className="absolute inset-0">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.caption ?? "SSF Malappuram West Sahityotsav"}
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/90 to-emerald-900/70" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute top-1/2 -left-24 size-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-200">
            <Trophy className="size-4" />
            West Sahityotsav 2026
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            SSF Malappuram West{" "}
            <span className="text-amber-400">Sahityotsav 2026</span>
          </h1>
          <p className="mt-6 text-lg text-emerald-100/80">
            A platform for young minds to express, compete and excel in
            literature and culture. 10 divisions, 5 categories, 90+ items
            and 2000+ participants competing for district glory.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-amber-950 shadow-lg shadow-amber-400/40 transition-transform hover:scale-105 hover:from-amber-300 hover:to-orange-400"
              nativeButton={false}
              render={
                <Link href="/results">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-red-600" />
                  </span>
                  Live Results
                  <Trophy className="size-4" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-emerald-400/40 bg-white/5 text-white hover:bg-white/10"
              nativeButton={false}
              render={
                <Link href="/standings">
                  <BarChart3 className="size-4" />
                  Team Standings
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
