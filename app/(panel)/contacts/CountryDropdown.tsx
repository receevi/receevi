"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { Noop, RefCallBack, useForm } from "react-hook-form"
import * as z from "zod"

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState, forwardRef } from "react"
import countryCodeListUntyped from "@/lib/countryCodeList.json"
import { ScrollArea } from "@/components/ui/scroll-area"

type CountryType = {
  code: string
  name: string
  phoneCode: string,
  displayValue: string,
}

const countryCodeList = countryCodeListUntyped as CountryType[]

countryCodeList.forEach((country: CountryType) => {
  country.displayValue = `(+${country.phoneCode}) ${country.name}`
})

export const countryFormType = z.object({
  code: z.string(),
  name: z.string(),
  phoneCode: z.string(),
})

type CountryDropdownValues = z.infer<typeof countryFormType>

type CountryDropdownProps = {
  onChange: (value: CountryDropdownValues) => void,
  onBlur: Noop,
  value: CountryDropdownValues,
  ref: RefCallBack,
}

const CountryDropdown = forwardRef<HTMLInputElement, CountryDropdownProps>(
  (props, ref) => {
    const [open, setOpen] = useState(false)

    return (
      <FormItem className="flex flex-col">
        <FormLabel>Country Code</FormLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[104px] justify-between",
                  !props.value && "text-muted-foreground"
                )}
              >
                <span className="text-center flex-1">
                  {props.value
                    ? `+${props.value.phoneCode}`
                    : "Select country"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command ref={ref}>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {countryCodeList.map((country) => (
                    <CommandItem
                      value={country.displayValue}
                      key={country.code}
                      onSelect={(value) => {
                        const selectedCountry: CountryType | undefined = countryCodeList.find(
                          (country) => country.displayValue.toLowerCase() === value.toLowerCase()
                        )
                        if (selectedCountry) {
                          props.onChange(selectedCountry)
                          setOpen(false)
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          country.code === props.value?.code
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {country.displayValue}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )
  }
)
CountryDropdown.displayName = "CountryDropdown"
export { CountryDropdown };
