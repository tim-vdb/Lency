import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/front/components/ui/accordion";

const faqs = [
  {
    question: "Est-ce que le plan gratuit suffit ?",
    answer:
      "Oui, le plan gratuit te donne accès à la communauté, aux projets ouverts et à ton profil public. Tu peux rejoindre des projets, poser des questions et collaborer sans débourser un centime.\nPour des fonctionnalités avancées comme la mise en avant de ton profil dans la marketplace ou les statistiques détaillées, le plan Creator est disponible.",
  },
  {
    question: "Comment rejoindre un projet sur Lency ?",
    answer:
      "Rends-toi sur le Marketplace, parcours les projets disponibles et postule directement depuis la fiche projet. Le porteur de projet te contactera s'il retient ta candidature.",
  },
  {
    question: "Je débute dans l'audiovisuel, Lency est fait pour moi ?",
    answer:
      "Absolument. Lency accueille tous les niveaux. La communauté est là pour répondre à tes questions et t'aider à progresser, que tu sois étudiant ou professionnel confirmé.",
  },
  {
    question: "Puis-je proposer mes propres projets ?",
    answer:
      "Oui, depuis ton dashboard tu peux créer un projet, décrire tes besoins et recruter des créatifs qui correspondent à ta vision.",
  },
  {
    question: "Comment fonctionne la communauté ?",
    answer:
      "La communauté Lency est organisée en espaces thématiques où tu peux partager tes créations, poser des questions, donner ton avis et trouver des collaborateurs pour tes projets audiovisuels.",
  },
];

export default function FAQ() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 md:mb-12">
        Questions / Réponses
      </h2>

      <Accordion type="single" collapsible defaultValue="item-0">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 dark:text-gray-100 hover:no-underline py-5 md:py-6">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line pb-5 md:pb-6">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
