import { useEffect, useRef, useState } from "react";

export function useListNavigation(
  count: number,
  isOpen: boolean,
  onSelect: (index: number) => void,
  onClose: () => void,
) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  // Scroll the list to display the selected option
  useEffect(() => {
    if (isOpen && itemsRef.current[activeIndex]) {
      itemsRef.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isOpen, activeIndex]);

  // Handle the native actions for navigation inside the list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < count - 1 ? prev + 1 : 0));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : count - 1));
        break;

      case "Enter":
        e.preventDefault();
        onSelect(activeIndex);
        onClose();
        break;

      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  return { activeIndex, setActiveIndex, itemsRef, handleKeyDown };
}
