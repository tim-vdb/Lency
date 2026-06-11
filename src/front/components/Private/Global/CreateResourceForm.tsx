"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Music, Plus, Trash2, Upload, Video, X } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CreateResourceSchema, type CreateResourceValues } from "@/front/schemas/zod/resource.zod"

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
import { Button } from "@/front/components/ui/button"
import { MultistepForm, MultistepStep, MultistepNavigation } from "@/front/components/ui/multistep-form"
import { useCategories } from "@/front/queries/categories"
import { useCreateResource, useUpdateResource } from "@/front/queries/resources"
import { uploadToImageKit } from "@/front/lib/upload"
import { ResourceWithUserState } from "@/front/schemas/types/resource.type"

const RESOURCE_TYPE_LABELS: Record<string, string> = {
    ASSET: "Asset(s)",
    TUTORIAL: "Tutoriel(s)",
    LINK: "Lien(s)",
}

const STEPS = [
    { id: "reference", title: "Référence" },
    { id: "medias", title: "Médias" },
]

// ─── DropZone ─────────────────────────────────────────────────────────────────

function DropZone({
    accept,
    label,
    preview,
    uploading,
    onFile,
    onClear,
    icon: Icon,
}: {
    accept: string
    label: string
    preview: string | null
    uploading: boolean
    onFile: (f: File) => void
    onClear: () => void
    icon: React.ElementType
}) {
    const ref = useRef<HTMLInputElement>(null)
    return (
        <div className="relative">
            {preview ? (
                <div className="relative rounded-lg overflow-hidden bg-neutral-100">
                    {accept.startsWith("image") ? (
                        <img src={preview} alt="" className="w-full h-24 object-cover" />
                    ) : accept.startsWith("video") ? (
                        <video src={preview} className="w-full h-24 object-cover" />
                    ) : (
                        <div className="w-full h-14 flex items-center justify-center gap-2 text-sm text-neutral-600">
                            <Icon className="size-4" />{label}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                    >
                        <X className="size-3" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => ref.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-border py-3 flex flex-col items-center gap-1 text-sm text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-50"
                >
                    {uploading ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
                    <span className="text-xs">{label}</span>
                </button>
            )}
            <input
                ref={ref}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }}
            />
        </div>
    )
}

// ─── MediaSection — liste de DropZones pour un type de fichier ────────────────

function MediaSection({
    label,
    accept,
    icon,
    previews,
    uploading,
    onAdd,
    onRemove,
}: {
    label: string
    accept: string
    icon: React.ElementType
    previews: string[]
    uploading: boolean
    onAdd: (f: File) => void
    onRemove: (i: number) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{label} <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></span>
            <div className="grid grid-cols-2 gap-2">
                {previews.map((prev, i) => (
                    <DropZone
                        key={i}
                        accept={accept}
                        label={label}
                        preview={prev}
                        uploading={uploading}
                        onFile={onAdd}
                        onClear={() => onRemove(i)}
                        icon={icon}
                    />
                ))}
                <DropZone
                    accept={accept}
                    label={`Ajouter`}
                    preview={null}
                    uploading={uploading}
                    onFile={onAdd}
                    onClear={() => {}}
                    icon={icon}
                />
            </div>
        </div>
    )
}

// ─── UrlList — liste de champs URL ────────────────────────────────────────────

function UrlList({
    label,
    placeholder,
    values,
    onChange,
    error,
}: {
    label: string
    placeholder: string
    values: string[]
    onChange: (vals: string[]) => void
    error?: string
}) {
    const rows = values.length === 0 ? [""] : values

    function set(i: number, val: string) {
        const next = [...rows]
        next[i] = val
        onChange(next)
    }

    function remove(i: number) {
        onChange(rows.filter((_, idx) => idx !== i))
    }

    function add() {
        onChange([...rows, ""])
    }

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{label}</span>
            {rows.map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                    <Input
                        type="url"
                        placeholder={placeholder}
                        value={val}
                        onChange={(e) => set(i, e.target.value)}
                        className="flex-1"
                    />
                    {rows.length > 1 && (
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    )}
                </div>
            ))}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" variant="outline" size="sm" onClick={add} className="self-start gap-1.5">
                <Plus className="size-3.5" />
                Ajouter un lien
            </Button>
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CreateResourceFormProps {
    onSuccess?: () => void
    initialData?: ResourceWithUserState
    mode?: "create" | "edit"
}

export function CreateResourceForm({ onSuccess, initialData, mode = "create" }: CreateResourceFormProps) {
    const isEdit = mode === "edit"
    const { mutate: mutateCreate, isPending: isCreating } = useCreateResource()
    const { mutate: mutateUpdate, isPending: isUpdating } = useUpdateResource(
        initialData?.id ?? "",
        initialData?.categoryId,
    )
    const isPending = isEdit ? isUpdating : isCreating
    const { data: categories } = useCategories()

    const [imagePrevs, setImagePrevs] = useState<string[]>(initialData?.imageUrls ?? [])
    const [videoPrevs, setVideoPrevs] = useState<string[]>(initialData?.videoUrls ?? [])
    const [audioPrevs, setAudioPrevs] = useState<string[]>(initialData?.audioUrls ?? [])
    const [uploading, setUploading] = useState(false)

    const form = useForm<CreateResourceValues>({
        resolver: zodResolver(CreateResourceSchema),
        defaultValues: isEdit && initialData
            ? {
                title: initialData.title,
                description: initialData.description ?? "",
                type: initialData.type as "ASSET" | "TUTORIAL" | "LINK",
                urls: initialData.urls.length ? initialData.urls : [],
                imageUrls: initialData.imageUrls,
                videoUrls: initialData.videoUrls,
                audioUrls: initialData.audioUrls,
                categoryId: initialData.categoryId,
            }
            : { title: "", description: "", type: undefined, urls: [], imageUrls: [], videoUrls: [], audioUrls: [], categoryId: "" },
    })

    const type = form.watch("type")
    const isLink = type === "LINK"
    const descriptionLength = form.watch("description")?.length ?? 0
    const urls = form.watch("urls") ?? []

    async function handleUpload(
        file: File,
        field: "imageUrls" | "videoUrls" | "audioUrls",
        setPrevs: React.Dispatch<React.SetStateAction<string[]>>,
    ) {
        setUploading(true)
        try {
            const url = await uploadToImageKit(file, "/resources")
            form.setValue(field, [...(form.getValues(field) ?? []), url])
            setPrevs((p) => [...p, URL.createObjectURL(file)])
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur upload")
        } finally {
            setUploading(false)
        }
    }

    function removeMedia(
        index: number,
        field: "imageUrls" | "videoUrls" | "audioUrls",
        setPrevs: React.Dispatch<React.SetStateAction<string[]>>,
    ) {
        form.setValue(field, (form.getValues(field) ?? []).filter((_, i) => i !== index))
        setPrevs((p) => p.filter((_, i) => i !== index))
    }

    function onSubmit(values: CreateResourceValues) {
        const clean = (arr: string[]) => arr.filter((u) => u.match(/^https?:\/\/.+/))
        const payload = {
            title: values.title,
            description: values.description || undefined,
            type: values.type,
            urls: isLink ? clean(values.urls) : clean(values.urls),
            imageUrls: values.imageUrls.filter(Boolean),
            videoUrls: values.videoUrls.filter(Boolean),
            audioUrls: values.audioUrls.filter(Boolean),
            categoryId: values.categoryId,
        }

        const callbacks = {
            onSuccess: () => {
                toast.success(isEdit ? "Ressource modifiée !" : "Ressource créée !")
                if (!isEdit) {
                    form.reset()
                    setImagePrevs([]); setVideoPrevs([]); setAudioPrevs([])
                }
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
                displaySteps={isLink ? [STEPS[0]] : STEPS}
                onFormSubmit={form.handleSubmit(onSubmit)}
                navigation={
                    <MultistepNavigation
                        onNext={async (step) => {
                            if (step === 0) {
                                return form.trigger(["type", "categoryId", "title", ...(isLink ? ["urls" as const] : [])])
                            }
                            return true
                        }}
                        isPending={isPending}
                        disabled={uploading || !type}
                        submitLabel={isEdit ? "Enregistrer" : "Créer la ressource"}
                        isLastOverride={isLink}
                    />
                }
            >
                {/* ── Étape 1 : Référence ── */}
                <MultistepStep title="Référence" description="Type, catégorie et titre de la ressource.">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(RESOURCE_TYPE_LABELS).map(([v, l]) => (
                                                <SelectItem key={v} value={v}>{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catégorie</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre</FormLabel>
                                <FormControl><Input placeholder="Nom de la ressource…" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isLink && (
                        <FormField
                            control={form.control}
                            name="urls"
                            render={({ fieldState }) => (
                                <FormItem>
                                    <UrlList
                                        label="Liens"
                                        placeholder="https://…"
                                        values={urls}
                                        onChange={(vals) => form.setValue("urls", vals, { shouldValidate: true })}
                                        error={fieldState.error?.message}
                                    />
                                </FormItem>
                            )}
                        />
                    )}

                    {isLink && (
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-baseline justify-between">
                                        <FormLabel>Description <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                        <span className="text-xs text-muted-foreground tabular-nums">{descriptionLength}/500</span>
                                    </div>
                                    <FormControl>
                                        <Textarea placeholder="Décrivez cette ressource…" className="min-h-16 resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </MultistepStep>

                {/* ── Étape 2 : Médias (ASSET / TUTORIAL uniquement) ── */}
                <MultistepStep title="Médias & liens" description="Ajoutez des fichiers, images, vidéos, audios ou des liens externes.">
                    <MediaSection
                        label="Images"
                        accept="image/*"
                        icon={Upload}
                        previews={imagePrevs}
                        uploading={uploading}
                        onAdd={(f) => handleUpload(f, "imageUrls", setImagePrevs)}
                        onRemove={(i) => removeMedia(i, "imageUrls", setImagePrevs)}
                    />
                    <MediaSection
                        label="Vidéos"
                        accept="video/*"
                        icon={Video}
                        previews={videoPrevs}
                        uploading={uploading}
                        onAdd={(f) => handleUpload(f, "videoUrls", setVideoPrevs)}
                        onRemove={(i) => removeMedia(i, "videoUrls", setVideoPrevs)}
                    />
                    <MediaSection
                        label="Audios"
                        accept="audio/*"
                        icon={Music}
                        previews={audioPrevs}
                        uploading={uploading}
                        onAdd={(f) => handleUpload(f, "audioUrls", setAudioPrevs)}
                        onRemove={(i) => removeMedia(i, "audioUrls", setAudioPrevs)}
                    />

                    <FormField
                        control={form.control}
                        name="urls"
                        render={({ fieldState }) => (
                            <FormItem>
                                <UrlList
                                    label="Liens externes"
                                    placeholder="https://…"
                                    values={urls}
                                    onChange={(vals) => form.setValue("urls", vals, { shouldValidate: true })}
                                    error={fieldState.error?.message}
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline justify-between">
                                    <FormLabel>Description <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                    <span className="text-xs text-muted-foreground tabular-nums">{descriptionLength}/500</span>
                                </div>
                                <FormControl>
                                    <Textarea placeholder="Décrivez cette ressource…" className="min-h-16 resize-none" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField control={form.control} name="imageUrls" render={() => <FormMessage />} />
                </MultistepStep>
            </MultistepForm>
        </Form>
    )
}
