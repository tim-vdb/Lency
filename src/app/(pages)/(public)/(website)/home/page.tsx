import ProfileCTA from "./_components/ProfileCTA";
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