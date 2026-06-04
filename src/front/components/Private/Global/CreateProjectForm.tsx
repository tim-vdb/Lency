"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Upload, X } from "lucide-react"
import { Switch } from "@/front/components/ui/switch"
import { useRef, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
import { MultistepForm, MultistepStep, MultistepNavigation } from "@/front/components/ui/multistep-form"
import { useCreateProject, useUpdateProject } from "@/front/queries/projects"
import { uploadToImageKit } from "@/front/lib/upload"
import { ProjectWithOwner } from "@/front/schemas/types/project.type"

// ─── Schema ────────────────────────────────────────────────────────────────────

const CreateProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(150, "Maximum 150 caractères"),
    description: z.string().min(1, "La description est requise").max(2000, "Maximum 2000 caractères"),
    projectType: z.preprocess((v) => v ?? "", z.string().min(1, "Le type de projet est requis")),
    level: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]).optional(),
    remunerationType: z.enum(["NON_REMUNERE", "REMUNERE"]).optional(),
    workMode: z.enum(["PRESENTIEL", "DISTANCIEL", "HYBRIDE"]).optional(),
    city: z.string().max(100).optional(),
    startDate: z.string().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    bannerUrl: z.string().optional(),
    roles: z.array(z.string()),
    isPublished: z.boolean(),
})

type CreateProjectValues = z.infer<typeof CreateProjectSchema>

// ─── Constantes ────────────────────────────────────────────────────────────────

const STEPS = [
    { id: "presentation", title: "Présentation" },
    { id: "caracteristiques", title: "Caractéristiques" },
    { id: "finalisation", title: "Finalisation" },
]

const PROJECT_TYPES = ["Court métrage", "Long métrage", "Série", "Clip", "Documentaire", "YouTube", "Autre"]

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

function RolesInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
    const [input, setInput] = useState("")

    function add() {
        const trimmed = input.trim()
        if (!trimmed || value.includes(trimmed)) return
        onChange([...value, trimmed])
        setInput("")
    }

    function remove(role: string) {
        onChange(value.filter((r) => r !== role))
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ex : Monteur vidéo, Cadreur…"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
                    className="flex-1"
                />
                <Button type="button" variant="outline" size="icon" onClick={add} disabled={!input.trim()}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((role) => (
                        <Badge key={role} variant="secondary" className="gap-1 pr-1 text-xs font-normal">
                            {role}
                            <button type="button" onClick={() => remove(role)} className="hover:text-destructive transition-colors ml-0.5">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
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
                    <div className="grid grid-cols-2 gap-3">
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
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
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
                                    <FormLabel>Ville <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                    <FormControl><Input placeholder="Paris, Lyon…" {...field} /></FormControl>
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
