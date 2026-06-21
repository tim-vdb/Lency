import type { Metadata } from "next";
import HeroAudiovisuel from "./home/_components/HeroAudiovisuel";
import FeatureHighlights from "./home/_components/FeatureHighlights";
import StatsSection from "./home/_components/StatsSection";
import HowToJoin from "./home/_components/HowToJoin";
import TestimonialsSection from "./home/_components/TestimonialsSection";
import FAQHome from "./home/_components/FaqHome";
import ProfileCTA from "./home/_components/ProfileCTA";


export const metadata: Metadata = {
  title: "Lency — La communauté des créatifs audiovisuels",
  description:
    "Lency réunit les créatifs audiovisuels : trouvez des projets, partagez vos créations et collaborez avec des talents du monde entier.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <HeroAudiovisuel />
      <FeatureHighlights />
      <StatsSection />
      <HowToJoin />
      <TestimonialsSection />
      <FAQHome />
      <ProfileCTA />
    </main>
  );
}
