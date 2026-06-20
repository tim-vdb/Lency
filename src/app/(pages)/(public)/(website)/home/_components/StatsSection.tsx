import Image from "next/image";
import Link from "next/link";
import { Button } from "@/front/components/ui/button";
import { ChevronRight } from "lucide-react";

const stats = [
  { value: "+500", label: "projets lancés ensemble." },
  { value: "3x PLUS", label: "de chances de finir ton projet en équipe." },
  { value: "100%", label: "gratuit pour les étudiants et passionnés." },
];

export default function StatsSection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-16 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
        {/* Col 1: stats */}
        <div className="w-full lg:w-1/4 flex flex-row lg:flex-col flex-wrap gap-6 lg:gap-8 shrink-0">
          {stats.map(({ value, label }) => (
            <div key={value} className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-[36px] sm:text-[44px] lg:text-[54px] font-black text-[#EA3D0E] leading-tight">
                {value}
              </span>
              <span className="text-[14px] sm:text-[16px] text-neutral-500 dark:text-neutral-400 leading-snug">
                {label}
              </span>
            </div>
          ))}
          <img
            src="/images/calque-1.svg"
            alt=""
            aria-hidden="true"
            className="w-24 sm:w-32 mt-2 pointer-events-none dark:brightness-0 dark:invert dark:opacity-20 hidden lg:block"
          />
        </div>

        {/* Col 2: photo */}
        <div className="w-full lg:w-1/3 shrink-0">
          <div className="rounded-2xl overflow-hidden aspect-square w-full max-w-sm mx-auto lg:mx-0">
            <Image
              src="/images/cosmos-00111.png"
              alt="Créatif audiovisuel"
              width={480}
              height={480}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Col 3: text */}
        <div className="w-full lg:w-5/12 flex flex-col gap-5 sm:gap-6">
          <h2 className="text-[20px] sm:text-[22px] lg:text-[24px] font-black text-neutral-900 dark:text-white leading-tight">
            Ne laisse plus tes idées dormir dans tes tiroirs.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
            On a tous commencé quelque part. Que tu veuilles{" "}
            <strong className="text-[#EA3D0E] font-semibold">réaliser</strong>{" "}
            ton tout premier court-métrage,{" "}
            <strong className="text-[#EA3D0E] font-semibold">monter</strong> un
            clip pour un pote ou simplement{" "}
            <strong className="text-[#EA3D0E] font-semibold">exercer</strong> à
            manier une caméra, Lency brise la solitude du créateur.
            <br />
            <br />
            Tu n&apos;as plus d&apos;excuse pour ne pas tourner :{" "}
            <strong className="text-[#EA3D0E] font-semibold">
              rejoins une communauté
            </strong>{" "}
            qui partage la même envie de créer que toi.
          </p>
          <Button
            asChild
            className="text-[14px] w-fit bg-[#EA3D0E] hover:bg-[#d13509] text-white px-6 sm:px-8 h-11 sm:h-12 rounded-[4px]"
          >
            <Link href="/register" className="flex items-center gap-1">
              Rejoins Lency
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
