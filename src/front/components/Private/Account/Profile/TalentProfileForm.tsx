"use client";

import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/front/components/ui/form";
import { Input } from "@/front/components/ui/input";
import { Separator } from "@/front/components/ui/separator";
import { Switch } from "@/front/components/ui/switch";
import { Textarea } from "@/front/components/ui/textarea";
import { useUser } from "@/front/states/contexts/user.context";
import { useCreateUserConfig, useDeleteUserConfig, useMyConfigs } from "@/front/queries/user-configs";
import { useUpdateUser } from "@/front/queries/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { TalentProfileSchema, type TalentProfileValues } from "@/front/schemas/zod/talent.zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TalentProfileForm() {
    const user = useUser();
    const router = useRouter();
    const { mutate: updateUser, isPending } = useUpdateUser();
    const { data: configs } = useMyConfigs();
    const { mutate: createConfig, isPending: createPending } = useCreateUserConfig();
    const { mutate: deleteConfig } = useDeleteUserConfig();

    const [newConfigTitle, setNewConfigTitle] = useState("");
    const [newConfigValue, setNewConfigValue] = useState("");

    const form = useForm<TalentProfileValues>({
        resolver: zodResolver(TalentProfileSchema),
        defaultValues: {
            bio: user?.bio ?? "",
            portfolio: user?.portfolio ?? "",
            cv: user?.cv ?? "",
            isMarketplaceTalent: user?.isMarketplaceTalent ?? false,
        },
    });

    function onSubmit(values: TalentProfileValues) {
        if (!user?.id) return;
        updateUser(
            {
                id: user.id,
                data: {
                    bio: values.bio,
                    portfolio: values.portfolio || undefined,
                    cv: values.cv || undefined,
                    isMarketplaceTalent: values.isMarketplaceTalent,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Profil talent mis à jour.");
                    form.reset({
                        bio: values.bio,
                        portfolio: values.portfolio,
                        cv: values.cv,
                        isMarketplaceTalent: values.isMarketplaceTalent,
                    });
                    router.refresh();
                },
                onError: () => toast.error("Une erreur est survenue."),
            }
        );
    }

    function handleAddConfig() {
        const title = newConfigTitle.trim();
        const value = newConfigValue.trim();
        if (!title || !value) return;
        createConfig(
            { title, content: { value } },
            {
                onSuccess: () => {
                    setNewConfigTitle("");
                    setNewConfigValue("");
                    toast.success("Équipement ajouté.");
                },
                onError: () => toast.error("Erreur lors de l'ajout."),
            }
        );
    }

    function handleDeleteConfig(id: string) {
        deleteConfig(id, {
            onError: () => toast.error("Erreur lors de la suppression."),
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profil talent</CardTitle>
                <CardDescription>
                    Complétez votre profil pour apparaître dans la marketplace des talents et être contacté pour des projets.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

                        {/* Visibilité marketplace */}
                        <FormField
                            control={form.control}
                            name="isMarketplaceTalent"
                            render={({ field }) => (
                                <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-muted/30">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-sm font-medium">Visible dans la marketplace</p>
                                        <p className="text-xs text-muted-foreground">
                                            Activez pour apparaître publiquement dans la liste des talents disponibles.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </div>
                            )}
                        />

                        {/* Bio */}
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décrivez votre profil, vos compétences, votre expérience..."
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {field.value?.length ?? 0}/500
                                    </p>
                                </FormItem>
                            )}
                        />

                        {/* Portfolio */}
                        <FormField
                            control={form.control}
                            name="portfolio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Portfolio</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://mon-portfolio.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CV */}
                        <FormField
                            control={form.control}
                            name="cv"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CV (lien)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://drive.google.com/..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="size-4 animate-spin" />}
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </Form>

                <Separator />

                {/* Équipements / configs */}
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm font-medium">Mes équipements</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Ajoutez votre matériel (caméra, lumières, microphone...) pour que les porteurs de projets sachent ce dont vous disposez.
                        </p>
                    </div>

                    {configs && configs.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {configs.map((config) => (
                                <div
                                    key={config.id}
                                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-md border border-border bg-muted/20"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-sm font-medium shrink-0">{config.title} :</span>
                                        <span className="text-sm text-muted-foreground truncate">
                                            {String((config.content as Record<string, unknown>).value ?? "")}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDeleteConfig(config.id)}
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Ajout */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type (ex: Caméra)"
                            value={newConfigTitle}
                            onChange={(e) => setNewConfigTitle(e.target.value)}
                            className="w-36 shrink-0"
                        />
                        <Input
                            placeholder="Modèle ou description"
                            value={newConfigValue}
                            onChange={(e) => setNewConfigValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddConfig();
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={handleAddConfig}
                            disabled={createPending || !newConfigTitle.trim() || !newConfigValue.trim()}
                        >
                            {createPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Plus className="size-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
