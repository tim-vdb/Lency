import { ProjectApplicationAction } from "@/back/repositories/project-applications.action";
import { NotificationService } from "@/back/services/notifications.service";
import { getUser } from "@/back/lib/auth-session";
import { prisma } from "@/back/lib/prisma";
import {
  notifyProjectOwnerNewApplication,
  notifyUserApplicationStatus,
  notifyAddedToProject,
} from "@/back/lib/ably";
import { getDisplayName } from "@/front/lib/utils";

export const ProjectApplicationService = {
  // Candidater à un projet
  apply: async (projectId: string, data?: { applicantNote?: string; portfolioUrl?: string; cvUrl?: string }) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Vérifier que le projet existe
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new Error("Project not found");

    // Vérifier que l'utilisateur n'est pas le propriétaire
    if (project.ownerId === user.id) {
      throw new Error("Cannot apply to your own project");
    }

    // Vérifier qu'il n'a pas déjà candidaté
    const existing = await ProjectApplicationAction.findByProjectAndUser(
      projectId,
      user.id
    );
    if (existing) throw new Error("Already applied to this project");

    const application = await ProjectApplicationAction.create({
      projectId,
      userId: user.id,
      applicantNote: data?.applicantNote,
      portfolioUrl: data?.portfolioUrl,
      cvUrl: data?.cvUrl,
    });

    const applicantName = getDisplayName(user);

    // Persister en DB + livrer en temps réel via Ably
    await NotificationService.createForUser(
      project.ownerId,
      "new_application",
      `${applicantName} a demandé à rejoindre votre projet`,
      `Nouveau membre souhaitant rejoindre "${project.title}"`,
      { applicationId: application.id, projectId, projectTitle: project.title, applicantId: user.id, applicantName }
    );

    await notifyProjectOwnerNewApplication(
      project.ownerId,
      projectId,
      applicantName,
      user.id,
      application.id
    );

    return application;
  },

  // Accepter une candidature (propriétaire du projet)
  accept: async (applicationId: string, ownerNote?: string) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const app = await ProjectApplicationAction.findById(applicationId);
    if (!app) throw new Error("Application not found");

    // Vérifier que l'utilisateur est le propriétaire du projet
    const project = await prisma.project.findUnique({
      where: { id: app.projectId },
    });
    if (project?.ownerId !== user.id) {
      throw new Error("You are not the project owner");
    }

    // Accepter et ajouter aux participants
    const updated = await ProjectApplicationAction.updateStatus(
      applicationId,
      "ACCEPTED",
      ownerNote
    );

    // Ajouter l'utilisateur aux participants du projet
    await prisma.project.update({
      where: { id: app.projectId },
      data: { participants: { connect: { id: app.userId } } },
    });

    // Récupérer le nom du propriétaire pour la notification
    const projectOwner = await prisma.user.findUnique({ where: { id: user.id } });
    const ownerName = projectOwner?.firstname && projectOwner?.lastname
      ? `${projectOwner.firstname} ${projectOwner.lastname}`
      : projectOwner?.username || "Propriétaire";

    // Retirer la notification "new_application" du propriétaire
    await NotificationService.dismissApplicationNotification(user.id, applicationId);

    await NotificationService.createForUser(
      app.userId,
      "application_status",
      `Candidature acceptée ✅`,
      ownerNote
        ? `${ownerName} : "${ownerNote}"`
        : `Votre candidature au projet "${project.title}" a été acceptée`,
      { applicationId, projectId: app.projectId, projectTitle: project.title, status: "ACCEPTED", ownerNote }
    );

    await notifyUserApplicationStatus(app.userId, project.title, "ACCEPTED", applicationId);

    // Notifier que l'utilisateur a été ajouté au projet
    await NotificationService.createForUser(
      app.userId, "added_to_project",
      `Vous avez été ajouté au projet "${project.title}"`,
      `${ownerName} vous a accepté en tant que participant`,
      { projectId: app.projectId, projectTitle: project.title, addedByName: ownerName }
    );
    await notifyAddedToProject(app.userId, project.title, app.projectId, ownerName);

    return updated;
  },

  // Refuser une candidature (propriétaire du projet)
  reject: async (applicationId: string, ownerNote?: string) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const app = await ProjectApplicationAction.findById(applicationId);
    if (!app) throw new Error("Application not found");

    // Vérifier que l'utilisateur est le propriétaire du projet
    const project = await prisma.project.findUnique({
      where: { id: app.projectId },
    });
    if (project?.ownerId !== user.id) {
      throw new Error("You are not the project owner");
    }

    const ownerName = user.firstname && user.lastname
      ? `${user.firstname} ${user.lastname}`
      : user.username || "Propriétaire";

    const updated = await ProjectApplicationAction.updateStatus(
      applicationId,
      "REJECTED",
      ownerNote
    );

    // Retirer la notification "new_application" du propriétaire
    await NotificationService.dismissApplicationNotification(user.id, applicationId);

    await NotificationService.createForUser(
      app.userId,
      "application_status",
      `Candidature refusée`,
      ownerNote
        ? `${ownerName} : "${ownerNote}"`
        : `Votre candidature au projet "${project.title}" n'a pas été retenue`,
      { applicationId, projectId: app.projectId, projectTitle: project.title, status: "REJECTED", ownerNote }
    );

    await notifyUserApplicationStatus(app.userId, project.title, "REJECTED", applicationId);

    return updated;
  },

  // Récupérer les candidatures d'un projet
  getProjectApplications: async (projectId: string) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Vérifier que l'utilisateur est le propriétaire
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (project?.ownerId !== user.id) {
      throw new Error("You are not the project owner");
    }

    return ProjectApplicationAction.findByProjectId(projectId);
  },

  // Récupérer les candidatures de l'utilisateur
  getUserApplications: async () => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    return ProjectApplicationAction.findByUserId(user.id);
  },
};
