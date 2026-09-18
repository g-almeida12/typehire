"use client";

import { MailIcon } from "@/components/icons";
import { UserPublicResponsePayload } from "@/lib/schemas";
import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserProfile } from "../common/UserProfile";
import { getUsersByEmailPrefix } from "@/lib/actions";

interface UsersDropdownSelectProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  selectedUsersEmail: string[];
  onUserClick: (user: UserPublicResponsePayload) => void;
}

export const UsersDropdownSelect = forwardRef<
  HTMLInputElement,
  UsersDropdownSelectProps
>(({ label, selectedUsersEmail, onUserClick, ...props }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [matchedUsers, setMatchedUsers] = useState<UserPublicResponsePayload[]>(
    [],
  );

  // Scroll the dropdown to display the selected option
  useEffect(() => {
    if (isOpen && optionsRef.current[selectedIndex]) {
      optionsRef.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isOpen, selectedIndex]);

  // Close the dropdown  when the user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle the debounce for get users
  useEffect(() => {
    if (!search) {
      setMatchedUsers([]);
      return;
    }

    const debounceId = setTimeout(async () => {
      try {
        const response = await getUsersByEmailPrefix(search);
        if (!response.success) {
          setError("Não foi possível buscar usuários.");
          return;
        }

        setMatchedUsers(response.data);
      } catch (_err) {
        setError("Não foi possível buscar usuários.");
      }
    }, 400);

    return () => clearTimeout(debounceId);
  }, [search]);

  // Call the callback function and reset the input
  const handleUserClick = (user: UserPublicResponsePayload) => {
    onUserClick(user);
    setSearch("");
    setIsOpen(false);
    setSelectedIndex(0);
  };

  // Handle the native actions for navigation inside the dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < matchedUsers.length - 1 ? prev + 1 : 0,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : matchedUsers.length - 1,
        );
        break;

      case "Enter":
        e.preventDefault();
        if (
          matchedUsers[selectedIndex] &&
          !selectedUsersEmail.includes(matchedUsers[selectedIndex].email)
        ) {
          handleUserClick(matchedUsers[selectedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="group w-full flex flex-col items-start" ref={containerRef}>
      <label
        htmlFor={props.id}
        className="w-full mb-1 text-left text-sm text-background-300"
      >
        {label}
      </label>

      {/* Input */}
      <div
        className={`w-full flex flex-row gap-2 items-center justify-between border-2 px-2 py-1 group-hover:border-background-300 group-focus-within:bg-background-300 group-focus-within:text-background-800 group-focus-within:border-background-300 transition-colors ${isOpen ? "rounded-md rounded-b-none bg-background-300 text-background-800 border-background-300" : "rounded-md border-background-800 bg-background-800"}`}
      >
        <div className="flex flex-row gap-2 w-full">
          <MailIcon
            size={24}
            className={`shrink-0 ${isOpen ? "text-background-800" : "text-background-400"}`}
          />
          <input
            {...props}
            className="w-full focus:outline-none"
            ref={ref}
            value={search}
            onFocus={() => {
              setIsOpen(true);
              setSelectedIndex(0);
            }}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={label}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="w-full max-h-70 overflow-y-scroll rounded-b-md border-t border-background-700 bg-background-300 text-background-700"
          id={label}
          role="listbox"
        >
          {matchedUsers.length === 0 ? (
            <div className="w-full bg-background-400 text-background-800 italic">
              <p className="px-2 py-1 text-sm select-none font-medium">
                Nenhuma usuário encontrado.
              </p>
            </div>
          ) : (
            <ul>
              {matchedUsers.map((user, idx) => {
                const isAdded = selectedUsersEmail.includes(user.email);
                const styles = isAdded
                  ? idx === selectedIndex
                    ? "bg-green-600 text-green-950"
                    : "bg-green-500 text-green-950"
                  : idx === selectedIndex
                    ? "bg-background-500 text-background-900"
                    : "hover:bg-background-400 hover:text-background-800";

                return (
                  <li
                    className={`w-full ${styles} px-2 py-1 cursor-pointer`}
                    onClick={() => {
                      if (!isAdded) {
                        handleUserClick(user);
                      }
                    }}
                    ref={(el) => {
                      optionsRef.current[idx] = el;
                    }}
                    key={`select-${idx}`}
                    role="option"
                  >
                    <UserProfile user={user} type="list" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      {error && (
        <p className="text-left text-sm text-red-500 w-full">{error}</p>
      )}
    </div>
  );
});
