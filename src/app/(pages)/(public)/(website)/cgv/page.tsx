import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions Générales de Vente — Lency",
    description: "Conditions Générales de Vente de la plateforme Lency.",
};

export default function CGVPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 pt-24 sm:pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h1>Conditions Générales de Vente</h1>
                    <p className="lead"><em>LENCY — Plateforme SaaS communautaire dédiée aux créateurs audiovisuels</em></p>

                    <table>
                        <tbody>
                            <tr><td><strong>Version</strong></td><td>1.0</td></tr>
                            <tr><td><strong>Date d&apos;entrée en vigueur</strong></td><td>18/12/2025</td></tr>
                            <tr><td><strong>Éditeur</strong></td><td>Lency</td></tr>
                            <tr><td><strong>Statut juridique</strong></td><td>SAS</td></tr>
                            <tr><td><strong>Adresse</strong></td><td>Lyon</td></tr>
                            <tr><td><strong>Contact</strong></td><td>lency@hotmail.fr</td></tr>
                            <tr><td><strong>Hébergeur</strong></td><td>Vercel Inc. – 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</td></tr>
                            <tr><td><strong>Site web hébergeur</strong></td><td>https://vercel.com</td></tr>
                        </tbody>
                    </table>

                    <h2>Article 1 – Objet</h2>
                    <p>Les présentes Conditions Générales de Vente (ci-après « CGV ») ont pour objet de définir les modalités et conditions dans lesquelles la plateforme Lency (ci-après « la Plateforme ») fournit ses services aux utilisateurs inscrits (ci-après « l&apos;Utilisateur »).</p>
                    <p>La Plateforme est un service SaaS (Software as a Service) communautaire destiné aux créateurs audiovisuels. Elle propose notamment :</p>
                    <ul>
                        <li>la mise en relation entre créateurs audiovisuels ;</li>
                        <li>la participation à des projets collaboratifs ;</li>
                        <li>la publication et la valorisation de portfolios ;</li>
                        <li>l&apos;accès à des ressources pédagogiques et tutoriels ;</li>
                        <li>l&apos;accès à des fonctionnalités avancées via un abonnement premium.</li>
                    </ul>
                    <p>Toute utilisation de la Plateforme implique l&apos;acceptation pleine, entière et sans réserve des présentes CGV.</p>

                    <h2>Article 2 – Identité du fournisseur</h2>
                    <h3>2.1 Éditeur du service</h3>
                    <table>
                        <tbody>
                            <tr><td><strong>Raison sociale</strong></td><td>Lency</td></tr>
                            <tr><td><strong>Statut juridique</strong></td><td>SAS</td></tr>
                            <tr><td><strong>Adresse</strong></td><td>Lyon</td></tr>
                            <tr><td><strong>E-mail de contact</strong></td><td>lency@hotmail.fr</td></tr>
                        </tbody>
                    </table>
                    <h3>2.2 Hébergement</h3>
                    <p>Le site et ses données sont hébergés par :</p>
                    <table>
                        <tbody>
                            <tr><td><strong>Raison sociale</strong></td><td>Vercel Inc.</td></tr>
                            <tr><td><strong>Adresse</strong></td><td>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</td></tr>
                            <tr><td><strong>Site web</strong></td><td>https://vercel.com</td></tr>
                        </tbody>
                    </table>

                    <h2>Article 3 – Accès au service</h2>
                    <p>La Plateforme est accessible via un navigateur web standard, sur ordinateur de bureau ou appareil mobile, sans installation préalable d&apos;un logiciel tiers.</p>
                    <p>L&apos;accès aux fonctionnalités nécessite la création d&apos;un compte personnel par l&apos;Utilisateur. L&apos;Utilisateur s&apos;engage à fournir des informations exactes, complètes et à les maintenir à jour.</p>
                    <p>L&apos;accès au service est conditionné à la disponibilité des infrastructures techniques. L&apos;éditeur s&apos;efforce d&apos;assurer une disponibilité optimale du service, sans toutefois garantir une continuité de service ininterrompue.</p>

                    <h2>Article 4 – Offres et abonnements</h2>
                    <h3>4.1 Offre gratuite (Freemium)</h3>
                    <p>L&apos;offre gratuite permet à tout Utilisateur inscrit d&apos;accéder aux fonctionnalités de base de la Plateforme, notamment :</p>
                    <ul>
                        <li>la création et la personnalisation d&apos;un profil public ;</li>
                        <li>l&apos;accès à la communauté et aux publications des membres ;</li>
                        <li>la participation à certains projets collaboratifs ;</li>
                        <li>la consultation d&apos;une sélection de ressources et tutoriels.</li>
                    </ul>
                    <p><em>Certaines fonctionnalités peuvent être limitées ou restreintes dans le cadre de l&apos;offre gratuite.</em></p>
                    <h3>4.2 Offre Premium</h3>
                    <p>L&apos;offre premium est un abonnement payant ouvrant droit à des fonctionnalités avancées, notamment :</p>
                    <ul>
                        <li>l&apos;accès à l&apos;intégralité des fonctionnalités de la Plateforme ;</li>
                        <li>une visibilité accrue du profil au sein de la communauté ;</li>
                        <li>l&apos;accès à des ressources exclusives et à du contenu premium ;</li>
                        <li>la participation illimitée aux projets collaboratifs.</li>
                    </ul>
                    <p>Les détails complets de chaque offre et leurs conditions d&apos;accès sont consultables sur la page tarifaire de la Plateforme.</p>

                    <h2>Article 5 – Prix</h2>
                    <p>Les prix sont exprimés en euros (€) toutes taxes comprises (TTC).</p>
                    <p>Les abonnements premium sont proposés selon les formules suivantes :</p>
                    <ul>
                        <li>abonnement mensuel : renouvelable chaque mois ;</li>
                        <li>abonnement annuel : renouvelable chaque année, pouvant bénéficier d&apos;un tarif préférentiel.</li>
                    </ul>
                    <p>Les tarifs en vigueur sont affichés sur la Plateforme au moment de la souscription. L&apos;éditeur se réserve le droit de modifier ses tarifs à tout moment. Toute modification tarifaire sera notifiée à l&apos;Utilisateur au moins 30 jours avant son entrée en vigueur.</p>

                    <h2>Article 6 – Modalités de paiement</h2>
                    <p>Le paiement des abonnements s&apos;effectue exclusivement en ligne, via les moyens de paiement sécurisés mis à disposition sur la Plateforme (carte bancaire, etc.). Les transactions sont cryptées et sécurisées conformément aux standards en vigueur.</p>
                    <p>L&apos;abonnement est renouvelé automatiquement à l&apos;échéance de chaque période, sauf résiliation par l&apos;Utilisateur dans les conditions prévues à l&apos;article 7. En cas d&apos;échec du paiement, la Plateforme se réserve le droit de suspendre ou de résilier l&apos;accès aux fonctionnalités premium.</p>

                    <h2>Article 7 – Résiliation</h2>
                    <p>L&apos;Utilisateur peut résilier son abonnement à tout moment depuis les paramètres de son compte, sans frais ni pénalité.</p>
                    <p>La résiliation prend effet à la fin de la période d&apos;abonnement en cours. L&apos;Utilisateur continue de bénéficier des fonctionnalités premium jusqu&apos;à cette date.</p>
                    <p>Aucun remboursement ne sera accordé pour toute période d&apos;abonnement déjà entamée, sauf disposition légale contraire applicable.</p>
                    <p>L&apos;éditeur se réserve le droit de résilier un compte en cas de manquement grave aux présentes CGV ou aux Conditions Générales d&apos;Utilisation (CGU) de la Plateforme.</p>

                    <h2>Article 8 – Responsabilités</h2>
                    <h3>8.1 Responsabilité de l&apos;éditeur</h3>
                    <p>La Plateforme agit en qualité d&apos;intermédiaire technique entre les utilisateurs. À ce titre, l&apos;éditeur ne saurait être tenu responsable :</p>
                    <ul>
                        <li>du contenu publié par les Utilisateurs ;</li>
                        <li>des collaborations, accords ou litiges entre membres ;</li>
                        <li>des préjudices indirects résultant de l&apos;utilisation de la Plateforme.</li>
                    </ul>
                    <p>L&apos;éditeur s&apos;engage à mettre en œuvre les moyens raisonnables pour assurer la sécurité et la disponibilité du service.</p>
                    <h3>8.2 Responsabilité de l&apos;Utilisateur</h3>
                    <p>Chaque Utilisateur est seul responsable des contenus qu&apos;il publie (vidéos, images, textes, projets) ainsi que de son comportement au sein de la communauté. Il s&apos;engage à respecter la législation en vigueur et les droits des tiers.</p>

                    <h2>Article 9 – Propriété intellectuelle</h2>
                    <p>Les Utilisateurs conservent l&apos;intégralité des droits de propriété intellectuelle sur les contenus qu&apos;ils publient sur la Plateforme.</p>
                    <p>En publiant un contenu, l&apos;Utilisateur concède à la Plateforme une licence non exclusive, gratuite, mondiale et pour la durée de sa présence sur la Plateforme, aux fins d&apos;affichage et de diffusion dudit contenu dans le cadre normal des services proposés.</p>
                    <p>L&apos;ensemble des éléments constitutifs de la Plateforme (logo, interface, code source, marque, etc.) sont la propriété exclusive de l&apos;éditeur et sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation préalable est strictement interdite.</p>

                    <h2>Article 10 – Protection des données personnelles</h2>
                    <p>Les données personnelles collectées dans le cadre de l&apos;utilisation de la Plateforme sont traitées conformément au Règlement Général sur la Protection des Données (RGPD – Règlement UE 2016/679) et à la loi Informatique et Libertés.</p>
                    <p>Conformément à la réglementation en vigueur, chaque Utilisateur dispose des droits suivants sur ses données :</p>
                    <ul>
                        <li>droit d&apos;accès et de rectification ;</li>
                        <li>droit à l&apos;effacement (« droit à l&apos;oubli ») ;</li>
                        <li>droit à la portabilité des données ;</li>
                        <li>droit d&apos;opposition et de limitation du traitement.</li>
                    </ul>
                    <p>Pour exercer ces droits, l&apos;Utilisateur peut adresser une demande à : lency@hotmail.fr.</p>

                    <h2>Article 11 – Modification des CGV</h2>
                    <p>L&apos;éditeur se réserve le droit de modifier les présentes CGV à tout moment, notamment pour se conformer à toute nouvelle réglementation applicable ou pour faire évoluer ses services.</p>
                    <p>En cas de modification substantielle, l&apos;Utilisateur sera informé par e-mail ou par une notification sur la Plateforme au moins 30 jours avant l&apos;entrée en vigueur des nouvelles CGV.</p>

                    <h2>Article 12 – Droit applicable et juridiction compétente</h2>
                    <p>Les présentes CGV sont soumises au droit français.</p>
                    <p>En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes CGV, et à défaut de résolution amiable dans un délai de 30 jours, les parties conviennent de soumettre le litige aux tribunaux compétents du ressort du siège social de l&apos;éditeur.</p>
                    <p>Conformément aux articles L.611-1 et suivants du Code de la consommation, l&apos;Utilisateur consommateur a la possibilité de recourir, en cas de litige, à un médiateur de la consommation en vue d&apos;un règlement amiable.</p>
                </div>
            </div>
        </div>
    );
}
