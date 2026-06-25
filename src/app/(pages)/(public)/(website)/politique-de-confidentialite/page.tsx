import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de Confidentialité — Lency",
    description: "Politique de confidentialité et protection des données personnelles de la plateforme Lency.",
};

export default function PolitiqueConfidentialitePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 pt-24 sm:pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h1>Politique de Confidentialité</h1>
                    <p className="text-sm text-neutral-500">Dernière mise à jour : 05 mars 2026</p>

                    <h2>1. Introduction</h2>
                    <p>La présente Politique de Confidentialité a pour objectif d&apos;informer les utilisateurs de la plateforme <strong>LENCY</strong> sur la manière dont leurs données personnelles sont collectées, utilisées et protégées.</p>
                    <p>LENCY s&apos;engage à respecter la réglementation applicable en matière de protection des données personnelles, notamment le <strong>Règlement Général sur la Protection des Données (RGPD – règlement UE 2016/679)</strong> et la <strong>loi Informatique et Libertés</strong>.</p>

                    <h2>2. Responsable du traitement</h2>
                    <p>Les données personnelles collectées sur la plateforme sont traitées par :</p>
                    <p>
                        <strong>LENCY</strong><br />
                        Société par actions simplifiée (SAS)<br />
                        Siège social : COEUR DEFENSE - TOUR B - 110 ESPLANADE DU GENERAL DE GAULLE 92400 COURBEVOIE<br />
                        Email de contact : <a href="mailto:contact@lency.fr">contact@lency.fr</a>
                    </p>

                    <h2>3. Données collectées</h2>
                    <p>Dans le cadre de l&apos;utilisation de la plateforme, LENCY peut collecter les catégories de données suivantes :</p>
                    <h3>Données d&apos;identification</h3>
                    <ul>
                        <li>nom et prénom</li>
                        <li>pseudonyme</li>
                        <li>adresse email</li>
                        <li>mot de passe (chiffré)</li>
                    </ul>
                    <h3>Données de profil</h3>
                    <ul>
                        <li>photo de profil</li>
                        <li>description professionnelle</li>
                        <li>compétences et portfolio</li>
                        <li>projets audiovisuels publiés</li>
                    </ul>
                    <h3>Données techniques</h3>
                    <ul>
                        <li>adresse IP</li>
                        <li>type de navigateur</li>
                        <li>système d&apos;exploitation</li>
                        <li>données de connexion et d&apos;utilisation de la plateforme</li>
                    </ul>
                    <h3>Données de paiement (le cas échéant)</h3>
                    <p>Si l&apos;utilisateur souscrit à un abonnement premium, certaines données de paiement peuvent être collectées via un <strong>prestataire de paiement sécurisé</strong>. LENCY ne conserve pas les données bancaires complètes.</p>

                    <h2>4. Finalités du traitement</h2>
                    <p>Les données personnelles sont collectées pour les finalités suivantes :</p>
                    <ul>
                        <li>création et gestion des comptes utilisateurs</li>
                        <li>mise en relation entre utilisateurs</li>
                        <li>publication et gestion des contenus</li>
                        <li>fonctionnement et amélioration de la plateforme</li>
                        <li>gestion des abonnements et paiements</li>
                        <li>prévention des fraudes et abus</li>
                        <li>respect des obligations légales.</li>
                    </ul>

                    <h2>5. Base légale du traitement</h2>
                    <p>Le traitement des données personnelles repose sur les bases juridiques suivantes :</p>
                    <ul>
                        <li><strong>exécution du contrat</strong> (utilisation de la plateforme)</li>
                        <li><strong>consentement</strong> (cookies, communications)</li>
                        <li><strong>obligations légales</strong></li>
                        <li><strong>intérêt légitime</strong> de LENCY pour améliorer et sécuriser le service.</li>
                    </ul>

                    <h2>6. Destinataires des données</h2>
                    <p>Les données personnelles peuvent être accessibles :</p>
                    <ul>
                        <li>aux équipes internes de LENCY</li>
                        <li>aux prestataires techniques nécessaires au fonctionnement du service.</li>
                    </ul>
                    <p>Ces prestataires peuvent inclure notamment : services d&apos;hébergement, services d&apos;infrastructure cloud, prestataires de paiement, services d&apos;analyse d&apos;audience. Ils sont soumis à des obligations de confidentialité et de sécurité.</p>

                    <h2>7. Transferts de données hors Union européenne</h2>
                    <p>Certains services utilisés par LENCY peuvent impliquer un transfert de données en dehors de l&apos;Union européenne, notamment vers les États-Unis.</p>
                    <p>Dans ce cas, LENCY veille à ce que ces transferts soient encadrés par des garanties appropriées conformément au RGPD (clauses contractuelles types ou mécanismes équivalents).</p>

                    <h2>8. Durée de conservation des données</h2>
                    <p>Les données personnelles sont conservées pendant une durée limitée :</p>
                    <ul>
                        <li>données de compte : pendant toute la durée d&apos;utilisation du service</li>
                        <li>données de facturation : durée légale de conservation (10 ans)</li>
                        <li>données techniques : durée maximale de 13 mois.</li>
                    </ul>
                    <p>En cas de suppression du compte, les données personnelles sont supprimées ou anonymisées dans un délai raisonnable, sauf obligation légale de conservation.</p>

                    <h2>9. Droits des utilisateurs</h2>
                    <p>Conformément au RGPD, les utilisateurs disposent des droits suivants :</p>
                    <ul>
                        <li>droit d&apos;accès à leurs données</li>
                        <li>droit de rectification</li>
                        <li>droit de suppression</li>
                        <li>droit d&apos;opposition</li>
                        <li>droit à la limitation du traitement</li>
                        <li>droit à la portabilité des données.</li>
                    </ul>
                    <p>Les utilisateurs peuvent exercer ces droits en contactant : <a href="mailto:contact@lency.fr">contact@lency.fr</a></p>
                    <p>Une réponse sera apportée dans un délai maximal d&apos;un mois.</p>

                    <h2>10. Sécurité des données</h2>
                    <p>LENCY met en œuvre des mesures techniques et organisationnelles appropriées afin de garantir la sécurité des données personnelles et de prévenir tout accès non autorisé, perte ou divulgation.</p>
                    <p>Toutefois, aucun système informatique ne peut garantir une sécurité absolue.</p>

                    <h2>11. Cookies</h2>
                    <p>La plateforme LENCY peut utiliser des cookies afin d&apos;assurer le fonctionnement technique du site, d&apos;analyser l&apos;utilisation de la plateforme et d&apos;améliorer l&apos;expérience utilisateur.</p>
                    <p>Les utilisateurs peuvent accepter ou refuser l&apos;utilisation des cookies via le bandeau prévu à cet effet lors de leur première visite.</p>

                    <h2>12. Données des mineurs</h2>
                    <p>La plateforme est accessible à partir de <strong>15 ans</strong>. Les utilisateurs mineurs doivent disposer de l&apos;autorisation de leur représentant légal.</p>

                    <h2>13. Réclamation auprès de l&apos;autorité de contrôle</h2>
                    <p>Si un utilisateur estime que le traitement de ses données personnelles ne respecte pas la réglementation, il peut introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">https://www.cnil.fr</a></p>

                    <h2>14. Modification de la politique de confidentialité</h2>
                    <p>LENCY se réserve le droit de modifier la présente Politique de Confidentialité à tout moment afin de garantir sa conformité avec la législation en vigueur. Les utilisateurs seront informés de toute modification importante.</p>
                </div>
            </div>
        </div>
    );
}
