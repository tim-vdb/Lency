"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Upload, X } from "lucide-react"
import { Switch } from "@/front/components/ui/switch"
import { useEffect, useRef, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import { CreateProjectSchema, type CreateProjectValues } from "@/front/schemas/zod/project.zod"

import { Button } from "@/front/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/front/components/ui/select"
import { Textarea } from "@/front/components/ui/textarea"
import { Badge } from "@/front/components/ui/badge"
import { AddressAutocompleteInput } from "@/front/components/ui/address-autocomplete-input"
import { MultistepForm, MultistepStep, MultistepNavigation } from "@/front/components/ui/multistep-form"
import { useCreateProject, useUpdateProject } from "@/front/queries/projects"
import { uploadToImageKit } from "@/front/lib/upload"
import { ProjectWithOwner } from "@/front/schemas/types/project.type"

// ─── Constantes ────────────────────────────────────────────────────────────────

const STEPS = [
    { id: "presentation", title: "Présentation" },
    { id: "caracteristiques", title: "Caractéristiques" },
    { id: "finalisation", title: "Finalisation" },
]

const PROJECT_TYPES = [
    { value: "COURT_METRAGE", label: "Court métrage" },
    { value: "LONG_METRAGE", label: "Long métrage" },
    { value: "SERIE", label: "Série" },
    { value: "CLIP", label: "Clip" },
    { value: "DOCUMENTAIRE", label: "Documentaire" },
    { value: "YOUTUBE", label: "YouTube" },
    { value: "AUTRE", label: "Autre" }
]

const LEVEL_OPTIONS = [
    { value: "DEBUTANT", label: "Débutant" },
    { value: "INTERMEDIAIRE", label: "Intermédiaire" },
    { value: "AVANCE", label: "Avancé" },
]

const WORKMODE_OPTIONS = [
    { value: "PRESENTIEL", label: "Présentiel" },
    { value: "DISTANCIEL", label: "Distanciel" },
    { value: "HYBRIDE", label: "Hybride" },
]

const REMUNERATION_OPTIONS = [
    { value: "NON_REMUNERE", label: "Non rémunéré" },
    { value: "REMUNERE", label: "Rémunéré" },
]

const VISIBILITY_OPTIONS = [
    { value: "PUBLIC", label: "Public" },
    { value: "PRIVATE", label: "Privé" },
]

// ─── Composant rôles (tag input) ───────────────────────────────────────────────

const ROLE_SUGGESTIONS = [
    "Réalisateur / Réalisatrice", "Monteur vidéo", "Cadreur / Cadreuse",
    "DOP - Directeur de la photographie", "Ingénieur du son", "Chef opérateur son",
    "Perchman", "Scripte", "Scénariste", "Producteur / Productrice",
    "Acteur / Actrice", "Directeur de casting", "Coloriste", "Motion designer",
    "Graphiste", "Chef décorateur", "Costumier / Costumière", "Maquilleur / Maquilleuse",
    "Régisseur / Régisseuse", "Électricien de plateau", "Machiniste",
    "Photographe", "Photographe de plateau", "Compositeur / Compositrice",
    "Vidéaste", "Infographiste 3D", "VFX Artist", "Chef monteur son",
    "Mixeur son", "Étalonnage / Coloriste", "Caméraman / Camérwoman",
    "Drone Operator", "Assistant réalisation", "Directeur artistique",
]

function RolesInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
    const [input, setInput] = useState("")
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const filtered = input.length > 0
        ? ROLE_SUGGESTIONS.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s))
        : ROLE_SUGGESTIONS.filter((s) => !value.includes(s))

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as HTMLElement))
                setOpen(false)
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

    return (
        <div className="flex flex-col gap-2">
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((v) => (
                        <Badge key={v} variant="secondary" className="gap-1 pr-1 text-xs font-normal">
                            {v}
                            <button type="button" onClick={() => onChange(value.filter((r) => r !== v))} className="ml-0.5 hover:text-destructive transition-colors">
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
                        onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); add(input) }
                            if (e.key === "Escape") setOpen(false)
                        }}
                        placeholder="Rechercher un rôle… ex: Monteur vidéo"
                        className="h-8 text-sm"
                    />
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2 shrink-0" onClick={() => add(input)} disabled={!input.trim()}>
                        <Plus className="size-4" />
                    </Button>
                </div>
                {open && filtered.length > 0 && (
                    <ul className="absolute z-50 top-full mt-1 left-0 right-0 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md text-sm">
                        {filtered.map((s) => (
                            <li key={s}>
                                <button type="button" className="w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground" onMouseDown={(e) => { e.preventDefault(); add(s) }}>
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

// ─── Composant principal ────────────────────────────────────────────────────────

interface CreateProjectFormProps {
    onSuccess?: () => void
    initialData?: ProjectWithOwner
    mode?: "create" | "edit"
}

export function CreateProjectForm({ onSuccess, initialData, mode = "create" }: CreateProjectFormProps) {
    const isEdit = mode === "edit"
    const { mutate: mutateCreate, isPending: isCreating } = useCreateProject()
    const { mutate: mutateUpdate, isPending: isUpdating } = useUpdateProject(initialData?.id ?? "")
    const isPending = isEdit ? isUpdating : isCreating
    const [bannerPrev, setBannerPrev] = useState<string | null>(initialData?.bannerUrl ?? null)
    const [uploading, setUploading] = useState(false)
    const bannerRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreateProjectValues>({
        resolver: zodResolver(CreateProjectSchema) as Resolver<CreateProjectValues>,
        defaultValues: isEdit && initialData ? {
            title: initialData.title,
            description: initialData.description ?? "",
            projectType: initialData.projectType ?? undefined,
            level: (initialData.level as "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE" | undefined) ?? undefined,
            remunerationType: (initialData.remunerationType as "NON_REMUNERE" | "REMUNERE" | undefined) ?? undefined,
            workMode: (initialData.workMode as "PRESENTIEL" | "DISTANCIEL" | "HYBRIDE" | undefined) ?? undefined,
            city: initialData.mapLocation?.name ?? "",
            latitude: initialData.mapLocation?.latitude ?? undefined,
            longitude: initialData.mapLocation?.longitude ?? undefined,
            startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "",
            visibility: (initialData.visibility === "MEMBERS_ONLY" ? "PUBLIC" : (initialData.visibility as "PUBLIC" | "PRIVATE")) ?? "PUBLIC",
            bannerUrl: initialData.bannerUrl ?? "",
            roles: (initialData.roles as string[]) ?? [],
            isPublished: initialData.status === "PUBLISHED",
        } : {
            title: "",
            description: "",
            projectType: undefined,
            level: undefined,
            remunerationType: undefined,
            workMode: undefined,
            city: "",
            latitude: undefined,
            longitude: undefined,
            startDate: "",
            visibility: "PUBLIC",
            bannerUrl: "",
            roles: [],
            isPublished: true,
        },
    })

    const descriptionLength = form.watch("description")?.length ?? 0
    const isPublished = form.watch("isPublished")

    async function handleBannerUpload(file: File) {
        setUploading(true)
        try {
            const url = await uploadToImageKit(file, "/projects/banners")
            form.setValue("bannerUrl", url)
            setBannerPrev(URL.createObjectURL(file))
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur upload")
        } finally {
            setUploading(false)
        }
    }

    function clearBanner() {
        form.setValue("bannerUrl", "")
        setBannerPrev(null)
    }

    function onSubmit(values: CreateProjectValues) {
        const payload = {
            title: values.title,
            description: values.description,
            bannerUrl: values.bannerUrl || undefined,
            projectType: values.projectType || undefined,
            remunerationType: values.remunerationType,
            level: values.level,
            workMode: values.workMode,
            city: values.city || undefined,
            latitude: values.latitude,
            longitude: values.longitude,
            startDate: values.startDate || undefined,
            roles: values.roles,
            visibility: values.visibility,
            status: values.isPublished ? "PUBLISHED" as const : "DRAFT" as const,
        }
        const callbacks = {
            onSuccess: () => {
                toast.success(values.isPublished ? "Projet publié !" : "Projet sauvegardé en brouillon.")
                if (!isEdit) { form.reset(); setBannerPrev(null) }
                onSuccess?.()
            },
            onError: (err: Error) => toast.error(err.message),
        }
        if (isEdit) {
            mutateUpdate(payload, callbacks)
        } else {
            mutateCreate(payload, callbacks)
        }
    }

    return (
        <Form {...form}>
            <MultistepForm
                steps={STEPS}
                onFormSubmit={form.handleSubmit(onSubmit)}
                navigation={
                    <MultistepNavigation
                        onNext={async (step) => {
                            if (step === 0) return form.trigger(["title", "description"])
                            if (step === 1) return form.trigger(["projectType"])
                            return true
                        }}
                        isPending={isPending}
                        disabled={uploading}
                        submitLabel={isEdit
                            ? (isPublished ? "Mettre à jour et publier" : "Enregistrer les modifications")
                            : (isPublished ? "Publier le projet" : "Sauvegarder en brouillon")
                        }
                    />
                }
            >
                {/* ── Étape 1 : Présentation ── */}
                <MultistepStep title="Présentation du projet" description="Donnez un titre, une bannière et une description.">
                    <FormField
                        control={form.control}
                        name="bannerUrl"
                        render={() => (
                            <FormItem>
                                <FormLabel>Bannière <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                <FormControl>
                                    <div>
                                        {bannerPrev ? (
                                            <div className="relative rounded-xl overflow-hidden">
                                                <img src={bannerPrev} alt="" className="w-full h-36 object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={clearBanner}
                                                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={uploading}
                                                onClick={() => bannerRef.current?.click()}
                                                className="w-full h-28 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-sm text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-50"
                                            >
                                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                                <span>Ajouter une image de couverture</span>
                                            </button>
                                        )}
                                        <input
                                            ref={bannerRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBannerUpload(f) }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre du projet</FormLabel>
                                <FormControl><Input placeholder="Les Larmes du Molosse…" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline justify-between">
                                    <FormLabel>Description</FormLabel>
                                    <span className="text-xs text-muted-foreground tabular-nums">{descriptionLength}/2000</span>
                                </div>
                                <FormControl>
                                    <Textarea placeholder="Décrivez votre projet, son contexte, ce que vous cherchez…" className="min-h-24 resize-none" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </MultistepStep>

                {/* ── Étape 2 : Caractéristiques ── */}
                <MultistepStep title="Caractéristiques" description="Le type de projet est obligatoire.">
                    <div className="grid grid-cols-2 gap-3 items-start">
                        <FormField
                            control={form.control}
                            name="projectType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type de projet</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PROJECT_TYPES.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Niveau</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {LEVEL_OPTIONS.map((o) => (
                                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="remunerationType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rémunération</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {REMUNERATION_OPTIONS.map((o) => (
                                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="workMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mode de travail</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {WORKMODE_OPTIONS.map((o) => (
                                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </MultistepStep>

                {/* ── Étape 3 : Finalisation ── */}
                <MultistepStep title="Finalisation" description="Localisation, date de début, visibilité et rôles recherchés.">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lieu <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                    <FormControl>
                                        <AddressAutocompleteInput
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            onSelect={(_address, lat, lon) => {
                                                form.setValue("latitude", lat)
                                                form.setValue("longitude", lon)
                                            }}
                                            placeholder="Paris, Lyon…"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date de début <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Visibilité</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {VISIBILITY_OPTIONS.map((o) => (
                                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rôles recherchés <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                <FormControl>
                                    <RolesInput value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3 rounded-lg border px-4 py-3">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="flex flex-col gap-0.5">
                                    <FormLabel className="text-sm cursor-pointer leading-none mb-0">
                                        {field.value ? "Publier maintenant" : "Sauvegarder en brouillon"}
                                    </FormLabel>
                                    <p className="text-xs text-muted-foreground">
                                        {field.value ? "Visible dans le marketplace." : "Vous pourrez le publier plus tard."}
                                    </p>
                                </div>
                            </FormItem>
                        )}
                    />
                </MultistepStep>
            </MultistepForm>
        </Form>
    )
}
