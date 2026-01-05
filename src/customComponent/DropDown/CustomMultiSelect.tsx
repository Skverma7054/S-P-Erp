"use client";

import * as React from "react";

import Label from "../../components/form/Label";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type Option = {
  label: string;
  value: string;
};

interface Props {
  label?: string;
  options: Option[];
  value: string[];               // ✅ array
  onChange: (val: string[]) => void;
  placeholder?: string;
}

export default function CustomMultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
}: Props) {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {value.length > 0
              ? `${value.length} selected`
              : placeholder}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64">
          {options.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={value.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
