import { RatedMovie } from '@/types/tmdb';
import * as MemoryStorage from './storage';
import * as KVStorage from './kv-storage';

// Détermine si nous sommes en environnement de production sur Vercel
const isVercelProduction = process.env.VERCEL === '1';

/**
 * Récupère tous les films notés
 */
export const getAllRatedMovies = async (): Promise<RatedMovie[]> => {
  if (isVercelProduction) {
    return KVStorage.getAllRatedMovies();
  } else {
    return MemoryStorage.getAllRatedMovies();
  }
};

/**
 * Récupère un film noté par son ID
 */
export const getRatedMovie = async (id: number): Promise<RatedMovie | null> => {
  if (isVercelProduction) {
    return KVStorage.getRatedMovie(id);
  } else {
    return MemoryStorage.getRatedMovie(id);
  }
};

/**
 * Ajoute ou met à jour un film noté
 */
export const addOrUpdateRatedMovie = async (movie: RatedMovie): Promise<RatedMovie> => {
  if (isVercelProduction) {
    return KVStorage.addOrUpdateRatedMovie(movie);
  } else {
    return MemoryStorage.addOrUpdateRatedMovie(movie);
  }
};

/**
 * Supprime un film noté
 */
export const deleteRatedMovie = async (id: number): Promise<boolean> => {
  if (isVercelProduction) {
    return KVStorage.deleteRatedMovie(id);
  } else {
    return MemoryStorage.deleteRatedMovie(id);
  }
};
