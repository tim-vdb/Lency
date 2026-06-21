import Image from "next/image";
import Link from "next/link";
import { Button } from "@/front/components/ui/button";

export default function TestimonialsSection() {
  return (
    <section className="w-full py-20 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
        {/* Left: two overlapping photos */}
        <div className="shrink-0">
          <div className="relative" style={{ width: 376, height: 393 }}>
            {/* Back photo */}
            <Image
              src="/images/gemini-generated-image-y-7742-ny-7742-ny-7741.png"
              alt=""
              aria-hidden
              width={298}
              height={373}
              className="absolute top-0 left-0 object-cover"
              style={{ width: 298, height: 373, borderRadius: 8 }}
            />
            {/* Front photo */}
            <Image
              src="/images/af-24-ac-3-da-0691-ebc-0-da-7-ba-6-a-09-ff-8-f-1.png"
              alt="Guerric Cochelin"
              width={298}
              height={373}
              className="absolute object-cover object-top"
              style={{ width: 298, height: 373, borderRadius: 8, top: 20, left: 78 }}
            />
          </div>
        </div>

        {/* Right: title + testimonial */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-[48px] font-black text-[#EA3D0E] uppercase leading-tight">
            Ils ont trouvé leur équipe sur Lency
          </h2>

          <div className="bg-[#FAF7F2] dark:bg-neutral-800 rounded-2xl p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow">
                <Image
                  src="/images/af-24-ac-3-da-0691-ebc-0-da-7-ba-6-a-09-ff-8-f-1.png"
                  alt="Timothée Van Den Bosch"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-[16px] font-bold text-neutral-900 dark:text-white">
                  Guerric Cochelin
                </p>
                <p className="text-[14px] text-neutral-500 dark:text-neutral-400">Réalisateur</p>
              </div>
            </div>

            <p className="text-[16px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
              &ldquo;Franchement, je savais pas du tout comment trouver des
              gens visuels pour tourner mes talents. En deux jours sur Lency,
              j&apos;ai rencontré une monteuse et un créateur hyper cool. On
              tourne plus nos caméras !&rdquo;
            </p>

            <Button
              asChild
              className="text-[14px] w-fit bg-neutral-900 hover:bg-neutral-800 text-white px-6 h-11 rounded-[4px]"
            >
              <Link href="/community">Trouver d&apos;autres passionnés</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
