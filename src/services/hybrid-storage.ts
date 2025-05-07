import { RatedMovie } from '@/types/tmdb';
import * as MemoryStorage from './storage';
import * as KVStorage from './kv-storage';

// Détermine si nous sommes en environnement de production sur Vercel
const isVercelProduction = process.env.VERCEL === '1';

// Vérifie si nous sommes côté serveur
const isServer = typeof window === 'undefined';

/**
 * Récupère tous les films notés
 */
export const getAllRatedMovies = async (): Promise<RatedMovie[]> => {
  // En production sur Vercel, utiliser KV Storage
  if (isVercelProduction) {
    return KVStorage.getAllRatedMovies();
  }
  
  // En développement côté serveur, retourner un tableau vide pour éviter les erreurs
  // Les données seront chargées côté client
  if (isServer) {
    return [];
  }
  
  // En développement côté client, utiliser le stockage local
  return MemoryStorage.getAllRatedMovies();
};

/**
 * Récupère un film noté par son ID
 */
export const getRatedMovie = async (id: number): Promise<RatedMovie | null> => {
  // En production sur Vercel, utiliser KV Storage
  if (isVercelProduction) {
    return KVStorage.getRatedMovie(id);
  }
  
  // En développement côté serveur, retourner null pour éviter les erreurs
  if (isServer) {
    return null;
  }
  
  // En développement côté client, utiliser le stockage local
  return MemoryStorage.getRatedMovie(id);
};

/**
 * Ajoute ou met à jour un film noté
 */
export const addOrUpdateRatedMovie = async (movie: RatedMovie): Promise<RatedMovie> => {
  // En production sur Vercel, utiliser KV Storage
  if (isVercelProduction) {
    return KVStorage.addOrUpdateRatedMovie(movie);
  }
  
  // En développement, toujours utiliser le stockage local
  // Cette fonction est généralement appelée lors d'actions utilisateur (côté client)
  return MemoryStorage.addOrUpdateRatedMovie(movie);
};

/**
 * Supprime un film noté
 */
export const deleteRatedMovie = async (id: number): Promise<boolean> => {
  // En production sur Vercel, utiliser KV Storage
  if (isVercelProduction) {
    return KVStorage.deleteRatedMovie(id);
  }
  
  // En développement, toujours utiliser le stockage local
  // Cette fonction est généralement appelée lors d'actions utilisateur (côté client)
  return MemoryStorage.deleteRatedMovie(id);
};
