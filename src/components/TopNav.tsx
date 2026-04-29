import { Search, MonitorPlay } from 'lucide-react';
import { motion } from 'motion/react';

export default function TopNav({ onSearchClick }: { onSearchClick?: () => void }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 flex items-center px-4 z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent" id="top-navigation">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <MonitorPlay className="w-5 h-5 text-[#69C9D0] opacity-90" />
          <span className="text-white font-black italic text-lg tracking-tighter">INDIAN<span className="text-[#69C9D0]">REELS</span></span>
        </div>
        
        <div className="flex items-center gap-6" id="feed-selector">
          <button className="relative group">
            <span className="text-white/60 font-bold text-sm tracking-wide transition-opacity group-hover:opacity-100">Following</span>
          </button>
          <button className="relative group">
            <span className="text-white font-bold text-sm tracking-wide">For You</span>
            <motion.div
              layoutId="active-tab"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-white rounded-full"
            />
          </button>
        </div>

        <button 
          onClick={onSearchClick}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
