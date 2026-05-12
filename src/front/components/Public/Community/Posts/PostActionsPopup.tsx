"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/front/components/ui/tooltip";
import { cn } from "@/front/lib/utils";
import { Bookmark, Flag, Ellipsis, Share } from "lucide-react";
import { PostWithUserState } from "@/front/types/post.schema";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useShare } from "@/front/hooks/use-share";
import { useReportPost, useToggleSavePost } from "@/front/hooks/queries/use-posts";
import { toast } from "sonner";

interface PostActionsPopupProps {
    post: PostWithUserState;
    isSaved: boolean;
    setIsSaved: (value: boolean) => void;
}

export default function PostActionsPopup({
    post,
    isSaved,
    setIsSaved,
}: PostActionsPopupProps) {
    const { mutate: toggleSavePost } = useToggleSavePost(post.id);
    const { mutate: report } = useReportPost(post.id);

    const requireAuth = useRequireAuth();
    const share = useShare();

    function handleSave(e: React.MouseEvent) {
        e.stopPropagation();
        requireAuth(() => {
            const nextSaved = !isSaved;
            setIsSaved(nextSaved);
            toggleSavePost();
        });
    }

    function handleReport(e: React.MouseEvent) {
        e.stopPropagation();
        requireAuth(() => {
            report(undefined, { onSuccess: () => toast.success("Post signalé.") });
        });
    }

    function handleShare(e: React.MouseEvent) {
        e.stopPropagation();
        share(`/community/${post.category.slug}/post/${post.id}`, post.content.slice(0, 60));
    }

    const menuItems = [
        {
            icon: Share,
            label: "Partager",
            onClick: handleShare,
            className: "",
        },
        {
            icon: Bookmark,
            label: isSaved ? "Enregistré" : "Enregistrer",
            onClick: handleSave,
            className: "",
            filled: isSaved,
        },
        {
            icon: Flag,
            label: "Signaler",
            onClick: handleReport,
            className: "text-red-500",
        },
    ];

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                            <Ellipsis className="w-5 h-5 text-neutral-500" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-44 p-1" align="end">
                        {menuItems.map(({ icon: Icon, label, className, onClick, filled }) => (
                            <button
                                key={label}
                                className={cn(
                                    "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                                    className
                                )}
                                onClick={onClick}
                            >
                                <Icon className={cn("w-4 h-4", filled ? "fill-neutral-900 text-neutral-900 dark:fill-neutral-100 dark:text-neutral-100" : "")} />
                                {label}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>
            </TooltipTrigger>
            <TooltipContent><p>Plus d'options</p></TooltipContent>
        </Tooltip>
    );
}
