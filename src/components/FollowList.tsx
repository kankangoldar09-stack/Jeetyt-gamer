import { motion } from 'motion/react';
import { ArrowLeft, Search, UserMinus, MessageSquarePlus } from 'lucide-react';

export default function FollowList({ 
  type, 
  onBack,
  onUserClick
}: { 
  type: 'followers' | 'following', 
  onBack: () => void,
  onUserClick?: (user: any) => void
}) {
  const users = [
    { id: '1', name: 'Zoya Artist', user: 'visual_artist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist', isFollowing: true },
    { id: '2', name: 'Nature Explorer', user: 'nature_explorer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature', isFollowing: false },
    { id: '3', name: 'Street King', user: 'street_style', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=style', isFollowing: true },
    { id: '4', name: 'Alex Mono', user: 'alex_mono', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', isFollowing: false },
    { id: '5', name: 'Design Guru', user: 'design_pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design', isFollowing: true },
    { id: '6', name: 'Motion Master', user: 'motion_god', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=motion', isFollowing: false },
  ];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[#010101] z-[60] flex flex-col"
      id="follow-list-full"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-2 text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white font-bold text-lg capitalize">{type}</h2>
        </div>
        <Search className="w-6 h-6 text-white opacity-40" />
      </div>

      {/* Suggested Categories */}
      <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-hide border-b border-white/5">
        {['All', 'Friends', 'Suggested', 'Recent'].map((cat, i) => (
          <button key={i} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'bg-white text-black' : 'bg-white/5 text-white/40 border border-white/5'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="bg-white/5 rounded-xl px-4 py-2 flex items-center gap-3 border border-white/5">
          <Search className="w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder={`Search ${type}...`} 
            className="bg-transparent border-none text-white text-sm focus:outline-none w-full"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {users.map((fUser) => (
          <div key={fUser.id} className="flex items-center gap-4 group">
            <button 
              onClick={() => onUserClick?.({
                id: fUser.id,
                email: `${fUser.user}@toktok.app`,
                user_metadata: {
                  username: fUser.user,
                  full_name: fUser.name,
                  avatar_url: fUser.avatar
                }
              })}
              className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#69C9D0]/20 to-[#EE1D52]/20 active:scale-95 transition-transform"
            >
              <img src={fUser.avatar} className="w-14 h-14 rounded-full object-cover bg-zinc-800" alt="" />
            </button>
            <div className="flex-1 text-left" onClick={() => onUserClick?.({
              id: fUser.id,
              email: `${fUser.user}@toktok.app`,
              user_metadata: {
                username: fUser.user,
                full_name: fUser.name,
                avatar_url: fUser.avatar
              }
            })}>
              <h3 className="text-white font-bold text-sm tracking-tight">{fUser.name}</h3>
              <p className="text-white/40 text-xs">{fUser.user}</p>
            </div>
            {fUser.isFollowing ? (
              <div className="flex gap-2">
                 <button className="bg-white/5 border border-white/10 text-white/60 text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest">Message</button>
                 <button className="bg-white/5 border border-white/10 p-2 rounded-lg">
                    <UserMinus className="w-4 h-4 text-white/40" />
                 </button>
              </div>
            ) : (
              <button className="bg-[#EE1D52] text-white text-[10px] font-black px-6 py-2 rounded-lg uppercase tracking-widest shadow-lg shadow-[#EE1D52]/20">Follow</button>
            )}
          </div>
        ))}

        <div className="py-8 flex flex-col items-center space-y-2 opacity-20">
           <MessageSquarePlus className="w-8 h-8 text-white" />
           <span className="text-[10px] uppercase font-bold tracking-[0.4em]">No more {type} found</span>
        </div>
      </div>
    </motion.div>
  );
}
