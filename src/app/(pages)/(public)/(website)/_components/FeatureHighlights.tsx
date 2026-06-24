import { Button } from "@/front/components/ui/button";
import { Users, ChevronRight } from "lucide-react";
import Link from "next/link";

function CursorIcon({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 113 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M26.4572 58.5549L20.4393 64.5728M19.8104 42.5051H11.2998M20.4393 20.4414L26.4572 26.4593M42.507 11.2998V19.8104M64.5708 20.4414L58.5528 26.4593M75.4159 75.3118L97.085 67.7476C101.147 66.3297 101.304 60.6422 97.3251 59.0631L47.7488 41.7982C44.022 40.3192 40.2746 43.975 41.6599 47.7382L57.8935 98.6952C59.3718 102.711 65.0565 102.698 66.578 98.6758L75.4159 75.3118Z"
        stroke="black"
        strokeOpacity="0.29"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FeatureHighlights() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-16 bg-[#FAF7F2] dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left: title */}
        <div className="md:w-2/5 flex flex-col gap-4">
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-black text-[#EA3D0E] uppercase leading-tight">
            Tout pour tes projets.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Lency met à ta disposition les outils indispensables pour ne plus
            jamais bloquer sur une création vidéo. Découvre ce qu&apos;on
            t&apos;a préparé.
          </p>
        </div>

        {/* Right: two cards */}
        <div className="md:w-3/5 flex flex-col sm:flex-row gap-5 sm:gap-6">
          {/* Card 1 — orange theme */}
          <div className="flex-1 bg-white dark:bg-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm border border-neutral-100 dark:border-neutral-700 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <span
                className="text-[80px] sm:text-[100px] lg:text-[120px] font-black leading-none select-none pointer-events-none text-[#F9D0C0]"
                aria-hidden="true"
              >
                1
              </span>
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#EA3D0E] shrink-0 mt-2" />
            </div>
            <h3 className="text-[20px] sm:text-[24px] font-bold text-neutral-900 dark:text-white">La Communauté</h3>
            <p className="text-[15px] sm:text-[16px] text-neutral-500 dark:text-neutral-400 leading-relaxed flex-1">
              Échange avec des centaines de passionnés, demande des avis en
              direct sur tes montages et trouve l&apos;inspiration au quotidien.
            </p>
            <Button
              asChild
              className="text-[14px] w-fit rounded-[4px] mt-auto bg-[#EA3D0E] hover:bg-[#d13509] text-white"
            >
              <Link href="/community" className="flex items-center gap-1">
                Explorer la communauté
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {/* Card 2 — neutral theme */}
          <div className="flex-1 bg-white dark:bg-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm border border-neutral-100 dark:border-neutral-700 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <span
                className="text-[80px] sm:text-[100px] lg:text-[120px] font-black leading-none select-none pointer-events-none"
                style={{ color: "#00000033" }}
                aria-hidden="true"
              >
                2
              </span>
              <CursorIcon className="shrink-0 mt-2" />
            </div>
            <h3 className="text-[20px] sm:text-[24px] font-bold text-neutral-900 dark:text-white">L&apos;Explorateur</h3>
            <p className="text-[15px] sm:text-[16px] text-neutral-500 dark:text-neutral-400 leading-relaxed flex-1">
              Découvre les meilleurs projets réalisés par la communauté, trouve
              des tournages qui recrutent près de chez toi et fais-toi repérer.
            </p>
            <Button
              asChild
              className="text-[14px] w-fit rounded-[4px] mt-auto bg-[#F5F5F5] hover:bg-[#e8e8e8] dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200"
            >
              <Link href="/marketplace" className="flex items-center gap-1">
                Voir les projets
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
