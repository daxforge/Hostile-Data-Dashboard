import ReactCountUp from "react-countup";
import { Shield, ShieldAlert, Cpu, Orbit } from "lucide-react";
import { motion } from "framer-motion";
import { playClick } from "../utils/synth";

const CountUp = typeof ReactCountUp === "function" ? ReactCountUp : (ReactCountUp?.default || ReactCountUp);

const StatsBar = ({ ships }) => {
  const total = ships.length;
  const critical = ships.filter((s) => s.isCritical).length;
  const normalCount = total - critical;

  const operationalPercent = total ? Math.round(((total - critical) / total) * 100) : 100;
  const anomalyPercent = total ? Math.round((critical / total) * 100) : 0;

  // SVG parameters for radial progress circle
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  
  const getDashOffset = (percent) => {
    return circumference - (percent / 100) * circumference;
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
      
      {/* Card 1: Total Fleet Size */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        onMouseEnter={() => playClick()}
        className="glass cyber-panel relative overflow-hidden rounded-xl p-5 border border-cyan-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:border-cyan-500/35 transition-all duration-300"
      >
        <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron text-2xs uppercase tracking-widest text-cyan-400 font-bold">
            Total Fleet Size
          </h3>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu size={16} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-white font-orbitron">
              <CountUp end={total} duration={1.5} />
            </span>
            <span className="font-share text-3xs text-gray-500 uppercase tracking-wider">Registered Vessels</span>
          </div>

          {/* Mini dynamic radial meter */}
          <div className="relative h-14 w-14 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle cx="28" cy="28" r={radius} className="stroke-cyan-950/40 fill-none" strokeWidth="3" />
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-cyan-500 fill-none transition-all duration-1000 ease-out"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={getDashOffset(100)}
                strokeLinecap="round"
              />
            </svg>
            <Orbit className="absolute text-cyan-400/80 animate-spin" size={16} style={{ animationDuration: "12s" }} />
          </div>
        </div>

        {/* Dynamic Telemetry Status line */}
        <div className="mt-4 space-y-1.5 border-t border-cyan-500/5 pt-3">
          <div className="flex items-center justify-between text-3xs font-share text-gray-400">
            <span>DATABASE SYNC</span>
            <span className="text-cyan-400 font-bold">100% OPERATIONAL</span>
          </div>
          <div className="h-1 w-full bg-cyan-950/40 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full" style={{ width: "100%" }} />
          </div>
        </div>
      </motion.div>

      {/* Card 2: Critical Core Alerts */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        onMouseEnter={() => playClick()}
        className={`glass relative overflow-hidden rounded-xl p-5 border shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${
          critical > 0 
            ? "border-red-500/30 hover:border-red-500/50 cyber-panel-critical shadow-red-950/20" 
            : "border-cyan-500/15 hover:border-cyan-500/35 cyber-panel"
        }`}
      >
        <div className={`absolute top-0 right-0 h-28 w-28 rounded-full blur-2xl pointer-events-none ${critical > 0 ? "bg-red-500/5" : "bg-cyan-500/5"}`} />
        
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-orbitron text-2xs uppercase tracking-widest font-bold ${critical > 0 ? "text-red-400" : "text-gray-400"}`}>
            Critical Core Alerts
          </h3>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
            critical > 0 
              ? "bg-red-500/10 text-red-400 border-red-500/30" 
              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
          }`}>
            <ShieldAlert size={16} className={critical > 0 ? "animate-pulse" : ""} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold tracking-tight font-orbitron ${critical > 0 ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" : "text-gray-300"}`}>
              <CountUp end={critical} duration={1.5} />
            </span>
            <span className="font-share text-3xs text-gray-500 uppercase tracking-wider">Vessel Overloads</span>
          </div>

          {/* Radial Indicator */}
          <div className="relative h-14 w-14 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle cx="28" cy="28" r={radius} className="stroke-slate-900/60 fill-none" strokeWidth="3" />
              <circle
                cx="28"
                cy="28"
                r={radius}
                className={`fill-none transition-all duration-1000 ease-out ${critical > 0 ? "stroke-red-500" : "stroke-cyan-500/40"}`}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={getDashOffset(anomalyPercent)}
                strokeLinecap="round"
              />
            </svg>
            <ShieldAlert className={`absolute ${critical > 0 ? "text-red-400 animate-pulse" : "text-cyan-500/30"}`} size={16} />
          </div>
        </div>

        <div className="mt-4 space-y-1.5 border-t border-cyan-500/5 pt-3">
          <div className="flex items-center justify-between text-3xs font-share text-gray-400">
            <span>CONTAINMENT RISK RATIO</span>
            <span className={critical > 0 ? "text-red-400 font-bold" : "text-gray-400 font-bold"}>
              {anomalyPercent}% COMPROMISED
            </span>
          </div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${critical > 0 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-cyan-500"}`}
              style={{ width: `${anomalyPercent}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Card 3: System Integrity */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        onMouseEnter={() => playClick()}
        className="glass cyber-panel relative overflow-hidden rounded-xl p-5 border border-emerald-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/35 transition-all duration-300"
      >
        <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron text-2xs uppercase tracking-widest text-emerald-400 font-bold">
            System Integrity
          </h3>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield size={16} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-emerald-400 font-orbitron">
              <CountUp end={operationalPercent} suffix="%" duration={1.5} />
            </span>
            <span className="font-share text-3xs text-gray-500 uppercase tracking-wider">
              {critical > 0 ? "VULNERABLE" : "STABLE STATE"}
            </span>
          </div>

          {/* Radial Indicator */}
          <div className="relative h-14 w-14 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle cx="28" cy="28" r={radius} className="stroke-emerald-950/40 fill-none" strokeWidth="3" />
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-emerald-400 fill-none transition-all duration-1000 ease-out"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={getDashOffset(operationalPercent)}
                strokeLinecap="round"
              />
            </svg>
            <Shield className="absolute text-emerald-400" size={16} />
          </div>
        </div>

        <div className="mt-4 space-y-1.5 border-t border-cyan-500/5 pt-3">
          <div className="flex items-center justify-between text-3xs font-share text-gray-400">
            <span>ONLINE DYNAMIC CAPABILITY</span>
            <span className="text-emerald-400 font-bold">{normalCount} / {total} ACTIVE</span>
          </div>
          <div className="h-1 w-full bg-emerald-950/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${operationalPercent}%` }}
            />
          </div>
        </div>
      </motion.div>
      
    </div>
  );
};

export default StatsBar;
