"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/front/components/ui/form";
import { Item, ItemContent } from "@/front/components/ui/item";
import { useCreateComment } from "@/front/hooks/querys/use-posts";
import { CreateCommentFormValues, CreateCommentSchema } from "@/front/types/comment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CommentRoot({ postId }: { postId: string }) {
    const { mutate: createComment, isPending } = useCreateComment(postId);


    const form = useForm<CreateCommentFormValues>({
        resolver: zodResolver(CreateCommentSchema),
        defaultValues: { content: "" },
    });

    function onSubmit(values: CreateCommentFormValues) {
        createComment(
            { content: values.content, postId },
            {
                onSuccess: () => {
                    toast.success("Commentaire publié.");
                    form.reset();
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
                },
            }
        );
    }

    return (
        <Item variant={"outline"} className="w-full text-center text-md border-2 p-0">
            <ItemContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
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
                                            className="w-full text-sm border border-neutral-200 rounded-md p-4 outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
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
                    </form>
                </Form>
            </ItemContent>
        </Item>

    );
}