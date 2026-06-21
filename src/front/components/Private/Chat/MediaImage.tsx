"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface MediaImageProps {
    url: string;
}

export function MediaImage({ url }: MediaImageProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <img
                src={url}
                alt=""
                className="rounded-xl max-h-64 w-full object-cover cursor-zoom-in"
                onClick={() => setOpen(true)}
            />
            {open && (
                <div
                    className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
                    onClick={() => setOpen(false)}
                >
                    <button
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                    <img
                        src={url}
                        alt=""
                        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
