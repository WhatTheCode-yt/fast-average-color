Getting Started with React Vite + Tailwind CSS + Fast Average Color
This guide helps you set up a React app using Vite, Tailwind CSS, and the Fast Average Color library to dynamically extract and display the average color from uploaded images and videos.
Prerequisites

Node.js (v16+): Install from nodejs.org.
npm or yarn: Verify with npm --version or yarn --version.
Code editor: Recommended: VS Code.
Basic JavaScript/React knowledge.

Setup Steps
1. Create Vite + React Project
Run the following commands to set up a new Vite project with the React template:
npm create vite@latest my-app -- --template react
cd my-app
npm install

2. Install Tailwind CSS
Install Tailwind CSS and its Vite plugin:
npm install tailwindcss @tailwindcss/vite

3. Configure Vite
Update vite.config.js to include the Tailwind CSS plugin:
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})

4. Install Fast Average Color
Install the Fast Average Color library:
npm install fast-average-color

5. Add Application Code
Replace src/App.jsx with the following code to create a demo that extracts average colors from uploaded images and videos:
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

6. Run the App
Start the development server:
npm run dev

Open http://localhost:5173 to view the app, which includes:

Image Upload Section: Upload an image to display it with its average color as the background.
Video Upload Section: Upload a video, and its average color is extracted and updated every second during playback.

Troubleshooting

Images/Videos Not Loading: Check the browser console (F12 → Console/Network) for errors. Ensure uploaded files are valid.
Tailwind Not Working: Verify vite.config.js includes the Tailwind plugin and restart the server.
Fast Average Color Issues: Ensure fast-average-color is installed and the browser supports canvas operations.
General Errors: Reinstall dependencies:rm -rf node_modules package-lock.json
npm install



Customization

Styling: Modify Tailwind classes in App.jsx to adjust the design (e.g., colors, spacing, or layout).
Media Handling: Extend the app to support additional file types or add more image/video processing features.
Color Extraction: Adjust the analyzeImage or analyzeVideo functions to extract different color properties (e.g., RGB, HSL) using Fast Average Color's API.
Deployment: Run npm run build and host the dist folder on platforms like Netlify or Vercel.

Resources

Vite Docs
Tailwind CSS Docs
Fast Average Color Docs
React Docs
