'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { Movie } from '@/types/tmdb';
import { getImageUrl } from '@/services/tmdb';
import Navbar from '@/components/Navbar';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get('/api/movies/search', {
        params: { query },
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = (movieId: number) => {
    router.push(`/admin/edit/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Rechercher un film</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titre du film..."
              className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-md bg-yellow-500 px-6 py-2 font-medium text-gray-900 transition-colors hover:bg-yellow-400 disabled:opacity-50"
            >
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </form>

        {movies.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Résultats</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie.id)}
                  className="cursor-pointer overflow-hidden rounded-lg bg-gray-800 shadow-md transition-transform hover:scale-105"
                >
                  <div className="relative h-[300px] w-full">
                    <Image
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-gray-400">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : 'Date inconnue'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
