"use client";

import ImageKitUploader from "@/front/components/common/ImageKitUploader";
import { Form, FormControl, FormField, FormItem } from "@/front/components/ui/form";
import { Item, ItemContent } from "@/front/components/ui/item";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useCreateComment } from "@/front/hooks/queries/use-posts";
import { useCreateResourceComment } from "@/front/hooks/queries/use-resources";
import { CommentTarget } from "@/front/types/comment-target";
import { CreateCommentFormValues, CreateCommentSchema } from "@/front/types/comment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CommentRoot({ target }: { target: CommentTarget }) {
    const requireAuth = useRequireAuth();
    const postMutation = useCreateComment(target.type === "post" ? target.id : "");
    const resourceMutation = useCreateResourceComment(target.type === "resource" ? target.id : "");
    const { mutate: createPostComment, isPending: postPending } = postMutation;
    const { mutate: createResourceComment, isPending: resourcePending } = resourceMutation;
    const isPending = target.type === "post" ? postPending : resourcePending;

    const form = useForm<CreateCommentFormValues>({
        resolver: zodResolver(CreateCommentSchema),
        defaultValues: { content: "", imageUrl: null, videoUrl: null },
    });

    const imageUrl = form.watch("imageUrl") ?? null;
    const videoUrl = form.watch("videoUrl") ?? null;

    function onSubmit(values: CreateCommentFormValues) {
        requireAuth(() => {
            const onSuccess = () => {
                toast.success("Commentaire publié.");
                form.reset({ content: "", imageUrl: null, videoUrl: null });
            };
            const onError = (error: unknown) => {
                toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
            };

            if (target.type === "post") {
                createPostComment(
                    {
                        content: values.content,
                        postId: target.id,
                        imageUrl: values.imageUrl,
                        videoUrl: values.videoUrl,
                    },
                    { onSuccess, onError }
                );
            } else {
                createResourceComment(
                    {
                        content: values.content,
                        resourceId: target.id,
                        imageUrl: values.imageUrl,
                        videoUrl: values.videoUrl,
                    },
                    { onSuccess, onError }
                );
            }
        });
    }

    return (
        <Item variant={"outline"} className="w-full text-md border-2 px-3 py-2">
            <ItemContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="Rejoindre la conversation"
                                                className="w-full py-2 text-sm rounded-md outline-none transition-all"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex items-center gap-1 text-xs font-medium bg-neutral-900 text-white px-3 py-2 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50 cursor-pointer"
                                hidden
                            >
                                {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                                Envoyer
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <ImageKitUploader
                                kind="image"
                                value={imageUrl}
                                onChange={(url) => form.setValue("imageUrl", url, { shouldValidate: true })}
                                disabled={isPending}
                            />
                            <ImageKitUploader
                                kind="video"
                                value={videoUrl}
                                onChange={(url) => form.setValue("videoUrl", url, { shouldValidate: true })}
                                disabled={isPending}
                            />
                        </div>
                    </form>
                </Form>
            </ItemContent>
        </Item>
    );
}
