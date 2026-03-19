# 🎬 YouTube Thumbnail Preview Generator

โปรเจกต์จำลองระบบ **Thumbnail Scrubbing** แบบ YouTube โดยใช้ **Next.js App Router** ร่วมกับ **FFmpeg** เพื่อสร้าง Sprite Sheet (Storyboard) จากวิดีโอที่อัปโหลดโดยอัตโนมัติ

---

## ✨ Features
- **Video Upload:** รองรับการอัปโหลดไฟล์วิดีโอ (MP4) เข้าสู่ระบบ
- **FFmpeg Integration:** ใช้ FFmpeg/FFprobe เจนรูปภาพ Sprite Sheet (60 คอลัมน์) ตามความยาววิดีโอจริง
- **Dynamic Sprite Calculation:** คำนวณจำนวนแถว (Rows) อัตโนมัติจาก Duration ของวิดีโอ (1 แถว = 60 วินาที)
- **Custom Video Player:** ระบบพรีวิวภาพ Thumbnail ตามตำแหน่งเมาส์บน Progress Bar แบบวินาทีต่อวินาที
- **Dockerized:** พร้อมรันในสภาพแวดล้อมที่มี FFmpeg ติดตั้งผ่าน Docker

---

## 🛠 Tech Stack
- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Processing:** [FFmpeg](https://ffmpeg.org/) & [FFprobe](https://ffmpeg.org/ffprobe.html)
- **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Prerequisites
- ติดตั้ง [Docker](https://www.docker.com/) และ [Docker Compose](https://docs.docker.com/compose/)
- หรือหากต้องการรันแบบ Local (ไม่ใช้ Docker) ต้องติดตั้ง `ffmpeg` และ `ffprobe` ในเครื่องก่อน

### 2. Installation & Running (Docker - Recommended)
วิธีนี้จะจัดการเรื่องการติดตั้ง FFmpeg ให้โดยอัตโนมัติภายใน Container

```bash
# 1. Clone โปรเจกต์
git clone <your-repo-url>
cd youtube-thumbnail-preview

# 2. รันด้วย Docker Compose
docker-compose up --build