# DOSSIER DE RENDU

**Projet : Application de gestion des CRA – Lency**  
**Domaine principal :** https://lency.net  
**Version de production :** lency.net  
**Environnement de staging :** staging.lency.net  

**Date :** 27 mars 2026  
**Auteur :** [Ton Prénom NOM]

## 1. Solution retenue

Afin de structurer les différents déploiements et d’éviter la centralisation sur un seul domaine, l’architecture adoptée est basée sur **plusieurs sous-domaines** hébergés sur Vercel :

- **lency.net** → Environnement de **production** (destiné aux clients finaux)
- **staging.lency.net** → Environnement de **staging / pré-production** (tests et validation)
- **mail.lency.net** → Sous-domaine dédié exclusivement à l’envoi d’emails via l'application exemple (support@mail.lency.net)

**Objectifs atteints :**
- Séparation claire entre production et staging.
- Protection de la réputation du domaine principal (`lency.net`) en cas de problèmes de délivrabilité email.
- Flexibilité : un client peut arriver directement sur un sous-domaine ou être redirigé depuis le domaine principal.
- Possibilité de créer facilement d’autres sous-domaines à l’avenir.

**Stack technique :**
- **Hébergement** : Vercel (PaaS optimisé pour Next.js)
- **Base de données** : Neon.com (PostgreSQL serverless)
- **Gestion des secrets** : Doppler
- **Envoi d’emails** : Resend pour les mails de règle métier/newsletter (support@mail.lency.net,...) + Proton Mail (SMTP configuré sur social@lency.net)
- **Frontend** : Next.js 15 (App Router)

## 2. Étapes de déploiement réalisées

1. Ajout du domaine `lency.net` et création des sous-domaines sur Vercel.
2. Connexion du dépôt GitHub pour déploiements automatiques.
3. Configuration Doppler (projets séparés pour production et staging).
4. Connexion de la base de données Neon.com via Prisma.
5. Configuration DNS et SMTP sur `mail.lency.net` (SPF, DKIM, DMARC).
6. Mise en place des redirections intelligentes via middleware Next.js.
7. Déploiement automatique :
   - Branche `main` → `lency.net` (production)
   - Branche `develop` / Preview branches → `staging.lency.net`

## 3. Difficultés rencontrées et solutions

- Propagation DNS des sous-domaines → résolue avec Cloudflare en proxy.
- Gestion sécurisée des variables d’environnement → Doppler (projets isolés).
- Délivrabilité email → combinaison Resend + Proton + configuration SPF/DKIM/DMARC sur sous-domaine dédié.
- Redirection fluide entre domaine principal et sous-domaines → implémentée avec Next.js Middleware.

## 4. Justification des choix (alignée sur les critères d’évaluation)

- **Application déployée et fonctionnelle** : Application accessible sur `lency.net` et `staging.lency.net`, base de données opérationnelle, projet récupéré depuis GitHub.
- **Qualité de l’hébergement / architecture** : Choix cohérent de Vercel (PaaS) + multi-sous-domaines + Neon, architecture claire et scalable.
- **Sécurité et bonnes pratiques** : HTTPS automatique, secrets gérés via Doppler (jamais exposés), debug désactivé en production.
- **Exploitabilité / maintenance** : Déploiements GitHub automatiques, logs Vercel + Neon, procédure simple.
- **Dossier de rendu** : Document complet avec solution, étapes, difficultés et justification.

## 5. Conclusion

L’architecture multi-sous-domaines mise en place répond parfaitement aux besoins de structuration, de sécurité et de maintenabilité du projet Lency. L’application est aujourd’hui pleinement fonctionnelle, sécurisée et facilement évolutive.

**Liens :**  
- Production : https://lency.net  
- Staging : https://staging.lency.net  

**Prêt pour évaluation.**