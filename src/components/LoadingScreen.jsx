import { useState, useEffect } from "react";
import { Terminal, Database } from "lucide-react";
import { motion } from "framer-motion";

const logSteps = [
  "INITIALIZING AEGIS DATABASE COMM-LINK...",
  "HANDSHAKING SYSTEM DECRYPTION CODES...",
  "PARSING VESSEL STRUCTURAL BLUEPRINTS...",
  "NORMALIZING IRREGULAR RECTOR LOGS...",
  "SCANNING INTERSTELLAR QUANTUM CORES...",
  "DECRYPTING ANOMALOUS PLASMA EMISSIONS...",
  "CONSTRUCTING HOLOGRAM TELEMETRY CONSOLE...",
  "READY FOR DEPLOYMENT.",
];

const LoadingScreen = () => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  // Simulating console log lines typing
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < logSteps.length) {
        setLogs((prev) => [...prev, logSteps[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  // Simulating loader progress count up
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const delta = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + delta);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040a] font-mono">
      {/* Background neon elements */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Futuristic vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.9)_100%)]" />

      {/* Console frame */}
      <div className="glass max-w-xl w-full mx-4 rounded-2xl border border-cyan-500/20 p-6 md:p-8 bg-black/60 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 relative overflow-hidden">
        
        {/* Hologram scanline */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-cyan-500/1 to-transparent bg-[size:100%_4px] opacity-35" />

        {/* Loading Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <Database className="text-cyan-400 animate-pulse" size={22} />
            <div>
              <h2 className="text-base font-bold text-white tracking-widest uppercase">
                CORESYNC BOOTLOADER
              </h2>
              <p className="text-3xs text-cyan-500/70 tracking-widest uppercase mt-0.5">
                SECURE SAT-LINK CHANNEL
              </p>
            </div>
          </div>
          <span className="text-sm font-bold text-cyan-400 tracking-wider">
            {progress}%
          </span>
        </div>

        {/* Rotating Circular HUD Loader */}
        <div className="flex justify-center py-6">
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Outer dotted loader ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dotted border-cyan-500/30"
            />
            {/* Inner neon loader ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-2 rounded-full border-t-2 border-r-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            />
            {/* Inner stability indicator */}
            <Terminal size={22} className="text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Console Logs Datastream */}
        <div className="rounded-xl border border-cyan-500/10 bg-black/60 p-4 min-h-36 text-3xs text-cyan-400/80 shadow-inner flex flex-col justify-end space-y-1.5 overflow-hidden">
          {logs.map((log, index) => (
            <div key={index} className="leading-relaxed truncate border-l border-cyan-500/30 pl-2">
              &gt; {log}
            </div>
          ))}
          {progress < 100 && (
            <div className="animate-pulse text-cyan-500/40 pl-2">
              &gt; DECRYPTING FLUX FREQUENCY: {progress * 74} MHz...
            </div>
          )}
        </div>

        {/* Progress Bar Loader */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-500/5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
