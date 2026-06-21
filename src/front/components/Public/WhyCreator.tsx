import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";

const creatorFeatures = [
  "Accès complet au dashboard",
  "Espaces de travail illimités",
  "Analytiques avancées & rapports",
  "Automatisations personnalisées",
  "Accès prioritaire aux nouvelles fonctionnalités",
  "Support dédié (chat & email)",
  "Historique illimité",
];

export default function WhyCreator() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 md:mb-6">
        Pourquoi passer à Creator ?
      </h2>
      <p className="text-sm sm:text-base text-neutral-500 leading-relaxed max-w-2xl mb-10 md:mb-16">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt
      </p>

      <div className="flex justify-center">
        <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              Profil Creator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 sm:px-6 sm:py-5">
              <ul className="space-y-2.5 sm:space-y-3">
                {creatorFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm sm:text-base text-neutral-700">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full border border-gray-400 bg-white" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}