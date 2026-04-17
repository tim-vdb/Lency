import CallToAction from "./_components/CallToAction";
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
