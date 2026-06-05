"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TalentProfileModalSchema, type TalentProfileModalValues } from "@/front/schemas/zod/talent.zod"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/front/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import { Textarea } from "@/front/components/ui/textarea"
import { Switch } from "@/front/components/ui/switch"
import { Button } from "@/front/components/ui/button"
import { Badge } from "@/front/components/ui/badge"
import { MultistepForm, MultistepStep, MultistepNavigation } from "@/front/components/ui/multistep-form"
import { useUser } from "@/front/states/contexts/user.context"
import { useUpdateUser } from "@/front/queries/users"
import { useMyConfigs, useCreateUserConfig, useUpdateUserConfig } from "@/front/queries/user-configs"

// ─── Constantes ────────────────────────────────────────────────────────────────

const STEPS = [
    { id: "profil", title: "Profil" },
    { id: "disponibilite", title: "Disponibilité" },
    { id: "roles", title: "Rôles" },
    { id: "equipements", title: "Équipements" },
]

const WORKMODE_OPTIONS = [
    { value: "PRESENTIEL", label: "Présentiel" },
    { value: "DISTANCIEL", label: "Distanciel" },
    { value: "HYBRIDE", label: "Hybride" },
]
const LEVEL_OPTIONS = [
    { value: "DEBUTANT", label: "Débutant" },
    { value: "INTERMEDIAIRE", label: "Intermédiaire" },
    { value: "AVANCE", label: "Avancé" },
]
const REMU_OPTIONS = [
    { value: "REMUNERE", label: "Rémunéré" },
    { value: "NON_REMUNERE", label: "Non rémunéré" },
]

const ROLE_SUGGESTIONS = [
    "Réalisateur / Réalisatrice",
    "Monteur vidéo",
    "Cadreur / Cadreuse",
    "DOP - Directeur de la photographie",
    "Ingénieur du son",
    "Chef opérateur son",
    "Scripte",
    "Scénariste",
    "Producteur / Productrice",
    "Acteur / Actrice",
    "Directeur de casting",
    "Coloriste",
    "Motion designer",
    "Graphiste",
    "Chef décorateur",
    "Costumier / Costumière",
    "Maquilleur / Maquilleuse",
    "Régisseur / Régisseuse",
    "Électricien de plateau",
    "Machiniste",
    "Photographe de plateau",
    "Compositeur / Compositrice",
    "Vidéaste",
    "Infographiste 3D",
    "VFX Artist",
    "Chef monteur son",
    "Mixeur son",
    "Étalonnage / Coloriste",
    "Caméraman / Camérwoman",
    "Drone Operator",
]

const SUGGESTIONS: Record<string, string[]> = {
    cameras: [
        "Sony FX3", "Sony FX6", "Sony FX9", "Sony A7S III", "Sony A7 IV",
        "Canon EOS R5", "Canon EOS R5C", "Canon EOS C70", "Canon EOS C300 Mark III",
        "Blackmagic Pocket 6K G2", "Blackmagic Pocket 6K Pro", "Blackmagic Cinema Camera 6K",
        "DJI Ronin 4D", "ARRI Alexa Mini LF", "RED Komodo 6K",
        "Fujifilm X-H2S", "Panasonic Lumix S5 II", "Nikon Z9",
        "GoPro Hero 12", "DJI Osmo Pocket 3",
    ],
    lenses: [
        "Sigma 24-70mm f/2.8 DG DN", "Sigma 18-35mm f/1.8 DC HSM",
        "Canon RF 50mm f/1.2L", "Canon RF 24-70mm f/2.8L",
        "Sony FE 24mm f/1.4 GM", "Sony FE 85mm f/1.4 GM", "Sony FE 16-35mm f/2.8 GM",
        "Tamron 17-28mm f/2.8", "Tamron 28-75mm f/2.8 G2",
        "Zeiss Milvus 21mm f/2.8", "Rokinon 14mm f/2.8",
        "Laowa 12mm f/2.8 Zero-D",
    ],
    lights: [
        "Aputure 120D II", "Aputure 300D II", "Aputure 600D Pro", "Aputure MC",
        "Godox SL150W II", "Godox SL300W II", "Godox MG1200Bi",
        "Nanlite Forza 60B", "Nanlite Forza 300B II", "Nanlite Pavotube II 30C",
        "Amaran 100D", "Amaran P60C", "Amaran F22C",
        "Westcott Flex", "Quasar Science Q-LED", "Litepanels Astra 6X Bi",
    ],
    software: [
        "Adobe Premiere Pro", "Adobe After Effects", "Adobe Audition", "Adobe Photoshop", "Adobe Lightroom", "Adobe Illustrator", "Adobe Media Encoder", "Adobe Character Animator", "Adobe InDesign",
        "DaVinci Resolve", "DaVinci Resolve Studio",
        "Final Cut Pro", "Motion",
        "Avid Media Composer",
        "CapCut", "VN Editor",
        "Blender", "Cinema 4D",
        "OBS Studio", "Ecamm Live",
        "Audacity", "Logic Pro",
    ],
    audio: [
        "Rode NTG5", "Rode NTG3", "Rode Wireless GO II", "Rode PodMic",
        "Sennheiser MKH 416", "Sennheiser EW 100 G4",
        "Sony UWP-D21", "Sony ECM-B10",
        "Zoom H6", "Zoom F3", "Zoom F8n",
        "Tascam DR-60D", "Sound Devices MixPre-3 II",
        "DJI Mic", "DJI Mic 2",
        "Deity S-MIC 2", "Deity BP-TRX",
    ],
}

const AV_SECTIONS: { key: string; label: string; placeholder: string }[] = [
    { key: "cameras", label: "Caméras", placeholder: "Ex: Sony FX3, Canon R5…" },
    { key: "lenses", label: "Objectifs", placeholder: "Ex: Sigma 24-70mm f/2.8…" },
    { key: "lights", label: "Lumières", placeholder: "Ex: Aputure 120D II…" },
    { key: "software", label: "Logiciels", placeholder: "Ex: Premiere Pro, DaVinci…" },
    { key: "audio", label: "Audio", placeholder: "Ex: Rode NTG5, Zoom H6…" },
]

type AudiContent = Record<string, string[]>

// ─── TagSearchInput ────────────────────────────────────────────────────────────

function TagSearchInput({
    suggestions,
    value,
    onChange,
    placeholder,
}: {
    suggestions: string[]
    value: string[]
    onChange: (v: string[]) => void
    placeholder?: string
}) {
    const [input, setInput] = useState("")
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const filtered = input.length > 0
        ? suggestions.filter(
            (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
        )
        : suggestions.filter((s) => !value.includes(s)).slice(0, 8)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as HTMLElement)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function add(v: string) {
        const trimmed = v.trim()
        if (!trimmed || value.includes(trimmed)) return
        onChange([...value, trimmed])
        setInput("")
        setOpen(false)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") { e.preventDefault(); add(input) }
        if (e.key === "Escape") setOpen(false)
    }

    return (
        <div className="flex flex-col gap-2">
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((v) => (
                        <Badge key={v} variant="secondary" className="gap-1 pr-1 text-xs font-normal">
                            {v}
                            <button
                                type="button"
                                onClick={() => onChange(value.filter((r) => r !== v))}
                                className="ml-0.5 hover:text-destructive transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            <div ref={wrapperRef} className="relative">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setOpen(true) }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="h-8 text-sm"
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 shrink-0"
                        onClick={() => add(input)}
                        disabled={!input.trim()}
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>
                {open && filtered.length > 0 && (
                    <ul className="absolute z-50 top-full mt-1 left-0 right-0 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md text-sm">
                        {filtered.map((s) => (
                            <li key={s}>
                                <button
                                    type="button"
                                    className="w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
                                    onMouseDown={(e) => { e.preventDefault(); add(s) }}
                                >
                                    {s}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

// ─── ConfigSection ─────────────────────────────────────────────────────────────

function ConfigSection({
    sectionKey,
    label,
    placeholder,
    items,
    onAdd,
    onRemove,
}: {
    sectionKey: string
    label: string
    placeholder: string
    items: string[]
    onAdd: (key: string, value: string) => void
    onRemove: (key: string, value: string) => void
}) {
    const [input, setInput] = useState("")
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const suggestions = SUGGESTIONS[sectionKey] ?? []
    const filtered = input.length > 0
        ? suggestions.filter(
            (s) => s.toLowerCase().includes(input.toLowerCase()) && !items.includes(s)
        )
        : []

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as HTMLElement)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function handleAdd(value: string) {
        const trimmed = value.trim()
        if (!trimmed || items.includes(trimmed)) return
        onAdd(sectionKey, trimmed)
        setInput("")
        setOpen(false)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") { e.preventDefault(); handleAdd(input) }
        if (e.key === "Escape") setOpen(false)
    }

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{label}</p>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                        <Badge key={item} variant="secondary" className="gap-1 pr-1 text-xs font-normal">
                            {item}
                            <button
                                type="button"
                                onClick={() => onRemove(sectionKey, item)}
                                className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                            >
                                <X className="size-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            <div ref={wrapperRef} className="relative">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setOpen(true) }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="h-8 text-sm"
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 shrink-0"
                        onClick={() => handleAdd(input)}
                        disabled={!input.trim()}
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>
                {open && filtered.length > 0 && (
                    <ul className="absolute z-50 top-full mt-1 left-0 right-0 max-h-40 overflow-y-auto rounded-md border border-border bg-popover shadow-md text-sm">
                        {filtered.map((s) => (
                            <li key={s}>
                                <button
                                    type="button"
                                    className="w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
                                    onMouseDown={(e) => { e.preventDefault(); handleAdd(s) }}
                                >
                                    {s}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

// ─── TalentProfileModal ────────────────────────────────────────────────────────

interface TalentProfileModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TalentProfileModal({ open, onOpenChange }: TalentProfileModalProps) {
    const user = useUser()
    const { data: configs } = useMyConfigs()
    const { mutateAsync: updateUserAsync } = useUpdateUser()
    const { mutateAsync: createConfigAsync } = useCreateUserConfig()
    const { mutateAsync: updateConfigAsync } = useUpdateUserConfig()

    const [roles, setRoles] = useState<string[]>([])
    const [avContent, setAvContent] = useState<AudiContent>({})
    const [isPending, setIsPending] = useState(false)

    const form = useForm<TalentProfileModalValues>({
        resolver: zodResolver(TalentProfileModalSchema),
        defaultValues: {
            bio: user?.bio ?? "",
            portfolio: user?.portfolio ?? "",
            cv: user?.cv ?? "",
            isMarketplaceTalent: user?.isMarketplaceTalent ?? false,
        },
    })

    // Sync state when modal opens
    useEffect(() => {
        if (!open) return
        const rolesConfig = configs?.find((c) => c.title === "roles")
        setRoles(rolesConfig ? ((rolesConfig.content as { roles?: string[] }).roles ?? []) : [])

        const avConfig = configs?.find((c) => c.title === "audiovisual")
        setAvContent(avConfig ? (avConfig.content as AudiContent) : {})

        const prefsConfig = configs?.find((c) => c.title === "preferences")
        const prefs = prefsConfig ? (prefsConfig.content as { workMode?: string; level?: string; remunerationType?: string }) : {}

        form.reset({
            bio: user?.bio ?? "",
            portfolio: user?.portfolio ?? "",
            cv: user?.cv ?? "",
            isMarketplaceTalent: user?.isMarketplaceTalent ?? false,
            workMode: prefs.workMode ?? "",
            level: prefs.level ?? "",
            remunerationType: prefs.remunerationType ?? "",
        })
    }, [open])

    function handleAvAdd(key: string, value: string) {
        setAvContent((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), value] }))
    }

    function handleAvRemove(key: string, value: string) {
        setAvContent((prev) => ({ ...prev, [key]: (prev[key] ?? []).filter((v) => v !== value) }))
    }

    async function onSubmit(values: TalentProfileModalValues) {
        if (!user?.id) return
        setIsPending(true)
        try {
            await updateUserAsync({
                id: user.id,
                data: {
                    bio: values.bio,
                    portfolio: values.portfolio || undefined,
                    cv: values.cv || undefined,
                    isMarketplaceTalent: values.isMarketplaceTalent,
                },
            })

            const rolesConfig = configs?.find((c) => c.title === "roles")
            if (rolesConfig) {
                await updateConfigAsync({ id: rolesConfig.id, data: { content: { roles } } })
            } else {
                await createConfigAsync({ title: "roles", content: { roles } })
            }

            const avConfig = configs?.find((c) => c.title === "audiovisual")
            if (avConfig) {
                await updateConfigAsync({ id: avConfig.id, data: { content: avContent } })
            } else {
                await createConfigAsync({ title: "audiovisual", content: avContent })
            }

            const prefsContent = {
                workMode: values.workMode || null,
                level: values.level || null,
                remunerationType: values.remunerationType || null,
            }
            const prefsConfig = configs?.find((c) => c.title === "preferences")
            if (prefsConfig) {
                await updateConfigAsync({ id: prefsConfig.id, data: { content: prefsContent } })
            } else if (values.workMode || values.level || values.remunerationType) {
                await createConfigAsync({ title: "preferences", content: prefsContent })
            }

            toast.success("Profil talent mis à jour !")
            onOpenChange(false)
        } catch {
            toast.error("Une erreur est survenue.")
        } finally {
            setIsPending(false)
        }
    }

    const bioLength = form.watch("bio")?.length ?? 0

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="p-0 gap-0 w-full max-w-[820px] h-[600px] flex overflow-hidden rounded-xl">
                    <DialogTitle className="sr-only">Profil talent</DialogTitle>
                    <DialogDescription className="sr-only">Modifier votre profil talent</DialogDescription>

                    <Form {...form}>
                        <MultistepForm
                            steps={STEPS}
                            onFormSubmit={form.handleSubmit(onSubmit)}
                            navigation={
                                <MultistepNavigation
                                    onNext={async (step) => {
                                        if (step === 0) return form.trigger(["bio", "portfolio", "cv"])
                                        if (step === 1) return form.trigger(["workMode", "level", "remunerationType"])
                                        return true
                                    }}
                                    isPending={isPending}
                                    submitLabel="Enregistrer"
                                />
                            }
                        >
                            {/* ── Étape 1 : Profil ── */}
                            <MultistepStep title="Profil talent" description="Vos informations publiques sur la marketplace.">
                                <FormField
                                    control={form.control}
                                    name="isMarketplaceTalent"
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-muted/30">
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-sm font-medium">Visible dans la marketplace</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Apparaître publiquement dans la liste des talents disponibles.
                                                </p>
                                            </div>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-baseline justify-between">
                                                <FormLabel>Bio <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                                <span className="text-xs text-muted-foreground tabular-nums">{bioLength}/500</span>
                                            </div>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Décrivez votre profil, vos compétences, votre expérience…"
                                                    className="resize-none min-h-20"
                                                    maxLength={500}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="portfolio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Portfolio <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                                <FormControl>
                                                    <Input type="url" placeholder="https://mon-portfolio.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cv"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CV <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                                <FormControl>
                                                    <Input type="url" placeholder="https://drive.google.com/…" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </MultistepStep>

                            {/* ── Étape 2 : Disponibilité ── */}
                            <MultistepStep title="Disponibilité" description="Ces informations apparaissent sur votre carte dans la marketplace, elles permettent aux recruteurs de savoir si vous correspondez à leurs besoins.">
                                <div className="grid grid-cols-1 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="workMode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mode de travail</FormLabel>
                                                <FormControl>
                                                    <select
                                                        value={field.value ?? ""}
                                                        onChange={field.onChange}
                                                        className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                                                    >
                                                        <option value="">Non spécifié</option>
                                                        {WORKMODE_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>{o.label}</option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="level"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Niveau d'expérience</FormLabel>
                                                <FormControl>
                                                    <select
                                                        value={field.value ?? ""}
                                                        onChange={field.onChange}
                                                        className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                                                    >
                                                        <option value="">Non spécifié</option>
                                                        {LEVEL_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>{o.label}</option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="remunerationType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type de rémunération</FormLabel>
                                                <FormControl>
                                                    <select
                                                        value={field.value ?? ""}
                                                        onChange={field.onChange}
                                                        className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                                                    >
                                                        <option value="">Non spécifié</option>
                                                        {REMU_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>{o.label}</option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </MultistepStep>

                            {/* ── Étape 3 : Rôles ── */}
                            <MultistepStep title="Rôles" description="Sélectionnez ou ajoutez vos rôles dans la production audiovisuelle.">
                                <TagSearchInput
                                    suggestions={ROLE_SUGGESTIONS}
                                    value={roles}
                                    onChange={setRoles}
                                    placeholder="Rechercher un rôle… ex: Monteur vidéo"
                                />
                            </MultistepStep>

                            {/* ── Étape 4 : Équipements ── */}
                            <MultistepStep title="Équipements" description="Renseignez votre matériel et logiciels audiovisuels.">
                                <div className="flex flex-col gap-5">
                                    {AV_SECTIONS.map(({ key, label, placeholder }) => (
                                        <ConfigSection
                                            key={key}
                                            sectionKey={key}
                                            label={label}
                                            placeholder={placeholder}
                                            items={avContent[key] ?? []}
                                            onAdd={handleAvAdd}
                                            onRemove={handleAvRemove}
                                        />
                                    ))}
                                </div>
                            </MultistepStep>
                        </MultistepForm>
                    </Form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
