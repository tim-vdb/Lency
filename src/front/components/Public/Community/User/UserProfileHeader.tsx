"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent } from "@/front/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/front/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/front/components/ui/form";
import { Input } from "@/front/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/front/components/ui/select";
import { Textarea } from "@/front/components/ui/textarea";
import { useUser } from "@/front/context/UserContext";
import { useDeleteSocialLink, useReportUser, useToggleFollowUser, useUpdateUser, useUpsertSocialLink } from "@/front/hooks/queries/use-users";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { cn, getDisplayName, getInitialName } from "@/front/lib/utils";
import { UserProfile } from "@/front/types/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Flag, MessageCircleMore, Pencil, Plus, Trash2, UserRoundCheck, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaBehance, FaBluesky, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import { z } from "zod";

const PLATFORMS = [
    { value: "portfolio", label: "Portfolio", icon: Briefcase },
    { value: "instagram", label: "Instagram", icon: FaInstagram },
    { value: "behance", label: "Behance", icon: FaBehance },
    { value: "tiktok", label: "TikTok", icon: FaTiktok },
    { value: "facebook", label: "Facebook", icon: FaFacebook },
    { value: "twitter", label: "X / Twitter", icon: FaXTwitter },
    { value: "youtube", label: "YouTube", icon: FaYoutube },
    { value: "bluesky", label: "Bluesky", icon: FaBluesky },
    { value: "linkedin", label: "LinkedIn", icon: FaLinkedin },
    { value: "github", label: "GitHub", icon: FaGithub },
] as const;

function getPlatformIcon(value: string) {
    return PLATFORMS.find((p) => p.value === value)?.icon ?? Briefcase;
}

function getPlatformLabel(value: string) {
    return PLATFORMS.find((p) => p.value === value)?.label ?? value;
}

const profileSchema = z.object({
    bio: z.string().max(300, "300 caractères max").optional(),
});

const socialLinkSchema = z.object({
    platform: z.string().min(1, "Choisis un réseau"),
    url: z.string().regex(/^https?:\/\/.+/, "URL invalide (commence par http:// ou https://)"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

function EditBioDialog({ user, children }: { user: UserProfile; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const { mutate: updateUser, isPending } = useUpdateUser();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { bio: user.bio ?? "" },
    });

    function onSubmit(values: ProfileFormValues) {
        updateUser(
            { id: user.id, data: { bio: values.bio || undefined } },
            {
                onSuccess: () => { toast.success("Bio mise à jour."); setOpen(false); },
                onError: () => toast.error("Une erreur est survenue."),
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Modifier la bio</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Parle-nous de toi..." className="resize-none" rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending} className="w-full">Enregistrer</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function AddSocialLinkDialog({ user, children }: { user: UserProfile; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const { mutate: upsert, isPending } = useUpsertSocialLink(user.username ?? "");

    const existingPlatforms = new Set(user.socialLinks.map((l) => l.platform));
    const availablePlatforms = PLATFORMS.filter((p) => !existingPlatforms.has(p.value));

    const form = useForm<SocialLinkFormValues>({
        resolver: zodResolver(socialLinkSchema),
        defaultValues: { platform: "", url: "" },
    });

    function onSubmit(values: SocialLinkFormValues) {
        upsert(values, {
            onSuccess: () => { toast.success("Lien ajouté."); setOpen(false); form.reset(); },
            onError: () => toast.error("Une erreur est survenue."),
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Ajouter un réseau social</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Réseau</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un réseau..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availablePlatforms.map((p) => {
                                                const Icon = p.icon;
                                                return (
                                                    <SelectItem key={p.value} value={p.value}>
                                                        <span className="flex items-center gap-2">
                                                            <Icon className="w-4 h-4" />
                                                            {p.label}
                                                        </span>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending || availablePlatforms.length === 0} className="w-full">
                            Ajouter
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function UserProfileHeader({ user }: { user: UserProfile }) {
    const currentUser = useUser();
    const requireAuth = useRequireAuth();
    const isOwnProfile = !!currentUser && currentUser.id === user.id;

    const [isFollowed, setIsFollowed] = useState(user.isFollowed);
    const [isReported, setIsReported] = useState(user.isReported);

    const { mutate: toggleFollow, isPending: followPending } = useToggleFollowUser(user.id, user.username ?? "");
    const { mutate: report, isPending: reportPending } = useReportUser(user.id);
    const { mutate: deleteLink } = useDeleteSocialLink(user.username ?? "");

    const displayName = getDisplayName(user);
    const initials = getInitialName(user);
    const level = user._count.Posts + user._count.projects * 5;

    function handleFollow() {
        requireAuth(() => {
            const next = !isFollowed;
            toggleFollow(undefined, {
                onSuccess: () => { setIsFollowed(next); toast.success(next ? "Utilisateur suivi." : "Utilisateur désuivi."); },
                onError: (error) => { setIsFollowed(isFollowed); toast.error(error.message || "Une erreur est survenue."); },
            });
        });
    }

    function handleReport() {
        requireAuth(() => {
            const next = !isReported;
            report(undefined, {
                onSuccess: () => { setIsReported(next); toast.success(next ? "Utilisateur signalé." : "Signalement retiré."); },
                onError: (error) => { setIsReported(isReported); toast.error(error.message || "Une erreur est survenue."); },
            });
        });
    }

    function handleDeleteLink(platform: string) {
        deleteLink(platform, {
            onSuccess: () => toast.success("Lien supprimé."),
            onError: () => toast.error("Une erreur est survenue."),
        });
    }

    return (
        <Card className="shrink-0 w-64 py-5 min-w-md">
            <CardContent className="flex flex-col gap-4 px-5">
                {/* Avatar + level */}
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={user.image ?? undefined} alt={displayName} />
                            <AvatarFallback className="text-lg bg-pink-100 text-pink-700">{initials}</AvatarFallback>
                        </Avatar>
                        <Badge className="absolute top-0 right-1 bg-linear-to-br from-amber-400 to-orange border-0 shadow text-base px-1.5 py-0">
                            {level}
                        </Badge>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <h1 className="text-lg font-bold truncate leading-tight">{displayName}</h1>
                        {!isOwnProfile && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <Button variant={isFollowed ? "default" : "outline"} size="sm" className="h-7 text-xs px-2.5 gap-1" onClick={handleFollow} disabled={followPending}>
                                    {isFollowed ? <UserRoundCheck className="h-3 w-3" /> : <UserRoundPlus className="h-3 w-3" />}
                                    {isFollowed ? "Suivi" : "Suivre"}
                                </Button>
                                <Button variant={isReported ? "destructive" : "outline"} size="sm" className="h-7 text-xs px-2.5 gap-1" onClick={handleReport} disabled={reportPending}>
                                    <Flag className={cn("h-3 w-3", isReported && "fill-white")} />
                                    Signaler
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 gap-1" onClick={() => toast.info("Bientôt disponible")}>
                                    <MessageCircleMore className="h-3 w-3" />
                                    Discuter
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio */}
                {user.bio ? (
                    <div className="flex items-start gap-1.5 group">
                        <p className="text-xs text-neutral-500 leading-relaxed flex-1">{user.bio}</p>
                        {isOwnProfile && (
                            <EditBioDialog user={user}>
                                <button className="text-neutral-300 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5">
                                    <Pencil className="w-3 h-3" />
                                </button>
                            </EditBioDialog>
                        )}
                    </div>
                ) : isOwnProfile ? (
                    <EditBioDialog user={user}>
                        <button className="flex items-center gap-1 text-xs text-neutral-400 hover:text-foreground transition-colors text-left">
                            <Plus className="w-3 h-3 shrink-0" />
                            Ajouter une bio
                        </button>
                    </EditBioDialog>
                ) : null}

                {/* Social links */}
                {(user.socialLinks.length > 0 || isOwnProfile) && (
                    <div className="flex flex-col gap-1.5">
                        {user.socialLinks.map((link) => {
                            const Icon = getPlatformIcon(link.platform);
                            return (
                                <div key={link.platform} className="flex items-center gap-1.5 group">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-foreground transition-colors flex-1 min-w-0"
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{getPlatformLabel(link.platform)}</span>
                                    </a>
                                    {isOwnProfile && (
                                        <button
                                            className="text-neutral-300 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                                            onClick={() => handleDeleteLink(link.platform)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {isOwnProfile && PLATFORMS.some((p) => !user.socialLinks.some((l) => l.platform === p.value)) && (
                            <AddSocialLinkDialog user={user}>
                                <button className="flex items-center gap-1 text-xs text-neutral-400 hover:text-foreground transition-colors text-left mt-0.5">
                                    <Plus className="w-3 h-3 shrink-0" />
                                    Ajouter un réseau social
                                </button>
                            </AddSocialLinkDialog>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
