import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/front/components/ui/accordion";

const faqs = [
  {
    question: "Est-ce que le plan gratuit suffit ?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  },
  {
    question: "Est-ce que le plan gratuit suffit ?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
  },
  {
    question: "Est-ce que le plan gratuit suffit ?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
  },
  {
    question: "Est-ce que le plan gratuit suffit ?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
  },
  {
    question: "Est-ce que le plan gratuit suffit ?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
  },
];

export default function FAQHome() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12">
        Questions / Réponses
      </h2>

      <Accordion type="single" collapsible defaultValue="item-0">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 hover:no-underline py-5 md:py-6">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base text-gray-500 leading-relaxed whitespace-pre-line pb-5 md:pb-6">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}