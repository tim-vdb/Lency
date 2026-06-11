import Link from "next/link";
import { Button } from "@/front/components/ui/button";

const steps = [
  {
    number: "1",
    color: "#0000000F",
    title: "Crée ton profil",
    description:
      "Renseigne ce que tu sais faire (ou ce que tu veux apprendre !) et montre tes projets passés.",
  },
  {
    number: "2",
    color: "#0000001A",
    title: "Explore les annonces",
    description:
      "Regarde les projets en cours autour de toi ou cherche les compétences qu'il te manque.",
  },
  {
    number: "3",
    color: "#00000033",
    title: "Propose tes services",
    description:
      "Un projet te chauffe ? Envoie un message en un clic pour rejoindre l'équipe de tournage.",
  },
  {
    number: "4",
    color: "#00000057",
    title: "Fais chauffer la caméra",
    description:
      "Retrouve ta nouvelle équipe, tourne, monte et partage le résultat à la communauté !",
  },
];

export default function HowToJoin() {
  return (
    <section className="w-full py-20 px-8 lg:px-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
        {/* Left: title */}
        <div className="md:w-2/5 flex flex-col justify-center">
          <h2 className="text-[48px] font-black text-[#EA3D0E] uppercase leading-tight">
            Comment on se lance sur Lency ?
          </h2>
        </div>

        {/* Right: steps */}
        <div className="md:w-3/5 flex flex-col gap-3">
          {steps.map(({ number, color, title, description }) => (
            <div
              key={number}
              className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-neutral-100"
            >
              <span
                className="font-black leading-none select-none shrink-0 self-center"
                style={{ fontSize: "96px", color }}
                aria-hidden="true"
              >
                {number}
              </span>
              <div className="flex flex-col gap-1 py-2">
                <h3 className="text-[16px] font-bold text-neutral-900">
                  Étape {number} — {title}
                </h3>
                <p className="text-[16px] text-neutral-500 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
          <Button
            asChild
            className="text-[14px] w-fit mt-4 bg-[#EA3D0E] hover:bg-[#d13509] text-white px-8 h-12 rounded-[4px]"
          >
            <Link href="/register">Créer un compte</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
