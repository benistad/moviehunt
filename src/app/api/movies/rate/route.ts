import { NextRequest, NextResponse } from 'next/server';
import { MovieDetails, RatedMovie } from '@/types/tmdb';
import { addOrUpdateRatedMovie } from '@/services/hybrid-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { movie, userRating, remarkableStaff } = body;

    if (!movie || typeof userRating !== 'number') {
      return NextResponse.json(
        { error: 'Movie and userRating are required' },
        { status: 400 }
      );
    }

    // Create a rated movie object
    const ratedMovie: RatedMovie = {
      ...(movie as MovieDetails),
      userRating,
      remarkableStaff: remarkableStaff || [],
      createdAt: new Date().toISOString(),
    };

    // Save the rated movie
    const savedMovie = await addOrUpdateRatedMovie(ratedMovie);

    return NextResponse.json(savedMovie);
  } catch (error) {
    console.error('Error rating movie:', error);
    return NextResponse.json(
      { error: 'Failed to rate movie' },
      { status: 500 }
    );
  }
}
