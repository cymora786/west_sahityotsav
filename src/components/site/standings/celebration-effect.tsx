"use client";

import { useEffect } from "react";

export function CelebrationEffect() {
  useEffect(() => {
    let cancelled = false;

    async function fire() {
      const confetti = (await import("canvas-confetti")).default;

      if (cancelled) return;

      // Initial big burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#2e6ab1", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#fbbf24", "#ffffff"],
        gravity: 0.9,
        scalar: 1.1,
      });

      // Side cannons
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#fbbf24", "#f59e0b", "#2e6ab1", "#ffffff"],
          gravity: 0.85,
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#fbbf24", "#f59e0b", "#2e6ab1", "#ffffff"],
          gravity: 0.85,
        });
      }, 300);

      // Glitter burst
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.5 },
          ticks: 200,
          colors: ["#ffd700", "#fff176", "#ffe066", "#ffffff", "#2e6ab1"],
          shapes: ["circle"],
          scalar: 0.6,
          gravity: 0.6,
        });
      }, 700);

      // Final shimmer
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { x: 0.3, y: 0.4 },
          colors: ["#ffffff", "#fbbf24", "#2e6ab1"],
          scalar: 0.8,
          gravity: 0.7,
        });
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { x: 0.7, y: 0.4 },
          colors: ["#ffffff", "#fbbf24", "#2e6ab1"],
          scalar: 0.8,
          gravity: 0.7,
        });
      }, 1200);
    }

    fire();
    return () => { cancelled = true; };
  }, []);

  return null;
}
