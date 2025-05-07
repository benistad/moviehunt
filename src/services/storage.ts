import { RatedMovie } from '@/types/tmdb';

// Stockage local pour le développement
// Utilisation d'une fonction pour initialiser moviesStore
let moviesStore: RatedMovie[] = [];

// Initialisation du stockage
const initializeStorage = () => {
  // Vérifier si nous sommes côté client
  if (typeof window !== 'undefined') {
    try {
      // Récupérer les films du localStorage
      const storedMovies = localStorage.getItem('ratedMovies');
      if (storedMovies) {
        moviesStore = JSON.parse(storedMovies);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des films du localStorage:', error);
    }
  }
};

// Initialiser le stockage
initializeStorage();

export const getAllRatedMovies = async (): Promise<RatedMovie[]> => {
  // Sort by creation date, newest first
  return [...moviesStore].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getRatedMovie = async (id: number): Promise<RatedMovie | null> => {
  return moviesStore.find(movie => movie.id === id) || null;
};

export const addOrUpdateRatedMovie = async (movie: RatedMovie): Promise<RatedMovie> => {
  // Check if movie already exists
  const index = moviesStore.findIndex(m => m.id === movie.id);
  
  if (index !== -1) {
    // Update existing movie
    moviesStore[index] = movie;
  } else {
    // Add new movie
    moviesStore.push(movie);
  }
  
  // Sauvegarder dans localStorage si nous sommes côté client
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ratedMovies', JSON.stringify(moviesStore));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des films dans localStorage:', error);
    }
  }
  
  return movie;
};

export const deleteRatedMovie = async (id: number): Promise<boolean> => {
  const initialLength = moviesStore.length;
  moviesStore = moviesStore.filter(movie => movie.id !== id);
  
  // Sauvegarder dans localStorage si nous sommes côté client
  if (typeof window !== 'undefined' && moviesStore.length < initialLength) {
    try {
      localStorage.setItem('ratedMovies', JSON.stringify(moviesStore));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des films dans localStorage:', error);
    }
  }
  
  return moviesStore.length < initialLength;
};
