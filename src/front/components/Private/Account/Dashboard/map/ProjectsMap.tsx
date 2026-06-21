import dynamic from "next/dynamic"
import { Project } from "@/front/lib/api/projects"

const ProjectsMapInner = dynamic(
    () => import("./ProjectsMapInner").then((m) => m.ProjectsMapInner),
    { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-muted rounded-lg" /> }
)

export function ProjectsMap({ projects }: { projects: Project[] }) {
    return <ProjectsMapInner projects={projects} />
}