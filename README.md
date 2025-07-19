Here is the complete and **well-formatted `README.md`** content for your **React + Vite + Tailwind CSS + Fast Average Color** demo:

---

````markdown
# 🎨 Getting Started with React Vite + Tailwind CSS + Fast Average Color

This guide helps you set up a React app using **Vite**, **Tailwind CSS**, and the [`fast-average-color`](https://www.npmjs.com/package/fast-average-color) library to dynamically extract and display the average color from uploaded **images** and **videos**.

---

## 📦 Prerequisites

- Node.js (v16+): [Download Node.js](https://nodejs.org/)
- npm or yarn: Verify with `npm --version` or `yarn --version`
- Code editor: [Visual Studio Code](https://code.visualstudio.com/) recommended
- Basic JavaScript/React knowledge

---

## 🛠 Setup Steps

### 1. Create Vite + React Project

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
````

---

### 2. Install Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

---

### 3. Configure Vite

Edit `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

### 4. Install Fast Average Color

```bash
npm install fast-average-color
```

---

### 5. Add Application Code

Replace the contents of `src/App.jsx` with the following code:

```jsx
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
              <img src={imageSrc} alt="Uploaded" className="object-contain max-w-full max-h-full" />
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

---

### 6. Run the App

```bash
npm run dev
```

Open your browser: [http://localhost:5173](http://localhost:5173)

---

## 💡 Features

* 🎨 **Image Upload**: Extract and display background color
* 🎥 **Video Upload**: Analyze video frames every second
* ⚡ Powered by `fast-average-color`
* 🧁 Styled using `Tailwind CSS`

---

## 🧰 Troubleshooting

* **Images/Videos Not Loading**: Check console for file/CORS issues
* **Tailwind Not Working**: Ensure correct plugin setup in `vite.config.js` and restart dev server
* **Canvas/Color Issues**: Verify `fast-average-color` is installed and browser supports `canvas`
* **Reset**: Try reinstalling dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🛠 Customization

* **Styling**: Modify Tailwind classes in `App.jsx`
* **Enhancements**: Add multiple media previews, theme switching, or save extracted colors
* **Color Data**: Use `rgb`, `hsl`, or `value` from `fac.getColor(...)` object
* **Deployment**: Run `npm run build` and host the `dist` folder on [Netlify](https://netlify.com), [Vercel](https://vercel.com), or [GitHub Pages](https://pages.github.com)

---

## 📚 Resources

* [🔗 Vite Documentation](https://vitejs.dev)
* [🎨 Tailwind CSS Docs](https://tailwindcss.com)
* [🌈 Fast Average Color Docs](https://github.com/fast-average-color/fast-average-color)
* [⚛️ React Docs](https://react.dev)

---

## 🧾 License

MIT — Use, modify, and share freely.

---

```

Let me know if you'd like this content exported to a `.md` file or converted for GitHub Pages, Vercel, or other documentation formats.
```
