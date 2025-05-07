'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface TrailerSectionProps {
  trailerKey: string | null;
}

const TrailerSection = ({ trailerKey }: TrailerSectionProps) => {
  if (!trailerKey) return null;
  
  return (
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
  );
};

export default TrailerSection;
