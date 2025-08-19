import * as React from "react"
import { Plus, X } from "lucide-react"

import { Badge } from "@/Components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { cn } from "@/lib/utils"

export type Option = {
    label: string
    value: string
    disabled?: boolean
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
    badgeClassName?: string
    emptyText?: string
    allowCreation?: boolean
    onCreateOption?: (value: string) => Option
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options",
    className,
    badgeClassName,
    emptyText = "No options found.",
    allowCreation = false,
    onCreateOption,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const [availableOptions, setAvailableOptions] = React.useState<Option[]>(options)

    const handleCreate = React.useCallback(() => {
        if (!inputValue.trim()) return

        const exists = availableOptions.some((option) => option.label.toLowerCase() === inputValue.toLowerCase())

        if (!exists) {
            const newOption = onCreateOption
                ? onCreateOption(inputValue)
                : { label: inputValue, value: inputValue.toLowerCase().replace(/\s+/g, "-") }

            setAvailableOptions((prev) => [...prev, newOption])
            onChange([...selected, newOption.value])
            setInputValue("")
        }
    }, [inputValue, availableOptions, onCreateOption, onChange, selected])

    const handleUnselect = (value: string) => {
        onChange(selected.filter((item) => item !== value))
    }

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value))
        } else {
            onChange([...selected, value])
        }
        setInputValue("")
    }

    const filteredOptions = React.useMemo(() => {
        return availableOptions.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
    }, [availableOptions, inputValue])

    const showCreateOption = React.useMemo(() => {
        if (!allowCreation || !inputValue.trim()) return false
        return !availableOptions.some((option) => option.label.toLowerCase() === inputValue.toLowerCase())
    }, [allowCreation, inputValue, availableOptions])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                        className,
                    )}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
                        {selected.map((value) => {
                            const option = availableOptions.find((opt) => opt.value === value)
                            return (
                                <Badge
                                    key={value}
                                    variant="secondary"
                                    className={cn("flex items-center gap-1 px-2 py-0.5", badgeClassName)}
                                >
                                    {option?.label || value}
                                    <button
                                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnselect(value)
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleUnselect(value)
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        <span className="sr-only">Remove {option?.label || value}</span>
                                    </button>
                                </Badge>
                            )
                        })}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search or add options..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter" && showCreateOption) {
                                e.preventDefault()
                                handleCreate()
                            }
                        }}
                    />
                    <CommandList>
                        {filteredOptions.length === 0 && !showCreateOption && <CommandEmpty>{emptyText}</CommandEmpty>}
                        <CommandGroup>
                            {filteredOptions.map((option) => {
                                const isSelected = selected.includes(option.value)
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        disabled={option.disabled}
                                        onSelect={() => handleSelect(option.value)}
                                        className={cn(
                                            "flex items-center gap-2",
                                            isSelected ? "bg-accent" : "",
                                            option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <svg
                                                className={cn("h-3 w-3")}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>{option.label}</span>
                                    </CommandItem>
                                )
                            })}

                            {showCreateOption && (
                                <CommandItem
                                    value={`create-${inputValue}`}
                                    onSelect={handleCreate}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50">
                                        <Plus className="h-3 w-3" />
                                    </div>
                                    <span>Create "{inputValue}"</span>
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}