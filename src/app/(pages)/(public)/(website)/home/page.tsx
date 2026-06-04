import type { Metadata } from 'next';
import ProfileCTA from "./_components/ProfileCTA";

export const metadata: Metadata = {
    title: 'Lency — La communauté des créatifs audiovisuels',
    description: 'Lency réunit les créatifs audiovisuels : trouvez des projets, partagez vos créations et collaborez avec des talents du monde entier.',
};
import FeatureHighlights from "./_components/FeatureHighlights";
import HeroAudiovisuel from "./_components/HeroAudiovisuel";
import FAQHome from "./_components/FaqHome";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroAudiovisuel />
      <FeatureHighlights />
      <ProfileCTA />
      <FAQHome />
    </main>
  );
}