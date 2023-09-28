"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { cn } from "../lib/utils";

type Option = {
  label: string;
  value: string;
};

type CommonProps = {
  options: Option[];
};

type SingleSelectProps = CommonProps & {
  isMulti?: false;
  value?: Option;
  onChange: (value: Option) => void;
};

type MultiSelectProps = CommonProps & {
  isMulti: true;
  value: Option[];
  onChange: (value: Option[]) => void;
};

type Props = SingleSelectProps | MultiSelectProps;

export const Combobox = React.forwardRef<
  React.ElementRef<typeof Popover>,
  Props
>(({ onChange, options, value, isMulti }: Props, ref) => {
  const [open, setOpen] = React.useState(false);

  const valuesIDs = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((option) => option.value);
    }
    if (value?.value) {
      return [value?.value];
    }
    return [];
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild ref={ref}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-full justify-between px-3 text-start h-auto"
        >
          {Array.isArray(value) &&
            value.length > 0 &&
            value.map((option) => option.label).join(", ")}
          {!Array.isArray(value) && value?.value && value.label}
          {!Array.isArray(value) && !value?.value && "Выбрать..."}
          {Array.isArray(value) && value.length === 0 && "Выбрать..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Поиск" />
          <CommandEmpty>Ничего не найдено...</CommandEmpty>
          <CommandGroup className="w-full">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  if (isMulti) {
                    const updatedValue = valuesIDs.includes(option.value)
                      ? value.filter((v) => v.value !== option.value)
                      : [...value, option];
                    onChange(updatedValue);
                  } else {
                    onChange(option);
                    setOpen(false);
                  }
                }}
              >
                <Check
                  className={cn("mr-2 h-4 w-4 opacity-0", {
                    "opacity-100": valuesIDs.includes(option.value),
                  })}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
