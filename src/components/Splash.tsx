import { motion } from 'motion/react';
import { useEffect } from 'react';

export default function Splash({ onFinish }: { onFinish: () => void; key?: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#010101] flex flex-col items-center justify-between py-24 font-sans text-white overflow-hidden z-50"
      id="splash-editorial"
    >
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#69C9D0] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EE1D52] rounded-full blur-[120px]"></div>
      </div>

      {/* Top Branding / Status */}
      <div className="z-10 flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] uppercase tracking-[0.6em] text-white/40 font-bold mb-2"
        >
          Secured by Cloud Node
        </motion.span>
        <div className="h-[2px] w-8 bg-gradient-to-r from-[#69C9D0] to-[#EE1D52]"></div>
      </div>

      {/* Main Logo Section */}
      <div className="relative flex flex-col items-center z-10">
        <div className="relative w-56 h-56">
          {/* TikTok Icon Glow Effect - Enhanced */}
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 blur-3xl text-[#69C9D0]/30"
          >
             <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M78 31.5C71.3 31.5 65.5 27.8 62.5 22.3V57.5C62.5 72.7 50.2 85 35 85C19.8 85 7.5 72.7 7.5 57.5C7.5 42.3 19.8 30 35 30C37.5 30 39.8 30.3 42 30.9V44.6C39.8 43.6 37.5 43.1 35 43.1C27.1 43.1 20.6 49.6 20.6 57.5C20.6 65.4 27.1 71.9 35 71.9C42.9 71.9 49.4 65.4 49.4 57.5V10H62.5C62.5 17.5 68.6 23.6 76.1 23.6V31.5H78Z" />
             </svg>
          </motion.div>
          
          {/* Holographic Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-white/5 rounded-full"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#69C9D0] rounded-full shadow-[0_0_10px_#69C9D0]"></div>
          </motion.div>

          {/* Main Logo SVG */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox="0 0 100 100" fill="none" className="relative drop-shadow-[0_0_30px_rgba(105,201,208,0.4)]">
              <path d="M78 31.5C71.3 31.5 65.5 27.8 62.5 22.3V57.5C62.5 72.7 50.2 85 35 85C19.8 85 7.5 72.7 7.5 57.5C7.5 42.3 19.8 30 35 30C37.5 30 39.8 30.3 42 30.9V44.6C39.8 43.6 37.5 43.1 35 43.1C27.1 43.1 20.6 49.6 20.6 57.5C20.6 65.4 27.1 71.9 35 71.9C42.9 71.9 49.4 65.4 49.4 57.5V10H62.5C62.5 17.5 68.6 23.6 76.1 23.6V31.5H78Z" fill="white"/>
            </svg>
          </motion.div>
        </div>

        {/* Brand Name */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-6xl font-black tracking-tighter text-white italic drop-shadow-2xl"
        >
          INDIAN<span className="text-[#69C9D0]">REELS</span><span className="text-[#EE1D52] animate-pulse">.</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[#69C9D0] text-[10px] font-black uppercase tracking-[0.5em] mt-2 drop-shadow-[0_0_8px_rgba(105,201,208,0.5)]"
        >
          NEXT GENERATION SOCIAL
        </motion.p>
        
        {/* Loading State */}
        <div className="mt-16 w-72 h-[3px] bg-white/5 rounded-full overflow-hidden backdrop-blur-md">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: [0.65, 0, 0.35, 1] }}
            className="h-full bg-gradient-to-r from-[#69C9D0] via-white to-[#EE1D52]" 
          />
        </div>
        <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#69C9D0] rounded-full animate-ping"></span>
            Syncing Cloud
          </span>
          <span className="animate-pulse">v2.1.0-PRO</span>
        </div>
      </div>

      {/* Bottom Branding Section */}
      <div className="z-10 flex flex-col items-center">
        <p className="text-[10px] uppercase tracking-[0.8em] text-white/20 mb-6 font-bold">Engineered by</p>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-4 bg-white/5 px-8 py-3 rounded-2xl border border-white/10 backdrop-blur-xl"
        >
          <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">GEN-AI</span>
        </motion.div>
        
        {/* Micro Footer Details */}
        <div className="mt-12 flex gap-8 text-[9px] uppercase tracking-widest text-white/20">
          <span>Version 32.4.0 (Pro)</span>
          <span>Encrypted Session</span>
          <span>Global Active</span>
        </div>
      </div>

      {/* UI Decorative Corner Accents */}
      <div className="absolute top-12 left-12 w-4 h-4 border-t border-l border-white/20"></div>
      <div className="absolute top-12 right-12 w-4 h-4 border-t border-r border-white/20"></div>
      <div className="absolute bottom-12 left-12 w-4 h-4 border-b border-l border-white/20"></div>
      <div className="absolute bottom-12 right-12 w-4 h-4 border-b border-r border-white/20"></div>
      
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none technical-grid"></div>
    </motion.div>
  );
}
