import { Button } from "@/front/components/ui/button";

export default function CallToAction() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center gap-4 md:gap-6">
      <p className="text-sm sm:text-base lg:text-lg text-neutral-700 dark:text-neutral-300">
        Certains progressent seuls.
      </p>
      <p className="text-sm sm:text-base lg:text-lg text-neutral-700 dark:text-neutral-300">
        Mais beaucoup stagnent, doutent, ou manquent d'opportunités.
      </p>
      <p className="text-sm sm:text-base lg:text-lg text-neutral-700 leading-relaxed">
        Lency existe pour accélérer cette progression,{" "}
        <br className="hidden sm:block" />
        en connectant les bonnes personnes au bon moment.
      </p>

      <Button
        variant="outline"
        className="mt-4 w-full max-w-xs sm:max-w-sm rounded-xl border-gray-300 dark:border-neutral-600 bg-[#F9B8B8] dark:bg-neutral-700 hover:bg-[#f5a0a0] dark:hover:bg-neutral-600 text-neutral-800 dark:text-white font-medium py-5 sm:py-6 text-sm sm:text-base"
      >
        Commencer
      </Button>
    </section>
  );
}