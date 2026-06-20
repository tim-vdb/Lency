import type { Metadata } from "next";
import HeroAudiovisuel from "./_components/HeroAudiovisuel";
import FeatureHighlights from "./_components/FeatureHighlights";
import StatsSection from "./_components/StatsSection";
import HowToJoin from "./_components/HowToJoin";
import TestimonialsSection from "./_components/TestimonialsSection";
import FAQHome from "./_components/FaqHome";
import ProfileCTA from "./_components/ProfileCTA";

export const metadata: Metadata = {
  title: "Lency — La communauté des créatifs audiovisuels",
  description:
    "Lency réunit les créatifs audiovisuels : trouvez des projets, partagez vos créations et collaborez avec des talents du monde entier.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
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
