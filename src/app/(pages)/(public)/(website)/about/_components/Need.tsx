import { Card, CardContent } from "@/front/components/ui/card";

const features = [
  "Trouvez des collaborateurs pour vos projets audiovisuels",
  "Partagez vos créations et obtenez des retours de la communauté",
  "Accédez à une marketplace de talents (réalisateurs, monteurs, cadreurs...)",
  "Rejoignez des espaces thématiques selon vos pratiques",
  "Gérez vos candidatures et recrutements depuis le dashboard",
  "Publiez vos projets et recrutez les bons profils",
  "Développez votre réseau dans l'audiovisuel",
];

export default function Need() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-snug mb-10 md:mb-16">
        Lency centralise tout ce dont un <br className="hidden sm:block" /> créatif a besoin
      </h2>

      <div className="flex justify-center">
        <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg dark:bg-neutral-900 dark:border-neutral-700">
          <CardContent className="pt-6">
            <ul className="space-y-3 text-left">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <span className="shrink-0 w-4 h-4 rounded-full border border-gray-400 dark:border-gray-500 bg-white dark:bg-neutral-700" />
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
