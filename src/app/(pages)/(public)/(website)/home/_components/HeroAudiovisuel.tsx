"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { Button } from "@/front/components/ui/button";
import LencyLogo from "@/front/components/ui/lency-logo";
import { cn } from "@/front/lib/utils";

export default function HeroAudiovisuel() {
  const videoRef = useRef<React.ComponentRef<"video">>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePlay = () => setIsPlaying(true);

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }, 300);
  };

  // Double rAF : déclenche la transition CSS juste après le mount du DOM
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        setIsExpanded(true);
        videoRef.current?.play();
      })
    );
    return () => window.cancelAnimationFrame(id);
  }, [isPlaying]);

  // Fermer avec Escape
  useEffect(() => {
    if (!isPlaying) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying]);

  return (
    <>
      <section className="w-full bg-[#EA3D0E] relative overflow-hidden min-h-screen flex items-center select-none">
        {/* Diamond icon — absolutely positioned top-right */}
        <Image
          src="/images/image.png"
          alt=""
          aria-hidden
          width={720}
          height={720}
          className="absolute -top-10 -right-10 select-none pointer-events-none opacity-30"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
          {/* Left: text content */}
          <div className="flex flex-col gap-8 w-full lg:max-w-[500px] shrink-0 ">
            <div className="flex flex-col gap-3">
              <span className="text-white/60 text-sm font-semibold uppercase tracking-widest">
                La plateforme audiovisuelle
              </span>
              <h1 className="font-black text-white uppercase text-left leading-[1.05] tracking-tight text-[38px] sm:text-[52px] lg:text-[68px]">
                Progresse plus vite dans l&apos;audiovisuel
              </h1>
            </div>

            <p className="text-white/75 text-lg leading-relaxed">
              Marre de galérer tout seul dans ton coin ? Trouve ton équipe,
              partage tes compétences et donne enfin vie à tes projets vidéos.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                variant={"secondary"}
                className="text-sm font-semibold dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white px-8 h-12 rounded-xl shadow-lg"
              >
                <Link href="/sign-up">Rejoindre Lency</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="text-sm font-semibold border-white/30 text-white! bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8 h-12 rounded-xl"
              >
                <Link href="/marketplace">Explorer les projets</Link>
              </Button>
            </div>


            {/* Domaines couverts */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {["Réalisation", "Montage", "Motion design", "Son"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: video thumbnail card */}
          <div className="flex-1 w-full relative">
            <div
              className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.35)] cursor-pointer group"
              onClick={handlePlay}
            >
              <div className="aspect-video bg-neutral-100" />

              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-8">
                <LencyLogo className="w-40 h-auto" />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-[#EA3D0E] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                  <span className="text-neutral-500 text-sm font-medium">Voir la vidéo</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={handlePlay}
            >
              <div className="w-9 h-9 bg-[#EA3D0E] rounded-xl flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium">C&apos;est quoi Lency ?</p>
                <p className="text-sm font-bold text-neutral-900">Voir la présentation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isPlaying && (
        <div
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12",
            "transition-[background-color,backdrop-filter] duration-300 ease-out",
            isExpanded ? "bg-black/85 backdrop-blur-sm" : "bg-transparent"
          )}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            className={cn(
              "absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center",
              "bg-white/10 hover:bg-white/20 border border-white/20 text-white",
              "transition-all duration-300 ease-out",
              isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
            aria-label="Fermer la vidéo"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className={cn(
              "w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_48px_120px_rgba(0,0,0,0.6)]",
              "transition-all duration-300 ease-out",
              isExpanded ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
          >
            <video
              ref={videoRef}
              src="/Lency-v1.mp4"
              controls
              playsInline
              className="w-full block bg-black"
              style={{ aspectRatio: "16/9", objectFit: "contain" }}
              onEnded={handleClose}
            />
          </div>
        </div>
      )}
    </>
  );
}
