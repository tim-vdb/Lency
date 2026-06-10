"use client";

import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Project } from "@/front/lib/api/projects";
import { Calendar, MapPin } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

/*
  Popup hover : 176 × 102 px (spec design)
  Leaflet .leaflet-popup-content margin par défaut : 13px 19px
  → Override via .compact-popup pour margin: 10px 10px
  → Content width: 156px (176 - 2×10px)
  → Content height: 82px (102 - 2×10px)

  Layout interne (82px) :
  - Avatar (24px) + titre (2 lignes × 15px) côte à côte → 30px
  - gap 5px
  - Méta date/lieu → 14px
  - gap 5px
  - Bouton CTA → 24px
  Total : 30 + 5 + 14 + 5 + 24 = 78px ✓
*/
const COMPACT_POPUP_STYLES = `
    .compact-popup .leaflet-popup-content-wrapper {
        padding: 0;
        border-radius: 8px;
        border: 1px solid #E8E8E1;
        box-shadow: 0 4px 20px rgba(0,0,0,0.10);
    }
    .compact-popup .leaflet-popup-content {
        margin: 10px 10px !important;
        width: 156px !important;
    }
    .compact-popup .leaflet-popup-tip-container {
        display: none;
    }
`;

const icon = L.icon({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface ProjectsMapInnerProps {
    projects: Project[];
}

function PopupCard({ project }: { project: Project }) {
    const dateLabel = project.startDate ? dayjs(project.startDate).format("D MMM") : null;
    const cityName = project.mapLocation?.name ?? null;
    const ownerName =
        project.owner.firstname && project.owner.lastname
            ? `${project.owner.firstname} ${project.owner.lastname}`
            : (project.owner.username ?? "Anonyme");
    const ownerInitials = ownerName.slice(0, 2).toUpperCase();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, width: 156 }}>
            {/* Avatar + titre */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "#E8E8E1", flexShrink: 0, overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 600, color: "#4C4A43",
                }}>
                    {project.owner.image ? (
                        <img
                            src={project.owner.image}
                            alt={ownerName}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : ownerInitials}
                </div>
                <span style={{
                    fontWeight: 600, fontSize: 12, lineHeight: 1.3, color: "#000",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {project.title}
                </span>
            </div>

            {/* Méta */}
            {(dateLabel || cityName) && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {dateLabel && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#8C8A85" }}>
                            <Calendar size={10} />{dateLabel}
                        </span>
                    )}
                    {cityName && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#8C8A85", overflow: "hidden", maxWidth: 100 }}>
                            <MapPin size={10} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cityName}</span>
                        </span>
                    )}
                </div>
            )}

            {/* CTA */}
            <a
                href={`/marketplace/${project.id}`}
                style={{
                    display: "block", padding: "5px 0", fontSize: 11, fontWeight: 600,
                    textAlign: "center", borderRadius: 7,
                    background: "#EA3D0E", color: "#fff", textDecoration: "none", borderRadius: 4,
                }}
            >
                Rejoindre le projet
            </a>
        </div>
    );
}

function HoverMarker({ project }: { project: Project }) {
    const markerRef = useRef<L.Marker>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const cancelClose = () => clearTimeout(closeTimer.current);
    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => markerRef.current?.closePopup(), 250);
    };

    return (
        <Marker
            ref={markerRef}
            position={[project.mapLocation!.latitude, project.mapLocation!.longitude]}
            icon={icon}
            eventHandlers={{
                mouseover: () => { cancelClose(); markerRef.current?.openPopup(); },
                mouseout: scheduleClose,
            }}
        >
            <Popup
                className="compact-popup"
                closeButton={false}
                autoClose={false}
                closeOnClick={false}
                maxWidth={176}
                minWidth={176}
            >
                <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                    <PopupCard project={project} />
                </div>
            </Popup>
        </Marker>
    );
}

export function ProjectsMapInner({ projects }: ProjectsMapInnerProps) {
    return (
        <>
            <style>{COMPACT_POPUP_STYLES}</style>
            <MapContainer center={[46.6, 2.3]} zoom={6} className="h-full w-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap"
                />
                {projects
                    .filter((p) => p.mapLocation)
                    .map((p) => (
                        <HoverMarker key={p.id} project={p} />
                    ))}
            </MapContainer>
        </>
    );
}
