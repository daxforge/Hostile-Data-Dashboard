import { AlertTriangle, RefreshCw, Database } from "lucide-react";
import { motion } from "framer-motion";

const ErrorFallback = ({ errorMsg, onRetry, onLoadMock }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyberpunk Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(3,6,17,0.95)_100%)]" />

      {/* Error Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass max-w-md w-full rounded-2xl border border-red-500/30 p-6 md:p-8 bg-black/60 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-red-500/1 to-transparent bg-[size:100%_4px] opacity-25" />

        {/* Hazard alert circle */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-950/40 text-red-500 border border-red-500/30 mb-5 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <AlertTriangle size={32} className="animate-pulse" />
        </div>

        {/* Header details */}
        <h2 className="text-xl font-bold tracking-widest text-white uppercase font-mono">
          SAT-LINK OFFLINE
        </h2>
        <p className="mt-1 text-2xs font-mono text-red-400 uppercase tracking-widest">
          Telemetry Handshake Timeout (Error 503)
        </p>

        {/* Body detail */}
        <p className="mt-4 text-xs text-gray-400 font-mono leading-relaxed border-l-2 border-red-500/20 pl-4 text-left">
          {errorMsg || "Aegis command centers failed to connect to the fleet API. Remote satellite transponder links could be experiencing heavy solar storms or offline maintenance."}
        </p>

        {/* Interactive options buttons */}
        <div className="mt-8 flex flex-col gap-3 font-mono text-2xs">
          
          {/* Retry sat link */}
          <button
            onClick={onRetry}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:scale-102 hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] py-3 font-semibold text-white transition-all duration-300 cursor-pointer"
          >
            <RefreshCw size={12} className="animate-spin" />
            <span>RE-ESTABLISH TELEMETRY CONNECT</span>
          </button>

          {/* Fallback mock data */}
          <button
            onClick={onLoadMock}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/25 hover:border-cyan-400/50 bg-cyan-950/20 hover:bg-cyan-500/10 py-3 font-semibold text-cyan-400 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <Database size={12} />
            <span>ACTIVATE OFFLINE SIMULATOR DATABASE</span>
          </button>

        </div>
      </motion.div>
    </div>
  );
};

export default ErrorFallback;
