
# YouTube Thumbnail Preview

A Next.js project that demonstrates a YouTube-style video thumbnail preview. Upload a video, and as you hover over the progress bar, a floating thumbnail appears, just like on YouTube.

---

## Features

- **Video Upload:** Upload any video file via a simple UI.
- **Automatic Sprite Sheet Generation:** The backend uses FFmpeg to extract thumbnails and create a sprite sheet (storyboard).
- **YouTube-style Preview:** Hovering over the video progress bar shows a floating thumbnail preview.
- **Custom Video Player:** Responsive player with progress bar and preview overlay.

---

## How It Works

1. **Upload:** Use the upload button to select a video file.
2. **Processing:** The `/api/upload` endpoint saves the video and uses FFmpeg to generate a sprite sheet.
3. **Preview:** The player loads the video and storyboard, showing a thumbnail preview as you hover over the progress bar.

---

## Components & APIs

- **components/upload-button.tsx**: Handles file input and upload, calls the API, and passes results to the player.
- **components/youtube-player.tsx**: Custom video player with progress bar and floating thumbnail preview.
- **app/api/upload/route.ts**: API endpoint for video upload and FFmpeg processing.

---

## Installation & Setup

1. **Clone the repository:**
	```bash
	git clone <repo-url>
	cd youtube-thumbnail-preview
	```
2. **Install dependencies:**
	```bash
	npm install
	# or
	yarn install
	```
3. **Install FFmpeg:**
	- macOS: `brew install ffmpeg`
	- Ubuntu: `sudo apt install ffmpeg`
	- FFmpeg must be available in your system PATH.
4. **Run the development server:**
	```bash
	npm run dev
	# or
	yarn dev
	```
5. **Open your browser:**
	- Visit [http://localhost:3000](http://localhost:3000)

---

## Usage

1. Click the **UPLOAD VIDEO** button and select a video file.
2. Wait for processing (UI will indicate progress).
3. Hover over the video progress bar to see the floating thumbnail preview.

---

## Credits

- Built with [Next.js](https://nextjs.org)
- Uses [FFmpeg](https://ffmpeg.org) for video processing
- Inspired by YouTube’s video preview UI
