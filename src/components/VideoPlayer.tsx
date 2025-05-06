'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
      />
    </div>
  );
};

export default VideoPlayer;
