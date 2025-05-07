import { createClient } from 'redis';
import { RatedMovie } from '@/types/tmdb';

// Préfixe pour les clés de films individuels
const MOVIE_KEY_PREFIX = 'movie:';
// Clé pour la liste des IDs de films
const RATED_MOVIES_KEY = 'rated-movies-ids';

// Fonction pour créer et initialiser un client Redis
const getRedisClient = async () => {
  try {
    // Créer un client Redis avec les variables d'environnement fournies par Vercel
    const client = createClient({
      url: process.env.REDIS_URL || process.env.KV_URL,
      socket: {
        connectTimeout: 10000,
      },
    });

    // Gérer les erreurs de connexion
    client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    // Connexion au client Redis s'il n'est pas déjà connecté
    if (!client.isOpen) {
      await client.connect();
    }

    return client;
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
    return null;
  }
};

/**
 * Récupère tous les films notés
 */
export const getAllRatedMovies = async (): Promise<RatedMovie[]> => {
  try {
    const client = await getRedisClient();
    if (!client) return [];

    // Récupérer tous les IDs de films notés
    const movieIds = await client.sMembers(RATED_MOVIES_KEY);
    
    if (!movieIds || movieIds.length === 0) {
      await client.disconnect();
      return [];
    }

    // Récupérer chaque film par son ID
    const moviePromises = movieIds.map(id => 
      client.get(`${MOVIE_KEY_PREFIX}${id}`)
    );
    
    const movies = await Promise.all(moviePromises);
    
    // Fermer la connexion Redis
    await client.disconnect();
    
    // Filtrer les valeurs null, parser les JSON et trier par date de création
    return movies
      .filter(movie => movie !== null)
      .map(movie => JSON.parse(movie as string) as RatedMovie)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch (error) {
    console.error('Error fetching rated movies from Redis:', error);
    return [];
  }
};

/**
 * Récupère un film noté par son ID
 */
export const getRatedMovie = async (id: number): Promise<RatedMovie | null> => {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    // Récupérer le film par son ID
    const movieJson = await client.get(`${MOVIE_KEY_PREFIX}${id}`);
    
    // Fermer la connexion Redis
    await client.disconnect();
    
    if (!movieJson) return null;
    
    return JSON.parse(movieJson) as RatedMovie;
  } catch (error) {
    console.error(`Error fetching movie ${id} from Redis:`, error);
    return null;
  }
};

/**
 * Ajoute ou met à jour un film noté
 */
export const addOrUpdateRatedMovie = async (movie: RatedMovie): Promise<RatedMovie> => {
  try {
    const client = await getRedisClient();
    if (!client) throw new Error('Failed to connect to Redis');

    // Convertir l'objet movie en JSON
    const movieJson = JSON.stringify(movie);
    
    // Stocker le film avec sa clé
    await client.set(`${MOVIE_KEY_PREFIX}${movie.id}`, movieJson);
    
    // Ajouter l'ID du film à l'ensemble des films notés
    await client.sAdd(RATED_MOVIES_KEY, movie.id.toString());
    
    // Fermer la connexion Redis
    await client.disconnect();
    
    return movie;
  } catch (error) {
    console.error(`Error saving movie ${movie.id} to Redis:`, error);
    throw error;
  }
};

/**
 * Supprime un film noté
 */
export const deleteRatedMovie = async (id: number): Promise<boolean> => {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    // Supprimer le film
    await client.del(`${MOVIE_KEY_PREFIX}${id}`);
    
    // Retirer l'ID du film de l'ensemble des films notés
    const removed = await client.sRem(RATED_MOVIES_KEY, id.toString());
    
    // Fermer la connexion Redis
    await client.disconnect();
    
    return removed > 0;
  } catch (error) {
    console.error(`Error deleting movie ${id} from Redis:`, error);
    return false;
  }
};
