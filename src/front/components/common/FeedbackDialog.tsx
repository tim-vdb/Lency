"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateFeedbackSchema, type CreateFeedbackFormValues } from "@/front/schemas/zod/feedback.zod";

import { Button } from "@/front/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/front/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/front/components/ui/form";
import { Textarea } from "@/front/components/ui/textarea";
import ImageKitUploader from "@/front/components/common/ImageKitUploader";
import { useCreateFeedback } from "@/front/queries/feedback";

interface FeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
    const { mutate, isPending } = useCreateFeedback();

    const form = useForm<CreateFeedbackFormValues>({
        resolver: zodResolver(CreateFeedbackSchema),
        defaultValues: { description: "", imageUrl: null },
    });

    function onSubmit(values: CreateFeedbackFormValues) {
        mutate(
            {
                description: values.description,
                imageUrl: values.imageUrl ?? undefined,
            },
            {
                onSuccess: () => {
                    toast.success("Feedback envoyé, merci !");
                    form.reset();
                    onOpenChange(false);
                },
                onError: () => toast.error("Erreur lors de l'envoi du feedback."),
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Envoyer un feedback</DialogTitle>
                    <DialogDescription>
                        Un bug, une suggestion, une idée ? Décris-le et joins un screenshot si besoin.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décris le problème ou la suggestion..."
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capture d'écran (optionnel)</FormLabel>
                                    <FormControl>
                                        <ImageKitUploader
                                            value={field.value ?? null}
                                            onChange={field.onChange}
                                            kind="image"
                                            folder="/feedbacks"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Envoi..." : "Envoyer"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
