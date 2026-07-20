import { useState, useMemo } from "react";
import ShipCard from "./ShipCard";
import { Search, SlidersHorizontal, ArrowUpDown, ShieldX, LayoutGrid, Radar, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playClick, playSelect } from "../utils/synth";
import { formatCredits } from "../utils/helpers";

const ShipGrid = ({ ships, onViewDetails }) => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "radar"
  const [search, setSearch] = useState("");
  const [selectedCore, setSelectedCore] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  // Selected node for radar detail tooltip
  const [hoveredNode, setHoveredNode] = useState(null);

  // Extract unique core types and statuses for dynamic filters
  const coreTypes = useMemo(() => {
    const cores = new Set(ships.map((s) => s.coreType?.toLowerCase()).filter(Boolean));
    return ["all", ...Array.from(cores)];
  }, [ships]);

  const statuses = useMemo(() => {
    const stats = new Set(ships.map((s) => s.status?.toLowerCase()).filter(Boolean));
    return ["all", ...Array.from(stats)];
  }, [ships]);

  // Filter & Sort logic
  const filteredShips = useMemo(() => {
    return ships
      .filter((ship) => {
        const matchesSearch =
          ship.name.toLowerCase().includes(search.toLowerCase()) ||
          ship.manufacturer.toLowerCase().includes(search.toLowerCase());

        const matchesCore =
          selectedCore === "all" || ship.coreType?.toLowerCase() === selectedCore;

        const matchesStatus =
          selectedStatus === "all" || ship.status?.toLowerCase() === selectedStatus;

        return matchesSearch && matchesCore && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "capacity") return b.capacity - a.capacity;
        if (sortBy === "price") return b.price - a.price;
        return 0;
      });
  }, [ships, search, selectedCore, selectedStatus, sortBy]);

  // Map filtered ships to circular coordinate systems for the Tactical Radar map
  const radarNodes = useMemo(() => {
    return filteredShips.map((ship) => {
      // Deterministic polar conversion coordinates
      let hash = 0;
      const keyStr = ship.id + ship.name;
      for (let i = 0; i < keyStr.length; i++) {
        hash = keyStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
      // Radar range radius from 55px to 215px (within 500x500 screen coordinate, center is 250, 250)
      const baseRadius = 55 + (Math.abs(hash >> 4) % 165);
      const x = 250 + baseRadius * Math.cos(angle);
      const y = 250 + baseRadius * Math.sin(angle);

      return {
        ship,
        x,
        y,
        radius: baseRadius,
        angleDeg: Math.abs(hash) % 360,
      };
    });
  }, [filteredShips]);

  const handleToggleView = (mode) => {
    playSelect();
    setViewMode(mode);
  };

  return (
    <div className="space-y-6">
      
      {/* HUD Filter Control Panel */}
      <div className="glass rounded-xl border border-cyan-500/15 p-5 bg-slate-950/20 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search telemetry */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-cyan-500/50">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Query vessel log by designation or maker..."
              className="w-full rounded-lg border border-cyan-500/15 bg-slate-950/50 py-2.5 pl-10 pr-4 text-xs font-share text-cyan-100 placeholder-cyan-500/30 focus:border-cyan-400 focus:outline-hidden focus:ring-1 focus:ring-cyan-400/20 transition-all duration-300 shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]"
            />
          </div>

          {/* Controls & Mode Switches */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Core select */}
            <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/15 bg-slate-950/40 px-3 py-2">
              <SlidersHorizontal size={12} className="text-cyan-500" />
              <select
                value={selectedCore}
                onChange={(e) => setSelectedCore(e.target.value)}
                className="bg-transparent font-share text-2xs text-cyan-400 outline-hidden cursor-pointer uppercase tracking-wider font-semibold"
              >
                <option value="all">ALL CORES</option>
                {coreTypes.filter(c => c !== "all").map((core) => (
                  <option key={core} value={core} className="bg-[#02040b] text-gray-300">
                    {core.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Status select */}
            <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/15 bg-slate-950/40 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent font-share text-2xs text-cyan-400 outline-hidden cursor-pointer uppercase tracking-wider font-semibold"
              >
                <option value="all">ALL STATUSES</option>
                {statuses.filter(s => s !== "all").map((status) => (
                  <option key={status} value={status} className="bg-[#02040b] text-gray-300">
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/15 bg-slate-950/40 px-3 py-2">
              <ArrowUpDown size={12} className="text-cyan-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-share text-2xs text-cyan-400 outline-hidden cursor-pointer uppercase tracking-wider font-semibold"
              >
                <option value="name" className="bg-[#02040b] text-gray-300">SORT BY NAME</option>
                <option value="capacity" className="bg-[#02040b] text-gray-300">SORT BY CAPACITY</option>
                <option value="price" className="bg-[#02040b] text-gray-300">SORT BY VALUE</option>
              </select>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center border border-cyan-500/20 rounded-lg p-0.5 bg-slate-950/50">
              <button
                onClick={() => handleToggleView("grid")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-2xs font-share font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-cyan-500/20 text-white border border-cyan-500/30"
                    : "text-cyan-500/60 hover:text-cyan-400"
                }`}
              >
                <LayoutGrid size={12} />
                <span>Grid Console</span>
              </button>
              <button
                onClick={() => handleToggleView("radar")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-2xs font-share font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  viewMode === "radar"
                    ? "bg-cyan-500/20 text-white border border-cyan-500/30"
                    : "text-cyan-500/60 hover:text-cyan-400"
                }`}
              >
                <Radar size={12} />
                <span>Tactical Radar</span>
              </button>
            </div>

          </div>
        </div>

        {/* Search status diagnostics banner */}
        <div className="mt-3.5 flex items-center justify-between font-share text-3xs text-cyan-500/50 uppercase tracking-widest border-t border-cyan-500/5 pt-3">
          <span>Telemetry Link Query Status: ONLINE</span>
          <span>Matched Vessels: {filteredShips.length} of {ships.length}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {filteredShips.length > 0 ? (
          viewMode === "grid" ? (
            /* Grid View */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8"
            >
              {filteredShips.map((ship) => (
                <ShipCard key={ship.id} ship={ship} onViewDetails={onViewDetails} />
              ))}
            </motion.div>
          ) : (
            /* Tactical Radar Map View */
            <motion.div
              key="radar-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 lg:grid-cols-3 mt-8"
            >
              {/* Radar Screen Area (Left 2 Columns) */}
              <div className="lg:col-span-2 glass rounded-xl border border-cyan-500/15 p-6 flex flex-col items-center justify-center bg-black/40 min-h-[520px] relative overflow-hidden">
                {/* Conic Sweep Light animation */}
                <div
                  className="absolute h-[460px] w-[460px] rounded-full pointer-events-none border border-cyan-500/5 animate-radarSweep"
                  style={{
                    background: "conic-gradient(from 0deg, rgba(6,182,212,0.12) 0deg, transparent 80deg, transparent 360deg)",
                    top: "calc(50% - 230px)",
                    left: "calc(50% - 230px)"
                  }}
                />

                {/* Radar Grid SVG */}
                <svg
                  viewBox="0 0 500 500"
                  className="w-full max-w-[460px] h-auto relative z-10"
                >
                  <defs>
                    <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(6, 182, 212, 0.05)" />
                      <stop offset="100%" stopColor="rgba(2, 4, 11, 0)" />
                    </radialGradient>
                  </defs>

                  {/* Radar Backdrop circle glow */}
                  <circle cx="250" cy="250" r="230" fill="url(#radarGlow)" />

                  {/* Concentric rings */}
                  <circle cx="250" cy="250" r="230" className="fill-none stroke-cyan-500/15" strokeWidth="1" />
                  <circle cx="250" cy="250" r="172.5" className="fill-none stroke-cyan-500/10 stroke-dasharray-[3,3]" strokeWidth="1" />
                  <circle cx="250" cy="250" r="115" className="fill-none stroke-cyan-500/10" strokeWidth="1" />
                  <circle cx="250" cy="250" r="57.5" className="fill-none stroke-cyan-500/10 stroke-dasharray-[3,3]" strokeWidth="1" />

                  {/* Crosshairs axis lines */}
                  <line x1="20" y1="250" x2="480" y2="250" className="stroke-cyan-500/15" strokeWidth="1" />
                  <line x1="250" y1="20" x2="250" y2="480" className="stroke-cyan-500/15" strokeWidth="1" />

                  {/* Angle grid rays */}
                  <line x1="87.4" y1="87.4" x2="412.6" y2="412.6" className="stroke-cyan-500/5 stroke-dasharray-[2,4]" strokeWidth="1" />
                  <line x1="87.4" y1="412.6" x2="412.6" y2="87.4" className="stroke-cyan-500/5 stroke-dasharray-[2,4]" strokeWidth="1" />

                  {/* Command Center Centerpoint dot */}
                  <circle cx="250" cy="250" r="4" className="fill-cyan-400 stroke-cyan-400/30" strokeWidth="4" />
                  <circle cx="250" cy="250" r="10" className="fill-none stroke-cyan-400/40 animate-ping" strokeWidth="1" />

                  {/* Plot ship nodes */}
                  {radarNodes.map((node) => {
                    const isCrit = node.ship.isCritical;
                    const isMaint = node.ship.status.toLowerCase().includes("maintenance") || node.ship.status.toLowerCase().includes("standby");
                    const isHovered = hoveredNode?.ship.id === node.ship.id;
                    
                    let dotColor = "fill-emerald-400 stroke-emerald-500/30";
                    let glowColor = "rgba(52, 211, 153, 0.4)";
                    if (isCrit) {
                      dotColor = "fill-red-500 stroke-red-500/40 animate-pulse";
                      glowColor = "rgba(239, 68, 68, 0.6)";
                    } else if (isMaint) {
                      dotColor = "fill-amber-400 stroke-amber-400/30";
                      glowColor = "rgba(251, 191, 36, 0.4)";
                    } else if (node.ship.coreType.toLowerCase().includes("plasma")) {
                      dotColor = "fill-cyan-400 stroke-cyan-400/30";
                      glowColor = "rgba(6, 182, 212, 0.5)";
                    }

                    return (
                      <g
                        key={node.ship.id}
                        onClick={() => {
                          playSelect();
                          onViewDetails(node.ship);
                        }}
                        onMouseEnter={() => {
                          playClick();
                          setHoveredNode(node);
                        }}
                        className="cursor-pointer group/node"
                      >
                        {/* Interactive hover trigger circle */}
                        <circle cx={node.x} cy={node.y} r="14" fill="transparent" />

                        {/* Outer hover halo */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isHovered ? 11 : 7}
                          className="fill-none transition-all duration-300"
                          stroke={isCrit ? "rgba(239, 68, 68, 0.4)" : "rgba(6, 182, 212, 0.3)"}
                          strokeWidth={isHovered ? 2 : 1}
                        />

                        {/* Actual Node point */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isHovered ? 6 : 4}
                          className={`${dotColor} transition-all duration-300`}
                          style={{
                            filter: isHovered ? `drop-shadow(0 0 4px ${glowColor})` : "none"
                          }}
                        />

                        {/* HUD Coordinates projection line when hovered */}
                        {isHovered && (
                          <line
                            x1="250"
                            y1="250"
                            x2={node.x}
                            y2={node.y}
                            className="stroke-cyan-500/30 stroke-dasharray-[2,2]"
                            strokeWidth="1"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Radar Legend & HUD Compass Text */}
                <div className="absolute top-4 left-6 font-share text-3xs text-cyan-500/50 uppercase tracking-widest leading-relaxed">
                  <div>RADAR BEAM SENSOR GRID</div>
                  <div>RANGE: 400,000 AU</div>
                </div>
                
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-6 font-share text-3xs text-gray-400 uppercase tracking-wider bg-slate-950/20 backdrop-blur-xs py-1 rounded-md max-w-sm mx-auto border border-cyan-500/5">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Operational
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Plasma Core
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Maintenance
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" /> Critical Alert
                  </span>
                </div>
              </div>

              {/* Radar Feed telemetry panel (Right 1 Column) */}
              <div className="glass rounded-xl border border-cyan-500/15 p-5 bg-slate-950/30 flex flex-col justify-between min-h-[500px]">
                
                {/* Active HUD Feed Title */}
                <div>
                  <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-3">
                    <Radar className="text-cyan-400 animate-pulse" size={16} />
                    <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-cyan-300">
                      Tactical Sensor Feed
                    </h3>
                  </div>

                  {/* Tooltip Content or placeholder instruction */}
                  <AnimatePresence mode="wait">
                    {hoveredNode ? (
                      <motion.div
                        key={hoveredNode.ship.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="mt-5 space-y-4"
                      >
                        {/* Thumbnail image */}
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border border-cyan-500/10">
                          <img
                            src={hoveredNode.ship.image}
                            alt={hoveredNode.ship.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-cyan-950/80 text-3xs font-share text-cyan-300 border border-cyan-500/30">
                            {hoveredNode.ship.coreType.toUpperCase()}
                          </span>
                        </div>

                        {/* Telemetry log list */}
                        <div className="space-y-2.5 font-share text-xs">
                          <div>
                            <span className="text-3xs text-gray-500 block uppercase tracking-widest">Vessel Class/Name</span>
                            <span className="font-bold text-white text-base font-orbitron truncate block">{hoveredNode.ship.name}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 border-t border-cyan-500/5 pt-2">
                            <div>
                              <span className="text-3xs text-gray-500 block uppercase tracking-widest">RANGE COORDINATES</span>
                              <span className="font-bold text-cyan-400 font-mono">
                                R:{Math.round(hoveredNode.radius)} AU / {hoveredNode.angleDeg}°
                              </span>
                            </div>
                            <div>
                              <span className="text-3xs text-gray-500 block uppercase tracking-widest">STATUS STABILITY</span>
                              <span className={`font-bold ${hoveredNode.ship.isCritical ? "text-red-400" : "text-emerald-400"}`}>
                                {hoveredNode.ship.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 border-t border-cyan-500/5 pt-2">
                            <div>
                              <span className="text-3xs text-gray-500 block uppercase tracking-widest">CREW CAPACITY</span>
                              <span className="font-semibold text-gray-200">{hoveredNode.ship.capacity} PAX</span>
                            </div>
                            <div>
                              <span className="text-3xs text-gray-500 block uppercase tracking-widest">CREDIT VALUE</span>
                              <span className="font-semibold text-emerald-400">
                                {formatCredits(hoveredNode.ship.price)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Click Tip */}
                        <div className="flex items-center gap-1.5 p-2 rounded-lg border border-cyan-500/10 bg-cyan-950/10 text-cyan-400/80 text-3xs font-share tracking-wider">
                          <Info size={12} className="shrink-0 animate-bounce" />
                          <span>CLICK POINT TO RUN FULL SUB-SYSTEM DIAGNOSTICS</span>
                        </div>
                      </motion.div>
                    ) : (
                      /* Empty State Tip */
                      <motion.div
                        key="radar-placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-12 text-center text-gray-500 space-y-4"
                      >
                        <div className="w-12 h-12 rounded-full border border-dashed border-gray-600 flex items-center justify-center mx-auto opacity-30">
                          <Radar size={18} className="animate-pulse" />
                        </div>
                        <p className="font-share text-3xs uppercase tracking-widest leading-relaxed">
                          Hover over coordinate coordinates plotted on the sensor map to initialize satellite tracking feed.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Inspect telemetry button (if hovered) */}
                {hoveredNode && (
                  <button
                    onClick={() => {
                      playSelect();
                      onViewDetails(hoveredNode.ship);
                    }}
                    className="w-full mt-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 py-2.5 font-share font-bold text-black text-2xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:scale-102"
                  >
                    INSPECT VESSEL
                  </button>
                )}

              </div>
            </motion.div>
          )
        ) : (
          /* Empty Fallback State */
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-xl border border-cyan-500/10 p-12 text-center max-w-md mx-auto mt-12 bg-slate-950/30"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-950/30 text-cyan-500 border border-cyan-500/20 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <ShieldX size={26} className="animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-wide font-orbitron">No Telemetry Matches Found</h3>
            <p className="mt-2 text-xs text-gray-400 font-share leading-relaxed">
              Your telemetry queries returned 0 matched coordinate records. Adjust filter queries or reset the satellite search matrix.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCore("all");
                setSelectedStatus("all");
                playSelect();
              }}
              className="mt-5 rounded-lg bg-cyan-950/40 hover:bg-cyan-500/25 border border-cyan-500/35 px-4 py-2 font-share text-2xs text-cyan-400 hover:text-white transition-all duration-300 cursor-pointer uppercase tracking-widest font-semibold"
            >
              RESET TELEMETRY FILTERS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShipGrid;
