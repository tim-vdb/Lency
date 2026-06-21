export interface CreateFeedbackInput {
    description: string;
    imageUrl?: string;
}

export async function createFeedback(data: CreateFeedbackInput): Promise<void> {
    const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de l'envoi du feedback");
}
