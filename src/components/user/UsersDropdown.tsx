"use client";

import { useListNavigation } from "@/lib/hooks/useListNavigation";
import { useEffect, useState } from "react";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { DropdownOption } from "../common/Dropdown/DropdownOption";
import { DropdownSearchField } from "../common/Dropdown/DropdownSearchField";
import { BookmarkIcon } from "@/components/icons";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
  getUsersByEmailPrefixAction,
  UserPublicResponsePayload,
} from "@/lib/modules/user";
import { UserProfile } from "./UserProfile";

type User = Pick<UserPublicResponsePayload, "name" | "email" | "id">;

interface UsersDropdownProps<T extends FieldValues & { members?: User[] }> {
  control: Control<T>;
  currentUserEmail: string;
  isLoading: boolean;
  error?: string;
  label: string;
}

export function UsersDropdown<T extends FieldValues & { members?: User[] }>({
  control,
  currentUserEmail,
  label,
  isLoading,
  error,
}: UsersDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>(error ?? "");
  const [search, setSearch] = useState<string>("");
  const { field } = useController({ name: "members" as Path<T>, control });
  const selectedUsers: User[] = field.value ?? [];
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    if (selectedUsers.includes(user)) return;

    field.onChange([...selectedUsers, user]);
    setActiveIndex(0);
    setSearch("");
  };
  const { activeIndex, setActiveIndex, itemsRef, handleKeyDown } =
    useListNavigation(
      filteredUsers.length,
      isOpen,
      (idx) => {
        const user = filteredUsers[idx];
        if (user) addUser(user);
      },
      () => setIsOpen((prev) => !prev),
    );

  useEffect(() => {
    if (!search) {
      setFilteredUsers([]);
      return;
    }

    const debounceId = setTimeout(async () => {
      try {
        const response = await getUsersByEmailPrefixAction(search);
        if (!response.success) {
          setSearchError("Não foi possível buscar usuários.");
          return;
        }

        setFilteredUsers(
          response.data.filter((u) => u.email !== currentUserEmail),
        );
      } catch (_err) {
        setSearchError("Não foi possível buscar usuários.");
      }
    }, 400);

    return () => clearTimeout(debounceId);
  }, [search]);

  return (
    <Dropdown
      Icon={BookmarkIcon}
      label={label}
      disabled={isLoading}
      error={searchError}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      field={
        <DropdownSearchField
          search={search}
          setSearch={setSearch}
          handleKeyDown={handleKeyDown}
          isOpen={isOpen}
          disabled={isLoading}
          onOpen={() => setIsOpen(true)}
          controls="members"
          placeholder="Digite o email do usuário"
        />
      }
    >
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user, idx) => {
          const selectedEmails = selectedUsers.map(({ email }) => email);

          return (
            <DropdownOption
              activeIndex={activeIndex}
              index={idx}
              isSelected={selectedEmails.includes(user.email)}
              onOptionClick={() => {
                if (selectedEmails.includes(user.email)) return;

                setActiveIndex(0);
                setSearch("");
                field.onChange([...field.value, user]);
                setIsOpen(false);
              }}
              ref={(el) => {
                itemsRef.current[idx] = el;
              }}
              key={user.email}
            >
              <UserProfile user={user} type="list" />
            </DropdownOption>
          );
        })
      ) : (
        <span className="block p-1 text-sm italic">
          Nenhum usuário encontrado
        </span>
      )}
      {}
    </Dropdown>
  );
}
