import Image from "next/image";
import { Button } from "@/front/components/ui/button";

export default function HeroAudiovisuel() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 flex flex-col gap-6 md:gap-8 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Progresse plus vite dans l'audiovisuel
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Une communauté pour apprendre, collaborer et trouver des
            opportunités.
          </p>
          <div className="flex justify-center md:justify-start">
            <Button
              variant="outline"
              className="w-full max-w-xs sm:max-w-sm rounded-xl border-gray-300 bg-[#F9B8B8] hover:bg-[#f5a0a0] text-gray-800 font-medium py-5 sm:py-6 text-sm sm:text-base"
            >
              Créer un compte
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full">
          <Image
            src="/images/blog/img1.jpg"
            alt="Illustration audiovisuel"
            width={800}
            height={500}
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}