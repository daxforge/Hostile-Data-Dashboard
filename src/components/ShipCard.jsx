import { motion } from "framer-motion";
import { Cpu, Users, Coins, Eye, ShieldAlert, Zap } from "lucide-react";
import clsx from "clsx";
import { formatCredits, getCoreGlowClass, getStatusMeta } from "../utils/helpers";
import { playClick, playSelect } from "../utils/synth";

const ShipCard = ({ ship, onViewDetails }) => {
  const statusMeta = getStatusMeta(ship.status);
  const glowClass = getCoreGlowClass(ship.coreType);

  // Map engine type to dynamic color schemes for absolute hover borders
  const getHoverBorderClass = (coreType = "", isCritical) => {
    if (isCritical) return "group-hover:border-red-500/80 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]";
    const type = coreType.toLowerCase();
    if (type.includes("plasma")) return "group-hover:border-cyan-500/70 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]";
    if (type.includes("ion") || type.includes("nuclear")) return "group-hover:border-blue-500/70 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]";
    if (type.includes("fusion") || type.includes("warp") || type.includes("antimatter")) {
      return "group-hover:border-purple-500/70 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]";
    }
    return "group-hover:border-cyan-500/40 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]";
  };

  const hoverBorder = getHoverBorderClass(ship.coreType, ship.isCritical);

  const handleInspectClick = () => {
    playSelect();
    onViewDetails(ship);
  };

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.015,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      onMouseEnter={() => playClick()}
      className={clsx(
        "glass flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-300 shadow-lg relative group",
        ship.isCritical
          ? "border-red-500/40 shadow-red-500/5 bg-red-950/5 animate-pulseAlert cyber-panel-critical"
          : "border-cyan-500/15 bg-slate-950/20 cyber-panel",
        hoverBorder
      )}
    >
      {/* Corner bracket neon overlays */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Upper Section */}
      <div>
        {/* Hologram Card Image Container */}
        <div className="relative h-44 overflow-hidden bg-slate-900">
          <img
            src={ship.image}
            alt={ship.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-80 group-hover:opacity-100"
            loading="lazy"
          />
          {/* Card Overlay Scanlines */}
          <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-cyan-500/2 to-transparent bg-[size:100%_5px] opacity-40" />

          {/* HUD Target crosshair detail */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500 flex items-center justify-center">
            <div className="w-12 h-12 border border-dashed border-cyan-400 rounded-full animate-spin" style={{ animationDuration: "10s" }} />
            <div className="absolute w-2 h-[1px] bg-cyan-400" />
            <div className="absolute h-2 w-[1px] bg-cyan-400" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-share text-3xs font-medium uppercase tracking-wider backdrop-blur-md bg-slate-950/70 border-slate-500/30">
            <span className={clsx("h-1.5 w-1.5 rounded-full", statusMeta.dotClass)} />
            <span className="text-gray-200">{statusMeta.text}</span>
          </div>

          {/* Critical Alarm Flag */}
          {ship.isCritical && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md border border-red-500 bg-red-600/90 px-2 py-0.5 font-share text-3xs font-bold text-white shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse">
              <ShieldAlert size={10} />
              <span>CORE OVERLOAD</span>
            </div>
          )}

          {/* Holographic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#02040b] via-[#02040b]/15 to-transparent opacity-90" />
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-3.5">
          <div>
            <h2 className="text-base font-bold tracking-wider text-white group-hover:text-cyan-300 font-orbitron transition-colors duration-200 truncate">
              {ship.name}
            </h2>
            <p className="font-share text-3xs tracking-widest text-cyan-500/50 uppercase mt-0.5">
              Maker: {ship.manufacturer}
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 font-share text-2xs">
            {/* Passenger Cap */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-500/10 bg-slate-950/40 p-2 text-center group-hover:bg-cyan-950/5 group-hover:border-cyan-500/5 transition-all duration-300">
              <Users size={13} className="text-slate-400 mb-1 group-hover:text-cyan-400" />
              <span className="text-gray-500 block text-3xs uppercase tracking-wider scale-90 mb-0.5">Crew</span>
              <span className="font-bold text-gray-200 group-hover:text-white">{ship.capacity.toLocaleString()}</span>
            </div>

            {/* Core engine type */}
            <div className={clsx("flex flex-col items-center justify-center rounded-lg border bg-slate-950/40 p-2 text-center transition-all duration-300", glowClass)}>
              <Cpu size={13} className="mb-1" />
              <span className="text-gray-500 block text-3xs uppercase tracking-wider scale-90 mb-0.5">Core</span>
              <span className="font-bold truncate max-w-full uppercase text-2xs">{ship.coreType}</span>
            </div>

            {/* Vessel Value */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-500/10 bg-slate-950/40 p-2 text-center group-hover:bg-cyan-950/5 group-hover:border-cyan-500/5 transition-all duration-300">
              <Zap size={13} className="text-slate-400 mb-1 group-hover:text-cyan-400" />
              <span className="text-gray-500 block text-3xs uppercase tracking-wider scale-90 mb-0.5">Value</span>
              <span className="font-bold text-gray-200 group-hover:text-white">
                {ship.price >= 1e6 ? `${(ship.price / 1e6).toFixed(1)}M` : ship.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Action */}
      <div className="px-4 pb-4">
        <button
          onClick={handleInspectClick}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-950/15 hover:bg-cyan-500/15 border border-cyan-500/20 hover:border-cyan-400/60 py-2 font-share text-2xs font-bold text-cyan-400 hover:text-white transition-all duration-300 cursor-pointer shadow-[inset_0_1px_4px_rgba(6,182,212,0.05)]"
        >
          <Eye size={12} />
          <span>INSPECT TELEMETRY</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ShipCard;
