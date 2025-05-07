This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# MovieHunt - Application de Notation de Films

MovieHunt est une application web qui vous permet de noter des films et de partager vos critiques. Elle se compose d'une partie publique qui affiche tous les films notés et d'une partie administration pour rechercher et noter des films.

## Fonctionnalités

### Partie Publique
- Affichage de tous les films notés
- Page de détail pour chaque film avec:
  - Visuel du film
  - Synopsis
  - Note sur 10
  - Bande-annonce (si disponible)
  - "Remarkable Staff" (acteurs et équipe technique sélectionnés)

### Partie Administration
- Recherche de films via l'API TMDB
- Attribution d'une note sur 10
- Sélection du "Remarkable Staff" (acteurs, réalisateurs, scénaristes, etc.)
- Publication automatique sur la partie publique

## Configuration Technique

### Prérequis
- Node.js 18+ et npm
- Compte Vercel (pour le déploiement)
- Clé API TMDB (déjà configurée dans l'application)

### Installation Locale

```bash
# Cloner le dépôt
git clone https://github.com/benistad/moviehunt.git
cd moviehunt

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Déploiement sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas déjà un
2. Connectez votre compte GitHub à Vercel
3. Importez ce projet depuis GitHub
4. Vercel détectera automatiquement qu'il s'agit d'un projet Next.js et configurera les paramètres de build
5. Cliquez sur "Deploy" pour déployer votre application

Une fois déployée, votre application sera accessible à une URL du type `https://moviehunt-username.vercel.app`

## Stockage des Données

L'application utilise un système de stockage hybride :

- **En développement local** : Les données sont stockées en mémoire (elles sont perdues au redémarrage du serveur)
- **En production sur Vercel** : Les données sont stockées de manière persistante avec Vercel Redis

### Configuration de Vercel Redis

Pour configurer Vercel Redis et bénéficier du stockage persistant :

1. Déployez d'abord votre application sur Vercel
2. Dans votre projet Vercel, allez dans l'onglet "Storage"
3. Cliquez sur "Create" et sélectionnez "Redis Database"
4. Nommez votre base de données (nous utilisons "moviehunt-redis")
5. Suivez les instructions pour créer une nouvelle instance Redis
6. Une fois créée, Vercel configurera automatiquement les variables d'environnement nécessaires

### Utilisation de Redis en développement local

Pour utiliser Redis en développement local :

1. Installez la CLI Vercel si ce n'est pas déjà fait :
   ```bash
   npm i -g vercel
   ```

2. Liez votre projet local à votre projet Vercel :
   ```bash
   vercel link
   ```

3. Tirez les variables d'environnement :
   ```bash
   vercel env pull .env.development.local
   ```

4. Redémarrez votre serveur de développement

L'application détectera automatiquement les variables d'environnement Redis et utilisera le stockage persistant au lieu du stockage en mémoire. L'offre gratuite de Vercel Redis inclut 30 MB de stockage, ce qui est largement suffisant pour stocker environ 2000 films notés.

## Technologies Utilisées

- Next.js 15.3.1
- React 18.2.0
- Tailwind CSS
- API TMDB
- Vercel Redis pour le stockage persistant
- Vercel pour l'hébergement
