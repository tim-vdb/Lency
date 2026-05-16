"use client"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Project } from "@/front/lib/api/projects"

// Fix l'icône par défaut de Leaflet (bug connu avec webpack/turbopack)
const icon = L.icon({
    iconUrl: "/marker-icon.png",       // à copier dans /public
    iconRetinaUrl: "/marker-icon-2x.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

export function ProjectsMapInner({ projects }: { projects: Project[] }) {
    return (
        <MapContainer center={[46.6, 2.3]} zoom={6} className="h-full w-full">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© OpenStreetMap'
            />
            {projects
                .filter((p) => p.mapLocation)
                .map((p) => (
                    <Marker
                        key={p.id}
                        position={[p.mapLocation!.latitude, p.mapLocation!.longitude]}
                        icon={icon}
                    >
                        <Popup>
                            <strong>{p.title}</strong>
                            <p>{p.mapLocation!.name}</p>
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    )
}