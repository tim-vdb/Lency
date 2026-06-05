import { toast } from "sonner";

export function useShare() {
    return async function share(url: string, title: string) {
        if (typeof window === "undefined") return;

        const fullUrl = url.startsWith("https://") ? url : `${window.location.origin}${url}`;

        if (window.navigator.share) {
            try {
                await window.navigator.share({ title, url: fullUrl });
                return;
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
            }
        }

        try {
            await window.navigator.clipboard.writeText(fullUrl);
            toast.success("Lien copié dans le presse-papiers.");
        } catch {
            toast.error("Impossible de copier le lien.");
        }
    };
}
