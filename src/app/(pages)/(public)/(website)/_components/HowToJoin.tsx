"use client";

import Link from "next/link";
import { Button } from "@/front/components/ui/button";
import { useTheme } from "next-themes";

const steps = [
  {
    number: "1",
    lightColor: "#0000000F",
    darkColor: "rgba(255,255,255,0.06)",
    title: "Crée ton profil",
    description:
      "Renseigne ce que tu sais faire (ou ce que tu veux apprendre !) et montre tes projets passés.",
  },
  {
    number: "2",
    lightColor: "#0000001A",
    darkColor: "rgba(255,255,255,0.10)",
    title: "Explore les annonces",
    description:
      "Regarde les projets en cours autour de toi ou cherche les compétences qu'il te manque.",
  },
  {
    number: "3",
    lightColor: "#00000033",
    darkColor: "rgba(255,255,255,0.20)",
    title: "Propose tes services",
    description:
      "Un projet te chauffe ? Envoie un message en un clic pour rejoindre l'équipe de tournage.",
  },
  {
    number: "4",
    lightColor: "#00000057",
    darkColor: "rgba(255,255,255,0.34)",
    title: "Fais chauffer la caméra",
    description:
      "Retrouve ta nouvelle équipe, tourne, monte et partage le résultat à la communauté !",
  },
];

export default function HowToJoin() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-16 bg-[#FAF7F2] dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
        {/* Left: title */}
        <div className="md:w-2/5 flex flex-col justify-center">
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-black text-[#EA3D0E] uppercase leading-tight font-chunko">
            Comment on se lance sur Lency ?
          </h2>
        </div>

        {/* Right: steps */}
        <div className="md:w-3/5 flex flex-col gap-3">
          {steps.map(({ number, lightColor, darkColor, title, description }) => (
            <div
              key={number}
              className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700"
            >
              <span
                className="font-black leading-none select-none shrink-0"
                style={{ fontSize: "clamp(48px, 8vw, 96px)", color: isDark ? darkColor : lightColor }}
                aria-hidden="true"
              >
                {number}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-[15px] sm:text-[16px] font-bold text-neutral-900 dark:text-white">
                  Étape {number} — {title}
                </h3>
                <p className="text-[14px] sm:text-[16px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
          <Button
            asChild
            className="text-[14px] w-fit mt-4 bg-[#EA3D0E] hover:bg-[#d13509] text-white px-6 sm:px-8 h-11 sm:h-12 rounded-[4px]"
          >
            <Link href="/sign-up">Créer un compte</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
