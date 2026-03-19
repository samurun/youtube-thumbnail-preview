# ใช้ Node.js เป็นตัวฐาน
FROM node:20-slim

# ติดตั้ง FFmpeg และ FFprobe ในระดับ OS
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ก๊อปปี้ไฟล์โปรเจกต์
COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js
RUN npm run build

# เปิด Port 3000
EXPOSE 3000

# รันแอป
CMD ["npm", "start"]