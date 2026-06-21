# Tableau de Recettage — Lency

> **Légende :**
> - ✅ OK — fonctionnel
> - ⚠️ PARTIEL — fonctionne partiellement
> - 🚫 ANNULÉ — feature abandonnée / hors roadmap
> - 📅 Futur — planifié pour la suite, pas encore développé

---

## 1. Authentification

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 1.1 | Inscription (email/mot de passe) | Créer un compte avec email + password | ✅ | `(auth)/sign-up/page.tsx` |
| 1.2 | Connexion (email/mot de passe) | Se connecter avec email + password | ✅ | `(auth)/login/page.tsx` |
| 1.3 | Connexion Google OAuth | Se connecter via Google | ✅ | Configuré via better-auth + Google provider |
| 1.4 | Connexion OTP | Se connecter via code email | ✅ | `use-email-otp.ts` + `send-auth-otp-email.ts` |
| 1.5 | Mot de passe oublié | Demande de réinitialisation par email | ✅ | `(auth)/forgot-password/page.tsx` |
| 1.6 | Réinitialisation du mot de passe | Utiliser le lien reçu par email | ✅ | `(auth)/reset-password/page.tsx` |
| 1.7 | Vérification email | Vérifier son email après inscription | ✅ | `(auth)/verify-email/page.tsx` |
| 1.8 | Déconnexion | Se déconnecter de la session | ✅ | Via better-auth |
| 1.9 | Onboarding nouvel utilisateur | Compléter le profil lors de la 1ère connexion (`/new-user`) | ✅ | `(auth)/new-user/page.tsx` |
| 1.10 | Affichage/masquage mot de passe | Icône œil sur les champs password | ✅ | |

---

## 2. Profil utilisateur & Paramètres

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 2.1 | Profil public (`/user/[userName]`) | Voir le profil public d'un utilisateur | ✅ | `user/[userName]/page.tsx` |
| 2.2 | Modifier son profil | Changer prénom, nom, username, bio | ✅ | `account/settings/profile/page.tsx` |
| 2.3 | Upload avatar | Changer sa photo de profil | ✅ | ImageKit — `uploadToImageKit()` |
| 2.4 | Liens sociaux | Ajouter/modifier Twitter, LinkedIn… | ✅ | `api/users/social-links/route.ts` |
| 2.5 | URL portfolio | Ajouter/modifier son portfolio | ✅ | Stocké dans userConfig |
| 2.6 | Upload CV | Uploader un fichier CV | ✅ | Via ImageKit dans le profil talent |
| 2.7 | Changer son mot de passe | Via `Paramètres > Sécurité` | ✅ | `account/settings/security/page.tsx` |
| 2.8 | Changer son email | Avec confirmation par email | ✅ | Via better-auth |
| 2.9 | Voir ses sessions actives | Voir et gérer les appareils connectés | ✅ | Via better-auth session management |
| 2.10 | Suivre un utilisateur | Bouton Follow sur un profil | ✅ | `api/users/[userId]/follow/route.ts` |
| 2.11 | Se désabonner d'un utilisateur | Bouton Unfollow | ✅ | Toggle dans le même endpoint |
| 2.12 | Voir ses abonnés / abonnements | Compteurs sur le profil public | ✅ | `UserStats.tsx` + `UserFollowersList.tsx` |
| 2.13 | Signaler un utilisateur | Signalement via le profil | ✅ | API de report en place |
| 2.14 | Préférences notifications | Activer/désactiver notifications email et push | ✅ | `account/settings/notifs/page.tsx` |

---

## 3. Communauté — Fil d'actualité

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 3.1 | Fil général | Afficher tous les posts par défaut | ✅ | `community/page.tsx` + `CommunityPageClient.tsx` |
| 3.2 | Fil populaire | Posts triés par votes | ✅ | Tab populaire dans `CommunityPageClient.tsx` |
| 3.3 | Fil abonnements | Posts des catégories suivies | ✅ | Tab abonnements dans `CommunityPageClient.tsx` |
| 3.4 | Récemment consultés (sidebar) | Afficher les derniers posts/ressources visités | ✅ | `RecentlyViewed.tsx` |
| 3.5 | Pagination / scroll infini | Charger plus de posts | ✅ | Built into React Query |

---

## 4. Communauté — Création de posts

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 4.1 | Créer un post texte | Post avec contenu textuel uniquement | ✅ | `CreatePostForm.tsx` — type TEXT |
| 4.2 | Créer un post image | Post avec image (paysage/portrait) | ✅ | `CreatePostForm.tsx` — type IMAGE |
| 4.3 | Créer un post vidéo | Post avec vidéo (paysage/portrait) | ✅ | `CreatePostForm.tsx` — type VIDEO |
| 4.4 | Créer un post audio | Post avec fichier audio | ✅ | `CreatePostForm.tsx` — type AUDIO |
| 4.5 | Publier un post | Publier immédiatement | ✅ | Champ `isPublished` géré dans le service |
| 4.6 | Sauvegarder un brouillon | Enregistrer sans publier | ✅ | `api/posts/drafts/route.ts` |
| 4.7 | Voir ses brouillons | Accéder aux brouillons sauvegardés | ✅ | `DraftsTab.tsx` |
| 4.8 | Modifier un post | Editer un post existant | ✅ | `useUpdatePost()` hook |
| 4.9 | Supprimer un post | Supprimer définitivement | ✅ | `useDeletePost()` hook |
| 4.10 | Choisir la catégorie | Associer un post à une catégorie | ✅ | Sélection dans `CreatePostForm.tsx` |

---

## 5. Communauté — Interactions sur les posts

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 5.1 | Voter un post (upvote) | Liker un post | ✅ | `api/posts/[postId]/vote/route.ts` |
| 5.2 | Retirer son vote | Unliker un post | ✅ | Toggle dans le même endpoint |
| 5.3 | Sauvegarder un post | Ajouter aux posts sauvegardés | ✅ | `api/posts/[postId]/save/route.ts` |
| 5.4 | Retirer un post sauvegardé | Supprimer des sauvegardés | ✅ | Toggle dans le même endpoint |
| 5.5 | Voir ses posts sauvegardés | Page `/community/saved` | ✅ | |
| 5.6 | Partager un post | Copier le lien | ✅ | Via `PostActionsPopup.tsx` |
| 5.7 | Signaler un post | Signalement de contenu inapproprié | ✅ | `api/posts/[postId]/report/route.ts` |
| 5.8 | Compter les vues | Vue incrémentée à chaque visite | ✅ | Tracked dans le modèle Post |
| 5.9 | Page détail post | Accéder au post individuel (`/community/[slug]/post/[id]`) | ✅ | Route et page en place |

---

## 6. Communauté — Commentaires

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 6.1 | Ajouter un commentaire | Commenter un post | ✅ | `CommentRoot.tsx` |
| 6.2 | Répondre à un commentaire | Commentaires imbriqués | ✅ | `Comments.tsx` — récursif |
| 6.3 | Voter un commentaire | Upvote/downvote commentaire | ✅ | `api/posts/[postId]/comments/[commentId]/vote/route.ts` |
| 6.4 | Supprimer son commentaire | Supprimer un commentaire | ✅ | Via comment service |
| 6.5 | Commentaire avec média | Image / vidéo / audio dans un commentaire | ✅ | `CommentMediaUploader.tsx` |
| 6.6 | Commenter une ressource | Commentaire sur une ressource | ✅ | `api/resources/[resourceId]/comments/route.ts` |
| 6.7 | Commenter un projet | Commentaire sur un projet marketplace | ✅ | |

---

## 7. Communauté — Ressources

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 7.1 | Créer une ressource Asset | Upload de fichier téléchargeable | ✅ | `CreateResourceForm.tsx` — type ASSET |
| 7.2 | Créer une ressource Tutoriel | Contenu éducatif avec média | ✅ | `CreateResourceForm.tsx` — type TUTORIAL |
| 7.3 | Créer une ressource Lien | URL externe avec description | ✅ | `CreateResourceForm.tsx` — type LINK |
| 7.4 | Publier une ressource | Mettre en ligne | ✅ | |
| 7.5 | Modifier une ressource | Editer les informations | ✅ | |
| 7.6 | Supprimer une ressource | Supprimer définitivement | ✅ | |
| 7.7 | Voter une ressource | Upvote | ✅ | `api/resources/[resourceId]/vote/route.ts` |
| 7.8 | Sauvegarder une ressource | Ajouter aux sauvegardés | ✅ | `api/resources/[resourceId]/save/route.ts` |
| 7.9 | Voir ses ressources sauvegardées | Page `/community/saved` | ✅ | |
| 7.10 | Filtrer par type | Filtre Asset / Tutoriel / Lien | ✅ | `ResourceFiltersTabs.tsx` |
| 7.11 | Page détail ressource | Accéder à la ressource individuelle | ✅ | `community/[slug]/resources/[resourceId]/page.tsx` |
| 7.12 | Ressources par catégorie | Page ressources d'une catégorie | ✅ | `ResourceDetailPageClient.tsx` |

---

## 8. Communauté — Catégories

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 8.1 | Voir la liste des catégories | Explorer les communautés | ✅ | `api/categories/route.ts` |
| 8.2 | Accéder à une catégorie | Page `/community/[slug]` | ✅ | `community/[slug]/page.tsx` |
| 8.3 | Suivre une catégorie | S'abonner à une communauté | ✅ | `api/categories/[categoryId]/follow/route.ts` |
| 8.4 | Se désabonner d'une catégorie | Se désabonner | ✅ | Toggle dans le même endpoint |
| 8.5 | Notifications catégorie | Activer/désactiver les notifs d'une catégorie | ✅ | `api/categories/[categoryId]/notify/route.ts` |
| 8.6 | Infos catégorie | Voir description, règles, bannière, icône | ✅ | `CategoryInfos.tsx` |
| 8.7 | Stats catégorie | Nombre de membres, posts | ✅ | `CategoryPageClient.tsx` |

---

## 9. Marketplace — Projets

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 9.1 | Liste des projets | Page marketplace principale | ✅ | `marketplace/page.tsx` |
| 9.2 | Filtrer par type | Vidéo / Motion / Photo / Outils | ✅ | `FiltersPanel.tsx` + `FilterSelect.tsx` |
| 9.3 | Filtrer par niveau | Débutant / Intermédiaire / Avancé | ✅ | |
| 9.4 | Filtrer par mode de travail | Présentiel / Télétravail / Hybride | ✅ | |
| 9.5 | Filtrer par rémunération | Rémunéré / Non rémunéré | ✅ | |
| 9.6 | Créer un projet | Formulaire complet de création | ✅ | `CreateProjectForm.tsx` — formulaire 3 étapes |
| 9.7 | Uploader une bannière projet | Image de couverture du projet | ✅ | ImageKit intégré dans le formulaire |
| 9.8 | Ajouter des rôles recherchés | Définir les profils nécessaires | ✅ | Gestion des rôles dans `ProjectDetail.tsx` |
| 9.9 | Sauvegarder en brouillon | Projet non publié | ✅ | `api/projects/drafts/route.ts` |
| 9.10 | Publier un projet | Mettre en ligne | ✅ | |
| 9.11 | Modifier un projet | Editer les informations | ✅ | `EditProjectForm.tsx` |
| 9.12 | Archiver un projet | Clôturer le projet | ✅ | Via project service |
| 9.13 | Page détail projet | Accéder au projet individuel | ✅ | `marketplace/[projectId]/page.tsx` |
| 9.14 | Ajouter une localisation | Associer une adresse au projet | ✅ | `AddressAutocompleteInput` dans le formulaire |
| 9.15 | Ajouter des pièces jointes | Fichiers liés au projet | ✅ | Upload média supporté |

---

## 10. Marketplace — Candidatures

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 10.1 | Postuler à un projet | Soumettre une candidature | ✅ | `ApplyToProjectModal.tsx` |
| 10.2 | Ajouter une note de motivation | Texte dans la candidature | ✅ | Champ texte dans le modal |
| 10.3 | Ajouter un lien portfolio | URL portfolio dans la candidature | ✅ | Via userConfig |
| 10.4 | Uploader un CV | Fichier CV joint à la candidature | ✅ | Via profil utilisateur |
| 10.5 | Voir ses candidatures | En tant que postulant | ✅ | |
| 10.6 | Voir les candidatures reçues | En tant que créateur du projet (`/marketplace/[projectId]/candidature`) | ✅ | `ProjectApplicationsPageClient.tsx` |
| 10.7 | Accepter une candidature | Action du créateur | ✅ | `api/applications/[id]/accept/route.ts` |
| 10.8 | Refuser une candidature | Action du créateur | ✅ | `api/applications/[id]/reject/route.ts` |
| 10.9 | Statut de candidature | Affichage Pending / Accepté / Refusé | ✅ | |
| 10.10 | Empêcher de candidater 2x | Validation si déjà postulant | ✅ | Validation dans le service |
| 10.11 | Notif Ably à candidature | Créateur notifié en temps réel via Ably | ✅ | `AblyInitializer.tsx` + Ably intégré |
| 10.12 | Répondre depuis les notifications | Modal `ApplicationResponseModal` directement depuis les notifs dashboard | ✅ | |

---

## 11. Marketplace — Équipe & Invitations

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 11.1 | Voir les participants d'un projet | Liste des membres de l'équipe | ✅ | `ProjectMembersCard.tsx` |
| 11.2 | Inviter un utilisateur | Créateur invite un user à rejoindre | ✅ | `ProjectInviteBlock.tsx` |
| 11.3 | Accepter une invitation | Utilisateur accepte | ✅ | `api/projects/invitations/[invitationId]/route.ts` |
| 11.4 | Refuser une invitation | Utilisateur refuse | ✅ | Même endpoint |
| 11.5 | Retirer un membre | Créateur supprime un participant | ✅ | Via project service |
| 11.6 | Statut invitation | Affichage Pending / Accepté / Refusé | ✅ | |

---

## 12. Marketplace — Chat Projet

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 12.1 | Accéder au chat d'un projet | Page `/marketplace/[projectId]/chat` | ✅ | `marketplace/[projectId]/chat/page.tsx` |
| 12.2 | Envoyer un message | Message texte dans le chat | ✅ | `ChatInput.tsx` |
| 12.3 | Envoyer une image | Média dans le chat | ✅ | `ProjectChat.tsx` |
| 12.4 | Envoyer une vidéo | Vidéo dans le chat | ✅ | `ProjectChat.tsx` |
| 12.5 | Envoyer un audio | Audio dans le chat | ✅ | `ProjectChat.tsx` |
| 12.6 | Voir l'historique des messages | Persistance des messages | ✅ | `api/projects/[projectId]/messages/route.ts` |
| 12.7 | Temps réel (Ably) | Réception instantanée des messages | ✅ | `AblyInitializer.tsx` |
| 12.8 | Prévisualisation image chat | Composant `MediaImage` pour les images envoyées | ✅ | |

---

## 13. Messagerie directe

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 13.1 | Accéder aux conversations | Liste des conversations DM | ✅ | `ConversationsList.tsx` |
| 13.2 | Créer une nouvelle conversation | Initier un DM avec un utilisateur | ✅ | `api/conversations/route.ts` — getOrCreateConversation |
| 13.3 | Envoyer un message privé | Message texte | ✅ | `MessageBubble.tsx` + `ChatInput.tsx` |
| 13.4 | Envoyer un média | Image / vidéo / audio en DM | ✅ | `DirectMessageChat.tsx` |
| 13.5 | Voir l'historique | Historique des messages | ✅ | `useConversationMessages()` |
| 13.6 | Temps réel (Ably) | Réception instantanée | ✅ | Intégré avec Ably |

---

## 14. Répertoire des talents

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 14.1 | Voir la liste des talents | Parcourir les créatifs disponibles | ✅ | Onglet Talents dans `marketplace/page.tsx` |
| 14.2 | Voir le profil d'un talent | Détail avec portfolio, compétences | ✅ | |
| 14.3 | Se marquer comme talent | Activer son profil talent | ✅ | Via `TalentProfileModal.tsx` |
| 14.4 | Filtrer les talents | Par compétence, disponibilité | ✅ | `TalentFilters.tsx` |
| 14.5 | Contacter un talent | Via DM ou lien portfolio | ✅ | |
| 14.6 | Modal profil talent multi-étapes | Formulaire en 4 étapes : Profil / Disponibilité / Rôles / Équipements (`TalentProfileModal`) | ✅ | `TalentProfileModal.tsx` |
| 14.7 | Localisation talent | Adresse avec autocomplétion dans le profil talent | ✅ | `AddressAutocompleteInput` dans le modal |
| 14.8 | Mode de travail talent | Présentiel / Distanciel / Hybride | ✅ | |
| 14.9 | Voir talents sur la carte | Carte Leaflet des talents géolocalisés (dashboard Explorer) | ✅ | `TalentsMap.tsx` + `TalentsMapInner.tsx` |
| 14.10 | Filtres talents carte | Filtrer par rôle, niveau, rémunération, mode de travail | ✅ | `TalentFilters.tsx` |

---

## 15. Notifications

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 15.1 | Voir ses notifications | Liste des notifications (sheet + dashboard) | ✅ | `NotificationsSheet.tsx` + `AllNotificationsView.tsx` |
| 15.2 | Marquer comme lu | Passer une notification en lue | ✅ | Via notification service |
| 15.3 | Supprimer une notification | Bouton supprimer par notification | ✅ | `api/notifications/[id]/route.ts` |
| 15.4 | Notif nouvelle candidature | Projet owner notifié | ✅ | Via Ably |
| 15.5 | Notif candidature acceptée/refusée | Postulant notifié | ✅ | |
| 15.6 | Notif nouveau commentaire | Auteur du post/ressource notifié | ✅ | |
| 15.7 | Notif nouveau follower | Utilisateur notifié | ✅ | |
| 15.8 | Notif catégorie | Nouvelles publications dans une catégorie suivie | ✅ | |
| 15.9 | Notifications temps réel (Ably) | Réception instantanée sans rechargement | ✅ | `api/ably/token/route.ts` |
| 15.10 | Notifications groupées par date | Groupement Aujourd'hui / Hier / date dans le dashboard | ✅ | `AllNotificationsView.tsx` |
| 15.11 | Répondre à une candidature depuis la notif | Modal de réponse intégré dans le panneau notifications | ✅ | `ApplicationResponseModal` |

---

## 16. Recherche

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 16.1 | Recherche globale | Barre de recherche principale | ✅ | `SearchBar.tsx` |
| 16.2 | Résultats posts | Posts correspondants | ✅ | `api/search/route.ts` |
| 16.3 | Résultats projets | Projets correspondants | ✅ | |
| 16.4 | Résultats ressources | Ressources correspondantes | ✅ | |
| 16.5 | Résultats utilisateurs | Profils correspondants | ✅ | |
| 16.6 | Résultats catégories | Communautés correspondantes | ✅ | |
| 16.7 | Filtres de recherche | Filtrer par type de résultat | ✅ | `SearchFilters.tsx` |
| 16.8 | Debounce | Pas de requête à chaque frappe | ✅ | `useDebounce` dans `SearchBar.tsx` |

---

## 17. Upload & Médias

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 17.1 | Upload image (ImageKit) | Uploader une image | ✅ | `uploadToImageKit()` — `front/lib/upload` |
| 17.2 | Upload vidéo | Uploader une vidéo | ✅ | |
| 17.3 | Upload audio | Uploader un fichier audio | ✅ | |
| 17.4 | Upload fichier (CV, pièce jointe) | Uploader un document | ✅ | |
| 17.5 | Prévisualisation avant upload | Aperçu du fichier sélectionné | ✅ | `PostImage.tsx`, `PostVideo.tsx`, `PostAudio.tsx` |
| 17.6 | Optimisation images (ImageKit) | Transformation et compression | ✅ | `api/imagekit/auth/route.ts` + pipeline ImageKit |

---

## 18. Blog & Contenu éditorial

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 18.1 | Liste des articles de blog | Page `/blog` publique | ✅ | `(website)/blog/page.tsx` |
| 18.2 | Détail article | Page `/blog/[slug]` | ✅ | `(website)/blog/[slug]/page.tsx` |
| 18.3 | Filtrer articles par tag | Vidéo / Motion / Outils | ✅ | Tags VIDEO, MOTION, OUTILS |
| 18.4 | Compteur de vues article | Vue incrémentée à chaque visite | ✅ | Tracked dans le modèle Blog |
| 18.5 | Créer un article (admin) | `/admin/blogs/create` | ✅ | `admin/blog/create/page.tsx` + `CreateBlogForm.tsx` |
| 18.6 | Modifier un article (admin) | Editer un article existant | ✅ | `admin/blogs/[blogId]/edit/page.tsx` + `EditBlogForm.tsx` |
| 18.7 | Publier / archiver un article | Changer le statut | ✅ | Statuts DRAFT / PUBLISHED / ARCHIVED |

---

## 19. Carte & Lieux

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 19.1 | Carte des lieux (`/community/explore/places`) | Afficher la carte Leaflet | ✅ | Backend prêt (`api/spots/route.ts`), route frontend `/community/explore/places` manquante |
| 19.2 | Voir les spots sur la carte | Points d'intérêt géolocalisés | 🚫 | Modèle et service implémentés, pas de page |
| 19.3 | Ajouter un spot | Créer un lieu | 🚫 | `SpotsService` existe, pas de UI |
| 19.4 | Noter un spot | Attribuer une note à un lieu | 🚫 | `api/spots/[spotId]/rate/route.ts` existe, pas de UI |
| 19.5 | Géocoder une adresse | Conversion adresse → coordonnées | ✅ | `api/mapLocations/route.ts` + `api/geocode` |
| 19.6 | Voir les projets | Aperçu des projets créer dans l'app | ✅ | 
| 19.7 | Voir les talents | Aperçu des talents créer dans l'app | ✅ | 

---

## 20. Administration

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 20.1 | Accès admin protégé | Redirection si non admin | ✅ | `admin/layout.tsx` — vérification rôle |
| 20.2 | Liste des utilisateurs | Voir tous les utilisateurs | ✅ | `admin/users/page.tsx` |
| 20.3 | Gérer un utilisateur | Modifier, suspendre | ✅ | |
| 20.4 | Créer une catégorie | Nouvelle communauté | ✅ | `admin/categories/page.tsx` |
| 20.5 | Modifier une catégorie | Editer bannière, description, règles | ✅ | |
| 20.6 | Supprimer une catégorie | Suppression définitive | ✅ | |

---

## 21. Site public (marketing)

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 21.1 | Page d'accueil | Hero, présentation, CTA | ✅ | `(website)/home/page.tsx` |
| 21.2 | Section Stats | Compteurs animés (membres, projets, ressources…) | ✅ | `StatsSection.tsx` |
| 21.3 | Section Comment rejoindre | Étapes pour s'inscrire / démarrer | ✅ | `HowToJoin.tsx` |
| 21.4 | Section Témoignages | Avis utilisateurs | ✅ | `TestimonialsSection.tsx` |
| 21.5 | Section FAQ | Questions fréquentes dépliables | ✅ | `FaqHome.tsx` |
| 21.6 | Section ProfileCTA | Appel à l'action pour créer son profil | ✅ | |
| 21.7 | Page À propos | Présentation de Lency | ✅ | `(website)/about/page.tsx` |
| 21.8 | Page Équipe | Membres de l'équipe | ✅ | `(website)/team/page.tsx` |
| 21.9 | Page Contact | Formulaire de contact | ✅ | `(website)/contact/page.tsx` |
| 21.10 | Page Support | FAQ et aide | ✅ | `(website)/support/page.tsx` |
| 21.11 | Mentions légales | CGU / CGV | ✅ | `(website)/mentions-legales/page.tsx` |
| 21.12 | Formulaire de contact | Envoi de message via le formulaire | ✅ | |

---

## 22. Abonnements Premium

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 22.1 | Souscrire à un abonnement | Passer en compte premium | 📅 | Backend `api/subscriptions/route.ts` prêt, pas de page Pricing ni UI utilisateur |
| 22.2 | Voir son statut premium | Affichage du badge premium | 📅 | Modèle prêt |
| 22.3 | Annuler un abonnement | Résilier | 📅 | `SubscriptionsService` prêt |
| 22.4 | Expiration abonnement | Statut expiré géré correctement | 📅 | Champs start/end date en place |

---

## 23. Feedback & Support utilisateur

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 23.1 | Soumettre un feedback | Formulaire de retour utilisateur | ✅ | `FeedbackDialog.tsx` + `api/feedback/route.ts` |
| 23.2 | Joindre une capture d'écran | Image dans le feedback | ✅ | Via media uploader |
| 23.3 | Types de contact | Support / Général / Facturation / Partenariat | ✅ | |

---

## 24. Navigation & UX transversale

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 24.1 | Navigation principale | Header / sidebar correctement affichés | ✅ | |
| 24.2 | Breadcrumbs | Fil d'Ariane sur les pages profondes | ✅ | `BreadcrumbAuto.tsx` + `BreadcrumbOverride.tsx` |
| 24.3 | Mode sombre / clair | Toggle thème | ✅ | `ToggleDarkMode.tsx` |
| 24.4 | Persistence du thème | Thème conservé au rechargement | ✅ | Via theme provider |
| 24.5 | Pages 404 contextuelles | `not-found.tsx` par section | ✅ | Fichiers `not-found.tsx` multiples en place |
| 24.6 | Pages d'erreur | `error.tsx` avec bouton réessayer | ✅ | Fichiers `error.tsx` par section |
| 24.7 | Skeletons de chargement | `loading.tsx` affichés pendant les fetches | ✅ | `PostSkeleton.tsx` + `Skeletons.tsx` |
| 24.8 | Toasts de confirmation | Sonner affiché après actions | ✅ | Sonner intégré partout |
| 24.9 | Responsive mobile | Affichage correct sur mobile | ✅ | Tailwind responsive classes |
| 24.10 | Responsive tablette | Affichage correct sur tablette | ✅ | |
| 24.11 | Liens Next.js | Pas de rechargement de page complet | ✅ | `next/link` utilisé partout |
| 24.12 | Métadonnées SEO | `title` et `description` sur chaque page publique | ✅ | `metadata` / `generateMetadata` en place |
| 24.13 | Protection routes privées | Redirection `/login` si non connecté | ✅ | |
| 24.14 | Protection `/account` | Redirection serveur si non connecté | ✅ | `account/layout.tsx` — `getUser()` + redirect |
| 24.15 | Protection `/admin` | Redirection serveur si non admin | ✅ | `admin/layout.tsx` — vérification rôle |

---

## 25. Dashboard (`/account`)

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 25.1 | Projets mis en avant | Carrousel de projets recommandés (haut du dashboard) | ✅ | `DashboardFeaturedProjects` |
| 25.2 | Onglet Communautés | Posts & ressources des communautés suivies | ✅ | `CommunityBlock.tsx` + `PostsBlock.tsx` |
| 25.3 | Onglet Explorer — Projets | Carte Leaflet + liste des projets du marketplace | ✅ | `DashboardExplorer.tsx` + `ProjectsMap.tsx` |
| 25.4 | Onglet Explorer — Talents | Carte Leaflet + liste des talents géolocalisés | ✅ | `DashboardExplorer.tsx` + `TalentsMap.tsx` |
| 25.5 | Filtres carte projets | Type, niveau, mode de travail, rémunération, localisation | ✅ | `MapFilters.tsx` |
| 25.6 | Filtres carte talents | Rôle, niveau, mode de travail, rémunération | ✅ | `TalentFilters.tsx` |
| 25.7 | Géocodage adresse | Conversion adresse → coordonnées (API `/api/geocode`) | ✅ | `api/mapLocations/route.ts` |
| 25.8 | Panneau notifications dashboard | Notifications groupées par date, en temps réel (Ably) | ✅ | `DashboardNotifications` |
| 25.9 | Plein écran onglet | Bouton pour agrandir Communautés ou Explorer en overlay | ✅ | `DashboardTabs.tsx` |
| 25.10 | Layout responsive dashboard | Hauteurs calculées proportionnellement au viewport | ✅ | |

---

## 26. Carte & Explorer

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 26.1 | Carte projets (`ProjectsMap`) | Points projets sur carte Leaflet dans le dashboard | ✅ | `Dashboard/map/ProjectsMap.tsx` + `ProjectsMapInner.tsx` |
| 26.2 | Carte talents (`TalentsMap`) | Points talents sur carte Leaflet dans le dashboard | ✅ | `Dashboard/map/TalentsMap.tsx` + `TalentsMapInner.tsx` |
| 26.3 | Popup projet sur carte | Clic sur un marqueur → détail du projet | ✅ | Implémenté dans `ProjectsMapInner.tsx` |
| 26.4 | Popup talent sur carte | Clic sur un marqueur → profil du talent | ✅ | Implémenté dans `TalentsMapInner.tsx` |
| 26.5 | Filtrer projets sur carte | Les filtres MapFilters mettent à jour les marqueurs | ✅ | `MapFilters.tsx` |
| 26.6 | Filtrer talents sur carte | Les filtres TalentFilters mettent à jour les marqueurs | ✅ | `TalentFilters.tsx` |

---

## 27. Évènements

> 🚫 Feature abandonnée — code backend présent (`api/events/route.ts`, `EventsBlock.tsx`) mais hors roadmap.

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 27.1 | Voir les événements | Liste / bloc événements dans le dashboard | 🚫 | `EventsBlock.tsx` existant, feature annulée |
| 27.2 | Créer un événement | Formulaire de création | 🚫 | API `api/events/route.ts` existante, feature annulée |
| 27.3 | S'inscrire à un événement | Participation | 🚫 | Feature annulée |
| 27.4 | Gérer un événement | Modifier / annuler | 🚫 | `api/events/[eventId]/route.ts` existant, feature annulée |

---

## Récapitulatif

| Section | Total | ✅ OK | ⚠️ Partiel | 📅 Futur | 🚫 Annulé |
|---|---|---|---|---|---|
| 1. Authentification | 10 | 10 | | | |
| 2. Profil & Paramètres | 14 | 14 | | | |
| 3. Communauté — Fil | 5 | 5 | | | |
| 4. Création de posts | 10 | 10 | | | |
| 5. Interactions posts | 9 | 9 | | | |
| 6. Commentaires | 7 | 7 | | | |
| 7. Ressources | 12 | 12 | | | |
| 8. Catégories | 7 | 7 | | | |
| 9. Marketplace — Projets | 15 | 15 | | | |
| 10. Candidatures | 12 | 12 | | | |
| 11. Équipe & Invitations | 6 | 6 | | | |
| 12. Chat Projet | 8 | 8 | | | |
| 13. Messagerie directe | 6 | 6 | | | |
| 14. Talents | 10 | 10 | | | |
| 15. Notifications | 11 | 11 | | | |
| 16. Recherche | 8 | 8 | | | |
| 17. Upload & Médias | 6 | 6 | | | |
| 18. Blog | 7 | 7 | | | |
| 19. Carte & Lieux | 7 | 4 | | | 3 |
| 20. Administration | 7 | 7 | | | |
| 21. Site public | 12 | 12 | | | |
| 22. Abonnements Premium | 4 | | | 4 | |
| 23. Feedback & Support | 3 | 3 | | | |
| 24. Navigation & UX | 15 | 15 | | | |
| 25. Dashboard (/account) | 10 | 10 | | | |
| 26. Carte & Explorer | 6 | 6 | | | |
| 27. Évènements | 4 | | | | 4 |
| **TOTAL** | **231** | **220** | **0** | **4** | **7** |
