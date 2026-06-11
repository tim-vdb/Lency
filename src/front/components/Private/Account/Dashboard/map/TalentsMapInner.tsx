"use client";

import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Talent } from "@/front/lib/api/talents";
import { getDisplayName, getInitialName } from "@/front/lib/utils";

const COMPACT_POPUP_STYLES = `
    .talent-popup .leaflet-popup-content-wrapper {
        padding: 0;
        border-radius: 8px;
        border: 1px solid #E8E8E1;
        box-shadow: 0 4px 20px rgba(0,0,0,0.10);
    }
    .talent-popup .leaflet-popup-content {
        margin: 10px 10px !important;
        width: 156px !important;
    }
    .talent-popup .leaflet-popup-tip-container {
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

function PopupCard({ talent }: { talent: Talent }) {
    const name = getDisplayName(talent);
    const initials = getInitialName(talent);
    const avatar = talent.image ?? talent.avatarUrl;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, width: 156 }}>
            {/* Avatar + nom */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "#E8E8E1", flexShrink: 0, overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 600, color: "#4C4A43",
                }}>
                    {avatar
                        ? <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : initials}
                </div>
                <span style={{
                    fontWeight: 600, fontSize: 12, lineHeight: 1.3, color: "#000",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {name}
                </span>
            </div>

            {/* Bio ou adresse */}
            {(talent.bio || talent.address) && (
                <p style={{
                    fontSize: 11, color: "#8C8A85", margin: 0,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {talent.bio ?? talent.address}
                </p>
            )}

            {/* CTA */}
            <a
                href={`/user/${talent.username ?? talent.id}`}
                style={{
                    display: "block", padding: "5px 0", fontSize: 11, fontWeight: 600,
                    textAlign: "center", borderRadius: 4,
                    background: "#EA3D0E", color: "#fff", textDecoration: "none",
                }}
            >
                Voir le profil
            </a>
        </div>
    );
}

function HoverMarker({ talent }: { talent: Talent }) {
    const markerRef = useRef<L.Marker>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const cancelClose = () => clearTimeout(closeTimer.current);
    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => markerRef.current?.closePopup(), 250);
    };

    return (
        <Marker
            ref={markerRef}
            position={[talent.latitude!, talent.longitude!]}
            icon={icon}
            eventHandlers={{
                mouseover: () => { cancelClose(); markerRef.current?.openPopup(); },
                mouseout: scheduleClose,
            }}
        >
            <Popup
                className="talent-popup"
                closeButton={false}
                autoClose={false}
                closeOnClick={false}
                maxWidth={176}
                minWidth={176}
            >
                <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                    <PopupCard talent={talent} />
                </div>
            </Popup>
        </Marker>
    );
}

export function TalentsMapInner({ talents }: { talents: Talent[] }) {
    const mappable = talents.filter((t) => t.latitude !== null && t.longitude !== null);

    return (
        <>
            <style>{COMPACT_POPUP_STYLES}</style>
            <MapContainer center={[46.6, 2.3]} zoom={6} className="h-full w-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap"
                />
                {mappable.map((t) => (
                    <HoverMarker key={t.id} talent={t} />
                ))}
            </MapContainer>
        </>
    );
}
