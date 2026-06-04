"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Send, Link, FileText } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/front/components/ui/dialog";
import { Button } from "@/front/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/front/components/ui/form";
import { Input } from "@/front/components/ui/input";
import { Textarea } from "@/front/components/ui/textarea";
import { useApplyToProject } from "@/front/queries/applications";

const schema = z.object({
    applicantNote: z.string().max(1000, "Maximum 1000 caractères").optional(),
    portfolioUrl: z.string().url("URL invalide").optional().or(z.literal("")),
    cvUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface ApplyToProjectModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    projectTitle?: string;
}

export function ApplyToProjectModal({ open, onClose, projectId, projectTitle }: ApplyToProjectModalProps) {
    const { mutate: apply, isPending } = useApplyToProject(projectId);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { applicantNote: "", portfolioUrl: "", cvUrl: "" },
    });

    function onSubmit(values: FormValues) {
        apply(
            {
                applicantNote: values.applicantNote || undefined,
                portfolioUrl: values.portfolioUrl || undefined,
                cvUrl: values.cvUrl || undefined,
            },
            {
                onSuccess: () => {
                    toast.success("Candidature envoyée !");
                    form.reset();
                    onClose();
                },
                onError: (err) => toast.error(err.message),
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Postuler au projet</DialogTitle>
                    {projectTitle && (
                        <DialogDescription className="text-neutral-500">
                            {projectTitle}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        {/* Note de motivation */}
                        <FormField
                            control={form.control}
                            name="applicantNote"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message de motivation <span className="text-neutral-400 font-normal">(optionnel)</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Présentez-vous, expliquez pourquoi vous souhaitez rejoindre ce projet..."
                                            className="resize-none min-h-[110px]"
                                            maxLength={1000}
                                        />
                                    </FormControl>
                                    <div className="flex justify-end">
                                        <span className="text-xs text-neutral-400">{(field.value ?? "").length}/1000</span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Portfolio */}
                        <FormField
                            control={form.control}
                            name="portfolioUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5">
                                        <Link className="w-3.5 h-3.5" />
                                        Lien portfolio <span className="text-neutral-400 font-normal">(optionnel)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="https://monportfolio.com" type="url" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CV */}
                        <FormField
                            control={form.control}
                            name="cvUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5" />
                                        Lien CV / Google Drive <span className="text-neutral-400 font-normal">(optionnel)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="https://drive.google.com/..." type="url" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 pt-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>
                                Annuler
                            </Button>
                            <Button type="submit" className="flex-1 bg-[#ea3d0e] hover:bg-[#d13500]" disabled={isPending}>
                                {isPending ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Envoi...</>
                                ) : (
                                    <><Send className="w-4 h-4 mr-2" />Envoyer ma candidature</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
