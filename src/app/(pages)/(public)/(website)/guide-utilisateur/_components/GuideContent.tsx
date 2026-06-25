'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: 'connexion', label: 'Connexion' },
  { id: 'fil', label: 'Fil & Posts' },
  { id: 'ressources', label: 'Ressources' },
  { id: 'communautes', label: 'Communautés' },
  { id: 'interactions', label: 'Interactions' },
  { id: 'mkt-explorer', label: 'Explorer' },
  { id: 'mkt-projet', label: 'Créer un projet' },
  { id: 'mkt-postuler', label: 'Postuler' },
  { id: 'mkt-gerer', label: 'Gérer' },
  { id: 'mkt-talents', label: 'Talents & Chat' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'map', label: 'Map interactive' },
  { id: 'profil', label: 'Profil public' },
  { id: 'parametres', label: 'Paramètres' },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

function ChapterLabel({ n, label: _label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="inline-flex items-center gap-2 bg-orange-50 text-[#EA3D0E] rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wide">
        Chapitre {n}
      </span>
    </div>
  );
}

function ChapterDivider() {
  return <div className="h-0.5 w-20 rounded bg-gradient-to-r from-[#EA3D0E] to-[#00CEC9] mb-8" />;
}

function SectionBand({ icon, part, title }: { icon: string; part: string; title: string }) {
  return (
    <div className="mt-16 pt-10 border-t-[3px] border-[#EA3D0E] flex items-center gap-4 mb-1">
      <span className="text-4xl">{icon}</span>
      <div>
        <div className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-widest">{part}</div>
        <h2 className="text-2xl font-black text-[#EA3D0E] leading-tight">{title}</h2>
      </div>
    </div>
  );
}

function SectionBandDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] text-neutral-500 max-w-2xl mb-8">{children}</p>;
}

function Route({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded px-2 py-0.5 font-mono text-xs text-slate-700 before:content-['→'] before:text-[#EA3D0E]">
      {children}
    </span>
  );
}

function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'green' | 'orange' | 'blue' | 'red' }) {
  const variants = {
    default: 'bg-orange-50 text-[#EA3D0E]',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-500',
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

function InfoBox({ type, icon, title, children }: { type: 'tip' | 'warn' | 'note' | 'wip'; icon: string; title?: string; children: React.ReactNode }) {
  const styles = {
    tip: 'bg-green-50 border-green-300',
    warn: 'bg-amber-50 border-amber-300',
    note: 'bg-orange-50 border-orange-200',
    wip: 'bg-blue-50 border-blue-300',
  };
  return (
    <div className={`flex gap-3 items-start rounded-xl p-4 border my-5 ${styles[type]}`}>
      <span className="text-lg shrink-0 mt-0.5">{icon}</span>
      <div className="text-[13px] leading-relaxed text-neutral-700">
        {title && <strong className="font-bold block mb-1">{title}</strong>}
        {children}
      </div>
    </div>
  );
}

function StepGrid({ steps }: { steps: { title: string; body: React.ReactNode }[] }) {
  return (
    <div className="flex flex-col gap-4 my-4">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-4 items-start bg-white border border-neutral-200 rounded-xl p-5 hover:border-[#EA3D0E] hover:shadow-[0_0_0_3px_#fdeee9] transition-all">
          <div className="w-9 h-9 shrink-0 bg-[#EA3D0E] text-white rounded-lg flex items-center justify-center text-sm font-extrabold">{i + 1}</div>
          <div>
            <h3 className="text-[15px] font-bold mb-1">{s.title}</h3>
            <div className="text-[13px] text-neutral-500 leading-relaxed">{s.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureGrid({ items }: { items: { icon: string; title: string; desc: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 my-5">
      {items.map((item, i) => (
        <div key={i} className="bg-white border border-neutral-200 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">{item.icon}</div>
          <h4 className="text-[13.5px] font-bold mb-1">{item.title}</h4>
          <p className="text-xs text-neutral-500">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-5">{children}</div>;
}

function Card({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <h4 className="text-[14px] font-bold mb-2.5 flex items-center gap-2">{title}</h4>
      {children}
    </div>
  );
}

function Checklist({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 py-1.5 border-b border-neutral-100 last:border-0 text-[13px] text-neutral-600">
          <span className="text-emerald-500 font-black shrink-0 mt-0.5">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[17px] font-bold mt-6 mb-3.5 flex items-center gap-2.5 after:flex-1 after:h-px after:bg-neutral-200 after:content-['']">
      {children}
    </h3>
  );
}

function Chapter({ id, n, title, intro, children }: { id: string; n: number; title: string; intro: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-14" id={id}>
      <ChapterLabel n={n} label={title} />
      <h2 className="text-2xl font-extrabold mb-2">{title}</h2>
      <p className="text-neutral-500 text-[14.5px] max-w-2xl mb-6">{intro}</p>
      <ChapterDivider />
      {children}
    </div>
  );
}

export default function GuideContent() {
  const [activeId, setActiveId] = useState('connexion');

  useEffect(() => {
    function onScroll() {
      let active = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) active = s.id;
      }
      setActiveId(active);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative">
      {/* Side nav */}
      <aside className="hidden xl:block fixed left-0 top-20 bottom-0 w-52 border-r border-neutral-100 bg-white overflow-y-auto py-4 z-10">
        <div className="px-3">
          <div className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest px-2.5 py-2">Démarrer</div>
          {SECTIONS.slice(0, 1).map(s => <NavBtn key={s.id} s={s} active={activeId === s.id} />)}
          <div className="h-px bg-neutral-100 my-2" />
          <div className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest px-2.5 py-2">Communauté</div>
          {SECTIONS.slice(1, 5).map(s => <NavBtn key={s.id} s={s} active={activeId === s.id} />)}
          <div className="h-px bg-neutral-100 my-2" />
          <div className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest px-2.5 py-2">Marketplace</div>
          {SECTIONS.slice(5, 10).map(s => <NavBtn key={s.id} s={s} active={activeId === s.id} />)}
          <div className="h-px bg-neutral-100 my-2" />
          <div className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest px-2.5 py-2">Espace privé</div>
          {SECTIONS.slice(10).map(s => <NavBtn key={s.id} s={s} active={activeId === s.id} />)}
        </div>
      </aside>

      {/* Content */}
      <div className="xl:ml-52 max-w-3xl mx-auto px-6 pb-20 pt-8">

        {/* Table des matières */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-5 text-[#EA3D0E]">Table des matières</h2>
          <div className="flex flex-col gap-6">
            <TocSection label="Démarrer">
              <TocItem n={1} href="#connexion">Connexion & inscription</TocItem>
            </TocSection>
            <TocSection label="👥 Communauté">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <TocItem n={2} href="#fil">Fil d'actualité & posts</TocItem>
                <TocItem n={3} href="#ressources">Ressources partagées</TocItem>
                <TocItem n={4} href="#communautes">Communautés thématiques</TocItem>
                <TocItem n={5} href="#interactions">Interactions & enregistrements</TocItem>
              </div>
            </TocSection>
            <TocSection label="🛒 Marketplace">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <TocItem n={6} href="#mkt-explorer">Explorer projets & talents</TocItem>
                <TocItem n={7} href="#mkt-projet">Créer & gérer un projet</TocItem>
                <TocItem n={8} href="#mkt-postuler">Postuler à un projet</TocItem>
                <TocItem n={9} href="#mkt-gerer">Candidatures & équipe</TocItem>
                <TocItem n={10} href="#mkt-talents">Profil talent & chat</TocItem>
              </div>
            </TocSection>
            <TocSection label="🔒 Espace privé">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <TocItem n={11} href="#dashboard">Dashboard — tableau de bord</TocItem>
                <TocItem n={12} href="#map">Map interactive</TocItem>
                <TocItem n={13} href="#profil">Profil public</TocItem>
                <TocItem n={14} href="#parametres">Paramètres du compte</TocItem>
              </div>
            </TocSection>
          </div>
        </div>

        {/* ── Chapitre 1 : Connexion ── */}
        <Chapter id="connexion" n={1} title="Connexion & inscription" intro="Lency propose trois méthodes d'authentification. L'inscription prend moins de 2 minutes.">
          <FeatureGrid items={[
            { icon: '📧', title: 'Email / Mot de passe', desc: 'Connexion classique avec identifiant et mot de passe.' },
            { icon: '🔑', title: 'Code OTP par email', desc: 'Recevez un code à usage unique dans votre boîte mail.' },
            { icon: '🌐', title: 'Google OAuth', desc: 'Connexion en un clic avec votre compte Google.' },
          ]} />
          <InfoBox type="note" icon="💡" title="Première visite ?">
            Cliquez sur <strong>"Créer un compte"</strong> depuis la page de connexion. Renseignez prénom, nom, email et mot de passe. Après validation, vous êtes redirigé vers votre <strong>Dashboard</strong>.
          </InfoBox>
        </Chapter>

        {/* ══ Section Communauté ══ */}
        <SectionBand icon="👥" part="Section 1" title="Communauté" />
        <SectionBandDesc>
          L'espace communauté regroupe le fil d'actualité, les ressources partagées et les communautés thématiques. Accessible via <Route>/community</Route>.
        </SectionBandDesc>

        {/* ── Chapitre 2 ── */}
        <Chapter id="fil" n={2} title="Fil d'actualité & posts" intro={<>Le fil est le cœur de la communauté. Trois onglets : <strong>Général</strong> (tous les posts), <strong>Populaire</strong> (triés par votes), <strong>Suivis</strong> (vos communautés seulement).</>}>
          <SectionTitle>Créer un post</SectionTitle>
          <StepGrid steps={[
            { title: 'Ouvrir le formulaire', body: <>Cliquez sur <strong>"Nouveau post"</strong> ou la zone de saisie en haut du fil. Formats disponibles : <Tag>Texte</Tag> <Tag>Image</Tag> <Tag>Vidéo</Tag> <Tag>Audio</Tag>. Pour les médias, choisissez l'orientation Paysage ou Portrait.</> },
            { title: 'Rédiger & choisir la communauté', body: <>Rédigez votre contenu (ou uploadez votre média), puis sélectionnez la <strong>communauté cible</strong> dans le menu déroulant. Le post sera visible dans son fil dédié.</> },
            { title: 'Publier ou enregistrer en brouillon', body: <>Activez <strong>"Publié"</strong> pour une visibilité immédiate, ou laissez en <strong>"Brouillon"</strong> pour finaliser plus tard. Un toast de confirmation s'affiche à la publication.</> },
          ]} />
          <InfoBox type="note" icon="👁️" title="Sidebar droite">
            Le fil affiche vos <em>éléments récemment consultés</em> dans la sidebar droite, pour retrouver rapidement un post ou une ressource visités.
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 3 ── */}
        <Chapter id="ressources" n={3} title="Ressources partagées" intro={<>Les ressources sont des contenus structurés — tutoriels, assets ou liens — accessibles depuis <Route>/community/resources</Route> ou via la sidebar.</>}>
          <TwoCol>
            <Card title="📦 Asset"><p className="text-[13px] text-neutral-500">Fichiers réutilisables : mockups, icônes, templates, polices. Uploadez une image de couverture pour maximiser l'engagement.</p></Card>
            <Card title="🎓 Tutoriel"><p className="text-[13px] text-neutral-500">Guides, cours ou articles explicatifs pour partager votre savoir-faire avec la communauté.</p></Card>
          </TwoCol>
          <Card title="🔗 Lien"><p className="text-[13px] text-neutral-500">URL vers une ressource externe : article, outil en ligne, vidéo YouTube, documentation. Collez simplement le lien dans le champ dédié.</p></Card>
          <SectionTitle>Publier une ressource</SectionTitle>
          <StepGrid steps={[
            { title: 'Cliquer sur "Ajouter une ressource"', body: <>Depuis la page <Route>/community/resources</Route>, cliquez sur le bouton en haut. Choisissez le type, donnez un titre clair, une description (optionnelle) et associez à une communauté.</> },
            { title: 'Ajouter le contenu', body: <>Pour un <strong>Lien</strong> : collez l'URL externe. Pour un <strong>Asset / Tutoriel</strong> : uploadez une image de couverture, vidéo ou fichier audio. Puis publiez — la ressource apparaît dans la bibliothèque globale.</> },
          ]} />
          <InfoBox type="tip" icon="✨">
            Les ressources avec image de couverture obtiennent en moyenne <strong>3× plus d'engagements</strong> que celles sans visuel.
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 4 ── */}
        <Chapter id="communautes" n={4} title="Communautés thématiques" intro={<>Lency est organisé en communautés (appelées catégories). Chaque communauté a son fil, ses ressources et ses membres. Accès via <Route>/community/[slug]</Route>.</>}>
          <FeatureGrid items={[
            { icon: '🖼️', title: 'Bannière & identité', desc: 'Image de couverture, icône, nom et description propres à la communauté.' },
            { icon: '📋', title: 'Règles & statistiques', desc: 'Règles de conduite, nombre de membres, posts publiés et abonnés actifs.' },
            { icon: '📚', title: 'Bibliothèque dédiée', desc: <>Chaque communauté possède ses propres ressources via <Route>/community/[slug]/resources</Route>.</> },
          ]} />
          <SectionTitle>Suivre une communauté</SectionTitle>
          <p className="text-[13px] text-neutral-500 mb-3.5">Accédez à la page de la communauté (via un badge sur un post ou l'URL directe), cliquez sur <strong>"Suivre"</strong>. Basculez ensuite sur l'onglet <strong>"Suivis"</strong> du fil pour un feed personnalisé.</p>
          <InfoBox type="note" icon="📌">
            Cliquer sur le logo <strong>Lency</strong> en haut de la sidebar vous ramène toujours au fil d'actualité principal.
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 5 ── */}
        <Chapter id="interactions" n={5} title="Interactions & enregistrements" intro={<>Chaque post et chaque ressource propose des actions d'interaction. Les enregistrements sont centralisés dans votre espace personnel <Route>/community/saved</Route>.</>}>
          <div className="flex flex-wrap gap-2.5 my-4">
            {[['❤️ Voter', 'bg-[#EA3D0E]'], ['💬 Commenter', 'bg-[#00CEC9]'], ['🔖 Enregistrer', 'bg-amber-500'], ['↗ Partager', 'bg-emerald-500']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-2 bg-white border-1.5 border-neutral-200 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </div>
            ))}
          </div>
          <TwoCol>
            <Card title="❤️ Voter"><p className="text-[13px] text-neutral-500">Cliquez sur le cœur pour voter positivement. Le compteur se met à jour en temps réel. Recliquez pour retirer votre vote.</p></Card>
            <Card title="💬 Commenter"><p className="text-[13px] text-neutral-500">Cliquez sur la bulle pour ouvrir le fil. Vous pouvez répondre à un commentaire existant pour créer des threads imbriqués.</p></Card>
            <Card title="🔖 Enregistrer"><p className="text-[13px] text-neutral-500">Sauvegardez le contenu dans votre espace "Enregistrés". L'icône passe en orange si déjà sauvegardé. Deux onglets : <strong>Posts</strong> et <strong>Ressources</strong>.</p></Card>
            <Card title="↗ Partager"><p className="text-[13px] text-neutral-500">Copie le lien direct vers le post ou la ressource dans votre presse-papier, prêt à être partagé.</p></Card>
          </TwoCol>
        </Chapter>

        {/* ══ Section Marketplace ══ */}
        <SectionBand icon="🛒" part="Section 2" title="Marketplace" />
        <SectionBandDesc>
          La Marketplace est l'espace de mise en relation entre porteurs de projets créatifs et talents. Accessible via <Route>/marketplace</Route>.
        </SectionBandDesc>

        {/* ── Chapitre 6 ── */}
        <Chapter id="mkt-explorer" n={6} title="Explorer projets & talents" intro={<>Deux onglets principaux : <strong>Projets</strong> (toutes les offres de collaboration) et <strong>Talents</strong> (les profils disponibles). Six catégories de projets : Court métrage, Long métrage, Série, Clip, Documentaire, Autre.</>}>
          <SectionTitle>Filtres disponibles</SectionTitle>
          <TwoCol>
            <Card title="🎬 Projets">
              <Checklist items={['Type (Court métrage, Clip…)', 'Ville de tournage', 'Mode de travail (Présentiel / Distanciel / Hybride)', 'Niveau requis (Débutant / Intermédiaire / Avancé)', 'Rémunération (Rémunéré / Non rémunéré)', "Date de publication (Aujourd'hui / Semaine / Mois…)"]} />
            </Card>
            <Card title="🧑‍🎨 Talents">
              <Checklist items={['Rôle / Compétence (Monteur, Compositeur…)', 'Mode de travail', 'Niveau', 'Préférence de rémunération']} />
            </Card>
          </TwoCol>
          <SectionTitle>Ce qu'on trouve sur une fiche projet</SectionTitle>
          <FeatureGrid items={[
            { icon: '🖼️', title: 'Bannière', desc: 'Image de couverture, cliquable pour agrandir.' },
            { icon: '📋', title: 'Infos pratiques', desc: 'Type, ville, rémunération, niveau, date de début, rôles recherchés.' },
            { icon: '👥', title: 'Équipe actuelle', desc: 'Membres déjà rejoints, profils cliquables.' },
            { icon: '📎', title: 'Pièces jointes', desc: 'Script, brief, moodboard fournis par le porteur.' },
            { icon: '💬', title: 'Commentaires', desc: 'Discussion publique visible par tous.' },
            { icon: '🔗', title: 'Projets similaires', desc: 'Trois projets de la même catégorie.' },
          ]} />
          <InfoBox type="note" icon="🌐" title="3 niveaux de visibilité :">
            <Tag>Public</Tag> (visible par tous) · <Tag variant="blue">Membres</Tag> (connectés uniquement) · <Tag variant="orange">Privé</Tag> (porteur + membres invités).
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 7 ── */}
        <Chapter id="mkt-projet" n={7} title="Créer & gérer un projet" intro={<>Publiez votre projet pour trouver des collaborateurs. Cliquez sur <strong>"Nouveau projet"</strong> depuis la Marketplace — un formulaire modal s'ouvre sans vous rediriger.</>}>
          <StepGrid steps={[
            { title: 'Titre & description', body: 'Titre accrocheur (max 150 car.) + description complète (max 2 000 car.). C\'est votre argument principal pour attirer les bons collaborateurs.' },
            { title: 'Critères & rôles', body: <>Choisissez le type de projet, niveau requis, rémunération, mode de travail, ville et date de début (optionnels). Ajoutez des tags de rôles recherchés : <Tag>Monteur</Tag> <Tag>Compositeur</Tag>…</> },
            { title: 'Visibilité & bannière', body: 'Définissez qui peut voir le projet (Public / Membres / Privé). Uploadez une image de couverture — les projets avec bannière obtiennent significativement plus de candidatures.' },
            { title: 'Publier ou brouillon', body: <><strong>"Publier"</strong> pour une visibilité immédiate selon les règles choisies. <strong>"Brouillon"</strong> pour finaliser plus tard. Modifiable ou supprimable à tout moment via le bouton "···" sur la fiche.</> },
          ]} />
          <InfoBox type="warn" icon="⚠️">
            La <strong>suppression d'un projet est irréversible</strong> et supprime également tous les commentaires et candidatures associés.
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 8 ── */}
        <Chapter id="mkt-postuler" n={8} title="Postuler à un projet" intro={<>Trouvez un projet qui vous correspond et envoyez une candidature depuis la fiche projet. <strong>Une seule candidature par projet.</strong></>}>
          <StepGrid steps={[
            { title: 'Cliquer sur "Postuler"', body: "Le bouton est visible si vous êtes connecté et pas encore candidat ou membre. Une modal s'ouvre avec trois champs optionnels." },
            { title: 'Remplir la candidature', body: <><strong>Message de motivation</strong> (max 1 000 car.) — citez un détail spécifique du projet. <strong>Lien portfolio</strong> — URL vers vos réalisations. <strong>Lien CV</strong> — Google Drive ou autre.</> },
            { title: 'Soumettre & attendre', body: <>Cliquez sur <strong>"Envoyer ma candidature"</strong>. Statut initial : <Tag variant="orange">En attente</Tag>. Le porteur est notifié et peut accepter, refuser ou vous laisser un message.</> },
          ]} />
          <TwoCol>
            <Card title="✅ Si accepté">
              <Checklist items={[<>Statut passe à <Tag variant="green">Accepté</Tag></>, 'Vous rejoignez l\'équipe', 'Accès au chat privé du projet', 'Profil affiché dans "Équipe"']} />
            </Card>
            <Card title="❌ Si refusé">
              <Checklist items={[<>Statut passe à <Tag variant="red">Refusé</Tag></>, 'Notification envoyée avec message optionnel', 'Impossible de repostuler au même projet']} />
            </Card>
          </TwoCol>
        </Chapter>

        {/* ── Chapitre 9 ── */}
        <Chapter id="mkt-gerer" n={9} title="Candidatures & équipe" intro="En tant que porteur, gérez les candidatures reçues et invitez directement des talents à rejoindre votre équipe.">
          <SectionTitle>Gérer les candidatures</SectionTitle>
          <StepGrid steps={[
            { title: 'Accéder à la page Candidatures', body: <>Depuis la fiche de votre projet, cliquez sur <strong>"Voir les candidatures"</strong> → <Route>/marketplace/[id]/candidature</Route>. Page visible uniquement par le porteur.</> },
            { title: 'Filtrer & consulter', body: <>Filtres : statut (En attente / Accepté / Refusé), toggle <em>"A un portfolio"</em>, toggle <em>"Est un Talent Marketplace"</em>. Chaque carte affiche : avatar, bio, rôles, message de motivation, portfolio et CV.</> },
            { title: 'Répondre (Accepter / Refuser)', body: <>Cliquez sur <strong>"Répondre"</strong> (visible uniquement sur les candidatures <Tag variant="orange">En attente</Tag>). Rédigez un message optionnel (max 500 car.), puis acceptez ou refusez. Le candidat est notifié immédiatement.</> },
          ]} />
          <SectionTitle>Inviter directement un talent</SectionTitle>
          <StepGrid steps={[
            { title: 'Bloc "Inviter un membre"', body: <>Sur la fiche de votre projet, faites défiler jusqu'à la section <strong>"Inviter un membre"</strong>. Tapez un nom d'utilisateur — la liste affiche en temps réel les talents avec le statut <em>"Prêt à démarrer"</em>.</> },
            { title: 'Envoyer & suivre', body: <>Cliquez sur <strong>"Inviter"</strong>. Le bouton se désactive si la personne est déjà membre ou a déjà candidaté. Les invitations envoyées s'affichent sous le bloc avec leur statut : <Tag variant="orange">En attente</Tag> / <Tag variant="green">Acceptée</Tag> / <Tag variant="red">Refusée</Tag>.</> },
          ]} />
          <InfoBox type="tip" icon="💡">
            Invitations et candidatures aboutissent au même résultat (rejoindre l'équipe). La différence : l'invitation part du porteur, la candidature part du talent.
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 10 ── */}
        <Chapter id="mkt-talents" n={10} title="Profil talent & chat de projet" intro="Rendez-vous visible en tant que talent, et coordonnez votre équipe via le chat privé du projet.">
          <SectionTitle>Devenir un Talent Marketplace</SectionTitle>
          <StepGrid steps={[
            { title: 'Cliquer sur "Devenir un talent"', body: "Depuis la Marketplace, cliquez sur le bouton visible si vous n'êtes pas encore talent. Une modal s'ouvre pour configurer votre profil : rôles, mode de travail, niveau, rémunération, portfolio et CV." },
            { title: 'Activer "Prêt à démarrer"', body: <>Ce statut vous rend visible dans les résultats de recherche d'invitation directe. Votre profil apparaît dans l'onglet <strong>Talents</strong> de la Marketplace.</> },
          ]} />
          <InfoBox type="note" icon="🔗">
            Les informations de votre profil talent proviennent de votre profil public <Route>/user/[username]</Route>. Complétez-le pour maximiser votre visibilité.
          </InfoBox>
          <hr className="my-6 border-neutral-200" />
          <SectionTitle>Chat de projet</SectionTitle>
          <p className="text-[13px] text-neutral-500 mb-4">Chaque projet dispose d'un chat privé accessible uniquement aux membres confirmés (porteur + membres acceptés). Les candidats en attente n'y ont pas accès.</p>
          <TwoCol>
            <Card title="💬 Fonctionnalités">
              <Checklist items={['Messages texte en temps réel', "Partage d'images, vidéos et audio", 'Historique complet des échanges', 'Avatars et noms affichés']} />
            </Card>
            <Card title="🔐 Accès">
              <Checklist items={['Réservé aux membres confirmés', "Accessible dès l'acceptation", 'Non visible publiquement', <Route>/marketplace/[id]/chat</Route>]} />
            </Card>
          </TwoCol>
          <div className="bg-gradient-to-r from-[#EA3D0E] to-[#b82d08] text-white rounded-2xl p-7 my-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-lg font-extrabold mb-1">Prêt à lancer votre projet ?</h3>
              <p className="text-[13px] opacity-80">Publiez votre projet et trouvez les talents qui vous correspondent, ou proposez vos services et rejoignez des projets passionnants.</p>
            </div>
            <Link href="/marketplace" className="bg-white text-[#EA3D0E] rounded-xl px-5 py-2.5 text-[13px] font-bold whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity">
              Aller à la Marketplace →
            </Link>
          </div>
        </Chapter>

        {/* ══ Section Espace privé ══ */}
        <SectionBand icon="🔒" part="Section 3" title="Espace privé" />
        <SectionBandDesc>
          Le Dashboard, la Map interactive, votre profil public et vos paramètres — accessibles depuis <Route>/account</Route> après connexion.
        </SectionBandDesc>

        {/* ── Chapitre 11 ── */}
        <Chapter id="dashboard" n={11} title="Dashboard — tableau de bord" intro={<>Le Dashboard est votre écran d'accueil après connexion (<Route>/account</Route>). La page est divisée en <strong>3 zones fixes</strong> qui occupent tout l'écran sans scroll de page.</>}>
          <SectionTitle>① Projets à la Une</SectionTitle>
          <p className="text-[13px] text-neutral-500 mb-3.5">Bandeau en haut de la page. Présente les <strong>12 projets les plus récents</strong> de la Marketplace dans un carousel horizontal.</p>
          <TwoCol>
            <Card title="🎞️ Le carousel">
              <Checklist items={['Défilement horizontal : flèche › à droite', 'Le dernier item est partiellement masqué pour signaler du contenu à droite', 'Chaque carte : bannière, titre, type de projet, ville', 'Clic sur une carte → fiche projet sur la Marketplace']} />
            </Card>
            <Card title="⤢ Mode plein écran">
              <Checklist items={['Icône ⤢ en haut à droite du bloc', 'Tous les projets s\'affichent en grille dans une modale', 'Fermer avec ×']} />
            </Card>
          </TwoCol>
          <SectionTitle>② Onglets principaux</SectionTitle>
          <p className="text-[13px] text-neutral-500 mb-4">Zone centrale qui prend tout l'espace restant. Un sélecteur en haut commute entre deux onglets.</p>
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <TwoCol>
              <div>
                <div className="text-[13.5px] font-bold mb-2.5">👥 Onglet Communautés</div>
                <Checklist items={['Grille 2 colonnes des communautés que vous suivez', 'Chaque carte : bannière + nom + description', 'Badges noirs : N membres · N posts · N ressources', <><Route>/community/[slug]</Route> au clic</>, <>Si aucune communauté suivie → lien vers <Route>/community</Route></>, 'Bouton ⤢ → affichage plein écran de la liste']} />
              </div>
              <div>
                <div className="text-[13.5px] font-bold mb-2.5">🗺️ Onglet Explorer & Marketplace</div>
                <Checklist items={[<>Sous-onglets <Tag>Projets</Tag> <Tag>Talents</Tag> (filtres indépendants)</>, 'Bouton Filtres (icône ⊞) — panneau collapsible sous le bouton', 'Carte interactive géolocalisée (détaillée au Chapitre 12)', 'Grille 2 colonnes de résultats filtrés sous la carte', 'Bouton ⤢ → carte plein écran + filtres dans panneau latéral droit']} />
              </div>
            </TwoCol>
          </div>
          <SectionTitle>③ Colonne Notifications</SectionTitle>
          <p className="text-[13px] text-neutral-500 mb-4">Colonne fixe à droite (~329 px). Toujours visible, elle centralise toutes vos alertes en temps réel.</p>
          <TwoCol>
            <Card title="📋 Organisation">
              <Checklist items={[<><strong>Aujourd'hui</strong> · <strong>Hier</strong> · puis la date</>, 'Chaque groupe est collapsible au clic', 'Tri du plus récent au plus ancien', 'Icône 🗑 en haut → tout supprimer d\'un coup']} />
            </Card>
            <Card title="⚡ Actions directes">
              <Checklist items={[<><strong>Candidature reçue</strong> → modale Accepter / Refuser avec message sans quitter la page</>, <><strong>Statut candidature</strong> → modale de détail (acceptée ou refusée + message du porteur)</>, <><strong>Invitation projet</strong> → modale avec infos du projet</>, 'Dismiss individuel sur chaque notification']} />
            </Card>
          </TwoCol>
          <InfoBox type="tip" icon="💡">
            Vous pouvez <strong>répondre à une candidature directement depuis les notifications</strong> — la modale s'ouvre avec le profil complet du candidat (bio, rôles, motivation, portfolio, CV) sans naviguer vers la fiche projet.
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 12 ── */}
        <Chapter id="map" n={12} title="Map interactive" intro={<>La Map est intégrée au Dashboard dans l'onglet <strong>"Explorer & Marketplace"</strong>. Elle permet de visualiser géographiquement les projets et les talents disponibles sur la plateforme.</>}>
          <SectionTitle>Accéder à la Map</SectionTitle>
          <StepGrid steps={[
            { title: 'Ouvrir l\'onglet "Explorer & Marketplace"', body: <>Depuis le Dashboard <Route>/account</Route>, cliquez sur l'onglet <strong>"Explorer & Marketplace"</strong>. La Map s'affiche dans la partie supérieure du panneau.</> },
            { title: 'Choisir le mode : Projets ou Talents', body: <>Deux sous-onglets apparaissent : <strong>Projets</strong> affiche les projets géolocalisés, <strong>Talents</strong> affiche les profils avec leur localisation. Chaque mode a ses propres filtres.</> },
            { title: 'Filtrer depuis la Map', body: 'Un panneau de filtres est affiché sous la carte (ou à droite en mode plein écran). Projets : titre, type, niveau, rémunération, mode de travail, dates. Talents : rôle, niveau, mode, rémunération.' },
            { title: 'Agrandir en plein écran', body: <>Cliquez sur le bouton <strong>"Agrandir"</strong> (icône ⤢) pour passer la Map en mode plein écran. La carte occupe toute la gauche, les filtres s'affichent dans un panneau latéral droit. Touche <strong>Echap</strong> ou bouton <strong>×</strong> pour fermer.</> },
          ]} />
          <TwoCol>
            <Card title="🗺️ Map Projets">
              <Checklist items={['Tous les projets publiés avec localisation', 'Filtre par titre (autocomplétion)', 'Filtre par type de projet', 'Filtres niveau, rémunération, mode, dates', 'Résultats mis à jour en temps réel']} />
            </Card>
            <Card title="🧑‍🎨 Map Talents">
              <Checklist items={['Profils talent géolocalisés', 'Filtre par rôle / compétence', 'Filtre par niveau et mode de travail', 'Filtre par préférence de rémunération', 'Accès direct au profil public']} />
            </Card>
          </TwoCol>
          <InfoBox type="tip" icon="🗺️" title="Astuce">
            Utilisez la Map en mode plein écran pour une meilleure vue d'ensemble géographique. Les filtres restent accessibles dans le panneau latéral droit sans masquer la carte.
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 13 ── */}
        <Chapter id="profil" n={13} title="Profil public" intro={<>Votre profil public est accessible par tous les membres à l'adresse <Route>/user/[votre-username]</Route>. C'est votre vitrine sur la plateforme.</>}>
          <TwoCol>
            <div className="flex flex-col gap-3.5">
              <Card title="👤 En-tête">
                <Checklist items={['Photo de profil (avatar)', 'Prénom, nom & username', 'Biographie courte', 'Liens sociaux (portfolio, CV…)', 'Bouton Suivre / Ne plus suivre']} />
              </Card>
              <Card title="📈 Statistiques">
                <Checklist items={['Posts publiés', 'Ressources partagées', "Nombre d'abonnés / suivis"]} />
              </Card>
            </div>
            <Card title="📑 Onglets de contenu">
              <Checklist items={[<><strong>Posts</strong> — publications de l'utilisateur</>, <><strong>Ressources</strong> — ressources partagées</>, <><strong>Projets</strong> — projets Marketplace</>]} />
            </Card>
          </TwoCol>
          <InfoBox type="note" icon="📍" title="Accéder à votre profil">
            En bas de la sidebar gauche, cliquez sur votre avatar ou nom → <strong>"Mon profil"</strong>. Vous pouvez partager l'URL <Route>/user/[username]</Route> directement sur vos réseaux.
          </InfoBox>
        </Chapter>

        {/* ── Chapitre 14 ── */}
        <Chapter id="parametres" n={14} title="Paramètres du compte" intro={<>L'espace paramètres est accessible via <Route>/account/settings</Route>.</>}>
          <SectionTitle>Sections disponibles</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Card title={<>👤 Profil <Tag variant="green">Disponible</Tag></>}>
              <Checklist items={['Photo de profil & bannière', 'Prénom, nom, username', 'Biographie & liens sociaux', "Changement d'adresse email (avec vérification)", 'Suppression du compte (irréversible)']} />
            </Card>
            <Card title={<>🎭 Profil Talent <Tag variant="green">Disponible</Tag></>}>
              <Checklist items={['Compétences & rôles', 'Mode de travail préféré', 'Niveau & rémunération', '"Prêt à démarrer"', 'Portfolio & CV']} />
            </Card>
            <Card title={<>🔐 Sécurité <Tag variant="green">Disponible</Tag></>}>
              <Checklist items={['Changer le mot de passe', 'Authentification 2FA', 'Sessions actives']} />
            </Card>
            <Card title={<>🔔 Notifications <Tag variant="orange">Partiel</Tag></>}>
              <Checklist items={['Préférences emails', 'Notifications in-app', 'Alertes candidatures & commentaires']} />
            </Card>
          </div>
          <InfoBox type="warn" icon="⚠️" title="Suppression du compte">
            La suppression est <strong>irréversible</strong>. Toutes vos données (posts, ressources, projets, candidatures) seront définitivement effacées.
          </InfoBox>
          <InfoBox type="note" icon="🔔" title="Notifications temps réel">
            L'icône cloche dans la sidebar indique le nombre de notifications non lues. Types : candidature reçue / acceptée, commentaire, invitation, vote, nouvel abonné. Cliquez sur une notification pour être redirigé vers l'élément concerné.
          </InfoBox>
        </Chapter>

        {/* Footer doc */}
        <div className="mt-16 pt-7 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-400">
          <div>
            <span className="text-[#EA3D0E] font-bold">Lency</span> — Guide Utilisateur v1.0<br />
            Communauté · Marketplace · Map · Dashboard · Profil · Paramètres
          </div>
          <div className="text-right">
            Juin 2026 · lency.net<br />
            support@infos.lency.net
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ s, active }: { s: Section; active: boolean }) {
  return (
    <button
      onClick={() => scrollTo(s.id)}
      className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all text-left ${active ? 'bg-[#EA3D0E] text-white font-bold' : 'text-neutral-500 hover:bg-orange-50 hover:text-[#EA3D0E]'}`}
    >
      {s.label}
    </button>
  );
}

function TocSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest mb-2.5">{label}</div>
      {children}
    </div>
  );
}

function TocItem({ n, href, children }: { n: number; href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="flex items-center gap-3 py-2 border-b border-neutral-100 text-neutral-700 hover:text-[#EA3D0E] transition-colors text-[13px] font-medium">
      <span className="w-6 h-6 shrink-0 bg-orange-50 text-[#EA3D0E] rounded-lg flex items-center justify-center text-[11px] font-bold">{n}</span>
      {children}
    </a>
  );
}
