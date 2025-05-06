import { NextRequest, NextResponse } from 'next/server';
import { getMovieDetails } from '@/services/tmdb';
import { getRatedMovie } from '@/services/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = parseInt(params.id, 10);

  if (isNaN(movieId)) {
    return NextResponse.json(
      { error: 'Invalid movie ID' },
      { status: 400 }
    );
  }

  try {
    // Get movie details from TMDB
    const movie = await getMovieDetails(movieId);
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Check if the movie has already been rated
    const ratedMovie = await getRatedMovie(movieId);

    return NextResponse.json({
      movie,
      ratedMovie,
    });
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}
