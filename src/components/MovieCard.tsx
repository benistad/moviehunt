import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/tmdb';
import { getImageUrl } from '@/services/tmdb';

interface MovieCardProps {
  movie: Movie & { userRating?: number };
  href: string;
}

const MovieCard = ({ movie, href }: MovieCardProps) => {
  return (
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
        <div className="relative h-[400px] w-full">
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {movie.userRating !== undefined && (
            <div className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full bg-black/80 text-xl font-bold text-white">
              {movie.userRating}/10
            </div>
          )}
        </div>
        <div className="bg-gray-800 p-4 text-white">
          <h3 className="text-lg font-semibold">{movie.title}</h3>
          <p className="text-sm text-gray-300">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Date inconnue'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
