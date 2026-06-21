import Image from "next/image";
import Link from "next/link";
import { Button } from "@/front/components/ui/button";

export default function HeroAudiovisuel() {
  return (
    <section
      className="w-full bg-[#EA3D0E] relative overflow-hidden -mt-[70px]"
      style={{ minHeight: 560 }}
    >
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 flex flex-col gap-5 sm:gap-6 pt-24 sm:pt-28 lg:pt-[120px] pb-16 sm:pb-20">
        <div className="max-w-[520px]">
          <h1
            className="font-black text-white uppercase leading-[1.1] tracking-tight text-[36px] sm:text-[48px] lg:text-[64px]"
            style={{ textAlign: "left" }}
          >
            Progresse plus vite dans l&apos;audiovisuel
          </h1>
        </div>
        <p className="text-white/85 leading-relaxed max-w-[480px] text-[16px] sm:text-[18px] lg:text-[20px]">
          Marre de galérer tout seul dans ton coin ? Trouve ton équipe, partage
          tes compétences et donne enfin vie à tes projets vidéos.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Button
            asChild
            className="text-[14px] bg-neutral-900 hover:bg-neutral-800 text-white px-6 sm:px-8 h-11 sm:h-12 rounded-[4px]"
          >
            <Link href="/register">Rejoindre Lency</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-[14px] border-white text-neutral-900 bg-white hover:bg-white/90 px-6 sm:px-8 h-11 sm:h-12 rounded-[4px]"
          >
            <Link href="/community">Explorer les projets</Link>
          </Button>
        </div>
      </div>

      {/* Diamond — caché sur mobile, visible à partir de md */}
      <Image
        src="/images/image.png"
        alt=""
        aria-hidden
        width={717}
        height={708}
        className="absolute top-0 right-0 select-none hidden md:block"
        style={{ width: "45%", height: "auto", maxWidth: 717 }}
      />
    </section>
  );
}
