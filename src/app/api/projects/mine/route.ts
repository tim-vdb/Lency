import { NextResponse } from "next/server";
import { getUser } from "@/back/lib/auth-session";
import { ProjectsAction } from "@/back/repositories/projects.action";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const projects = await ProjectsAction.findByUser(user.id);
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
