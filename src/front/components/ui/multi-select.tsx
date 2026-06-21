"use client"

import * as React from "react"
import { X, ChevronsUpDown, Check } from "lucide-react"
import { Badge } from "@/front/components/ui/badge"
import { Button } from "@/front/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/front/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/front/components/ui/command"
import { cn } from "@/front/lib/utils"

export type MultiSelectOption = {
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
}

type MultiSelectProps = {
    options: MultiSelectOption[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    maxCount?: number
    className?: string
    disabled?: boolean
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Sélectionner...",
    maxCount = 3,
    className,
    disabled,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleToggle = (optionValue: string) => {
        const next = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue]
        onChange(next)
    }

    const handleRemove = (optionValue: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(value.filter((v) => v !== optionValue))
    }

    const selectedOptions = options.filter((o) => value.includes(o.value))
    const visibleOptions = selectedOptions.slice(0, maxCount)
    const overflow = selectedOptions.length - maxCount

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "h-auto min-h-9 w-full justify-between px-3 py-2 font-normal",
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedOptions.length === 0 && (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                        {visibleOptions.map((option) => (
                            <Badge
                                key={option.value}
                                variant="secondary"
                                className="gap-1 pr-1"
                            >
                                {option.icon && <option.icon className="size-3" />}
                                {option.label}
                                <button
                                    onClick={(e) => handleRemove(option.value, e)}
                                    className="ml-0.5 rounded-full outline-none hover:bg-secondary"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        ))}
                        {overflow > 0 && (
                            <Badge variant="secondary">+{overflow}</Badge>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                        <CommandEmpty>Aucun résultat.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = value.includes(option.value)
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => handleToggle(option.value)}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50"
                                            )}
                                        >
                                            {isSelected && <Check className="size-3" />}
                                        </div>
                                        {option.icon && <option.icon className="mr-2 size-4 opacity-70" />}
                                        {option.label}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
