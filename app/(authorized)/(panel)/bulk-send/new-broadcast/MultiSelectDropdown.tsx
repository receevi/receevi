"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"


export type Option = {
  value: string,
  label: string,
}

export function MultiSelectDropdown({ options, name, displayName, className }: {
  options: Option[],
  name: string,
  displayName: string,
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([])
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])
  const [inputValue, setInputValue] = React.useState<string>('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Input type="hidden" value={inputValue} name={name} />
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between ${className ?? ''}`}
        >
          {selectedOptions.length > 0
            ? selectedValues.join(', ')
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
                  const foundValue = options.find((item) => item.value.toLowerCase() == currentValue.toLowerCase())
                  if (foundValue) {
                    let newSelectedOptions;
                    if (selectedOptions.some(item => item.value == option.value)) {
                      newSelectedOptions = selectedOptions.filter((item) => {
                        return item.value !== foundValue.value
                      })
                    } else {
                      newSelectedOptions = [...selectedOptions, foundValue]
                    }
                    setSelectedOptions(newSelectedOptions)
                    const newSelectedValues = newSelectedOptions.map(item => item.value)
                    setSelectedValues(newSelectedValues)
                    setInputValue(JSON.stringify(newSelectedValues))
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedOptions.some(item => item.value == option.value) ? "opacity-100" : "opacity-0"
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
