'use client';

import { formatTime } from '@/utils/format';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useState, useRef, useMemo } from 'react';

interface YoutubePlayerProps {
  videoUrl: string; // URL ของไฟล์วิดีโอ (MP4)
  storyboardUrl: string; // URL ของ Sprite Sheet ที่ได้จาก FFmpeg
  cols?: number; // จำนวนคอลัมน์ใน Sprite Sheet (ที่เราเซตไว้ 60)
}

export default function YoutubePlayer({
  videoUrl,
  storyboardUrl,
  cols = 60,
}: YoutubePlayerProps) {
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hoverPos, setHoverPos] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // คำนวณหา Frame Index จากตำแหน่งเมาส์บน Progress Bar
  const previewFrame = useMemo(() => {
    // ถ้าเราเจนมาวินาทีละรูป previewFrame ก็คือ "วินาทีที่เมาส์ชี้"
    return Math.floor(hoverPos * duration);
  }, [hoverPos, duration]);

  // คำนวณ Background Position สำหรับ Sprite Sheet (สมมติรูปเล็ก 160x90)
  const bgX = (previewFrame % cols) * 160;
  const bgY = Math.floor(previewFrame / cols) * 90;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPos(x);
  };

  const handleSeek = (e: React.MouseEvent) => {
    if (!videoRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = x * videoRef.current.duration;
  };

  // 1. กำหนดความกว้างของ Preview Box (ต้องตรงกับ CSS)
  const PREVIEW_WIDTH = 160;

  // 2. คำนวณตำแหน่งที่ถูก "ล็อค" ไม่ให้หลุดขอบ
  // เราต้องหาความกว้างของ Container หลักก่อน (สามารถใช้ ref หรือคำนวณจากร้อยละ)
  const percentWidth =
    (PREVIEW_WIDTH / (videoRef.current?.clientWidth || 1)) * 100;
  const halfWidth = percentWidth / 2;

  // ล็อคค่าให้อยู่ในช่วง [ครึ่งหนึ่งของความกว้างพรีวิว, 100% - ครึ่งหนึ่งของความกว้างพรีวิว]
  const clampedLeft = Math.max(
    halfWidth,
    Math.min(100 - halfWidth, hoverPos * 100),
  );

  return (
    <div className='relative w-full max-w-4xl aspect-video bg-black group overflow-hidden rounded-xl shadow-2xl'>
      {/* 1. วิดีโอหลัก */}
      {videoUrl && storyboardUrl ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className='w-full h-full'
            onLoadedMetadata={(e) => {
              console.log('Video duration:', e.currentTarget.duration);
              setDuration(e.currentTarget.duration);
            }}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setProgress(
                  videoRef.current.currentTime / videoRef.current.duration,
                );
              }
            }}
            onClick={() =>
              videoRef.current?.paused
                ? videoRef.current.play()
                : videoRef.current?.pause()
            }
          />

          {/* 2. Controls Overlay (จะโผล่ตอน Hover) */}
          <div className='absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            {/* Progress Bar Container */}
            <div
              ref={progressBarRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleSeek}
              className='relative h-1.5 w-full bg-white/30 cursor-pointer mb-4 group/bar hover:h-2 transition-all'
            >
              {/* แถบ Progress สีแดงแบบ YouTube */}
              <div
                className='absolute top-0 left-0 h-full bg-red-600 flex items-center justify-end'
                style={{ width: `${progress * 100}%` }}
              >
                <div className='w-3 h-3 rounded-full bg-red-600 scale-0 group-hover/bar:scale-100 transition-transform translate-x-1.5' />
              </div>

              {/* 3. Floating Preview Box (Thumbnail) */}
              {isHovering && (
                <div
                  className='absolute bottom-6 -translate-x-1/2 border-2 border-white rounded-md shadow-lg overflow-hidden pointer-events-none'
                  style={{
                    left: `${clampedLeft}%`,
                    width: '160px',
                    height: '90px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${storyboardUrl})`,
                      backgroundPosition: `-${bgX}px -${bgY}px`, // ใช้ px เพื่อความแม่นยำระดับวินาที
                      backgroundSize: `${cols * 160}px auto`,
                    }}
                  />
                  <p className='absolute bottom-0 right-0 m-1 text-white text-xs'>
                    {formatTime(Math.floor(hoverPos * duration))}
                  </p>
                </div>
              )}
            </div>

            {/* Play/Pause Buttons (Simple Version) */}
            <div className='flex items-center gap-4 text-white'>
              {videoRef.current?.paused ? (
                <button
                  onClick={() => videoRef.current?.play()}
                  className='hover:scale-110 transition'
                >
                  <PlayIcon fill='#fff' className='size-4' />
                </button>
              ) : (
                <button
                  onClick={() => videoRef.current?.pause()}
                  className='hover:scale-110 transition'
                >
                  <PauseIcon fill='#fff' className='size-4' />
                </button>
              )}
              <span className='text-sm font-mono'>
                {videoRef.current
                  ? formatTime(Math.floor(videoRef.current.currentTime))
                  : '0:00'}
                /
                {videoRef.current?.duration
                  ? formatTime(Math.floor(videoRef.current.duration))
                  : '0:00'}
              </span>
              <div className='flex-1' />
              {/* ปุ่มขยายเต็มจอ (ยังไม่ทำงาน) */}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
