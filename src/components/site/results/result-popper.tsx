"use client";

import * as React from "react";
import confetti from "canvas-confetti";

export function ResultPopper() {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Left burst
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#FFD700", "#CE416B", "#2355b8", "#ffffff", "#ff6b6b"],
        zIndex: 9999,
      });
      // Right burst
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#FFD700", "#CE416B", "#2355b8", "#ffffff", "#ff6b6b"],
        zIndex: 9999,
      });
      // Center top shower
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 90,
          spread: 80,
          origin: { x: 0.5, y: 0 },
          gravity: 0.8,
          colors: ["#FFD700", "#CE416B", "#2355b8", "#ffffff"],
          zIndex: 9999,
        });
      }, 300);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
