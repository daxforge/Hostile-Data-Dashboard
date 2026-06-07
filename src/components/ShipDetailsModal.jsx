import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, HardDrive, ShieldCheck, Zap, Coins, Users, AlertTriangle, Activity } from "lucide-react";
import { formatCredits, getCoreGlowClass, getStatusMeta } from "../utils/helpers";
import { playClick, playSelect, playSuccess, playError, playWarp } from "../utils/synth";
import clsx from "clsx";

const ShipDetailsModal = ({ ship, isOpen, onClose }) => {
  const [jumpInitiated, setJumpInitiated] = useState(false);
  const [jumpProgress, setJumpProgress] = useState(0);
  const [diagLogs, setDiagLogs] = useState([]);
  
  // Real-time telemetry oscilloscope values
  const [oscilloscope, setOscilloscope] = useState([50, 48, 62, 55, 70, 68, 85, 78, 92, 85, 90, 88, 94, 90]);

  // Trigger sound alerts and logs when modal opens
  useEffect(() => {
    if (isOpen && ship) {
      setJumpInitiated(false);
      setJumpProgress(0);
      
      // Play alert chime if vessel has reactor anomalies
      if (ship.isCritical) {
        setTimeout(() => playError(), 150);
      } else {
        setTimeout(() => playClick(), 100);
      }

      setDiagLogs([
        "CONNECTING TO AEGIS REMOTE CORRESPONDING SAT-LINK...",
        "ACQUIRING ENCRYPTED SPEC TELEMETRY CODES...",
      ]);

      const logTemplates = [
        `RESOLVING VESSEL PORT MANUFACTURER: [${ship.manufacturer.toUpperCase()}]`,
        `CHECKING CORE STATUS STABILITY: [${ship.coreType.toUpperCase()}] ENGINE`,
        `CALIBRATING WARP FIELD COILS & PRIMARY SHIELD GENERATOR...`,
        `DIAGNOSTICS COMPLETED. SUB-LINK STATUS: ${ship.status.toUpperCase()}`,
      ];

      logTemplates.forEach((log, idx) => {
        setTimeout(() => {
          setDiagLogs((prev) => [...prev, log]);
        }, (idx + 1) * 800);
      });
    }
  }, [isOpen, ship]);

  // Oscilloscope live simulation loop
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setOscilloscope((prev) => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        // Add random fluctuation with boundary limits
        const delta = (Math.random() - 0.5) * 14;
        const nextVal = Math.min(96, Math.max(15, Math.round(last + delta)));
        return [...next, nextVal];
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Jump sequence oscillator frequency trigger
  useEffect(() => {
    let interval;
    if (jumpInitiated) {
      interval = setInterval(() => {
        setJumpProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            playSuccess();
            setTimeout(() => {
              setJumpInitiated(false);
              setJumpProgress(0);
              onClose();
            }, 1000);
            return 100;
          }
          // Play sweeping synth tone correlated to progress
          playWarp(prev);
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [jumpInitiated, onClose]);

  // Compute SVG spline paths for real-time oscilloscope chart
  const { strokePath, fillPath } = useMemo(() => {
    const width = 260;
    const height = 70;
    const step = width / (oscilloscope.length - 1);
    
    const points = oscilloscope.map((p, idx) => {
      const x = idx * step;
      const y = height - (p / 100) * height;
      return { x, y };
    });

    const stroke = points.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
    const fill = `${stroke} L ${width} ${height} L 0 ${height} Z`;

    return { strokePath: stroke, fillPath: fill };
  }, [oscilloscope]);

  if (!isOpen || !ship) return null;

  const statusMeta = getStatusMeta(ship.status);
  const glowClass = getCoreGlowClass(ship.coreType);

  const handleDismiss = () => {
    playSelect();
    onClose();
  };

  const handleInitiateJump = () => {
    playSelect();
    setJumpInitiated(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="absolute inset-0 bg-[#010309]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className={clsx(
            "glass relative w-full max-w-2xl overflow-hidden rounded-xl border p-6 md:p-8 bg-slate-950/80 shadow-[0_0_50px_rgba(6,182,212,0.18)] cyber-panel",
            ship.isCritical ? "border-red-500/40 cyber-panel-critical" : "border-cyan-500/20"
          )}
        >
          {/* Top warning ribbon if critical */}
          {ship.isCritical && (
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse" />
          )}

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/10 bg-cyan-950/30 text-cyan-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Header details */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="font-share text-3xs tracking-widest text-cyan-400 uppercase">
                Vessel ID Spec: {ship.id.substring(0, 13)}...
              </span>
              <h2 className="text-2xl font-black tracking-wider text-white md:text-3xl mt-1 font-orbitron">
                {ship.name}
              </h2>
            </div>
            
            {/* Status status tag */}
            <div className="flex items-center gap-1.5 self-start md:self-auto rounded-full border px-3.5 py-1 font-share text-2xs font-bold uppercase tracking-wider backdrop-blur-md bg-slate-900/60 border-slate-700/50">
              <span className={clsx("h-2 w-2 rounded-full", statusMeta.dotClass)} />
              <span className="text-gray-200">{statusMeta.text}</span>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Left: Image & Quick Specs */}
            <div className="space-y-4">
              <div className="relative h-48 overflow-hidden rounded-xl border border-cyan-500/15 bg-slate-950/40">
                <img
                  src={ship.image}
                  alt={ship.name}
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-cyan-500/2 to-transparent bg-[size:100%_4px] opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              </div>

              {/* Technical indicators */}
              <div className="grid grid-cols-2 gap-3 font-share text-2xs">
                <div className="rounded-xl border border-slate-500/10 bg-slate-950/50 p-3">
                  <div className="flex items-center gap-1 text-gray-500 uppercase tracking-widest text-3xs mb-1 font-semibold">
                    <Users size={12} className="text-cyan-500" />
                    <span>Crew Capacity</span>
                  </div>
                  <span className="text-sm font-bold text-white">{ship.capacity.toLocaleString()} PAX</span>
                </div>
                <div className="rounded-xl border border-slate-500/10 bg-slate-950/50 p-3">
                  <div className="flex items-center gap-1 text-gray-500 uppercase tracking-widest text-3xs mb-1 font-semibold">
                    <Coins size={12} className="text-emerald-400" />
                    <span>Valuation</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">{formatCredits(ship.price)}</span>
                </div>
              </div>
            </div>

            {/* Right: Telemetry Charts & Logs */}
            <div className="space-y-4">
              
              {/* Real-time Oscilloscope Telemetry Graph */}
              <div className="rounded-xl border border-cyan-500/15 bg-black/60 p-4 font-share relative overflow-hidden h-32 flex flex-col justify-between">
                {/* scanline overlay */}
                <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-cyan-500/1 to-transparent bg-[size:100%_3px] opacity-20" />
                
                <div className="flex items-center justify-between text-3xs text-cyan-400/80 uppercase tracking-wider font-semibold border-b border-cyan-500/10 pb-1 z-10">
                  <span className="flex items-center gap-1">
                    <Activity size={10} className="animate-pulse" />
                    Reactor Telemetry Curve
                  </span>
                  <span className="text-cyan-300 font-mono">Load: {oscilloscope[oscilloscope.length - 1]}%</span>
                </div>

                {/* SVG Graph path */}
                <div className="flex-1 flex items-end justify-center py-2">
                  <svg className="w-full h-[70px]">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(6, 182, 212, 0.25)" />
                        <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                      </linearGradient>
                    </defs>
                    <path d={fillPath} fill="url(#chartGradient)" />
                    <path d={strokePath} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Diagnostics Log Console */}
              <div className="flex flex-col justify-between rounded-xl border border-cyan-500/15 bg-black/75 p-3.5 font-share text-3xs text-cyan-400/80 shadow-inner h-36">
                <div className="space-y-1.5 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-cyan-300">
                      <Cpu size={12} className="animate-spin" style={{ animationDuration: "3s" }} />
                      Diagnostics Console
                    </span>
                    <span className="rounded bg-cyan-950 px-1 py-0.5 text-3xs text-cyan-300 font-semibold">ACTIVE</span>
                  </div>

                  {diagLogs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="leading-relaxed border-l border-cyan-500/20 pl-2 py-0.5 font-mono"
                    >
                      &gt; {log}
                    </motion.div>
                  ))}

                  {diagLogs.length < 6 && (
                    <div className="animate-pulse text-cyan-500/40 pl-2 font-mono">&gt; ACQUIRING ORBITAL TELEMETRY DATASTREAM...</div>
                  )}
                </div>

                {/* Engine core type indicator */}
                <div className="border-t border-cyan-500/15 pt-2 mt-2 flex items-center justify-between text-2xs font-semibold">
                  <span className="text-gray-500">REACTOR TYPE:</span>
                  <span className="font-bold text-cyan-300 uppercase tracking-wider">{ship.coreType} ENGINE</span>
                </div>
              </div>

            </div>

          </div>

          {/* Jump Sequence Interactive Section */}
          <div className="mt-8 border-t border-cyan-500/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Warning tag */}
            {ship.isCritical ? (
              <div className="flex items-center gap-2 text-red-400 font-share text-2xs uppercase tracking-wider font-semibold">
                <AlertTriangle size={14} className="animate-pulse shrink-0" />
                <span>Reactor overloaded. Hyperjump failsafe overridden.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-cyan-400 font-share text-2xs uppercase tracking-wider font-semibold">
                <ShieldCheck size={14} className="shrink-0" />
                <span>All telemetry systems within standard deviation thresholds.</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto font-share">
              <button
                onClick={handleDismiss}
                disabled={jumpInitiated}
                className="flex-1 sm:flex-initial rounded-lg border border-slate-500/20 hover:border-slate-500/40 bg-slate-900/30 hover:bg-slate-900/70 px-4 py-2 text-2xs font-bold text-gray-300 transition-colors duration-200 cursor-pointer disabled:opacity-50 uppercase tracking-widest"
              >
                DISMISS
              </button>

              <button
                onClick={handleInitiateJump}
                disabled={jumpInitiated}
                className={clsx(
                  "flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-2xs font-bold text-white transition-all duration-300 relative overflow-hidden cursor-pointer uppercase tracking-widest shadow-lg",
                  ship.isCritical
                    ? "bg-gradient-to-r from-red-600 to-orange-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-103"
                    : "bg-gradient-to-r from-cyan-500 to-sky-600 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-103"
                )}
              >
                {jumpInitiated ? (
                  <>
                    <Zap size={12} className="animate-bounce" />
                    <span>JUMPING: {jumpProgress}%</span>
                  </>
                ) : (
                  <>
                    <Zap size={12} />
                    <span>INITIATE HYPERJUMP</span>
                  </>
                )}

                {/* Progress bar inside button */}
                {jumpInitiated && (
                  <div
                    className="absolute bottom-0 left-0 h-[3px] bg-white opacity-50 transition-all duration-150"
                    style={{ width: `${jumpProgress}%` }}
                  />
                )}
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShipDetailsModal;
