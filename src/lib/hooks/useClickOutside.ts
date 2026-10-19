import { type RefObject, useEffect } from "react";

export function useClickOutside(
  containerRef: RefObject<HTMLElement | null>,
  onClickOutside: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef, onClickOutside]);
}
