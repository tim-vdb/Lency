import type { Metadata } from 'next';
import GuideContent from './_components/GuideContent';

export const metadata: Metadata = {
  title: 'Guide Utilisateur — Lency',
  description: 'Maîtrisez Lency de A à Z : Communauté, Marketplace, Map, Dashboard, Profil et Paramètres.',
};

export default function GuideUtilisateurPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white py-10 px-6 text-center">
        <span className="inline-flex items-center gap-2 bg-orange-50 text-[#EA3D0E] rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide mb-4">
          ✦ Guide Utilisateur Officiel
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Maîtrisez Lency de A à Z</h1>
        <p className="text-neutral-500 text-[15px] max-w-lg mx-auto">
          Communauté, Marketplace, Map, Dashboard, Profil et Paramètres — tout ce qu'il faut savoir pour publier, explorer et collaborer.
        </p>
        <p className="text-neutral-400 text-xs mt-4">Version 1.0 · Juin 2026 · lency.net</p>
      </div>
      <GuideContent />
    </div>
  );
}
