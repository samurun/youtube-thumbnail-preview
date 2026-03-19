import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

// Helper function สำหรับรันคำสั่ง Shell และเอาค่า Output (ใช้แทน ffprobe)
const getDuration = (videoPath: string): Promise<number> => {
  return new Promise((resolve) => {
    const ffprobe = spawn('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      videoPath,
    ]);

    let output = '';
    ffprobe.stdout.on('data', (data) => (output += data.toString()));

    // รอให้จบกระบวนการก่อนค่อย resolve
    ffprobe.on('close', () => {
      resolve(Math.ceil(parseFloat(output) || 0));
    });

    ffprobe.on('error', (err) => {
      console.error('ffprobe error:', err);
      resolve(0);
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const video = formData.get('video') as File;
    if (!video)
      return NextResponse.json({ error: 'No video' }, { status: 400 });

    const id = Date.now();
    const storageDir = join(process.cwd(), 'public/storage');
    await mkdir(storageDir, { recursive: true });

    const videoPath = join(storageDir, `${id}-input.mp4`);
    const storyboardPath = join(storageDir, `${id}-storyboard.jpg`);

    // 1. บันทึกไฟล์วิดีโอ
    const buffer = Buffer.from(await video.arrayBuffer());
    await writeFile(videoPath, buffer);

    // 2. หาความยาววิดีโอจริง
    const duration = await getDuration(videoPath);

    // 3. ตั้งค่าการเจน Sprite Sheet
    const cols = 60; // ล็อคไว้ที่ 60 รูปต่อแถว (ตามโจทย์)
    const fps = 1; // 1 วินาทีต่อ 1 รูป
    const totalFrames = Math.max(1, duration * fps);
    const rows = Math.ceil(totalFrames / cols); // คำนวณแถวอัตโนมัติ

    // 4. รัน FFmpeg สร้าง Storyboard
    const ffmpeg = spawn('ffmpeg', [
      '-i',
      videoPath,
      '-vf',
      `fps=${fps},scale=160:90,tile=${cols}x${rows}`,
      '-y', // เขียนทับถ้ามีไฟล์เดิม
      storyboardPath,
    ]);

    await new Promise((resolve, reject) => {
      ffmpeg.on('close', resolve);
      ffmpeg.on('error', reject);
    });

    return NextResponse.json({
      videoUrl: `/storage/${id}-input.mp4`,
      storyboardUrl: `/storage/${id}-storyboard.jpg`,
      config: {
        duration,
        cols,
        rows,
        totalFrames,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
