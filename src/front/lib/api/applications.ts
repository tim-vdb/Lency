// Fetch wrappers pour les candidatures

export interface ApplicationData {
  applicantNote?: string;
  portfolioUrl?: string;
  cvUrl?: string;
}

export async function applyToProject(projectId: string, data?: ApplicationData) {
  const res = await fetch(`/api/projects/${projectId}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data ?? {}),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to apply");
  }
  return res.json();
}

export async function acceptApplication(applicationId: string, ownerNote?: string) {
  const res = await fetch(`/api/applications/${applicationId}/accept`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerNote }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to accept application");
  }
  return res.json();
}

export async function rejectApplication(applicationId: string, ownerNote?: string) {
  const res = await fetch(`/api/applications/${applicationId}/reject`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerNote }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to reject application");
  }
  return res.json();
}

export async function fetchApplicationById(applicationId: string) {
    const res = await fetch(`/api/applications/${applicationId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors de la récupération de la candidature");
    return (await res.json()).application;
}

export async function getProjectApplications(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/applications`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}
