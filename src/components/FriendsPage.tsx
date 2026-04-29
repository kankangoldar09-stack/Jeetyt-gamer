import { motion, AnimatePresence } from 'motion/react';
import { Search, UserPlus, Users, X } from 'lucide-react';
import { useState } from 'react';
import VerifiedBadge from './VerifiedBadge';

const FRIENDS_ACTIVITY = [
  { id: '1', user: 'zoya_artist', name: 'Zoya Artist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist', activity: 'Posted a new video', time: '5m ago' },
  { id: '2', user: 'nature_explorer', name: 'Nature Explorer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature', activity: 'Is live now', isLive: true },
  { id: '3', user: 'street_style', name: 'Street King', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=style', activity: 'Shared a song', time: '1h ago' },
  { id: '4', user: 'alex_mono', name: 'Alex Mono', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', activity: 'Updated status', time: '2h ago' },
  { id: '5', user: 'coding_ninja', name: 'Code Master', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja', activity: 'Started a project', time: '3h ago' },
  { id: '6', user: 'travel_bug', name: 'World Traveler', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel', activity: 'Visited Bali', time: '4h ago' },
];

export default function FriendsPage({ initialSearchActive = false }: { initialSearchActive?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(initialSearchActive);

  const filteredActivity = FRIENDS_ACTIVITY.filter(item => 
    item.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-[#010101] pt-12 pb-24 px-4 overflow-y-auto scrollbar-hide"
      id="friends-page"
    >
      <div className="flex items-center justify-between mb-6">
        <AnimatePresence mode="wait">
          {!isSearchActive ? (
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              key="title"
              className="text-white text-2xl font-black italic tracking-tight uppercase"
            >
              Friends<span className="text-[#69C9D0]">.</span>
            </motion.h1>
          ) : (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              key="search-box"
              className="flex-1 mr-4 bg-zinc-900/50 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-white/40" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search usernames..." 
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-4 h-4 text-white/40" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setIsSearchActive(!isSearchActive);
              if (isSearchActive) setSearchQuery('');
            }}
            className={`p-2 rounded-full transition-colors ${isSearchActive ? 'bg-[#69C9D0] text-black' : 'bg-white/5 text-white'}`}
          >
            <Search className="w-5 h-5" />
          </button>
          {!isSearchActive && (
            <button className="p-2 bg-white/5 text-white rounded-full">
              <UserPlus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Friends Section */}
      <div className="mb-8 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Active Neighbors</h2>
          <button className="text-[#69C9D0] text-[10px] font-black uppercase tracking-widest">See all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {filteredActivity.length > 0 ? (
            filteredActivity.map(friend => (
              <motion.div 
                layout
                key={friend.id} 
                className="flex flex-col items-center gap-3 group shrink-0"
              >
                <div className={`relative p-0.5 rounded-2xl transition-all group-active:scale-95 ${friend.isLive ? 'bg-gradient-to-tr from-[#EE1D52] to-[#69C9D0] p-[2px]' : 'bg-zinc-800'}`}>
                  <div className="bg-[#010101] p-0.5 rounded-[14px]">
                    <img src={friend.avatar} className="w-16 h-16 rounded-[12px] object-cover" alt="" />
                  </div>
                  {friend.isLive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#EE1D52] text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ring-1 ring-black">LIVE</div>
                  )}
                </div>
                <span className="text-white text-[9px] font-bold tracking-widest uppercase truncate w-16 text-center opacity-60">{friend.name.split(' ')[0]}</span>
              </motion.div>
            ))
          ) : (
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest py-4">No neighbors found</p>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-[1px] flex-1 bg-white/5" />
          <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Network Stream</h2>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        
        {filteredActivity.length > 0 ? (
          filteredActivity.map(activity => (
            <motion.div 
              layout
              key={activity.id} 
              className="flex items-center gap-4 group bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="relative">
                <img src={activity.avatar} className="w-14 h-14 rounded-xl object-cover bg-zinc-800" alt="" />
                <div className="absolute -bottom-1 -right-1 bg-[#69C9D0] rounded-full p-1 ring-2 ring-[#010101] group-hover:scale-110 transition-transform">
                  <Users className="w-2.5 h-2.5 text-black" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="text-white font-black text-[13px] tracking-tight truncate">@{activity.user.toUpperCase()}</h3>
                    <VerifiedBadge className="w-3 h-3 flex-shrink-0" />
                  </div>
                  <span className="text-white/20 text-[9px] font-bold">{activity.time || 'NOW'}</span>
                </div>
                <p className="text-white/50 text-[11px] font-medium leading-tight line-clamp-1">{activity.activity}</p>
              </div>
              <button className="bg-[#EE1D52] hover:bg-[#ff2a63] text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-colors shadow-lg active:scale-95">Watch</button>
            </motion.div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center gap-4 border-2 border-dashed border-white/5 rounded-3xl">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center opacity-20">
                <Search className="w-6 h-6 text-white" />
             </div>
             <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Target not found in stream</p>
          </div>
        )}
      </div>

      {/* Find More Friends Empty State */}
      {!searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 py-10 border border-white/5 bg-white/2 rounded-3xl flex flex-col items-center text-center px-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#69C9D0]/5 to-transparent pointer-events-none" />
          <Users className="w-12 h-12 text-[#69C9D0] mb-4 opacity-40" />
          <h3 className="text-white font-black uppercase tracking-tighter text-lg mb-2">Join the Network</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] leading-loose max-w-[220px]">Establish new node connections via contact synchronization.</p>
          <button className="mt-8 transition-all active:scale-95 w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl hover:bg-zinc-200">Sync Nodes</button>
        </motion.div>
      )}
    </motion.div>
  );
}
