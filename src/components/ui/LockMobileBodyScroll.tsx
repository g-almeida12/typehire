"use client";

import { useEffect } from "react";

const MOBILE_SCREEN_WIDTH = 767;

export function LockMobileBodyScroll() {
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_SCREEN_WIDTH}px)`,
    );
    if (!mediaQuery.matches) return;

    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prev;
      document.body.style.overflow = prev;
    };
  }, []);

  return null;
}
