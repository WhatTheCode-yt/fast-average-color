
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
