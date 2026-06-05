import { ProjectInvitationAction } from "@/back/repositories/project-invitations.action";
import { NotificationService } from "@/back/services/notifications.service";
import { getUser } from "@/back/lib/auth-session";
import { prisma } from "@/back/lib/prisma";
import { notifyProjectInvitation, notifyInvitationUpdate } from "@/back/lib/ably";
import { getDisplayName } from "@/front/lib/utils";

export const ProjectInvitationService = {
    send: async (projectId: string, targetUserId: string) => {
        const owner = await getUser();
        if (!owner) throw new Error("Unauthorized");

        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project) throw new Error("Project not found");
        if (project.ownerId !== owner.id) throw new Error("You are not the project owner");
        if (targetUserId === owner.id) throw new Error("Cannot invite yourself");

        const existing = await ProjectInvitationAction.findByProjectAndUser(projectId, targetUserId);
        if (existing) throw new Error("Already invited");

        const invitation = await ProjectInvitationAction.create({ projectId, userId: targetUserId });

        const ownerName = getDisplayName(owner);

        await NotificationService.createForUser(
            targetUserId,
            "project_invitation",
            `Vous avez été invité à rejoindre "${project.title}"`,
            `${ownerName} vous invite à rejoindre son projet`,
            { projectId, projectTitle: project.title, invitationId: invitation.id, ownerId: owner.id, ownerName }
        );

        await notifyProjectInvitation(targetUserId, project.title, projectId, invitation.id, ownerName);

        return invitation;
    },

    accept: async (invitationId: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const inv = await ProjectInvitationAction.findById(invitationId);
        if (!inv) throw new Error("Invitation not found");
        if (inv.userId !== user.id) throw new Error("Unauthorized");

        const updated = await ProjectInvitationAction.updateStatus(invitationId, "ACCEPTED");

        await prisma.project.update({
            where: { id: inv.projectId },
            data: { participants: { connect: { id: user.id } } },
        });

        const memberName = getDisplayName(user);
        await NotificationService.createForUser(
            inv.project.ownerId,
            "invitation_accepted",
            `${memberName} a rejoint votre projet`,
            `${memberName} a accepté votre invitation et rejoint "${inv.project.title}"`,
            {
                projectId: inv.projectId,
                projectTitle: inv.project.title,
                userId: user.id,
                memberName,
                actorImage: user.image ?? user.avatarUrl ?? null,
            }
        );
        await notifyInvitationUpdate(inv.project.ownerId, inv.projectId, "ACCEPTED");

        return updated;
    },

    reject: async (invitationId: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const inv = await ProjectInvitationAction.findById(invitationId);
        if (!inv) throw new Error("Invitation not found");
        if (inv.userId !== user.id) throw new Error("Unauthorized");

        const updated = await ProjectInvitationAction.updateStatus(invitationId, "REJECTED");
        await notifyInvitationUpdate(inv.project.ownerId, inv.projectId, "REJECTED");

        return updated;
    },

    listForProject: async (projectId: string) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (project?.ownerId !== user.id) throw new Error("You are not the project owner");

        return ProjectInvitationAction.findByProjectId(projectId);
    },
};
