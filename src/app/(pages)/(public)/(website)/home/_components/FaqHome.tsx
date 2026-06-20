import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/front/components/ui/accordion";

const faqs = [
  {
    question: "Est-ce que le plan gratuit suffit ?",
    answer:
      "Oui, le plan gratuit te donne accès à la communauté, aux projets ouverts et à ton profil public. Tu peux rejoindre des projets, poser des questions et collaborer sans débourser un centime.",
  },
  {
    question: "Comment rejoindre un projet sur Lency ?",
    answer:
      "Rends-toi sur le Marketplace, parcours les projets disponibles et postule directement depuis la fiche projet. Le porteur de projet te contactera s'il retient ta candidature.",
  },
  {
    question: "Je débute, Lency est fait pour moi ?",
    answer:
      "Absolument. Lency accueille tous les niveaux. La communauté est là pour répondre à tes questions et t'aider à progresser, que tu sois étudiant ou professionnel confirmé.",
  },
  {
    question: "Comment fonctionne la communauté ?",
    answer:
      "La communauté Lency est organisée en espaces thématiques où tu peux partager tes créations, poser des questions, donner ton avis et trouver des collaborateurs.",
  },
  {
    question: "Puis-je proposer mes propres projets ?",
    answer:
      "Oui, depuis ton dashboard tu peux créer un projet, décrire tes besoins et recruter des créatifs qui correspondent à ta vision.",
  },
];

export default function FAQHome() {
  return (
    <section className="w-full py-20 px-8 lg:px-16 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[48px] font-black mb-10 text-center text-[#EA3D0E]">
          FAQ
        </h2>
        <Accordion type="single" collapsible defaultValue="item-0">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-neutral-200 dark:border-neutral-700">
              <AccordionTrigger className="text-[16px] font-semibold text-[#EA3D0E] hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[16px] text-neutral-500 dark:text-neutral-400 leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
