'use client';

import { useState, useRef } from 'react';

interface UploadButtonProps {
  // รับ Callback เพื่อส่งข้อมูลที่ได้จาก API กลับไปที่หน้าหลัก
  onUploadSuccess: (data: {
    videoUrl: string;
    storyboardUrl: string;
    config: {
      duration: number;
      cols: number;
      rows: number;
      totalFrames: number;
    };
  }) => void;
}

export function UploadButton({ onUploadSuccess }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // ใช้ FormData มาตรฐานของ Browser ในการส่งไฟล์
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      // ส่งข้อมูลทั้งหมด (รวม config) กลับไปให้ Player
      onUploadSuccess(data);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className='flex flex-col items-center gap-2'>
      <input
        type='file'
        accept='video/*'
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`
          px-6 py-2 rounded-full font-bold transition-all
          ${
            isUploading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
          }
        `}
      >
        {isUploading ? 'Processing Video...' : 'UPLOAD VIDEO'}
      </button>
    </div>
  );
}
