"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Filter, ExternalLink, FileText, BookOpen, Users } from "lucide-react";
import { Button } from "@/front/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/front/components/ui/select";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { useProjectApplications, useAcceptApplication, useRejectApplication } from "@/front/hooks/queries/use-applications";
import { useProjectById } from "@/front/hooks/queries/use-projects";
import { useUser } from "@/front/context/UserContext";
import {
    ApplicationResponseModal,
    type ApplicationForModal,
} from "@/front/components/Public/Marketplace/Projects/ApplicationResponseModal";
import { notificationQueries } from "@/front/hooks/queries/use-notifications";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    ACCEPTED: "Accepté",
    REJECTED: "Refusé",
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-700",
};

type ApplicationStatus = "all" | "PENDING" | "ACCEPTED" | "REJECTED";

interface Props { projectId: string }

export function ProjectApplicationsPageClient({ projectId }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const currentUser = useUser();

    const { data: project } = useProjectById(projectId);
    const { data: applicationsData, isLoading } = useProjectApplications(projectId);
    const applications: ApplicationWithUser[] = applicationsData?.applications ?? [];

    const { mutate: accept, isPending: isAccepting } = useAcceptApplication();
    const { mutate: reject, isPending: isRejecting } = useRejectApplication();

    const [selectedApp, setSelectedApp] = useState<ApplicationForModal | null>(null);
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [portfolioOnly, setPortfolioOnly] = useState(false);
    const [talentOnly, setTalentOnly] = useState(false);

    // Redirect non-owners
    const isOwner = project?.ownerId === currentUser?.id;

    // Collect all roles across applicants for the filter dropdown
    const allRoles = useMemo(() => {
        const set = new Set<string>();
        for (const app of applications) {
            const config = app.user.configs?.find((c: UserConfig) => c.title === "roles");
            const roles = (config?.content as Record<string, string[]>)?.roles ?? [];
            roles.forEach((r: string) => set.add(r));
        }
        return Array.from(set).sort();
    }, [applications]);

    const filtered = useMemo(() => {
        return applications.filter((app) => {
            if (statusFilter !== "all" && app.status !== statusFilter) return false;
            if (portfolioOnly && !app.portfolioUrl && !app.user.portfolio) return false;
            if (talentOnly && !app.user.isMarketplaceTalent) return false;
            if (roleFilter !== "all") {
                const config = app.user.configs?.find((c: UserConfig) => c.title === "roles");
                const roles = (config?.content as Record<string, string[]>)?.roles ?? [];
                if (!roles.includes(roleFilter)) return false;
            }
            return true;
        });
    }, [applications, statusFilter, roleFilter, portfolioOnly, talentOnly]);

    function openModal(app: ApplicationWithUser) {
        setSelectedApp({
            id: app.id,
            applicantNote: app.applicantNote,
            portfolioUrl: app.portfolioUrl,
            cvUrl: app.cvUrl,
            user: {
                id: app.user.id,
                firstname: app.user.firstname,
                lastname: app.user.lastname,
                username: app.user.username,
                image: app.user.image,
                bio: app.user.bio,
                portfolio: app.user.portfolio,
                cv: app.user.cv,
                badges: app.user.badges,
                configs: app.user.configs,
            },
        });
    }

    function handleAccept(applicationId: string, ownerNote: string) {
        accept({ applicationId, ownerNote }, {
            onSuccess: () => {
                toast.success("Candidature acceptée !");
                setSelectedApp(null);
                queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
            },
            onError: (err) => toast.error(err.message),
        });
    }

    function handleReject(applicationId: string, ownerNote: string) {
        reject({ applicationId, ownerNote }, {
            onSuccess: () => {
                toast.success("Candidature refusée");
                setSelectedApp(null);
                queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
            },
            onError: (err) => toast.error(err.message),
        });
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* En-tête */}
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/marketplace/${projectId}`)}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold">Candidatures</h1>
                    {project && (
                        <p className="text-sm text-neutral-500">{project.title}</p>
                    )}
                </div>
                <Badge variant="secondary" className="ml-auto">
                    {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                </Badge>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-neutral-50 rounded-lg">
                <Filter className="w-4 h-4 text-neutral-400 shrink-0" />

                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ApplicationStatus)}>
                    <SelectTrigger className="h-8 text-xs w-[130px]">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="ACCEPTED">Accepté</SelectItem>
                        <SelectItem value="REJECTED">Refusé</SelectItem>
                    </SelectContent>
                </Select>

                {allRoles.length > 0 && (
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="h-8 text-xs w-[140px]">
                            <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les rôles</SelectItem>
                            {allRoles.map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <button
                    onClick={() => setPortfolioOnly(v => !v)}
                    className={`h-8 px-3 text-xs rounded-md border transition-colors ${
                        portfolioOnly ? "bg-black text-white border-black" : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                    }`}
                >
                    Portfolio
                </button>

                <button
                    onClick={() => setTalentOnly(v => !v)}
                    className={`h-8 px-3 text-xs rounded-md border transition-colors ${
                        talentOnly ? "bg-black text-white border-black" : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                    }`}
                >
                    Talent marketplace
                </button>
            </div>

            {/* Liste */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300" />
                </div>
            ) : !isOwner && project ? (
                <div className="text-center py-16 text-neutral-400 text-sm">
                    Accès réservé au créateur du projet.
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <Users className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                    <p className="text-sm text-neutral-400">Aucune candidature ne correspond aux filtres</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((app) => (
                        <ApplicationCard
                            key={app.id}
                            app={app}
                            onRespond={() => openModal(app)}
                        />
                    ))}
                </div>
            )}

            <ApplicationResponseModal
                application={selectedApp}
                onAccept={handleAccept}
                onReject={handleReject}
                onClose={() => setSelectedApp(null)}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
            />
        </div>
    );
}

// ─── Types locaux ─────────────────────────────────────────────────────────────

interface UserConfig { title: string; content: unknown }

interface ApplicationWithUser {
    id: string;
    status: string;
    appliedAt: string;
    applicantNote?: string | null;
    portfolioUrl?: string | null;
    cvUrl?: string | null;
    ownerNote?: string | null;
    user: {
        id: string;
        firstname: string | null;
        lastname: string | null;
        username: string | null;
        image: string | null;
        bio?: string | null;
        portfolio?: string | null;
        cv?: string | null;
        isMarketplaceTalent?: boolean;
        badges?: Array<{ id: string; name: string }>;
        configs?: UserConfig[];
        socialLinks?: Array<{ platform: string; url: string }>;
    };
}

// ─── ApplicationCard ──────────────────────────────────────────────────────────

function ApplicationCard({ app, onRespond }: { app: ApplicationWithUser; onRespond: () => void }) {
    const displayName = getDisplayName(app.user);
    const initials = getInitialName(app.user);

    const rolesConfig = app.user.configs?.find((c) => c.title === "roles");
    const roles: string[] = rolesConfig
        ? ((rolesConfig.content as Record<string, string[]>)?.roles ?? [])
        : [];

    const portfolioLink = app.portfolioUrl || app.user.portfolio;
    const cvLink = app.cvUrl || app.user.cv;

    return (
        <div className="rounded-xl border border-neutral-200 p-4 bg-white hover:border-neutral-300 transition-colors">
            {/* Header */}
            <div className="flex items-start gap-3">
                <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage src={app.user.image ?? undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{displayName}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[app.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                            {STATUS_LABELS[app.status] ?? app.status}
                        </span>
                        {app.user.isMarketplaceTalent && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange/10 text-orange">Talent</span>
                        )}
                    </div>

                    {app.user.bio && (
                        <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">{app.user.bio}</p>
                    )}

                    {roles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            {roles.slice(0, 5).map((r) => (
                                <Badge key={r} variant="secondary" className="text-[10px] px-1.5 py-0">{r}</Badge>
                            ))}
                            {roles.length > 5 && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{roles.length - 5}</Badge>
                            )}
                        </div>
                    )}
                </div>

                <span className="text-xs text-neutral-300 shrink-0 mt-0.5">
                    {new Date(app.appliedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                </span>
            </div>

            {/* Note de motivation */}
            {app.applicantNote && (
                <div className="mt-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                    <p className="text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />Message
                    </p>
                    <p className="text-xs text-neutral-600 line-clamp-3">{app.applicantNote}</p>
                </div>
            )}

            {/* Note du owner si répondu */}
            {app.ownerNote && (
                <div className="mt-2 text-xs text-neutral-500 italic">
                    Votre note : &ldquo;{app.ownerNote}&rdquo;
                </div>
            )}

            {/* Footer : liens + bouton */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                {portfolioLink && (
                    <a href={portfolioLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-neutral-500 hover:text-black transition-colors">
                        <ExternalLink className="w-3 h-3" />Portfolio
                    </a>
                )}
                {cvLink && (
                    <a href={cvLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-neutral-500 hover:text-black transition-colors">
                        <FileText className="w-3 h-3" />CV
                    </a>
                )}
                {app.status === "PENDING" && (
                    <Button size="sm" className="ml-auto h-7 text-xs bg-orange hover:bg-orange/90"
                        onClick={onRespond}>
                        Répondre →
                    </Button>
                )}
            </div>
        </div>
    );
}
