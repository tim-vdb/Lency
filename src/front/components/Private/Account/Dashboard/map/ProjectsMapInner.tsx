"use client"
import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
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

interface ProjectsMapInnerProps {
    projects: Project[]
    addressCoords: { lat: number; lon: number } | null
}

// Composant interne qui utilise le hook useMap()
function MapZoomController({ addressCoords }: { addressCoords: { lat: number; lon: number } | null }) {
    const map = useMap()

    useEffect(() => {
        if (!addressCoords || !map) return
        // Zoom sur l'adresse avec animation
        map.setView([addressCoords.lat, addressCoords.lon], 12, { animate: true, duration: 0.5 })
    }, [addressCoords, map])

    return null
}

export function ProjectsMapInner({ projects, addressCoords }: ProjectsMapInnerProps) {
    return (
        <MapContainer center={[46.6, 2.3]} zoom={6} className="h-full w-full">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© OpenStreetMap'
            />
            <MapZoomController addressCoords={addressCoords} />
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