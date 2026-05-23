"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Plus, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Button } from "@/front/components/ui/button";
import { Input } from "@/front/components/ui/input";
import { Badge } from "@/front/components/ui/badge";
import { useMyConfigs, useCreateUserConfig, useUpdateUserConfig } from "@/front/hooks/queries/use-userConfigs";

// ─── Suggestions par catégorie ────────────────────────────────────────────────

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
        "Westcott Flex", "Quasar Science Q-LED",
        "Litepanels Astra 6X Bi",
    ],
    software: [
        "Adobe Premiere Pro", "Adobe After Effects", "Adobe Audition", "Adobe Photoshop", "Adobe Lightroom",
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
};

const SECTIONS: { key: string; label: string; placeholder: string }[] = [
    { key: "cameras", label: "Caméras", placeholder: "Ex: Sony FX3, Canon R5..." },
    { key: "lenses", label: "Objectifs", placeholder: "Ex: Sigma 24-70mm f/2.8..." },
    { key: "lights", label: "Lumières", placeholder: "Ex: Aputure 120D II..." },
    { key: "software", label: "Logiciels", placeholder: "Ex: Premiere Pro, DaVinci..." },
    { key: "audio", label: "Audio", placeholder: "Ex: Rode NTG5, Zoom H6..." },
];

const CONFIG_TITLE = "audiovisual";

// ─── Types ────────────────────────────────────────────────────────────────────

type AudiContent = Record<string, string[]>;

// ─── Sous-composant : une section ─────────────────────────────────────────────

function ConfigSection({
    sectionKey,
    label,
    placeholder,
    items,
    onAdd,
    onRemove,
}: {
    sectionKey: string;
    label: string;
    placeholder: string;
    items: string[];
    onAdd: (key: string, value: string) => void;
    onRemove: (key: string, value: string) => void;
}) {
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const suggestions = SUGGESTIONS[sectionKey] ?? [];
    const filtered = input.length > 0
        ? suggestions.filter(
            (s) => s.toLowerCase().includes(input.toLowerCase()) && !items.includes(s)
        )
        : [];

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleAdd(value: string) {
        const trimmed = value.trim();
        if (!trimmed || items.includes(trimmed)) return;
        onAdd(sectionKey, trimmed);
        setInput("");
        setOpen(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd(input);
        }
        if (e.key === "Escape") setOpen(false);
    }

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{label}</p>

            {/* Items ajoutés */}
            {items.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                        <Badge key={item} variant="secondary" className="gap-1 pr-1">
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

            {/* Input + suggestions */}
            <div ref={wrapperRef} className="relative">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setOpen(true); }}
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
                    <ul className="absolute z-50 top-full mt-1 left-0 right-0 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md text-sm">
                        {filtered.map((s) => (
                            <li key={s}>
                                <button
                                    type="button"
                                    className="w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
                                    onMouseDown={(e) => { e.preventDefault(); handleAdd(s); }}
                                >
                                    {s}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function AudiovisualConfigSection() {
    const { data: configs, isPending } = useMyConfigs();
    const { mutate: createConfig, isPending: isCreating } = useCreateUserConfig();
    const { mutate: updateConfig, isPending: isUpdating } = useUpdateUserConfig();

    const existing = configs?.find((c) => c.title === CONFIG_TITLE);
    const savedContent = (existing?.content ?? {}) as AudiContent;

    const [localContent, setLocalContent] = useState<AudiContent>({});
    const [dirty, setDirty] = useState(false);

    // Sync depuis la DB quand les données arrivent
    useEffect(() => {
        if (!isPending) {
            setLocalContent(savedContent);
            setDirty(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPending, existing?.id]);

    function handleAdd(key: string, value: string) {
        setLocalContent((prev) => ({
            ...prev,
            [key]: [...(prev[key] ?? []), value],
        }));
        setDirty(true);
    }

    function handleRemove(key: string, value: string) {
        setLocalContent((prev) => ({
            ...prev,
            [key]: (prev[key] ?? []).filter((v) => v !== value),
        }));
        setDirty(true);
    }

    function handleSave() {
        if (existing) {
            updateConfig(
                { id: existing.id, data: { content: localContent } },
                {
                    onSuccess: () => { toast.success("Config audiovisuelle sauvegardée."); setDirty(false); },
                    onError: () => toast.error("Erreur lors de la sauvegarde."),
                }
            );
        } else {
            createConfig(
                { title: CONFIG_TITLE, content: localContent },
                {
                    onSuccess: () => { toast.success("Config audiovisuelle créée."); setDirty(false); },
                    onError: () => toast.error("Erreur lors de la création."),
                }
            );
        }
    }

    const isSaving = isCreating || isUpdating;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Config audiovisuelle</CardTitle>
                <CardDescription>
                    Renseignez votre matériel et logiciels pour que les autres membres puissent voir votre setup.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isPending ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {SECTIONS.map(({ key, label, placeholder }) => (
                            <ConfigSection
                                key={key}
                                sectionKey={key}
                                label={label}
                                placeholder={placeholder}
                                items={localContent[key] ?? []}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
                            />
                        ))}

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSave} disabled={!dirty || isSaving}>
                                {isSaving && <Loader2 className="size-4 animate-spin" />}
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
