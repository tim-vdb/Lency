import { Card, CardContent } from "@/front/components/ui/card";

const features = [
  "Accès complet au dashboard",
  "Accès complet au dashboard et zzgzg",
  "zifgj zfg oz,fo z zo,f z,foz zz ,fzp,f",
  "zfzefe zef zfzf",
  "fzfzfzau f fz  zfzf zfzfz",
  "zfz ez ze fzfz fzef z f zf zf z",
  "Accès complet au dashboard",
  "faqeg sq gq gqg qdg dq gqdgdagerg gegr",
];

export default function Need() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-snug mb-10 md:mb-16">
        Lency centralise tout ce dont un <br className="hidden sm:block" /> créatif a besoin
      </h2>

      <div className="flex justify-center">
        <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <CardContent className="pt-6">
            <ul className="space-y-3 text-left">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full border border-gray-400 dark:border-neutral-600 bg-white dark:bg-neutral-700" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}