'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { MovieDetails, CastMember, CrewMember } from '@/types/tmdb';
import { getImageUrl, getMovieDetails } from '@/services/tmdb';
import { getAllRatedMovies } from '@/services/storage';
import ClientNavbar from '@/components/ClientNavbar';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = parseInt(params.id as string, 10);
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [selectedStaff, setSelectedStaff] = useState<(CastMember | CrewMember & { type: 'cast' | 'crew' })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'cast' | 'crew'>('cast');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Get movie details from TMDB API
        const movieDetails = await getMovieDetails(movieId);
        setMovie(movieDetails);
        
        // Check if the movie has already been rated
        const ratedMovies = await getAllRatedMovies();
        const ratedMovie = ratedMovies.find((m) => m.id === movieId);
        
        // If the movie has already been rated, set the values
        if (ratedMovie) {
          setUserRating(ratedMovie.userRating);
          setSelectedStaff(ratedMovie.remarkableStaff || []);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleSave = async () => {
    if (!movie) return;
    
    setIsSaving(true);
    try {
      await axios.post('/api/movies/rate', {
        movie,
        userRating,
        remarkableStaff: selectedStaff,
      });
      router.push('/admin');
    } catch (error) {
      console.error('Error saving movie rating:', error);
      setIsSaving(false);
    }
  };

  const toggleStaffSelection = (person: CastMember | CrewMember, type: 'cast' | 'crew') => {
    const personWithType = { ...person, type } as (CastMember | CrewMember) & { type: 'cast' | 'crew' };
    
    // Check if the person is already selected
    const isSelected = selectedStaff.some(
      (staff) => staff.id === person.id && ('type' in staff ? staff.type === type : false)
    );

    if (isSelected) {
      // Remove from selection
      setSelectedStaff(
        selectedStaff.filter(
          (staff) => !(staff.id === person.id && ('type' in staff ? staff.type === type : false))
        )
      );
    } else {
      // Add to selection
      setSelectedStaff([...selectedStaff, personWithType]);
    }
  };

  const isStaffSelected = (person: CastMember | CrewMember, type: 'cast' | 'crew') => {
    return selectedStaff.some(
      (staff) => staff.id === person.id && ('type' in staff ? staff.type === type : false)
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <ClientNavbar />
        <main className="container mx-auto flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
            <p>Chargement du film...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <ClientNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-red-900/30 p-6 text-center">
            <h2 className="text-xl font-semibold">Film non trouvé</h2>
            <p className="mt-2">
              Impossible de charger les détails du film. Veuillez réessayer ou sélectionner un autre film.
            </p>
            <button
              onClick={() => router.push('/admin/search')}
              className="mt-4 rounded-md bg-yellow-500 px-4 py-2 font-medium text-gray-900"
            >
              Retour à la recherche
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ClientNavbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Noter un film</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h2 className="mt-4 text-xl font-bold">{movie.title}</h2>
              <p className="text-gray-400">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : 'Date inconnue'}
              </p>

              <div className="mt-6">
                <label className="mb-2 block font-medium">Votre note (sur 10)</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={userRating}
                    onChange={(e) => setUserRating(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="ml-4 text-2xl font-bold">{userRating}</span>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="mt-8 w-full rounded-md bg-yellow-500 py-3 font-medium text-gray-900 transition-colors hover:bg-yellow-400 disabled:opacity-50"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer et publier'}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Remarkable Staff</h2>
              <p className="text-gray-400">
                Sélectionnez les acteurs et l'équipe technique que vous souhaitez mettre en avant.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex border-b border-gray-700">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'cast'
                      ? 'border-b-2 border-yellow-500 text-yellow-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('cast')}
                >
                  Acteurs ({movie.credits.cast.length})
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'crew'
                      ? 'border-b-2 border-yellow-500 text-yellow-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('crew')}
                >
                  Équipe technique ({movie.credits.crew.length})
                </button>
              </div>
            </div>

            {activeTab === 'cast' && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {movie.credits.cast.map((person) => (
                  <div
                    key={`cast-${person.id}`}
                    onClick={() => toggleStaffSelection(person, 'cast')}
                    className={`cursor-pointer overflow-hidden rounded-lg ${
                      isStaffSelected(person, 'cast')
                        ? 'bg-yellow-500/20 ring-2 ring-yellow-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium">{person.name}</h3>
                      <p className="text-sm text-gray-400">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'crew' && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {movie.credits.crew.map((person) => (
                  <div
                    key={`crew-${person.id}-${person.job}`}
                    onClick={() => toggleStaffSelection(person, 'crew')}
                    className={`cursor-pointer overflow-hidden rounded-lg ${
                      isStaffSelected(person, 'crew')
                        ? 'bg-yellow-500/20 ring-2 ring-yellow-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium">{person.name}</h3>
                      <p className="text-sm text-gray-400">{person.job}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
