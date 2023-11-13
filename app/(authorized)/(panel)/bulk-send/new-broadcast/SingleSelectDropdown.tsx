"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"


export type SelectOption = {
  value: string,
  label: string,
}

export const emptyOption: SelectOption = { value: '', label: '' }

export function SingleSelectDropdown({ options, name, displayName, className, onChange, value }: {
  options: SelectOption[],
  name: string,
  displayName: string,
  className?: string,
  value: SelectOption,
  onChange?: (option: SelectOption) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Input type="hidden" value={value?.value} name={name} />
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between ${className ?? ''}`}
        >
          {value != emptyOption
            ? value.label
            : `Select ${displayName}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={`Search ${displayName}...`} />
          <CommandEmpty>No {displayName} found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  const newValue = options.find((item) => item.value.toLowerCase() == currentValue.toLowerCase())
                  if (newValue) {
                    onChange?.apply(null, [newValue])
                    setOpen(false)
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value?.value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
