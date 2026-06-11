# Tableau de Recettage — Lency

> **Légende :**
> - ✅ OK — fonctionnel
> - ❌ KO — bug / ne fonctionne pas
> - ⚠️ PARTIEL — fonctionne partiellement
> - 🔄 EN COURS — en cours de test
> - ⏭️ SKIP — hors périmètre / non testé

---

## 1. Authentification

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 1.1 | Inscription (email/mot de passe) | Créer un compte avec email + password | | |
| 1.2 | Connexion (email/mot de passe) | Se connecter avec email + password | | |
| 1.3 | Connexion Google OAuth | Se connecter via Google | | |
| 1.4 | Connexion OTP | Se connecter via code email | | |
| 1.5 | Mot de passe oublié | Demande de réinitialisation par email | | |
| 1.6 | Réinitialisation du mot de passe | Utiliser le lien reçu par email | | |
| 1.7 | Vérification email | Vérifier son email après inscription | | |
| 1.8 | Déconnexion | Se déconnecter de la session | | |
| 1.9 | Onboarding nouvel utilisateur | Compléter le profil lors de la 1ère connexion (`/new-user`) | | |
| 1.10 | Affichage/masquage mot de passe | Icône œil sur les champs password | | |

---

## 2. Profil utilisateur & Paramètres

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 2.1 | Profil public (`/user/[userName]`) | Voir le profil public d'un utilisateur | | |
| 2.2 | Modifier son profil | Changer prénom, nom, username, bio | | |
| 2.3 | Upload avatar | Changer sa photo de profil | | |
| 2.4 | Liens sociaux | Ajouter/modifier Twitter, LinkedIn… | | |
| 2.5 | URL portfolio | Ajouter/modifier son portfolio | | |
| 2.6 | Upload CV | Uploader un fichier CV | | |
| 2.7 | Changer son mot de passe | Via `Paramètres > Sécurité` | | |
| 2.8 | Changer son email | Avec confirmation par email | | |
| 2.9 | Voir ses sessions actives | Voir et gérer les appareils connectés | | |
| 2.10 | Suivre un utilisateur | Bouton Follow sur un profil | | |
| 2.11 | Se désabonner d'un utilisateur | Bouton Unfollow | | |
| 2.12 | Voir ses abonnés / abonnements | Compteurs sur le profil public | | |
| 2.13 | Signaler un utilisateur | Signalement via le profil | | |
| 2.14 | Badges utilisateur | Affichage des badges sur le profil | | |
| 2.15 | Préférences notifications | Activer/désactiver notifications email et push | | |

---

## 3. Communauté — Fil d'actualité

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 3.1 | Fil général | Afficher tous les posts par défaut | | |
| 3.2 | Fil populaire | Posts triés par votes | | |
| 3.3 | Fil abonnements | Posts des catégories suivies | | |
| 3.4 | Récemment consultés (sidebar) | Afficher les derniers posts/ressources visités | | |
| 3.5 | Pagination / scroll infini | Charger plus de posts | | |

---

## 4. Communauté — Création de posts

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 4.1 | Créer un post texte | Post avec contenu textuel uniquement | | |
| 4.2 | Créer un post image | Post avec image (paysage/portrait) | | |
| 4.3 | Créer un post vidéo | Post avec vidéo (paysage/portrait) | | |
| 4.4 | Créer un post audio | Post avec fichier audio | | |
| 4.5 | Publier un post | Publier immédiatement | | |
| 4.6 | Sauvegarder un brouillon | Enregistrer sans publier | | |
| 4.7 | Voir ses brouillons | Accéder aux brouillons sauvegardés | | |
| 4.8 | Modifier un post | Editer un post existant | | |
| 4.9 | Supprimer un post | Supprimer définitivement | | |
| 4.10 | Choisir la catégorie | Associer un post à une catégorie | | |

---

## 5. Communauté — Interactions sur les posts

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 5.1 | Voter un post (upvote) | Liker un post | | |
| 5.2 | Retirer son vote | Unliker un post | | |
| 5.3 | Sauvegarder un post | Ajouter aux posts sauvegardés | | |
| 5.4 | Retirer un post sauvegardé | Supprimer des sauvegardés | | |
| 5.5 | Voir ses posts sauvegardés | Page `/community/saved` | | |
| 5.6 | Partager un post | Copier le lien | | |
| 5.7 | Signaler un post | Signalement de contenu inapproprié | | |
| 5.8 | Compter les vues | Vue incrémentée à chaque visite | | |
| 5.9 | Page détail post | Accéder au post individuel (`/community/[slug]/post/[id]`) | | |

---

## 6. Communauté — Commentaires

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 6.1 | Ajouter un commentaire | Commenter un post | | |
| 6.2 | Répondre à un commentaire | Commentaires imbriqués | | |
| 6.3 | Voter un commentaire | Upvote/downvote commentaire | | |
| 6.4 | Supprimer son commentaire | Supprimer un commentaire | | |
| 6.5 | Commentaire avec média | Image / vidéo / audio dans un commentaire | | |
| 6.6 | Commenter une ressource | Commentaire sur une ressource | | |
| 6.7 | Commenter un projet | Commentaire sur un projet marketplace | | |

---

## 7. Communauté — Ressources

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 7.1 | Créer une ressource Asset | Upload de fichier téléchargeable | | |
| 7.2 | Créer une ressource Tutoriel | Contenu éducatif avec média | | |
| 7.3 | Créer une ressource Lien | URL externe avec description | | |
| 7.4 | Publier une ressource | Mettre en ligne | | |
| 7.5 | Modifier une ressource | Editer les informations | | |
| 7.6 | Supprimer une ressource | Supprimer définitivement | | |
| 7.7 | Voter une ressource | Upvote | | |
| 7.8 | Sauvegarder une ressource | Ajouter aux sauvegardés | | |
| 7.9 | Voir ses ressources sauvegardées | Page `/community/saved` | | |
| 7.10 | Filtrer par type | Filtre Asset / Tutoriel / Lien | | |
| 7.11 | Page détail ressource | Accéder à la ressource individuelle | | |
| 7.12 | Ressources par catégorie | Page ressources d'une catégorie | | |

---

## 8. Communauté — Catégories

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 8.1 | Voir la liste des catégories | Explorer les communautés | | |
| 8.2 | Accéder à une catégorie | Page `/community/[slug]` | | |
| 8.3 | Suivre une catégorie | S'abonner à une communauté | | |
| 8.4 | Se désabonner d'une catégorie | Se désabonner | | |
| 8.5 | Notifications catégorie | Activer/désactiver les notifs d'une catégorie | | |
| 8.6 | Infos catégorie | Voir description, règles, bannière, icône | | |
| 8.7 | Stats catégorie | Nombre de membres, posts | | |

---

## 9. Marketplace — Projets

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 9.1 | Liste des projets | Page marketplace principale | | |
| 9.2 | Filtrer par type | Vidéo / Motion / Photo / Outils | | |
| 9.3 | Filtrer par niveau | Débutant / Intermédiaire / Avancé | | |
| 9.4 | Filtrer par mode de travail | Présentiel / Télétravail / Hybride | | |
| 9.5 | Filtrer par rémunération | Rémunéré / Non rémunéré | | |
| 9.6 | Créer un projet | Formulaire complet de création | | |
| 9.7 | Uploader une bannière projet | Image de couverture du projet | | |
| 9.8 | Ajouter des rôles recherchés | Définir les profils nécessaires | | |
| 9.9 | Sauvegarder en brouillon | Projet non publié | | |
| 9.10 | Publier un projet | Mettre en ligne | | |
| 9.11 | Modifier un projet | Editer les informations | | |
| 9.12 | Archiver un projet | Clôturer le projet | | |
| 9.13 | Page détail projet | Accéder au projet individuel | | |
| 9.14 | Ajouter une localisation | Associer une adresse au projet | | |
| 9.15 | Ajouter des pièces jointes | Fichiers liés au projet | | |

---

## 10. Marketplace — Candidatures

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 10.1 | Postuler à un projet | Soumettre une candidature | | |
| 10.2 | Ajouter une note de motivation | Texte dans la candidature | | |
| 10.3 | Ajouter un lien portfolio | URL portfolio dans la candidature | | |
| 10.4 | Uploader un CV | Fichier CV joint à la candidature | | |
| 10.5 | Voir ses candidatures | En tant que postulant | | |
| 10.6 | Voir les candidatures reçues | En tant que créateur du projet | | |
| 10.7 | Accepter une candidature | Action du créateur | | |
| 10.8 | Refuser une candidature | Action du créateur | | |
| 10.9 | Statut de candidature | Affichage Pending / Accepté / Refusé | | |
| 10.10 | Empêcher de candidater 2x | Validation si déjà postulant | | |

---

## 11. Marketplace — Équipe & Invitations

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 11.1 | Voir les participants d'un projet | Liste des membres de l'équipe | | |
| 11.2 | Inviter un utilisateur | Créateur invite un user à rejoindre | | |
| 11.3 | Accepter une invitation | Utilisateur accepte | | |
| 11.4 | Refuser une invitation | Utilisateur refuse | | |
| 11.5 | Retirer un membre | Créateur supprime un participant | | |
| 11.6 | Statut invitation | Affichage Pending / Accepté / Refusé | | |

---

## 12. Marketplace — Chat Projet

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 12.1 | Accéder au chat d'un projet | Page `/marketplace/[projectId]/chat` | | |
| 12.2 | Envoyer un message | Message texte dans le chat | | |
| 12.3 | Envoyer une image | Média dans le chat | | |
| 12.4 | Envoyer une vidéo | Vidéo dans le chat | | |
| 12.5 | Envoyer un audio | Audio dans le chat | | |
| 12.6 | Voir l'historique des messages | Persistance des messages | | |
| 12.7 | Temps réel (Ably) | Réception instantanée des messages | | |

---

## 13. Messagerie directe

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 13.1 | Accéder aux conversations | Liste des conversations DM | | |
| 13.2 | Créer une nouvelle conversation | Initier un DM avec un utilisateur | | |
| 13.3 | Envoyer un message privé | Message texte | | |
| 13.4 | Envoyer un média | Image / vidéo / audio en DM | | |
| 13.5 | Voir l'historique | Historique des messages | | |
| 13.6 | Temps réel (Ably) | Réception instantanée | | |

---

## 14. Répertoire des talents

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 14.1 | Voir la liste des talents | Parcourir les créatifs disponibles | | |
| 14.2 | Voir le profil d'un talent | Détail avec portfolio, compétences | | |
| 14.3 | Se marquer comme talent | Activer son profil talent | | |
| 14.4 | Filtrer les talents | Par compétence, disponibilité | | |
| 14.5 | Contacter un talent | Via DM ou lien portfolio | | |

---

## 15. Notifications

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 15.1 | Voir ses notifications | Liste des notifications | | |
| 15.2 | Marquer comme lu | Passer une notification en lue | | |
| 15.3 | Notif nouvelle candidature | Projet owner notifié | | |
| 15.4 | Notif candidature acceptée/refusée | Postulant notifié | | |
| 15.5 | Notif nouveau commentaire | Auteur du post/ressource notifié | | |
| 15.6 | Notif nouveau follower | Utilisateur notifié | | |
| 15.7 | Notif catégorie | Nouvelles publications dans une catégorie suivie | | |

---

## 16. Recherche

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 16.1 | Recherche globale | Barre de recherche principale | | |
| 16.2 | Résultats posts | Posts correspondants | | |
| 16.3 | Résultats projets | Projets correspondants | | |
| 16.4 | Résultats ressources | Ressources correspondantes | | |
| 16.5 | Résultats utilisateurs | Profils correspondants | | |
| 16.6 | Résultats catégories | Communautés correspondantes | | |
| 16.7 | Filtres de recherche | Filtrer par type de résultat | | |
| 16.8 | Debounce | Pas de requête à chaque frappe | | |

---

## 17. Upload & Médias

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 17.1 | Upload image (ImageKit) | Uploader une image | | |
| 17.2 | Upload vidéo | Uploader une vidéo | | |
| 17.3 | Upload audio | Uploader un fichier audio | | |
| 17.4 | Upload fichier (CV, pièce jointe) | Uploader un document | | |
| 17.5 | Prévisualisation avant upload | Aperçu du fichier sélectionné | | |
| 17.6 | Optimisation images (ImageKit) | Transformation et compression | | |

---

## 18. Blog & Contenu éditorial

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 18.1 | Liste des articles de blog | Page `/blog` publique | | |
| 18.2 | Détail article | Page `/blog/[slug]` | | |
| 18.3 | Filtrer articles par tag | Vidéo / Motion / Outils | | |
| 18.4 | Compteur de vues article | Vue incrémentée à chaque visite | | |
| 18.5 | Créer un article (admin) | `/admin/blogs/create` | | |
| 18.6 | Modifier un article (admin) | Editer un article existant | | |
| 18.7 | Publier / archiver un article | Changer le statut | | |

---

## 19. Carte & Lieux

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 19.1 | Carte des lieux (`/community/explore/places`) | Afficher la carte Leaflet | | |
| 19.2 | Voir les spots sur la carte | Points d'intérêt géolocalisés | | |
| 19.3 | Ajouter un spot | Créer un lieu | | |
| 19.4 | Noter un spot | Attribuer une note à un lieu | | |
| 19.5 | Géocoder une adresse | Conversion adresse → coordonnées | | |

---

## 20. Administration

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 20.1 | Accès admin protégé | Redirection si non admin | | |
| 20.2 | Liste des utilisateurs | Voir tous les utilisateurs | | |
| 20.3 | Gérer un utilisateur | Modifier, suspendre | | |
| 20.4 | Créer une catégorie | Nouvelle communauté | | |
| 20.5 | Modifier une catégorie | Editer bannière, description, règles | | |
| 20.6 | Supprimer une catégorie | Suppression définitive | | |
| 20.7 | Gestion galerie | Upload et gestion des médias admin | | |
| 20.8 | Gestion badges | Créer / activer / désactiver des badges | | |

---

## 21. Site public (marketing)

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 21.1 | Page d'accueil | Hero, présentation, CTA | | |
| 21.2 | Page À propos | Présentation de Lency | | |
| 21.3 | Page Équipe | Membres de l'équipe | | |
| 21.4 | Page Contact | Formulaire de contact | | |
| 21.5 | Page Support | FAQ et aide | | |
| 21.6 | Mentions légales | CGU / CGV | | |
| 21.7 | Formulaire de contact | Envoi de message via le formulaire | | |

---

## 22. Abonnements Premium

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 22.1 | Souscrire à un abonnement | Passer en compte premium | | |
| 22.2 | Voir son statut premium | Affichage du badge premium | | |
| 22.3 | Annuler un abonnement | Résilier | | |
| 22.4 | Expiration abonnement | Statut expiré géré correctement | | |

---

## 23. Feedback & Support utilisateur

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 23.1 | Soumettre un feedback | Formulaire de retour utilisateur | | |
| 23.2 | Joindre une capture d'écran | Image dans le feedback | | |
| 23.3 | Types de contact | Support / Général / Facturation / Partenariat | | |

---

## 24. Navigation & UX transversale

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 24.1 | Navigation principale | Header / sidebar correctement affichés | | |
| 24.2 | Breadcrumbs | Fil d'Ariane sur les pages profondes | | |
| 24.3 | Mode sombre / clair | Toggle thème | | |
| 24.4 | Persistence du thème | Thème conservé au rechargement | | |
| 24.5 | Pages 404 contextuelles | `not-found.tsx` par section | | |
| 24.6 | Pages d'erreur | `error.tsx` avec bouton réessayer | | |
| 24.7 | Skeletons de chargement | `loading.tsx` affichés pendant les fetches | | |
| 24.8 | Toasts de confirmation | Sonner affiché après actions | | |
| 24.9 | Responsive mobile | Affichage correct sur mobile | | |
| 24.10 | Responsive tablette | Affichage correct sur tablette | | |
| 24.11 | Liens Next.js | Pas de rechargement de page complet | | |
| 24.12 | Métadonnées SEO | `title` et `description` sur chaque page publique | | |
| 24.13 | Protection routes privées | Redirection `/login` si non connecté | | |
| 24.14 | Protection `/account` | Redirection serveur si non connecté | | |
| 24.15 | Protection `/admin` | Redirection serveur si non admin | | |

---

## Récapitulatif

| Section | Total | ✅ OK | ❌ KO | ⚠️ Partiel | ⏭️ Skip |
|---|---|---|---|---|---|
| 1. Authentification | 10 | | | | |
| 2. Profil & Paramètres | 15 | | | | |
| 3. Communauté — Fil | 5 | | | | |
| 4. Création de posts | 10 | | | | |
| 5. Interactions posts | 9 | | | | |
| 6. Commentaires | 7 | | | | |
| 7. Ressources | 12 | | | | |
| 8. Catégories | 7 | | | | |
| 9. Marketplace — Projets | 15 | | | | |
| 10. Candidatures | 10 | | | | |
| 11. Équipe & Invitations | 6 | | | | |
| 12. Chat Projet | 7 | | | | |
| 13. Messagerie directe | 6 | | | | |
| 14. Talents | 5 | | | | |
| 15. Notifications | 7 | | | | |
| 16. Recherche | 8 | | | | |
| 17. Upload & Médias | 6 | | | | |
| 18. Blog | 7 | | | | |
| 19. Carte & Lieux | 5 | | | | |
| 20. Administration | 8 | | | | |
| 21. Site public | 7 | | | | |
| 22. Abonnements Premium | 4 | | | | |
| 23. Feedback & Support | 3 | | | | |
| 24. Navigation & UX | 15 | | | | |
| **TOTAL** | **198** | | | | |
