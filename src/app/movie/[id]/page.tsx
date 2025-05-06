'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getImageUrl, getTrailerKey } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import StaffMember from '@/components/StaffMember';
import dynamic from 'next/dynamic';
import { getAllRatedMovies } from '@/services/storage';
import { RatedMovie } from '@/types/tmdb';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function MoviePage() {
  const params = useParams();
  const movieId = parseInt(params.id as string, 10);
  const [movie, setMovie] = useState<RatedMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Utiliser directement le service de stockage
        const ratedMovie = await getAllRatedMovies().then(
          movies => movies.find(m => m.id === movieId)
        );
        
        if (ratedMovie) {
          setMovie(ratedMovie);
        } else {
          setMovie(null);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const trailerKey = getTrailerKey(movie.videos);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="relative h-[50vh] w-full">
        <Image
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          className="object-cover object-top brightness-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      <main className="container mx-auto -mt-32 px-4">
        <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-xl md:col-span-1">
            <Image
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold md:text-4xl">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="mt-2 text-xl italic text-gray-400">{movie.tagline}</p>
            )}
            
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-2xl font-bold text-gray-900">
                {movie.userRating}/10
              </div>
              <div>
                <p className="text-sm text-gray-400">Ma note</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Synopsis</h2>
              <p className="mt-2 text-gray-300">{movie.overview || "Aucun synopsis disponible."}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-gray-800 px-3 py-1 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-gray-400">
                <span className="font-semibold">Date de sortie:</span>{' '}
                {new Date(movie.release_date).toLocaleDateString('fr-FR')}
              </p>
              {movie.runtime > 0 && (
                <p className="text-gray-400">
                  <span className="font-semibold">Durée:</span>{' '}
                  {Math.floor(movie.runtime / 60)}h{movie.runtime % 60 > 0 ? ` ${movie.runtime % 60}min` : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        {movie.remarkableStaff && movie.remarkableStaff.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Remarkable Staff</h2>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movie.remarkableStaff.map((member, index) => (
                <StaffMember key={`${member.id}-${index}`} member={member} />
              ))}
            </div>
          </section>
        )}

        {trailerKey && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Bande Annonce</h2>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailerKey}`}
                width="100%"
                height="100%"
                controls
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
