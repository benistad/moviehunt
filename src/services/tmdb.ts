import axios from 'axios';
import { Movie, MovieDetails, SearchMoviesResponse } from '@/types/tmdb';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '4d8c7fb7bb45955c22ccf1cf1c6823da';
const BASE_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsIm5iZiI6MS43NDY1MTUwNTQyODE5OTk4ZSs5LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mI9mPVyASt5bsbRwtVN5eUs6uyz28Tvy-FRJTT6vdg8';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get<SearchMoviesResponse>('/search/movie', {
      params: {
        query,
        language: 'fr-FR',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails | null> => {
  try {
    const response = await tmdbApi.get<MovieDetails>(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits',
        language: 'fr-FR',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    return null;
  }
};

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-image.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getTrailerKey = (videos: MovieDetails['videos']): string | null => {
  if (!videos || !videos.results || videos.results.length === 0) return null;
  
  // Try to find a trailer
  const trailer = videos.results.find(
    (video) => video.site === 'YouTube' && 
    (video.type === 'Trailer' || video.type === 'Teaser')
  );
  
  return trailer ? trailer.key : null;
};
