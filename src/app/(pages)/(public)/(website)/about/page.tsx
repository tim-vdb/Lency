import type { Metadata } from 'next';
import CallToAction from "./_components/CallToAction";

export const metadata: Metadata = {
    title: 'À propos — Lency',
    description: 'Découvrez la mission et la vision de Lency, la plateforme dédiée aux créatifs audiovisuels.',
};
import Hero from "./_components/Hero";
import Need from "./_components/Need";
import Problems from "./_components/Problems";
import HowItWorks from "./_components/HowItWorks";

export default function AboutPage() {
  return (
    <main>
      <Hero />
      <Problems />
      <Need />
      <HowItWorks />
      <CallToAction />
    </main>
  );
}
