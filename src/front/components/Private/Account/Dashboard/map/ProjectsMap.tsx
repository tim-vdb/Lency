import dynamic from "next/dynamic"
import { Project } from "@/front/lib/api/projects"

const ProjectsMapInner = dynamic(
    () => import("./ProjectsMapInner").then((m) => m.ProjectsMapInner),
    { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-muted rounded-lg" /> }
)

interface ProjectsMapProps {
    projects: Project[]
    flyTo?: { lat: number; lon: number }
}

export function ProjectsMap({ projects, flyTo }: ProjectsMapProps) {
    return <ProjectsMapInner projects={projects} flyTo={flyTo} />
}