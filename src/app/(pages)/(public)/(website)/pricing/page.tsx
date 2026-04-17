import Faq from "./_components/Faq";
import PricingPlans from "./_components/PricingPlans";

import WhyCreator from "./_components/WhyCreator";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <PricingPlans />
      <WhyCreator />
      <Faq/>
    </main>
  );
}