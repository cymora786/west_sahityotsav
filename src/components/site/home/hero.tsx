"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Layers, Users, CalendarDays, Trophy, Search, ArrowRight, Radio, BarChart3, ImageIcon, X } from "lucide-react";
import { EVENT_STATS } from "@/lib/constants";
import type { ApiCompetition } from "@/lib/sahityotsav-api";

const LIVE_STREAM_URL = "https://www.youtube.com/watch?v=9XDh357XfXc";

const CTA_BUTTONS = [
  { label: "Live Stream", href: LIVE_STREAM_URL, icon: Radio, external: true },
  { label: "Results", href: "/results", icon: Trophy, external: false },
  { label: "Standings", href: "/standings", icon: BarChart3, external: false },
  { label: "Gallery", href: "/gallery", icon: ImageIcon, external: false },
];

const STATS = [
  { label: "Divisions", value: EVENT_STATS.divisions, icon: Building2 },
  { label: "Competitions", value: `${EVENT_STATS.items}+`, icon: Layers },
  { label: "Participants", value: `${EVENT_STATS.participants.toLocaleString()}+`, icon: Users },
  { label: "Days", value: EVENT_STATS.days, icon: CalendarDays },
  { label: "Categories", value: EVENT_STATS.categories, icon: Trophy },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ competitions = [] }: { competitions?: ApiCompetition[] }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return competitions
      .filter((c) =>
        c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      )
      .slice(0, 7);
  }, [query, competitions]);

  const showDropdown = focused && suggestions.length > 0;

  function selectSuggestion(comp: ApiCompetition) {
    setQuery(comp.name);
    router.push(`/results/${comp.id}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
      return;
    }
    if (query.trim()) router.push(`/results?q=${encodeURIComponent(query.trim())}`);
    else router.push("/results");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    }
  }

  return (
    <section
      className="relative isolate overflow-hidden flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #3B4FD8 0%, #5B3FD8 40%, #7B2FD8 70%, #9B2FBF 100%)",
        minHeight: "100dvh",
      }}
    >
      {/* Background SVG */}
      <motion.div
        className="pointer-events-none absolute inset-0 origin-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/images/background.svg"
          alt=""
          fill
          className="object-cover "
          priority
        />
      </motion.div>

      {/* Dark overlay */}
     {/*  <div className="pointer-events-none absolute inset-0 bg-black/30" /> */}

      {/* Centered hero content */}
      <div className="relative mx-auto flex flex-1 max-w-7xl flex-col items-center justify-center px-4 pt-24 pb-28 sm:px-6 lg:px-8">

        <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-0">

          {/* Left — Because WE are */}
          <motion.div
            className="flex flex-1 flex-col items-center text-center"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            <div className="hero-float-a will-change-transform">
              <div className="hero-text-shimmer">
                <Image
                  src="/images/because-we-are.svg"
                  alt="Because WE are"
                  width={340}
                  height={218}
                  className="w-56 max-w-xs sm:w-72 lg:w-80 xl:w-[340px] drop-shadow-[0_8px_32px_rgba(255,255,255,0.15)]"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Vertical divider */}
          <motion.div
            className="hidden lg:block mx-10 xl:mx-16"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            style={{ transformOrigin: "top" }}
          >
            <div className="h-52 w-px bg-white/40" />
          </motion.div>

          {/* Horizontal divider mobile */}
          <motion.div
            className="block w-3/4 h-px bg-white/30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />

          {/* Right — sahi-2026-date */}
          <motion.div
            className="flex flex-1 flex-col items-center text-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
          >
            <div className="hero-float-b will-change-transform">
              <div className="hero-text-shimmer" style={{ animationDelay: "-1s" }}>
                <Image
                  src="/images/sahi-2026-date.svg"
                  alt="Sahityotsav 2026 July 9-12 Edappal"
                  width={520}
                  height={193}
                  className="w-72 max-w-sm sm:w-96 lg:w-[440px] xl:w-[520px] drop-shadow-[0_8px_32px_rgba(255,255,255,0.12)]"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA row */}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } },
          }}
        >
          {CTA_BUTTONS.map(({ label, href, icon: Icon, external }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
              }}
            >
              <Link
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-2 rounded-full bg-[#ce416b] px-6 py-3 text-sm font-bold text-white shadow-md shadow-black/30 transition-all hover:scale-105 hover:bg-[#b83460] hover:shadow-lg"
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="mt-10 w-full max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease }}
        >
          <form onSubmit={handleSearch}>
            <motion.div
              animate={focused ? { scale: 1.03 } : { scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              {/* Input row */}
              <div className={`relative flex items-center overflow-hidden shadow-2xl shadow-black/40 ${showDropdown ? "rounded-t-2xl" : "rounded-2xl"}`}>
                {/* Glow ring on focus */}
                <AnimatePresence>
                  {focused && (
                    <motion.div
                      key="ring"
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ boxShadow: "0 0 0 3px rgba(200,255,255,0.35)" }}
                    />
                  )}
                </AnimatePresence>

                <Search className="absolute left-4 size-5 text-white/60 z-10 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search competitions, categories…"
                  className="w-full bg-white/15 py-4 pl-12 pr-36 text-white placeholder-white/50 backdrop-blur-md outline-none text-base"
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setActiveIndex(-1); inputRef.current?.focus(); }}
                    className="absolute right-28 text-white/50 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    <X className="size-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 flex items-center gap-1.5 rounded-xl bg-[#ce416b] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#b83460] hover:scale-105 active:scale-95"
                >
                  Search <ArrowRight className="size-4" />
                </button>
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.ul
                    ref={listRef}
                    key="suggestions"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 z-50 overflow-hidden rounded-b-2xl border-t border-white/10 bg-[#1a1a3a]/95 backdrop-blur-lg shadow-2xl shadow-black/50"
                  >
                    {suggestions.map((comp, i) => (
                      <li key={comp.id}>
                        <button
                          type="button"
                          onMouseDown={() => selectSuggestion(comp)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                            i === activeIndex ? "bg-white/15" : "hover:bg-white/10"
                          }`}
                        >
                          <Search className="size-3.5 shrink-0 text-white/40" />
                          <span className="flex-1 truncate text-sm text-white">
                            {comp.name}
                          </span>
                          <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">
                            {comp.category}
                          </span>
                        </button>
                      </li>
                    ))}
                    <li className="border-t border-white/10 px-4 py-2.5">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors"
                      >
                        <ArrowRight className="size-3" />
                        See all results for &ldquo;{query}&rdquo;
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          </form>

        </motion.div>
      </div>

      {/* Stats strip — pinned to bottom of banner */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-black/25 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1, ease }}
      >
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 gap-2">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center text-white">
                <Icon className="size-4 opacity-70" />
                <p className="text-lg font-extrabold leading-none sm:text-2xl">{value}</p>
                <p className="text-[10px] font-medium uppercase tracking-widest text-white/60 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
