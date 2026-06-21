import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Mentions légales — Lency',
    description: 'Mentions légales et informations juridiques du site Lency.',
};

export default function MentionsLegalesPage() {
  return (
    <main className="p-8 sm:p-12 md:p-16 lg:px-24 lg:py-12 bg-white dark:bg-neutral-900 min-h-screen text-black dark:text-white">
      <h1 className="text-4xl md:text-5xl font-cooper font-bold mb-8 text-center md:text-left">
        Mentions légales
      </h1>

      <section className="mb-6 prose dark:prose-invert prose-lg">
        <p>
          Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004
          pour la confiance dans l’économie numérique, il est précisé aux
          utilisateurs du site
          <span className="font-bold"> Mölkky Lyon</span> l’identité de
          l’éditeur du présent site.
        </p>
      </section>

      <section className="mb-6 prose dark:prose-invert prose-lg">
        <h2 className="text-2xl font-cooper mb-3">1. Éditeur du Site</h2>
        <p>
          Le site <span className="font-bold">Mölkky Lyon</span> est édité par :
          <br />
          <span className="font-semibold">
            CLUB RHODANIEN DE MOLKKY (CRHOM)
          </span>
          <br />
          Association loi 1901 déclarée en préfecture du Rhône
          <br />
          Siège social : 3 Rue Turbil, 69003 Lyon, France
        </p>
      </section>

      <section className="prose prose-lg">
        <h2 className="text-2xl font-cooper mb-3">2. Objet de l’Association</h2>
        <p>
          Favoriser le développement du jeu de Mölkky ; organiser animations,
          tournois et manifestations ; restaurer ou reproduire des jeux de bois
          anciens ; imaginer et créer de nouveaux jeux de bois.
        </p>
      </section>

      <section className="prose prose-lg">
        <h2 className="text-2xl font-cooper mb-3">
          4. Propriété intellectuelle
        </h2>
        <p>
          L’ensemble des contenus présents sur le site (textes, images, logos,
          documents, etc.) sont la propriété exclusive du{' '}
          <span className="font-semibold">CLUB RHODANIEN DE MOLKKY</span>, sauf
          mention contraire. Toute reproduction, distribution, modification,
          adaptation, retransmission ou publication, même partielle, est
          strictement interdite sans l’accord écrit du Club.
        </p>
      </section>

      <section className="prose prose-lg">
        <h2 className="text-2xl font-cooper mb-3">5. Données personnelles</h2>
        <p>
          Le CLUB RHODANIEN DE MOLKKY s’engage à ce que la collecte et le
          traitement de vos données personnelles, effectués à partir du site
          Mölkky Lyon, soient conformes au RGPD et à la loi Informatique et
          Libertés. Vous disposez d’un droit d’accès, de rectification et de
          suppression des données vous concernant, que vous pouvez exercer en
          écrivant à : <span className="font-semibold">06 37 97 25 01</span>.
        </p>
      </section>

      <section className="prose prose-lg">
        <h2 className="text-2xl font-cooper mb-3">6. Responsabilité</h2>
        <p>
          Le site peut contenir des liens hypertextes vers d’autres sites. Le
          CLUB RHODANIEN DE MOLKKY ne saurait être tenu responsable du contenu
          de ces sites tiers. L’association ne pourra être tenue pour
          responsable de tout dommage direct ou indirect résultant de
          l’utilisation du site ou de l’impossibilité pour un utilisateur d’y
          accéder.
        </p>
      </section>
    </main>
  );
}
