import { kv } from '@vercel/kv';
import { RatedMovie } from '@/types/tmdb';

// Clé pour stocker la liste des IDs de films notés
const RATED_MOVIES_KEY = 'rated-movies-ids';

// Préfixe pour les clés de films individuels
const MOVIE_KEY_PREFIX = 'movie:';

/**
 * Récupère tous les films notés
 */
export const getAllRatedMovies = async (): Promise<RatedMovie[]> => {
  try {
    // Récupérer la liste des IDs de films notés
    const movieIds = await kv.smembers(RATED_MOVIES_KEY) as string[];
    
    if (!movieIds || movieIds.length === 0) {
      return [];
    }
    
    // Récupérer chaque film par son ID
    const moviePromises = movieIds.map((id: string) => 
      kv.get(`${MOVIE_KEY_PREFIX}${id}`) as Promise<RatedMovie | null>
    );
    
    const movies = await Promise.all(moviePromises);
    
    // Filtrer les valeurs null et trier par date de création (plus récent en premier)
    return movies
      .filter((movie): movie is RatedMovie => movie !== null)
      .sort((a: RatedMovie, b: RatedMovie) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch (error) {
    console.error('Error fetching rated movies from KV:', error);
    return [];
  }
};

/**
 * Récupère un film noté par son ID
 */
export const getRatedMovie = async (id: number): Promise<RatedMovie | null> => {
  try {
    return await kv.get(`${MOVIE_KEY_PREFIX}${id}`) as RatedMovie | null;
  } catch (error) {
    console.error(`Error fetching movie ${id} from KV:`, error);
    return null;
  }
};

/**
 * Ajoute ou met à jour un film noté
 */
export const addOrUpdateRatedMovie = async (movie: RatedMovie): Promise<RatedMovie> => {
  try {
    // Stocker le film avec sa clé
    await kv.set(`${MOVIE_KEY_PREFIX}${movie.id}`, JSON.parse(JSON.stringify(movie)));
    
    // Ajouter l'ID du film à l'ensemble des films notés
    await kv.sadd(RATED_MOVIES_KEY, movie.id.toString());
    
    return movie;
  } catch (error) {
    console.error(`Error saving movie ${movie.id} to KV:`, error);
    throw error;
  }
};

/**
 * Supprime un film noté
 */
export const deleteRatedMovie = async (id: number): Promise<boolean> => {
  try {
    // Supprimer le film
    await kv.del(`${MOVIE_KEY_PREFIX}${id}`);
    
    // Retirer l'ID du film de l'ensemble des films notés
    const removed = await kv.srem(RATED_MOVIES_KEY, id);
    
    return removed > 0;
  } catch (error) {
    console.error(`Error deleting movie ${id} from KV:`, error);
    return false;
  }
};
