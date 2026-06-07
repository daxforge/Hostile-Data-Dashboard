# 🌌 Aegis Fleet Control: Interstellar Command Console
### *Hostile Data Dashboard & Satellite Telemetry Portal*

Aegis Fleet Control is an immersive, high-fidelity React-based dashboard simulating an orbital military command center. It establishes secure satellite links to track, filter, and inspect **50 space vessels** orbiting deep space coordinate grids. Featuring interactive **Tactical Radar grids**, real-time **oscilloscope telemetry charts**, and custom **Web Audio API synthesizers**, this dashboard provides a complete science fiction telemetry console experience.

---

## 🚀 Key Features

*   **🛰️ Real-Time Tactical Radar Grid**: An interactive, dynamic SVG radar scan plotting concentric orbits, degree lines, and coordinate rays. All 50 ships are plotted as glowing nodes, color-coded by their stability status:
    *   🟢 **Green**: Active & Operational vessels.
    *   🟡 **Amber**: maintenance / standby status.
    *   🔴 **Red**: Critical core overloads.
    *   🔵 **Cyan**: Plasma-reactor powered grids.
*   **📈 Oscilloscope Telemetry Curves**: An animated real-time SVG spline chart displaying reactor thermal loads, warp coil stability, and core output inside the details modal.
*   **🎹 Interactive Web Audio Synthesizer**: A native browser-synthesized console clicker and warning hum system. It generates realistic electronic feedback using browser `AudioContext` oscillators (no media assets or network bandwidth needed):
    *   *Subtle clicks* on navbar and card hovers.
    *   *Frequency sweeps* tracking hyperjump progress meters.
    *   *Low-frequency warnings* for vessel overloads.
    *   *Chimes* for selector clicks and successful handshakes.
    *   Includes a global mute/unmute control with state preservation.
*   **📡 Deterministic Galactic Graphics**: Curates 12 distinct space stations, nebulas, cockpit consoles, and galactic anomalies mapped deterministically to ship IDs so every vessel has a unique, high-resolution aesthetic.
*   **📊 Integrated Integrity HUD**: Dynamic statistics cards showing fleet size, active anomaly ratios, and system integrity gauges using animated circular progress rings.
*   **🎭 Immersive Telemetry Loader**: A console bootloader terminal simulating boot routines, decrypting satellite handshakes, and compiling orbital blueprints.

---

## 🛠️ Technology Stack

*   **Core**: React 19 & Vite
*   **Styling**: Tailwind CSS v4 & Vanilla CSS (with custom cybernetic panel corner brackets, pulse animations, and scanline shaders)
*   **Animations**: Framer Motion
*   **Icons & Numbers**: Lucide React & React CountUp
*   **Networking**: Axios (with Vite local development proxy)

---

## 📂 Project Structure

```bash
TASK1 PROJECT/
├── public/                 # Static assets & index targets
├── src/
│   ├── api/
│   │   └── shipsApi.js     # Satellite API communications
│   ├── components/
│   │   ├── AlertBanner.jsx # Critical overload warnings
│   │   ├── BackgroundEffects.jsx # Space dust, vignettes, and scanlines
│   │   ├── ErrorFallback.jsx   # Sat-link offline handshake timeout panel
│   │   ├── LoadingScreen.jsx   # Rotating circular bootloader HUD
│   │   ├── Navbar.jsx      # Telemetry clocks, core integrity indicators, and mute toggles
│   │   ├── ShipCard.jsx    # Custom glowing clip-path card console
│   │   ├── ShipGrid.jsx    # Main view toggle (Grid Console vs. Tactical Radar)
│   │   ├── ShipDetailsModal.jsx # Oscilloscope chart and hyperjump sweep controls
│   │   └── StatsBar.jsx    # SVG radial gauges and metrics
│   ├── pages/
│   │   └── Dashboard.jsx   # Main view router
│   ├── utils/
│   │   ├── helpers.js      # Credit formatters, image arrays, and core glow utilities
│   │   ├── normalizeShip.js# API schema cleaners
│   │   └── synth.js        # Pure JS AudioContext synthesizer
│   ├── App.jsx             # Entry renderer
│   ├── index.css           # Custom sci-fi keyframe animations, glows, and scrollbars
│   └── main.jsx
├── index.html              # Custom sci-fi font loads (Orbitron & Share Tech Mono)
├── vite.config.js          # CORS proxy bypass target configuration
└── package.json
```

---

## ⚙️ Local Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/daxforge/Hostile-Data-Dashboard.git
    cd Hostile-Data-Dashboard
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Launch Local Console**:
    ```bash
    npm run dev
    ```
    *The app will boot up on [http://localhost:5173/](http://localhost:5173/).*

4.  **Build Production Assets**:
    ```bash
    npm run build
    ```

---

## 🌐 Public Live Deployment

This client application compiles into static JavaScript chunks and can be deployed directly to Vercel or Netlify.

### Deploy to Vercel in 10 seconds:
```bash
npx vercel
```
*Follow the wizard instructions to log in and publish your command portal directly onto the web.*
