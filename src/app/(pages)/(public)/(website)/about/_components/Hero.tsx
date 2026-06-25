import { Button } from "@/front/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        {/* Left — text + CTA */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EA3D0E] leading-tight font-chunko">
            Apprends, cree, connecte-toi
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Lency aide les débutants et créatifs à apprendre, collaborer et
            évoluer plus rapidement.
          </p>
          <div className="flex justify-center md:justify-start">
            <Button
              variant="outline"
              className="w-full max-w-xs sm:max-w-sm rounded-xl border-[#EA3D0E] bg-[#EA3D0E] hover:bg-[#c4300a] text-white font-medium py-5 sm:py-6 text-sm sm:text-base"
            >
              Commencer
            </Button>
          </div>
        </div>

        {/* Right — image */}
        <div className="flex-1 w-full">
          <Image
            src="/images/blog/img1.jpg"
            alt="Illustration Lency"
            width={800}
            height={500}
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}