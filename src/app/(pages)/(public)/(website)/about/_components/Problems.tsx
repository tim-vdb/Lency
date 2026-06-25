import { Network, Play, User } from "lucide-react";

const problems = [
  {
    icon: Network,
    label: "Pas de réseau",
  },
  {
    icon: Play,
    label: "Peu d'opportunités concrètes",
  },
  {
    icon: User,
    label: "Difficile de progresser seul",
  },
];

export default function Problems() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EA3D0E] leading-snug mb-12 md:mb-20 font-chunko">
        Aujourd'hui, les createurs audiovisuels <br className="hidden sm:block" /> sont disperses
      </h2>

      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-12 sm:gap-16 lg:gap-28">
        {problems.map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex flex-col items-center gap-4 max-w-[140px] lg:max-w-[180px]">
            <Icon size={42} strokeWidth={1.5} className="text-gray-900 dark:text-gray-100 lg:w-14 lg:h-14" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-snug">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}