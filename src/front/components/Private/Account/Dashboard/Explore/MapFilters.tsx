"use client"

import { useState, useEffect } from "react"
import { Input } from "@/front/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/front/components/ui/select"
import { Search, MapPin, X } from "lucide-react"
import { ProjectType } from "@/back/generated/prisma_client/edge"


interface AddressSuggestion {
    id: string
    name: string
    address: string
    lat: number
    lon: number
}

interface MapFiltersProps {
    onAddressChange: (address: string, lat?: number, lon?: number) => void
    addressFilter: string
    onProjectTypeChange: (projectType: ProjectType) => void
    projectTypeFilter: ProjectType
    onTitleChange: (title: string) => void
    titleSuggestions: Array<{ id: string; title: string }>
}

export default function MapFilters({
    onAddressChange,
    addressFilter,
    onProjectTypeChange,
    projectTypeFilter,
    onTitleChange,
    titleSuggestions,
}: MapFiltersProps) {
    const [addressInput, setAddressInput] = useState(addressFilter)
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)
    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])
    const [loadingAddress, setLoadingAddress] = useState(false)
    const [showTitleSuggestions, setShowTitleSuggestions] = useState(false)
    const [titleInput, setTitleInput] = useState("")

    // Debounce: attendre 300ms après que l'utilisateur arrête de taper
    useEffect(() => {
        const timer = setTimeout(() => {
            if (addressInput.length < 3) {
                setAddressSuggestions([])
                setShowAddressSuggestions(false)
                return
            }

            const fetchSuggestions = async () => {
                setLoadingAddress(true)
                try {
                    const response = await fetch(`/api/geocode?q=${encodeURIComponent(addressInput)}`)

                    if (!response.ok) {
                        throw new Error(`API returned ${response.status}`)
                    }

                    const data = await response.json()

                    // Fonction pour construire une adresse à partir de l'objet address de Nominatim
                    const buildAddressString = (addressObj: Record<string, string> | string | null | undefined): string => {
                        if (typeof addressObj === 'string') return addressObj
                        if (!addressObj) return ''

                        // Construire à partir des propriétés principales
                        const parts = []
                        if (addressObj.house_number) parts.push(addressObj.house_number)
                        if (addressObj.road) parts.push(addressObj.road)
                        if (addressObj.suburb) parts.push(addressObj.suburb)
                        if (addressObj.city) parts.push(addressObj.city)
                        if (addressObj.postcode) parts.push(addressObj.postcode)
                        if (addressObj.country) parts.push(addressObj.country)

                        return parts.filter(Boolean).join(', ')
                    }

                    // Filtrer les résultats pour éviter les doublons
                    const suggestions: AddressSuggestion[] = data
                        .slice(0, 8) // Limiter à 8 résultats
                        .map((item: Record<string, unknown>, idx: number) => ({
                            id: `${item.lat as string}-${item.lon as string}-${idx}`,
                            name: item.name || buildAddressString(item.address as Record<string, string> | null | undefined) || 'Adresse',
                            address: item.display_name || buildAddressString(item.address as Record<string, string> | null | undefined),
                            lat: parseFloat(item.lat as string),
                            lon: parseFloat(item.lon as string),
                        }))

                    setAddressSuggestions(suggestions)
                    setShowAddressSuggestions(suggestions.length > 0)
                } catch (error) {
                    console.error("Erreur géocodage:", error)
                    setShowAddressSuggestions(false)
                } finally {
                    setLoadingAddress(false)
                }
            }

            fetchSuggestions()
        }, 300) // Debounce de 300ms

        return () => clearTimeout(timer)
    }, [addressInput])

    const handleAddressInputChange = (value: string) => {
        setAddressInput(value)
        onAddressChange(value)
    }

    const handleAddressSuggestionClick = (suggestion: AddressSuggestion) => {
        setAddressInput(suggestion.address)
        onAddressChange(suggestion.address, suggestion.lat, suggestion.lon)
        setShowAddressSuggestions(false)
    }

    const handleClearAddress = () => {
        setAddressInput("")
        setAddressSuggestions([])
        setShowAddressSuggestions(false)
        onAddressChange("")
    }

    const handleTitleChange = (value: string) => {
        setTitleInput(value)
        onTitleChange(value)
        setShowTitleSuggestions(value.length > 0)
    }

    const handleSuggestionClick = (title: string) => {
        setTitleInput(title)
        onTitleChange(title)
        setShowTitleSuggestions(false)
    }

    const projectTypes: ProjectType[] = Object.values(ProjectType)

    return (
        <div className="flex flex-col gap-4">
            {/* Recherche par adresse avec autocomplete */}
            <div className="relative">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neutral-500 shrink-0" />
                    <Input
                        placeholder="Entrez une adresse (ex: Paris, 75001)..."
                        value={addressInput}
                        onChange={(e) => handleAddressInputChange(e.target.value)}
                        onFocus={() => addressInput.length >= 3 && addressSuggestions.length > 0 && setShowAddressSuggestions(true)}
                        className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                    />
                    {loadingAddress && <div className="w-4 h-4 border-2 border-neutral-500 border-t-neutral-100 rounded-full animate-spin shrink-0" />}
                    {addressInput && !loadingAddress && (
                        <button
                            onClick={handleClearAddress}
                            className="text-neutral-500 hover:text-neutral-100 transition-colors shrink-0"
                            aria-label="Effacer l'adresse"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Suggestions d'adresses */}
                {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute top-full left-8 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50 max-h-56 overflow-y-auto">
                        {addressSuggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                onClick={() => handleAddressSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-neutral-100 text-sm first:rounded-t-md last:rounded-b-md transition-colors border-b border-neutral-700 last:border-b-0"
                            >
                                <div className="font-medium line-clamp-1">{suggestion.name}</div>
                                <div className="text-xs text-neutral-400 line-clamp-1">{suggestion.address}</div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Message quand aucun résultat */}
                {showAddressSuggestions && addressSuggestions.length === 0 && addressInput.length >= 3 && !loadingAddress && (
                    <div className="absolute top-full left-8 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50 px-4 py-3 text-sm text-neutral-400">
                        Aucune adresse trouvée pour "{addressInput}"
                    </div>
                )}
            </div>

            {/* Recherche par titre avec autocomplete */}
            <div className="relative">
                <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-neutral-500 shrink-0" />
                    <Input
                        placeholder="Chercher un projet..."
                        value={titleInput}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        onFocus={() => titleInput.length > 0 && setShowTitleSuggestions(true)}
                        className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                    />
                </div>

                {/* Suggestions de titres */}
                {showTitleSuggestions && titleSuggestions.length > 0 && (
                    <div className="absolute top-full left-8 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                        {titleSuggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion.title)}
                                className="w-full text-left px-4 py-2 hover:bg-neutral-700 text-neutral-100 text-sm first:rounded-t-md last:rounded-b-md border-b border-neutral-700 last:border-b-0"
                            >
                                {suggestion.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Filtre par type de projet */}
            <Select value={projectTypeFilter} onValueChange={(value) => onProjectTypeChange(value as ProjectType)}>
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-100">
                    <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                    {projectTypes.map((projectType) => (
                        <SelectItem key={projectType} value={projectType}>
                            {projectType}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
