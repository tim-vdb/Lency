"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/front/components/ui/button";
import { Textarea } from "@/front/components/ui/textarea";
import { Send, ImageIcon, Music, Video, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadToImageKit } from "@/front/lib/upload";

export interface ChatMedia {
  imageUrls: string[];
  audioUrls: string[];
  videoUrls: string[];
}

interface ChatInputProps {
  onSend: (content: string, media: ChatMedia) => void;
  isPending?: boolean;
  placeholder?: string;
}

interface PendingFile {
  kind: "image" | "audio" | "video";
  file: File;
  localUrl: string;
}

export function ChatInput({ onSend, isPending, placeholder = "Écrivez un message..." }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const canSend = (value.trim().length > 0 || pending.length > 0) && !isPending && !isUploading;

  function addFile(kind: "image" | "audio" | "video", file: File) {
    const localUrl = URL.createObjectURL(file);
    setPending(prev => [...prev, { kind, file, localUrl }]);
  }

  function removeFile(idx: number) {
    setPending(prev => {
      URL.revokeObjectURL(prev[idx].localUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function handleSend() {
    if (!canSend) return;

    setIsUploading(true);
    try {
      const media: ChatMedia = { imageUrls: [], audioUrls: [], videoUrls: [] };

      for (const pf of pending) {
        const url = await uploadToImageKit(pf.file, "/chat");
        if (pf.kind === "image") media.imageUrls.push(url);
        else if (pf.kind === "audio") media.audioUrls.push(url);
        else media.videoUrls.push(url);
      }

      onSend(value.trim(), media);
      setValue("");
      pending.forEach(pf => URL.revokeObjectURL(pf.localUrl));
      setPending([]);
      textareaRef.current?.focus();
    } catch {
      toast.error("Échec de l'upload");
    } finally {
      setIsUploading(false);
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function onFileChange(kind: "image" | "audio" | "video", e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const limits: Record<string, number> = { image: 5 * 1024 * 1024, audio: 20 * 1024 * 1024, video: 50 * 1024 * 1024 };
    if (file.size > limits[kind]) {
      toast.error(`Fichier trop volumineux (max ${kind === "image" ? "5Mo" : kind === "audio" ? "20Mo" : "50Mo"})`);
      return;
    }
    addFile(kind, file);
  }

  return (
    <div className="border-t border-neutral-200 bg-white">
      {/* Prévisualisation des fichiers */}
      {pending.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 pt-2">
          {pending.map((pf, i) => (
            <div key={i} className="relative group/preview">
              {pf.kind === "image" ? (
                <img src={pf.localUrl} alt="" className="h-16 w-16 rounded-lg object-cover border border-neutral-200" />
              ) : pf.kind === "video" ? (
                <video src={pf.localUrl} className="h-16 w-20 rounded-lg object-cover border border-neutral-200" />
              ) : (
                <div className="h-16 w-32 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center gap-1.5">
                  <Music className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs text-neutral-500 truncate max-w-20">{pf.file.name}</span>
                </div>
              )}
              <button
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Zone de saisie */}
      <div className="flex gap-2 items-end p-3">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="resize-none min-h-[38px] max-h-[120px] text-sm py-2"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!canSend}
          className="h-[38px] w-[38px] shrink-0 bg-orange hover:bg-orange/80"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Boutons upload médias */}
      <div className="flex items-center gap-1 px-3 pb-2">
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange("image", e)} />
        <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => onFileChange("audio", e)} />
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => onFileChange("video", e)} />
        <button onClick={() => imageInputRef.current?.click()}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors py-0.5 px-1.5 rounded">
          <ImageIcon className="w-3.5 h-3.5" />Image
        </button>
        <button onClick={() => audioInputRef.current?.click()}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors py-0.5 px-1.5 rounded">
          <Music className="w-3.5 h-3.5" />Audio
        </button>
        <button onClick={() => videoInputRef.current?.click()}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors py-0.5 px-1.5 rounded">
          <Video className="w-3.5 h-3.5" />Vidéo
        </button>
      </div>
    </div>
  );
}
