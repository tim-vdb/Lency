import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de Cookies — Lency",
    description: "Politique de gestion des cookies de la plateforme Lency.",
};

export default function PolitiqueCookiesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 pt-24 sm:pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h1>Politique de Cookies</h1>
                    <p className="text-sm text-neutral-500">Dernière mise à jour : 05 mars 2026</p>

                    <h2>1. Introduction</h2>
                    <p>La présente Politique de Cookies explique comment la plateforme <strong>LENCY</strong> utilise des cookies et autres technologies similaires lors de l&apos;utilisation du site.</p>
                    <p>Un cookie est un petit fichier texte déposé sur le terminal de l&apos;utilisateur (ordinateur, smartphone, tablette) lors de la visite d&apos;un site internet.</p>
                    <p>Ces cookies permettent notamment d&apos;améliorer l&apos;expérience utilisateur, de mesurer l&apos;audience et d&apos;assurer le bon fonctionnement du service.</p>

                    <h2>2. Responsable du traitement</h2>
                    <p>Les cookies utilisés sur la plateforme sont gérés par :</p>
                    <p>
                        <strong>LENCY</strong><br />
                        Société par actions simplifiée (SAS)<br />
                        Email : <a href="mailto:contact@lency.fr">contact@lency.fr</a>
                    </p>

                    <h2>3. Types de cookies utilisés</h2>
                    <p>La plateforme peut utiliser plusieurs catégories de cookies.</p>

                    <h3>Cookies strictement nécessaires</h3>
                    <p>Ces cookies sont indispensables au fonctionnement du site. Ils permettent notamment :</p>
                    <ul>
                        <li>l&apos;authentification des utilisateurs</li>
                        <li>la gestion des sessions</li>
                        <li>la sécurisation du service.</li>
                    </ul>
                    <p>Ces cookies ne nécessitent pas le consentement de l&apos;utilisateur.</p>

                    <h3>Cookies de mesure d&apos;audience</h3>
                    <p>Ces cookies permettent d&apos;analyser la fréquentation et l&apos;utilisation du site afin d&apos;améliorer les services proposés. Ils permettent par exemple de mesurer :</p>
                    <ul>
                        <li>le nombre de visiteurs</li>
                        <li>les pages consultées</li>
                        <li>le temps passé sur le site.</li>
                    </ul>
                    <p>Ces cookies sont utilisés uniquement avec le consentement de l&apos;utilisateur.</p>

                    <h3>Cookies fonctionnels</h3>
                    <p>Ces cookies permettent de mémoriser certaines préférences de l&apos;utilisateur afin d&apos;améliorer son expérience sur la plateforme. Ils peuvent notamment permettre :</p>
                    <ul>
                        <li>de mémoriser les préférences d&apos;affichage</li>
                        <li>d&apos;enregistrer certaines options du compte.</li>
                    </ul>

                    <h2>4. Gestion du consentement</h2>
                    <p>Lors de sa première visite sur la plateforme, l&apos;utilisateur est informé de l&apos;utilisation de cookies via un <strong>bandeau d&apos;information</strong>.</p>
                    <p>L&apos;utilisateur peut :</p>
                    <ul>
                        <li>accepter tous les cookies</li>
                        <li>refuser les cookies non essentiels</li>
                        <li>personnaliser ses préférences.</li>
                    </ul>
                    <p>Le consentement peut être retiré à tout moment.</p>

                    <h2>5. Durée de conservation des cookies</h2>
                    <p>Les cookies sont conservés pour une durée maximale de <strong>13 mois</strong>, conformément aux recommandations de la CNIL.</p>
                    <p>Au-delà de cette durée, le consentement de l&apos;utilisateur sera à nouveau demandé.</p>

                    <h2>6. Gestion des cookies par le navigateur</h2>
                    <p>L&apos;utilisateur peut également configurer son navigateur afin de refuser ou supprimer les cookies.</p>
                    <ul>
                        <li><strong>Chrome</strong> : <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">support.google.com/chrome/answer/95647</a></li>
                        <li><strong>Firefox</strong> : <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer">support.mozilla.org</a></li>
                        <li><strong>Safari</strong> : <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">support.apple.com</a></li>
                        <li><strong>Edge</strong> : <a href="https://support.microsoft.com/fr-fr/help/4027947" target="_blank" rel="noopener noreferrer">support.microsoft.com</a></li>
                    </ul>

                    <h2>7. Cookies tiers</h2>
                    <p>La plateforme peut utiliser certains services tiers susceptibles de déposer des cookies, notamment :</p>
                    <ul>
                        <li>services d&apos;analyse d&apos;audience</li>
                        <li>services d&apos;hébergement</li>
                        <li>outils techniques nécessaires au fonctionnement du service.</li>
                    </ul>
                    <p>Ces cookies sont soumis aux politiques de confidentialité de leurs fournisseurs respectifs.</p>

                    <h2>8. Modification de la politique de cookies</h2>
                    <p>LENCY se réserve le droit de modifier la présente Politique de Cookies à tout moment afin de garantir sa conformité avec la réglementation en vigueur. Toute modification importante sera portée à la connaissance des utilisateurs.</p>
                </div>
            </div>
        </div>
    );
}
