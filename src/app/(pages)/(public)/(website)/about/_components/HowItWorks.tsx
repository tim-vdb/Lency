const steps = [
  {
    number: "01",
    title: "DÉCOUVRE",
    description:
      "Parcours les projets audiovisuels publiés par la communauté. Trouve des tournages qui recrutent près de chez toi, explore les profils de créatifs et repère les opportunités qui correspondent à ton univers.",
    side: "left",
  },
  {
    number: "02",
    title: "ÉCHANGE",
    description:
      "Rejoins des espaces thématiques, pose tes questions, partage tes créations et reçois des retours directs de professionnels. La communauté Lency est là pour t'aider à avancer, quel que soit ton niveau.",
    side: "right",
  },
  {
    number: "03",
    title: "PROGRESSE",
    description:
      "Collabore sur de vrais projets, enrichis ton portfolio et développe ton réseau dans l'audiovisuel. Chaque projet réalisé est une étape de plus vers le métier que tu veux exercer.",
    side: "left",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EA3D0E] mb-12 md:mb-20 font-chunko">
        Comment ca marche ?
      </h2>

      {/* Mobile — liste verticale simple */}
      <div className="flex flex-col gap-10 md:hidden">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col gap-2">
            <p className="text-5xl font-bold text-gray-900 dark:text-white">{step.number}</p>
            <p className="text-sm font-bold tracking-widest text-gray-900 dark:text-white">{step.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Desktop — layout zigzag avec ligne centrale */}
      <div className="relative hidden md:block">
        {/* Vertical dashed line */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 border-l border-dashed border-gray-300 dark:border-gray-600" />

        <div className="flex flex-col gap-20 lg:gap-28">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex w-full ${step.side === "right" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`w-[45%] ${step.side === "left" ? "text-right" : "text-left"
                  }`}
              >
                <p className="text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-1">
                  {step.number}
                </p>
                <p className="text-sm lg:text-base font-bold tracking-widest text-gray-900 dark:text-white mb-3">
                  {step.title}
                </p>
                <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow at bottom */}
        <div className="flex justify-center mt-6">
          <svg
            width="14"
            height="20"
            viewBox="0 0 12 16"
            fill="none"
            className="text-gray-400 dark:text-gray-500"
          >
            <path
              d="M6 0v14M1 9l5 6 5-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}