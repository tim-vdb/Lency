import Image from "next/image";
import Link from "next/link";
import { Button } from "@/front/components/ui/button";

export default function HeroAudiovisuel() {
  return (
    <section
      className="w-full bg-[#EA3D0E] relative overflow-hidden -mt-[70px]"
      style={{ minHeight: 640 }}
    >
      {/* Left: text content — pushed below the fixed header */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 flex flex-col gap-6"
        style={{ paddingTop: 120, paddingBottom: 80 }}
      >
        <div className="max-w-[520px]">
          <h1
            className="font-black text-white uppercase leading-[1.1] tracking-tight"
            style={{ fontSize: 64, textAlign: "left" }}
          >
            Progresse plus vite dans l&apos;audiovisuel
          </h1>
        </div>
        <p
          className="text-white/85 leading-relaxed max-w-[480px]"
          style={{ fontSize: 20 }}
        >
          Marre de galérer tout seul dans ton coin ? Trouve ton équipe, partage
          tes compétences et donne enfin vie à tes projets vidéos.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            className="text-[14px] bg-neutral-900 hover:bg-neutral-800 text-white px-8 h-12 rounded-[4px]"
          >
            <Link href="/register">Rejoindre Lency</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-[14px] border-white text-neutral-900 bg-white hover:bg-white/90 px-8 h-12 rounded-[4px]"
          >
            <Link href="/community">Explorer les projets</Link>
          </Button>
        </div>
        {/* Decorative squiggle — white on orange */}
        {/*<img
          src="/images/calque-1.svg"
          alt=""
          aria-hidden="true"
          className="w-36 pointer-events-none brightness-0 invert position-absolute -bottom-10 left-8 z-index-10"
        />*/}
      </div>

      {/* Diamond icon — absolutely positioned top-right */}
      <Image
        src="/images/image.png"
        alt=""
        aria-hidden
        width={717}
        height={708}
        className="absolute top-0 right-0 select-none"
        style={{ width: "50%", height: "auto", maxWidth: 717 }}
      />
    </section>
  );
}
