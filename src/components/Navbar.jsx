import { useState, useEffect } from "react";
import { Terminal, Shield, Wifi, Volume2, VolumeX, Radio } from "lucide-react";
import { playClick, playSelect, getMuteState, setMuteState } from "../utils/synth";

const Navbar = () => {
  const [time, setTime] = useState(new Date());
  const [stability, setStability] = useState(99.42);
  const [muted, setMuted] = useState(getMuteState());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const stabTimer = setInterval(() => {
      // Simulate minor quantum stability fluctuations
      setStability((prev) => {
        const delta = (Math.random() - 0.5) * 0.05;
        const next = prev + delta;
        return parseFloat(Math.min(100, Math.max(98.5, next)).toFixed(2));
      });
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(stabTimer);
    };
  }, []);

  const handleToggleMute = () => {
    const newState = !muted;
    setMuted(newState);
    setMuteState(newState);
    if (!newState) {
      setTimeout(() => playSelect(), 50);
    }
  };

  const formatSystemTime = (date) => {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const getSystemDate = (date) => {
    const year = date.getFullYear() + 200; // Future galactic year
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `SD-${year}.${month}.${day}`;
  };

  return (
    <nav className="glass sticky top-0 z-40 w-full border-b border-cyan-500/15 px-6 py-3.5 backdrop-blur-md shadow-[0_4px_20px_rgba(3,6,17,0.6)]">
      {/* Top micro-line indicator */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Brand/Console Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/35 bg-cyan-950/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Terminal size={20} className="animate-pulse" />
            <div className="absolute inset-0 rounded-lg bg-cyan-500/5 blur-xs" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 font-orbitron uppercase">
              Aegis Command
            </h1>
            <p className="text-3xs font-semibold tracking-widest text-cyan-500/70 font-share uppercase">
              Fleet Database Console
            </p>
          </div>
        </div>

        {/* Real-time Telemetry Stats & Controls */}
        <div className="flex flex-wrap items-center gap-4 font-share text-xs text-gray-400">
          
          {/* Galactic Clock */}
          <div className="flex items-center gap-2 rounded-md border border-cyan-500/10 bg-cyan-950/15 px-3 py-1.5 shadow-[inset_0_1px_4px_rgba(6,182,212,0.05)]">
            <Radio size={14} className="text-indigo-400 animate-pulse" />
            <span className="text-indigo-300">{getSystemDate(time)}</span>
            <span className="text-gray-500">|</span>
            <span className="font-semibold text-cyan-400 tracking-wider">
              {formatSystemTime(time)}
            </span>
          </div>

          {/* System Stability */}
          <div className="flex items-center gap-2 rounded-md border border-cyan-500/10 bg-cyan-950/15 px-3 py-1.5 shadow-[inset_0_1px_4px_rgba(6,182,212,0.05)]">
            <Shield size={14} className="text-emerald-400" />
            <span>CORE STABILITY:</span>
            <span className="font-bold text-emerald-400">{stability}%</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 rounded-md border border-cyan-500/10 bg-cyan-950/15 px-3 py-1.5 shadow-[inset_0_1px_4px_rgba(6,182,212,0.05)]">
            <Wifi size={14} className="text-cyan-400 animate-pulse" />
            <span>LINK:</span>
            <span className="font-bold text-cyan-300">SECURE</span>
          </div>

          {/* Audio Synthesizer Controller Toggle */}
          <button
            onClick={handleToggleMute}
            onMouseEnter={() => playClick()}
            className={`flex items-center justify-center p-1.5 rounded-md border transition-all duration-300 cursor-pointer ${
              muted
                ? "border-red-500/20 bg-red-950/10 text-red-400 hover:border-red-500/40"
                : "border-cyan-500/20 bg-cyan-950/10 text-cyan-400 hover:border-cyan-500/50"
            }`}
            title={muted ? "Unmute interface sound effects" : "Mute interface sound effects"}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
