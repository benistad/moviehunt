import { NextResponse } from 'next/server';
import { getAllRatedMovies } from '@/services/storage';

export async function GET() {
  try {
    const movies = await getAllRatedMovies();
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching all rated movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rated movies' },
      { status: 500 }
    );
  }
}
