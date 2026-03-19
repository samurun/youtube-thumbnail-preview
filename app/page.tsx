'use client';

import { UploadButton } from '@/components/upload-button';
import YoutubePlayer from '@/components/youtube-player';
import { useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [storyboardUrl, setStoryboardUrl] = useState<string | undefined>(
    undefined,
  );
  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans gap-4 dark:bg-black/50 px-4'>
      <UploadButton
        onUploadSuccess={(data) => {
          setVideoUrl(data.videoUrl);
          setStoryboardUrl(data.storyboardUrl);
        }}
      />
      {videoUrl && storyboardUrl && (
        <YoutubePlayer videoUrl={videoUrl} storyboardUrl={storyboardUrl} />
      )}
    </div>
  );
}
