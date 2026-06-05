import { useState, useEffect } from "react";

type ThumbnailResult = {
    thumbnail: string | null;  // data URL base64, null si pas encore prêt
    ready: boolean;            // true une fois la tentative terminée (succès ou échec)
    failed: boolean;           // true si CORS ou autre erreur — pas de thumbnail dispo
};

export function useVideoThumbnail(videoUrl: string | null | undefined): ThumbnailResult {
    const [state, setState] = useState<ThumbnailResult>({
        thumbnail: null,
        ready: false,
        failed: false,
    });

    useEffect(() => {
        if (!videoUrl) {
            setState({ thumbnail: null, ready: true, failed: false });
            return;
        }

        setState({ thumbnail: null, ready: false, failed: false });

        let cancelled = false;
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.preload = "metadata";
        video.playsInline = true;

        const onLoaded = () => {
            video.currentTime = 5;
        };

        const onSeeked = () => {
            if (cancelled) return;
            try {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth || 1280;
                canvas.height = video.videoHeight || 720;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    setState({ thumbnail: canvas.toDataURL("image/jpeg", 0.8), ready: true, failed: false });
                } else {
                    setState({ thumbnail: null, ready: true, failed: true });
                }
            } catch {
                // Typiquement une SecurityError CORS — le serveur vidéo n'envoie pas Access-Control-Allow-Origin
                if (!cancelled) setState({ thumbnail: null, ready: true, failed: true });
            }
        };

        const onError = () => {
            if (!cancelled) setState({ thumbnail: null, ready: true, failed: true });
        };

        video.addEventListener("loadeddata", onLoaded);
        video.addEventListener("seeked", onSeeked);
        video.addEventListener("error", onError);
        video.src = videoUrl;

        return () => {
            cancelled = true;
            video.removeEventListener("loadeddata", onLoaded);
            video.removeEventListener("seeked", onSeeked);
            video.removeEventListener("error", onError);
            video.src = "";
        };
    }, [videoUrl]);

    return state;
}
