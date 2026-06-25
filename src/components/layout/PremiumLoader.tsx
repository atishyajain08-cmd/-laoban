"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PremiumLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1850);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#070707]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 50% 32%, rgba(200,169,110,0.28), transparent 34%), radial-gradient(circle at 50% 100%, rgba(200,169,110,0.12), transparent 45%)",
            }}
            animate={{ opacity: [0.45, 0.78, 0.45] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <motion.img
              src="/-laoban/assets/brand/laoban-lb-mark.png"
              alt="Laoban"
              className="mb-6 h-28 w-28 rounded-full object-cover shadow-[0_0_60px_rgba(200,169,110,0.28)] md:h-36 md:w-36"
              animate={{ opacity: [0.82, 1, 0.82], scale: [1, 1.035, 1] }}
              transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.p
              className="loader-script text-gradient-gold"
              initial={{ letterSpacing: "0.02em", opacity: 0 }}
              animate={{ letterSpacing: "0.08em", opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              Laoban
            </motion.p>
            <motion.span
              className="mt-3 text-[10px] uppercase tracking-[0.42em] text-white/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.75] }}
              transition={{ duration: 1.25, delay: 0.25 }}
            >
              Style · Discipline · Presence
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
