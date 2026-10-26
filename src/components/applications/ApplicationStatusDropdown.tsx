import { Control, useController } from "react-hook-form";
import { ApplicationStatus } from "@/database/generated/enums";
import { useRef, useState } from "react";
import { useListNavigation } from "@/lib/hooks/useListNavigation";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { applicationStatusMapper } from "@/utils/mappers";
import { ApplicationUpdatePayload } from "@/lib/modules/application";

interface ApplicationStatusDropdownProps {
  control: Control<ApplicationUpdatePayload>;
  initialStatus: ApplicationStatus;
  onSelect: (status: ApplicationStatus) => void;
  isLoading: boolean;
  error: string | undefined;
}

const STATUSES = Object.values(ApplicationStatus);

export function ApplicationStatusDropdown({
  control,
  initialStatus,
  onSelect,
  isLoading,
  error,
}: ApplicationStatusDropdownProps) {
  const { field } = useController({ name: "status", control });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, handleKeyDown, itemsRef } = useListNavigation(
    STATUSES.length,
    isOpen,
    () => field.onChange(STATUSES[activeIndex]),
    () => setIsOpen(false),
  );

  useClickOutside(containerRef, () => setIsOpen(false));

  const tagColors: Record<ApplicationStatus, any> = {
    PENDING: { bg: "#FFD04D30", text: "#FFD04D" },
    REVIEW: { bg: "#4DFFE130", text: "#4DFFE1" },
    INTERVIEW: { bg: "#D34DFF30", text: "#D34DFF" },
    HIRED: { bg: "#22C22230", text: "#4DFF4D" },
    REJECTED: { bg: "#FF4D4D30", text: "#FF4D4D" },
  };
  const selectedStatus = field.value ?? initialStatus;

  return (
    <div
      className="relative group w-48 flex flex-col items-start"
      ref={containerRef}
    >
      <button
        className={`flex flex-row items-center justify-start gap-1 w-full px-2 py-1 text-left cursor-pointer ${isOpen ? "rounded-t-md" : "rounded-md"}`}
        style={{
          backgroundColor: tagColors[selectedStatus].bg,
          color: tagColors[selectedStatus].text,
        }}
        onClick={(e) => {
          if (isLoading) return;

          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={"status-dropdown"}
        type="button"
      >
        <ChevronDownIcon
          size={20}
          className={isOpen ? "rotate-180" : "rotate-0"}
        />
        <span className="text-sm font-medium">
          {applicationStatusMapper[selectedStatus]}
        </span>
      </button>

      {isOpen && !isLoading && (
        <ul
          className={`absolute z-50 top-full w-48 overflow-hidden rounded-b-md border-t bg-background-1000 ${isOpen ? "shadow-lg" : ""}`}
          role="listbox"
          id="status-dropdown"
        >
          {STATUSES.map((s, idx) => {
            if (s === "PENDING") return null;
            return (
              <li
                onClick={() => {
                  field.onChange(s);
                  setIsOpen(false);
                  onSelect(s);
                }}
                className="cursor-pointer"
                ref={(el) => {
                  itemsRef.current[idx] = el;
                }}
                aria-selected={s === selectedStatus}
                key={s}
              >
                <span
                  className="flex flex-row items-center gap-2 min-w-max w-full px-2 py-1"
                  style={{
                    backgroundColor: tagColors[s].bg,
                    color: tagColors[s].text,
                  }}
                >
                  {s === selectedStatus && <CheckIcon size={18} />}
                  <span className="text-sm font-medium">
                    {applicationStatusMapper[s]}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {error && (
        <p className="text-left text-sm text-red-500 w-full">{error}</p>
      )}
    </div>
  );
}
