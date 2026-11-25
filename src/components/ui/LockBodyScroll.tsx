"use client";

import { useEffect } from "react";

type Devices = "MOBILE" | "TABLET" | "DESKTOP";
const MEDIA_BREAK_POINTS: Record<Devices, number> = {
  MOBILE: 767,
  TABLET: 1020,
  DESKTOP: 1980,
};

export function LockBodyScroll({ device }: { device: Devices }) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MEDIA_BREAK_POINTS[device]) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "auto";
        document.body.style.overflow = "auto";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      document.documentElement.removeEventListener("resize", handleResize);
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, [device]);

  return null;
}
