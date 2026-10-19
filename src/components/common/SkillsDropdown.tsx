"use client";

import { useListNavigation } from "@/lib/hooks/useListNavigation";
import { useState } from "react";
import { Dropdown } from "./Dropdown/Dropdown";
import { Skill } from "@/database/generated/enums";
import { DropdownOption } from "./Dropdown/DropdownOption";
import { DropdownSearchField } from "./Dropdown/DropdownSearchField";
import { BookmarkIcon } from "@/components/icons";
import {
  Control,
  FieldValues,
  Path,
  useController,
} from "react-hook-form";
import { skillMapper } from "@/utils/mappers";

const SKILLS = Object.values(Skill);

interface SkillsDropdownProps<T extends FieldValues & { skills?: Skill[] }> {
  control: Control<T>;
  isLoading: boolean;
  error?: string;
  label: string;
}

export function SkillsDropdown<T extends FieldValues & { skills?: Skill[] }>({
  control,
  label,
  isLoading,
  error,
}: SkillsDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const { field } = useController({ name: "skills" as Path<T>, control });

  const selectedSkills: Skill[] = field.value ?? [];
  const filteredSkills = SKILLS.filter((skill) =>
    skillMapper[skill].toLowerCase().startsWith(search.toLowerCase()),
  );

  const addSkill = (skill: Skill) => {
    if (selectedSkills.includes(skill)) return;

    field.onChange([...selectedSkills, skill]);
    setActiveIndex(0);
    setSearch("");
  }
  const { activeIndex, setActiveIndex, itemsRef, handleKeyDown } =
    useListNavigation(
      filteredSkills.length,
      isOpen,
      (idx) => {
        const skill = filteredSkills[idx];
        if (skill) addSkill(skill);
      },
      () => setIsOpen((prev) => !prev),
    );

  return (
    <Dropdown
      Icon={BookmarkIcon}
      label={label}
      disabled={isLoading}
      error={error}
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
          controls="skills"
          placeholder="Digite uma habilidade"
        />
      }
    >
      {filteredSkills.map((skill, idx) => (
        <DropdownOption
          activeIndex={activeIndex}
          index={idx}
          isSelected={selectedSkills.includes(skill)}
          onOptionClick={() => {
            if (selectedSkills.includes(skill)) return;

            setActiveIndex(0);
            setSearch("");
            field.onChange([...field.value, skill]);
            setIsOpen(false);
          }}
          ref={(el) => {
            itemsRef.current[idx] = el;
          }}
          key={skill}
        >
          {skillMapper[skill]}
        </DropdownOption>
      ))}
    </Dropdown>
  );
}
