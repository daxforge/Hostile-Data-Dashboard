import { motion } from "framer-motion";

const BackgroundEffects = () => {
  // Generate a set of stable random positions/sizes for particles to avoid hydration mismatches
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * -20,
  }));

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#020512]">
      {/* Dynamic Grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Cyberpunk Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-cyan-500/1 to-transparent bg-[size:100%_4px] opacity-25" />
      
      {/* Animated Scanline Sweeper */}
      <div className="absolute inset-x-0 h-[2px] bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-scanline pointer-events-none" />

      {/* Neon glowing ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none" />

      {/* Futuristic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(3,6,17,0)_40%,rgba(3,6,17,0.8)_100%)]" />

      {/* Floating Space Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
            }}
            animate={{
              y: [0, -300, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundEffects;
