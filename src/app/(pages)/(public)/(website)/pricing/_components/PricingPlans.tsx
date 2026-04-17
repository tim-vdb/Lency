"use client";

import { useState } from "react";
import { cn } from "@/front/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/front/components/ui/tabs";

const freeFeatures = [
  "Accès complet au dashboard",
  "Gestion des projets basique",
  "Jusqu'à 3 espaces de travail",
  "Exports en PDF et CSV",
  "Support par email",
  "Historique sur 30 jours",
  "Intégrations natives (Notion, Slack)",
  "Mises à jour hebdomadaires automatiques",
];

const creatorFeatures = [
  "Tout ce qui est inclus dans le plan gratuit",
  "Espaces de travail illimités",
  "Analytiques avancées & rapports",
  "Automatisations personnalisées",
  "Accès prioritaire aux nouvelles fonctionnalités",
  "Support dédié (chat & email)",
  "Historique illimité",
  "Intégrations premium (Zapier, HubSpot…)",
];

export default function PricingPlans() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const creatorPrice = billing === "monthly" ? 4.99 : 3.99;

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <Tabs
          value={billing}
          onValueChange={(v) => setBilling(v as "monthly" | "annual")}
        >
          <TabsList className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm h-auto gap-1">
            <TabsTrigger
              value="monthly"
              className={cn(
                "rounded-lg px-4 sm:px-5 py-2 text-sm sm:text-base font-medium transition-all",
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-800"
              )}
            >
              Mensuellement
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className={cn(
                "rounded-lg px-4 sm:px-5 py-2 text-sm sm:text-base font-medium transition-all",
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-800"
              )}
            >
              Annuellement
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <PricingCard
          title="L'essentiel de Lency pour kiffer un max !"
          planLabel="Plan gratuit"
          priceLabel="0€"
          features={freeFeatures}
          cta="S'inscrire"
        />
        <PricingCard
          title="Des fonctionnalités avancées pour passer un cap"
          planLabel="Plan creator"
          priceLabel={`${creatorPrice.toFixed(2)}€`}
          priceSuffix={
            billing === "annual" ? "/mois, facturé annuellement" : "/mois"
          }
          features={creatorFeatures}
          cta="Commencer"
        />
      </div>
    </section>
  );
}

interface PricingCardProps {
  title: string;
  planLabel: string;
  priceLabel: string;
  priceSuffix?: string;
  features: string[];
  cta: string;
}

function PricingCard({
  title,
  planLabel,
  priceLabel,
  priceSuffix,
  features,
  cta,
}: PricingCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-6 md:mb-8">
        {title}
      </h2>

      <div className="flex items-baseline justify-between mb-4 md:mb-6">
        <span className="text-sm sm:text-base font-medium text-gray-500">{planLabel}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">{priceLabel}</span>
          {priceSuffix && (
            <span className="text-xs sm:text-sm text-gray-400">{priceSuffix}</span>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 sm:px-6 sm:py-5 mb-6 md:mb-8">
        <ul className="space-y-3 sm:space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
              <span className="shrink-0 w-4 h-4 rounded-full border border-gray-400 bg-white" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full rounded-xl bg-[#F9B8B8] py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-800 transition-all hover:bg-[#f5a0a0] active:scale-95">
        {cta}
      </button>
    </div>
  );
}