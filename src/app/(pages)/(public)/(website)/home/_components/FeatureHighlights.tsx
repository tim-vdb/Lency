import Image from "next/image";
import { Card, CardContent } from "@/front/components/ui/card";

const sections = [
  {
    title: "Trouve des réponses rapidement",
    description:
      "Pose tes questions, échange avec d'autres créatifs et progresse sans rester bloqué.",
    features: [
      "Des réponses concrètes",
      "Une entraide active",
      "Moins de temps perdu",
    ],
    imageLeft: false,
  },
  {
    title: "Participe à des projets",
    description:
      "Découvre des projets, collabore avec d'autres et gagne en expérience.",
    features: [
      "Pratique réelle",
      "Opportunités ouvertes",
      "Progression rapide",
    ],
    imageLeft: true,
  },
  {
    title: "Valorise ton travail",
    description:
      "Construis ton profil, partage tes projets et développe ta crédibilité.",
    features: [
      "Visibilité",
      "Portfolio vivant",
      "Réseau",
    ],
    imageLeft: false,
  },
];

export default function FeatureHighlights() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8 md:gap-12">
        {sections.map((section, i) => (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div
                className={`flex flex-col ${
                  section.imageLeft ? "md:flex-row-reverse" : "md:flex-row"
                } items-center gap-6 md:gap-8`}
              >
                <div className="w-full md:w-1/2">
                  <Image
                    src="/images/blog/img1.jpg"
                    alt={section.title}
                    width={800}
                    height={400}
                    className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover rounded-xl"
                  />
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
                    {section.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                    {section.description}
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {section.features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2.5 text-sm sm:text-base text-gray-700"
                      >
                        <span className="flex-shrink-0 w-4 h-4 rounded-full border border-gray-400 bg-white" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}