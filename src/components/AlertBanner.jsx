import { AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const AlertBanner = ({ count }) => {
  if (!count) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 overflow-hidden rounded-2xl border border-red-500 bg-red-950/15 p-4 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-pulseAlert"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Warning Information */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
            <AlertTriangle className="animate-bounce" size={22} />
          </div>
          <div>
            <h4 className="font-mono text-sm font-bold tracking-wider text-red-400 uppercase">
              Quantum Core Hazard Warning
            </h4>
            <p className="text-xs text-red-200/80">
              {count} vessel{count > 1 ? "s are" : " is"} running high-capacity Plasma reactors. Core meltdown risk elevated.
            </p>
          </div>
        </div>

        {/* Hazard Class Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-md border border-red-500/30 bg-red-950/40 px-3 py-1 font-mono text-2xs font-semibold text-red-400 uppercase tracking-widest">
          <ShieldAlert size={12} className="animate-pulse" />
          <span>CLASS 4 ANOMALY</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertBanner;
