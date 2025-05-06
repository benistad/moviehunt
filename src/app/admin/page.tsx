import React from 'react';
import Link from 'next/link';
import { getAllRatedMovies } from '@/services/storage';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';

export const revalidate = 0;

export default async function AdminPage() {
  const movies = await getAllRatedMovies();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Administration</h1>
          <Link
            href="/admin/search"
            className="rounded-md bg-yellow-500 px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-yellow-400"
          >
            Ajouter un film
          </Link>
        </div>

        <h2 className="mb-6 text-2xl font-semibold">Films notés</h2>
        
        {movies.length === 0 ? (
          <div className="rounded-lg bg-gray-800 p-8 text-center">
            <h3 className="text-xl font-semibold">Aucun film noté pour le moment</h3>
            <p className="mt-2 text-gray-400">
              Utilisez le bouton "Ajouter un film" pour commencer à noter des films.
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
                href={`/admin/edit/${movie.id}`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
