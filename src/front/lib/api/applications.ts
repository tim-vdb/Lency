// Fetch wrappers pour les candidatures

export async function applyToProject(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to apply");
  }
  return res.json();
}

export async function acceptApplication(applicationId: string) {
  const res = await fetch(`/api/applications/${applicationId}/accept`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to accept application");
  }
  return res.json();
}

export async function rejectApplication(applicationId: string) {
  const res = await fetch(`/api/applications/${applicationId}/reject`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to reject application");
  }
  return res.json();
}

export async function getProjectApplications(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/applications`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }
  return res.json();
}
