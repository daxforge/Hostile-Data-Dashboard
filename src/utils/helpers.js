/**
 * Formats a number as Galactic Credits with abbreviated millions/billions.
 */
export const formatCredits = (num) => {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B Credits`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M Credits`;
  }
  return `${num.toLocaleString()} Credits`;
};

/**
 * Returns glow classes based on the ship engine core type.
 */
export const getCoreGlowClass = (coreType = "") => {
  const type = coreType.toLowerCase();
  if (type.includes("plasma")) return "glow-cyan text-cyan-400 border-cyan-500/30";
  if (type.includes("ion") || type.includes("nuclear")) return "glow-blue text-blue-400 border-blue-500/30";
  if (type.includes("fusion") || type.includes("warp") || type.includes("antimatter")) {
    return "glow-purple text-purple-400 border-purple-500/30";
  }
  return "border-gray-500/20 text-gray-300";
};

/**
 * Returns status text coloring and animations.
 */
export const getStatusMeta = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("operational") || s.includes("active") || s.includes("safe")) {
    return {
      text: "Operational",
      colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      dotClass: "bg-emerald-400 animate-pulse",
    };
  }
  if (s.includes("maintenance") || s.includes("standby") || s.includes("repair")) {
    return {
      text: "Maintenance",
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      dotClass: "bg-amber-400",
    };
  }
  if (s.includes("critical") || s.includes("compromised") || s.includes("damaged")) {
    return {
      text: "Critical Failure",
      colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/30",
      dotClass: "bg-rose-500 animate-ping",
    };
  }
  return {
    text: status || "Unknown",
    colorClass: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    dotClass: "bg-sky-400",
  };
};

// Curated list of high-quality futuristic sci-fi spaceship & space telemetry artwork
export const SF_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", // warp reactor core
  "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=800", // nebula space storm
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800", // orbital telemetry satellite
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800", // cosmic violet gas clouds
  "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800", // rocket retro thrusters
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=800", // futuristic metal hull cockpit
  "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800", // cyberpunk console screens
  "https://images.unsplash.com/photo-1608178398319-48f814d0750c?q=80&w=800", // energetic quantum sphere
  "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=800", // hyperspace star velocity trails
  "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800", // deep space red dwarf reactor flare
  "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=800", // space station structural panels
  "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?q=80&w=800"  // distant blue spiral galaxy
];

/**
 * Returns a beautiful sci-fi image based on the ship's name hash
 */
export const getShipImage = (shipName = "") => {
  if (!shipName) return SF_IMAGES[0];
  let hash = 0;
  for (let i = 0; i < shipName.length; i++) {
    hash = shipName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SF_IMAGES.length;
  return SF_IMAGES[index];
};

export const MOCK_FLEET_DATA = [
  {
    id: "mock-1",
    name: "Nebula Centurion",
    manufacturer: "Hyperion Orbital",
    shipCapacity: 180,
    shipPrice: 42000000,
    engine: { coreType: "plasma" },
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200",
    status: "operational"
  },
  {
    id: "mock-2",
    name: "Quantum Voyager",
    manufacturer: "Astra Dynamics",
    shipCapacity: 85,
    shipPrice: 19500000,
    engine: { coreType: "ion" },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    status: "operational"
  },
  {
    id: "mock-3",
    name: "Solar Tempest",
    manufacturer: "Solaris Guild",
    shipCapacity: 250,
    shipPrice: 85000000,
    engine: { coreType: "plasma" },
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1200",
    status: "critical"
  },
  {
    id: "mock-4",
    name: "Chronos Dreadnought",
    manufacturer: "WarpForge Labs",
    shipCapacity: 45,
    shipPrice: 125000000,
    engine: { coreType: "warp" },
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    status: "maintenance"
  },
  {
    id: "mock-5",
    name: "Vanguard Interceptor",
    manufacturer: "Aegis Shipyards",
    shipCapacity: 12,
    shipPrice: 8500000,
    engine: { coreType: "fusion" },
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200",
    status: "operational"
  },
  {
    id: "mock-6",
    name: "Shadow Horizon",
    manufacturer: "Void Industries",
    shipCapacity: 110,
    shipPrice: 54000000,
    engine: { coreType: "antimatter" },
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200",
    status: "damaged"
  }
];


