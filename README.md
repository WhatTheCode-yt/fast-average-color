
# Getting Started with React Vite + Tailwind CSS + Fast Average Color

This guide helps you set up a React application using Vite, Tailwind CSS, and the Fast Average Color library to dynamically extract and display the average color from uploaded images and videos.

## Prerequisites

- Node.js (v16 or higher): https://nodejs.org/
- npm or yarn
- A code editor (e.g., VS Code)
- Basic knowledge of JavaScript and React

## Setup Steps

### 1. Create Vite + React Project

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
````

### 2. Install Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

### 3. Configure Vite

Update `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 4. Install Fast Average Color

```bash
npm install fast-average-color
```

### 5. Add Application Code

Replace the contents of `src/App.jsx` with the following:

```jsx
[PASTE FULL App.jsx CODE HERE – omitted for brevity in this preview]
```

```bash
import React, { useState, useRef, useEffect } from "react";
import { FastAverageColor } from "fast-average-color";

const fac = new FastAverageColor();

export default function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [imageBg, setImageBg] = useState("#f9fafb");
  const [videoBg, setVideoBg] = useState("#f9fafb");

  const videoRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImageSrc(imgUrl);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
    }
  };

  const analyzeImage = (src) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const color = fac.getColor(img);
      setImageBg(color.hex);
    };
  };

  const analyzeVideo = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const color = fac.getColor(canvas);
    setVideoBg(color.hex);
  };

  useEffect(() => {
    let interval = null;
    if (videoSrc && videoRef.current) {
      const onPlay = () => {
        interval = setInterval(() => {
          if (!videoRef.current.paused && !videoRef.current.ended) {
            analyzeVideo();
          }
        }, 1000);
      };

      const video = videoRef.current;
      video.addEventListener("play", onPlay);

      return () => {
        video.removeEventListener("play", onPlay);
        clearInterval(interval);
      };
    }
  }, [videoSrc]);

  useEffect(() => {
    if (imageSrc) analyzeImage(imageSrc);
  }, [imageSrc]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-tight">
        Dynamic Background From Media
      </h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Upload Section */}
        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Image</h2>
          <label className="block mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </label>
          <div
            className="relative h-80 rounded-xl overflow-hidden border shadow-inner transition-colors duration-500 flex items-center justify-center"
            style={{ backgroundColor: imageBg }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Uploaded"
                className="object-contain max-w-full max-h-full"
              />
            ) : (
              <span className="text-gray-500">Image preview will appear here</span>
            )}
          </div>
          {imageSrc && (
            <p className="mt-4 text-sm text-gray-600">
              Extracted color:{" "}
              <span
                className="inline-block px-3 py-1 rounded-full text-white text-xs ml-1"
                style={{ backgroundColor: imageBg }}
              >
                {imageBg}
              </span>
            </p>
          )}
        </div>

        {/* Video Upload Section */}
        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Video</h2>
          <label className="block mb-4">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </label>
          <div
            className="relative h-80 rounded-xl overflow-hidden border shadow-inner transition-colors duration-500 flex items-center justify-center"
            style={{ backgroundColor: videoBg }}
          >
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                className="object-contain max-w-full max-h-full z-10 rounded"
              />
            ) : (
              <span className="text-gray-500">Video preview will appear here</span>
            )}
          </div>
          {videoSrc && (
            <p className="mt-4 text-sm text-gray-600">
              Current frame color:{" "}
              <span
                className="inline-block px-3 py-1 rounded-full text-white text-xs ml-1"
                style={{ backgroundColor: videoBg }}
              >
                {videoBg}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 6. Run the App

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Features

* Upload an image to display its average color as background.
* Upload a video and dynamically update the background color as it plays.
* Color extracted using `fast-average-color`.

## Troubleshooting

* **Media not displaying**: Ensure uploaded files are valid. Check browser console for errors.
* **Tailwind not working**: Ensure Tailwind plugin is configured in `vite.config.js`. Restart the dev server.
* **fast-average-color errors**: Make sure the package is installed and that canvas is supported in the browser.
* **General issues**: Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Customization

* Modify Tailwind utility classes for layout or design adjustments.
* Extend support for additional media types.
* Extract additional color formats (e.g., RGB, HSL).
* Add features such as drag-and-drop, color history, or palette extraction.

## Deployment

Build the app for production:

```bash
npm run build
```



