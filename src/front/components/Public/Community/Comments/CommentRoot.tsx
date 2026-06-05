"use client";

import { CommentMediaUploader, type CommentMedia } from "@/front/components/common/CommentMediaUploader";
import { Form, FormControl, FormField, FormItem } from "@/front/components/ui/form";
import { Item, ItemContent } from "@/front/components/ui/item";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useCreateComment } from "@/front/queries/posts";
import { useCreateResourceComment } from "@/front/queries/resources";
import { useCreateProjectComment } from "@/front/queries/projects";
import { CommentTarget } from "@/front/schemas/types/comment-target.type";
import { CreateCommentFormValues, CreateCommentSchema } from "@/front/schemas/zod/comment.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const EMPTY_MEDIA: CommentMedia = { imageUrls: [], videoUrls: [], audioUrls: [] };

export default function CommentRoot({ target }: { target: CommentTarget }) {
    const requireAuth = useRequireAuth();
    const postMutation = useCreateComment(target.type === "post" ? target.id : "");
    const resourceMutation = useCreateResourceComment(target.type === "resource" ? target.id : "");
    const projectMutation = useCreateProjectComment(target.type === "project" ? target.id : "");
    const isPending =
        target.type === "post" ? postMutation.isPending :
        target.type === "resource" ? resourceMutation.isPending :
        projectMutation.isPending;

    const form = useForm<CreateCommentFormValues>({
        resolver: zodResolver(CreateCommentSchema),
        defaultValues: { content: "", imageUrls: [], videoUrls: [], audioUrls: [] },
    });

    function onSubmit(values: CreateCommentFormValues) {
        requireAuth(() => {
            const onSuccess = () => {
                toast.success("Commentaire publié.");
                form.reset({ content: "", imageUrls: [], videoUrls: [], audioUrls: [] });
            };
            const onError = (error: unknown) => {
                toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
            };

            const payload = {
                content: values.content,
                imageUrls: values.imageUrls,
                videoUrls: values.videoUrls,
                audioUrls: values.audioUrls,
            };

            if (target.type === "post") {
                postMutation.mutate({ ...payload, postId: target.id }, { onSuccess, onError });
            } else if (target.type === "resource") {
                resourceMutation.mutate({ ...payload, resourceId: target.id }, { onSuccess, onError });
            } else {
                projectMutation.mutate({ ...payload, projectId: target.id }, { onSuccess, onError });
            }
        });
    }

    const media: CommentMedia = {
        imageUrls: form.watch("imageUrls"),
        videoUrls: form.watch("videoUrls"),
        audioUrls: form.watch("audioUrls"),
    };

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
                        </div>
                        <Controller
                            control={form.control}
                            name="imageUrls"
                            render={() => (
                                <CommentMediaUploader
                                    value={media}
                                    onChange={(val) => {
                                        form.setValue("imageUrls", val.imageUrls, { shouldValidate: true });
                                        form.setValue("videoUrls", val.videoUrls, { shouldValidate: true });
                                        form.setValue("audioUrls", val.audioUrls, { shouldValidate: true });
                                    }}
                                    disabled={isPending}
                                />
                            )}
                        />
                    </form>
                </Form>
            </ItemContent>
        </Item>
    );
}
