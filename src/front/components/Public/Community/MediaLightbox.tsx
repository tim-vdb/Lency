"use client";

import { Dialog, DialogContent, DialogTitle } from "@/front/components/ui/dialog";
import { cn } from "@/front/lib/utils";
import { Expand, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface MediaLightboxProps {
    type: "image" | "video";
    src: string;
    alt?: string;
    // Uncontrolled (wraps a trigger element — used for images)
    children?: React.ReactNode;
    // Controlled (trigger lives outside — used for videos)
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function MediaLightbox({
    type,
    src,
    alt = "",
    children,
    open: openProp,
    onOpenChange,
}: MediaLightboxProps) {
    const [openInternal, setOpenInternal] = useState(false);
    const [zoomed, setZoomed] = useState(false);

    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : openInternal;

    function handleOpenChange(v: boolean) {
        if (!v) setZoomed(false);
        if (isControlled) onOpenChange?.(v);
        else setOpenInternal(v);
    }

    return (
        <>
            {children && (
                <div className="cursor-zoom-in" onClick={() => handleOpenChange(true)}>
                    {children}
                </div>
            )}

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent
                    className="max-w-none w-screen h-screen p-0 bg-black/96 border-0 flex flex-col items-center justify-center rounded-none [&>button]:text-white/60 [&>button]:hover:text-white [&>button]:top-4 [&>button]:right-4"
                    aria-describedby={undefined}
                >
                    <DialogTitle className="sr-only">{alt || "Média"}</DialogTitle>

                    {type === "image" ? (
                        <>
                            {/* Image area — click toggles zoom */}
                            <div
                                className={cn(
                                    "flex-1 flex items-center justify-center w-full overflow-auto p-6",
                                    zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                                )}
                                onClick={() => setZoomed((z) => !z)}
                            >
                                <img
                                    src={src}
                                    alt={alt}
                                    draggable={false}
                                    className={cn(
                                        "select-none transition-all duration-300 object-contain rounded-sm",
                                        zoomed
                                            ? "max-w-none max-h-none w-auto h-auto scale-150 origin-center"
                                            : "max-w-full max-h-[82vh]"
                                    )}
                                />
                            </div>

                            {/* Bottom bar */}
                            <div className="flex items-center justify-between w-full px-6 py-3 shrink-0 border-t border-white/10">
                                <p className="text-white/40 text-xs truncate max-w-sm">{alt}</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
                                    className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs"
                                >
                                    {zoomed
                                        ? <><ZoomOut className="w-4 h-4" /> Dézoomer</>
                                        : <><ZoomIn className="w-4 h-4" /> Zoomer</>
                                    }
                                </button>
                            </div>
                        </>
                    ) : (
                        <video
                            src={src}
                            controls
                            autoPlay
                            className="max-w-[92vw] max-h-[88vh] rounded-xl shadow-2xl"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

// Expand icon overlay — composable hover chip to place over any media
export function MediaExpandOverlay({ className }: { className?: string }) {
    return (
        <div className={cn(
            "absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
            className
        )}>
            <Expand className="w-4 h-4" />
        </div>
    );
}
