import Link from "next/link";
import { Button } from "@/front/components/ui/button";

export default function ProfileCTA() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-3xl flex flex-col items-center text-center gap-6 py-12 sm:py-16 px-6 sm:px-12 lg:px-24 border border-neutral-100 dark:border-neutral-700">
          <h2 className="text-[24px] sm:text-[30px] font-black text-neutral-900 dark:text-white leading-tight font-chunko">
            Choisis ton profil pour apprendre, collaborer et progresser.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl">
            Que tu sois réalisateur, monteur, cadreur ou compositeur — Lency
            t&apos;aide à trouver les collaborateurs qui partagent ta vision et
            à faire avancer tes projets.
          </p>
          <Button
            asChild
            className="text-[14px] w-full max-w-sm sm:max-w-md h-12 bg-[#EA3D0E] hover:bg-[#d13509] text-white rounded-[4px]"
          >
            <Link href="/sign-up">Choisir ton profil</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
