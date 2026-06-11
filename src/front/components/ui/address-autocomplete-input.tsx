"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Loader2, X } from "lucide-react"
import { Input } from "@/front/components/ui/input"
import { cn } from "@/front/lib/utils"

interface AddressSuggestion {
    id: string
    city: string
    name: string
    address: string
    lat: number
    lon: number
}

interface AddressAutocompleteInputProps {
    value: string
    onChange: (value: string) => void
    onSelect: (address: string, lat: number, lon: number) => void
    placeholder?: string
    className?: string
}

export function AddressAutocompleteInput({
    value,
    onChange,
    onSelect,
    placeholder = "Paris, Lyon…",
    className,
}: AddressAutocompleteInputProps) {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [loading, setLoading] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as HTMLElement))
                setShowSuggestions(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (value.length < 3) {
                setSuggestions([])
                setShowSuggestions(false)
                return
            }
            setLoading(true)
            try {
                const res = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`)
                if (!res.ok) return
                const data = await res.json()
                const results: AddressSuggestion[] = (data as Record<string, unknown>[])
                    .slice(0, 5)
                    .map((item, idx) => {
                        const addr = item.address as Record<string, string> | undefined
                        const cityName = addr
                            ? addr.city || addr.town || addr.village || addr.municipality || ""
                            : ""
                        const shortName = addr
                            ? [
                                addr.house_number && addr.road
                                    ? `${addr.house_number} ${addr.road}`
                                    : addr.road,
                                cityName,
                                addr.postcode,
                                addr.country,
                              ].filter(Boolean).join(", ")
                            : (item.name as string) || (item.display_name as string) || "Adresse"
                        return {
                            id: `${item.lat}-${item.lon}-${idx}`,
                            city: cityName || shortName,
                            name: shortName,
                            address: (item.display_name as string) || "",
                            lat: parseFloat(item.lat as string),
                            lon: parseFloat(item.lon as string),
                        }
                    })
                setSuggestions(results)
                setShowSuggestions(results.length > 0)
            } catch {
                setShowSuggestions(false)
            } finally {
                setLoading(false)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [value])

    function handleSelect(s: AddressSuggestion) {
        onChange(s.name)
        onSelect(s.name, s.lat, s.lon)
        setShowSuggestions(false)
    }

    function handleClear() {
        onChange("")
        setSuggestions([])
        setShowSuggestions(false)
    }

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative flex items-center">
                <MapPin className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                        if (!e.target.value) setShowSuggestions(false)
                    }}
                    onFocus={() => {
                        if (value.length >= 3 && suggestions.length > 0) setShowSuggestions(true)
                    }}
                    placeholder={placeholder}
                    className={cn("pl-9 pr-8", className)}
                />
                {loading && (
                    <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-muted-foreground" />
                )}
                {value && !loading && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 top-full mt-1 left-0 right-0 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md text-sm">
                    {suggestions.map((s) => (
                        <li key={s.id}>
                            <button
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    handleSelect(s)
                                }}
                            >
                                <div className="font-medium line-clamp-1">{s.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">{s.address}</div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
