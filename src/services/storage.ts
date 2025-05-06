import { RatedMovie } from '@/types/tmdb';

// In-memory storage for development
let moviesStore: RatedMovie[] = [];

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
  
  return movie;
};

export const deleteRatedMovie = async (id: number): Promise<boolean> => {
  const initialLength = moviesStore.length;
  moviesStore = moviesStore.filter(movie => movie.id !== id);
  return moviesStore.length < initialLength;
};
