import { ProjectApplicationAction } from "@/back/repositories/project-applications.action";
import { getUser } from "@/back/lib/auth-session";
import { prisma } from "@/back/lib/prisma";
import {
  notifyProjectOwnerNewApplication,
  notifyUserApplicationStatus,
} from "@/back/lib/ably";
import { getDisplayName } from "@/front/lib/utils";

export const ProjectApplicationService = {
  // Candidater à un projet
  apply: async (projectId: string) => {
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
    });

    // 📢 Envoyer une notification au propriétaire du projet
    const applicantName = getDisplayName(user);

    console.error("[ProjectApplicationService] Notifying owner:", {
      ownerId: project.ownerId,
      projectId,
      applicantName,
      userId: user.id,
      applicationId: application.id,
    });

    await notifyProjectOwnerNewApplication(
      project.ownerId,
      projectId,
      applicantName,
      user.id,
      application.id
    );

    console.error("[ProjectApplicationService] Notification sent successfully");

    return application;
  },

  // Accepter une candidature (propriétaire du projet)
  accept: async (applicationId: string) => {
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
      "ACCEPTED"
    );

    // Ajouter l'utilisateur aux participants du projet
    await prisma.project.update({
      where: { id: app.projectId },
      data: { participants: { connect: { id: app.userId } } },
    });

    // 📢 Envoyer une notification au candidat
    await notifyUserApplicationStatus(
      app.userId,
      project.title,
      "ACCEPTED",
      applicationId
    );

    return updated;
  },

  // Refuser une candidature (propriétaire du projet)
  reject: async (applicationId: string) => {
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

    const updated = await ProjectApplicationAction.updateStatus(
      applicationId,
      "REJECTED"
    );

    // 📢 Envoyer une notification au candidat
    await notifyUserApplicationStatus(
      app.userId,
      project.title,
      "REJECTED",
      applicationId
    );

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
