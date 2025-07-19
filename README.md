
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

> *(Tip: Copy the complete App.jsx code block from the implementation you shared and paste it here.)*

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



