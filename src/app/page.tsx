'use client';

import React, { useState, useEffect } from 'react';
import { getAllRatedMovies } from '@/services/storage';
import { RatedMovie } from '@/types/tmdb';
import MovieCard from '@/components/MovieCard';
import ClientNavbar from '@/components/ClientNavbar';

export default function Home() {
  const [movies, setMovies] = useState<RatedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRatedMovies()
      .then((response) => setMovies(response || []))
      .catch((error) => console.error('Error fetching movies:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ClientNavbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Films Notés</h1>
        
        {loading ? (
          <div className="rounded-lg bg-gray-800 p-8 text-center">
            <h2 className="text-xl font-semibold">Chargement...</h2>
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded-lg bg-gray-800 p-8 text-center">
            <h2 className="text-xl font-semibold">Aucun film noté pour le moment</h2>
            <p className="mt-2 text-gray-400">
              Connectez-vous à l'espace administration pour ajouter des films.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={{
                  ...movie,
                  userRating: movie.userRating,
                }}
                href={`/movie/${movie.id}`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
