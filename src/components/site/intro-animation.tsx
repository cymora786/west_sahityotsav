"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SsfLogoMark } from "@/components/site/ssf-logo";

export function IntroAnimation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("intro-played")) return;
    setVisible(true);

    // Total animation: logo (0.7s) + hold (0.8s) + exit starts — overlay exits at ~2s
    const timer = setTimeout(() => {
      sessionStorage.setItem("intro-played", "1");
      setVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #3B4FD8 0%, #5B3FD8 40%, #7B2FD8 70%, #9B2FBF 100%)",
          }}
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Logo bursts in */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <SsfLogoMark className="h-20 w-auto sm:h-28" white />
          </motion.div>

          {/* Tagline fades up */}
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <p className="text-base font-bold tracking-[0.2em] uppercase sm:text-xl">
              SSF Malappuram West
            </p>
            <p
              className="mt-1 text-2xl font-extrabold sm:text-4xl"
              style={{ color: "#ff6b8a" }}
            >
              Sahityotsav 2026
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
