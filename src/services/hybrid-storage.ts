import { RatedMovie } from '@/types/tmdb';
import * as MemoryStorage from './storage';
import * as RedisStorage from './redis-storage';

// Détermine si nous sommes en environnement de production sur Vercel
// ou si nous avons des variables d'environnement Redis locales
const hasRedisConfig = !!(process.env.REDIS_URL || process.env.KV_URL);

/**
 * Récupère tous les films notés
 */
export const getAllRatedMovies = async (): Promise<RatedMovie[]> => {
  if (hasRedisConfig) {
    return RedisStorage.getAllRatedMovies();
  } else {
    return MemoryStorage.getAllRatedMovies();
  }
};

/**
 * Récupère un film noté par son ID
 */
export const getRatedMovie = async (id: number): Promise<RatedMovie | null> => {
  if (hasRedisConfig) {
    return RedisStorage.getRatedMovie(id);
  } else {
    return MemoryStorage.getRatedMovie(id);
  }
};

/**
 * Ajoute ou met à jour un film noté
 */
export const addOrUpdateRatedMovie = async (movie: RatedMovie): Promise<RatedMovie> => {
  if (hasRedisConfig) {
    return RedisStorage.addOrUpdateRatedMovie(movie);
  } else {
    return MemoryStorage.addOrUpdateRatedMovie(movie);
  }
};

/**
 * Supprime un film noté
 */
export const deleteRatedMovie = async (id: number): Promise<boolean> => {
  if (hasRedisConfig) {
    return RedisStorage.deleteRatedMovie(id);
  } else {
    return MemoryStorage.deleteRatedMovie(id);
  }
};
