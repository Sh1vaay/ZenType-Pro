# ⚡ ZenType Pro: The Next-Gen Progressive Typing Tutor [v1.0]

[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=for-the-badge)](./LICENSE.md)

> **Master the art of touch typing through gamification, neural analytics, and a scientifically structured curriculum.**

---

## 📑 Table of Contents
- [📖 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#%EF%B8%8F-tech-stack--architecture)
- [🚀 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [🧠 Core Concepts](#-core-concepts)
- [🔮 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)

---

## 📖 Project Overview

**ZenType Pro** is not just another typing test. It is a comprehensive **Type-Training Platform** designed to break users out of "hunt and peck" habits and build muscle memory through incremental difficulty.

Unlike standard tutors that offer random paragraphs, ZenType uses a **Progressive Overload** methodology:
1.  **Isolation**: Start with single letters and home row keys.
2.  **Integration**: Move to digraphs (common letter pairs like "th", "er").
3.  **Application**: Type full words, then code snippets, and finally complex prose.

The application operates entirely **Client-Side** (Offline First), ensuring maximum privacy and 0ms latency input responsiveness.

---

## ✨ Key Features

### 🎮 **Gamified Progression**
-   **XP System**: Earn Experience Points for every correct character typed.
-   **Leveling**: Scale from *Novice* to *Grandmaster* as you accumulate XP.
-   **Economy**: Earn "TypeCoins" (TC) to purchase cosmetic upgrades in the Shop.
-   **Streaks**: Daily login tracking to encourage consistency.

### 📊 **Neural Analytics Engine**
-   **Heatmaps**: Real-time visual overlay on the virtual keyboard showing "Hot" (fast) and "Cold" (slow/error-prone) keys.
-   **Consistency Score**: Uses standard deviation of keystroke latency to measure rhythm stability, not just raw speed.
-   **Trend Analysis**: Linear graphs showing WPM and Accuracy over the last 50 sessions.

### ⚔️ **Diverse Game Modes**
-   **Classic Campaign**: 8-Curated Levels taking you from "asdf" to full paragraphs.
-   **Sudden Death**: One mistake ends the run immediately. High risk, high reward.
-   **Code Mode**: Practice real-world syntax for Python, JavaScript, and C++.
-   **Blind Mode**: The text fades away as you type, forcing you to trust your muscle memory.
-   **Zen Mode**: No timers, no scores. Just you and the flow.

### 🎨 **Total Customization**
-   **10+ Themes**: From *Dracula* and *Cyberpunk* to *Aurora* and *Glassmorphism*.
-   **Sound Packs**: Mechanical switch sounds (Blue, Brown, Red), Typewriter, and specialized UI sounds.
-   **Visual Toggles**: Adjust caret styles, font families (Monospace/Sans/Serif), and UI density.

---

## 🛠️ Tech Stack & Architecture

This project utilizes a modern, opinionated stack for maximum performance and developer experience.

| Technology | Usage | Reasoning |
| :--- | :--- | :--- |
| **React 19** | UI Framework | Leverages the new concurrent features and rigid component lifecycle for predictable state updates. |
| **TypeScript** | Language | Ensuring type safety across complex data structures like `UserStats` and `KeystrokeEvent`. |
| **Vite** | Build Tool | Chosen for its HMR (Hot Module Replacement) speed and efficient ESBuild compilation. |
| **Tailwind CSS** | Styling | Atomic CSS allows for rapid UI iteration and a consistent design system without style conflicts. |
| **Framer Motion** | Animations | Hardware-accelerated layout transitions (60fps) for the keyboard and modal interactions. |
| **Recharts** | Visualization | Composable charting library to render the complex analytics data svg-side. |
| **Lucide React** | Icons | Lightweight, consistent SVG icon set for the UI. |

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites
-   **Node.js**: v18.0.0 or higher is required.
-   **npm**: v9.0.0 or higher (usually comes with Node).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/zentype-pro.git
    cd zentype-pro
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # This will read the package.json and install all necessary node_modules
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Access the App**
    Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

A clean "Source-First" architecture is used to separate concerns.

```tree
/
├── public/                  # Static assets (images, sounds, favicons)
├── src/
│   ├── components/          # Reusable React components
│   │   ├── TypingArea.tsx       # Core game loop & input capture
│   │   ├── VirtualKeyboard.tsx  # Visual keyboard & heatmap renderer
│   │   ├── AnalyticsDashboard.tsx # Stats & graphs container
│   │   └── ...
│   ├── services/            # Pure logic & helper functions
│   │   └── soundEngine.ts       # Audio context & asset management
│   ├── App.tsx              # Main application controller & state holder
│   ├── constants.tsx        # Static data (Level text, quotes)
│   ├── types.ts             # TypeScript interfaces (The DNA of the app)
│   ├── index.tsx            # Application entry point
│   └── index.css            # Global styles & Tailwind directives
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

---

## 🧠 Core Concepts

### The "Game Loop"
Unlike standard CRUD apps, ZenType Pro runs a tight loop:
1.  **Input**: User presses a key.
2.  **Validation**: `TypingArea` compares input vs target at index $i$.
3.  **Feedback**:
    -   **Audio**: Sound plays.
    -   **Visual**: Character changes color (Green/Red).
    -   **Data**: Latency (ms) is pushed to the `latencyHistory` array.
4.  **Completion**: When $i == length$, the session ends and stats are aggregated.

### Persistence
The app uses a `localStorage` sync pattern.
-   **Load**: On mount, `App.tsx` hydrates state from `localStorage`.
-   **Save**: `useEffect` hooks listen for changes in `userStats` and write back to storage.
-   **Benefit**: Users can refresh or close the tab without losing their Level, XP, or History.

---

## 🔮 Roadmap

-   [ ] **Multiplayer Race Mode**: WebSocket implementation for 1v1 battles.
-   [ ] **Cloud Sync**: Firebase integration for cross-device progress.
-   [ ] **Custom Lessons**: Drag-and-drop support for `.txt` or `.md` files.
-   [ ] **Accessibility**: Enhanced screen reader support and WCAG 2.1 compliance.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

*Built with ❤️ by a Developer who loves Typography.*
