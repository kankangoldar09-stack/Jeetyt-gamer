import { Search, PenSquare, ArrowLeft, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import ChatScreen from './ChatScreen.tsx';

const CHATS = [
  { id: '1', name: 'Zoya Artist', user: 'visual_artist', lastMsg: 'Liked a message', time: '2m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist', online: true },
  { id: '2', name: 'Nature Explorer', user: 'nature_explorer', lastMsg: 'Sent a music crystal', time: '15m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature', online: true },
  { id: '3', name: 'Street King', user: 'street_style', lastMsg: 'Check this new drip!', time: '1h', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=style', online: false },
  { id: '4', name: 'Alex Mono', user: 'alex_mono', lastMsg: 'See you tonight ✌️', time: '3h', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', online: true },
];

export default function InboxPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);

  if (selectedChat) {
    return <ChatScreen friend={selectedChat} onBack={() => setSelectedChat(null)} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full bg-[#010101] pt-12"
      id="inbox-page"
    >
      {/* Inbox Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <h1 className="text-white text-xl font-bold italic tracking-tight">Direct</h1>
          <div className="bg-[#EE1D52] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</div>
        </div>
        <div className="flex items-center gap-4 text-white">
          <Camera className="w-6 h-6" />
          <PenSquare className="w-6 h-6" />
        </div>
      </div>

      {/* Active Friends Horizontal List */}
      <div className="py-4 space-y-3">
        <div className="flex items-center gap-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-white/40" />
              </div>
            </div>
            <span className="text-white/40 text-[10px] font-medium uppercase tracking-tighter">Your Note</span>
          </div>
          {CHATS.filter(c => c.online).map(chat => (
            <div key={chat.id} className="flex flex-col items-center gap-1 shrink-0" onClick={() => setSelectedChat(chat)}>
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                <div className="bg-[#010101] p-0.5 rounded-full">
                  <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover" alt="" />
                </div>
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#010101]" />
              </div>
              <span className="text-white text-[10px] font-medium tracking-tight truncate w-16 text-center">{chat.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="px-4 py-2">
        <div className="bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <Search className="w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search messages" 
            className="bg-transparent border-none text-white text-sm focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto mt-4 px-4 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-sm">Messages</span>
          <button className="text-[#69C9D0] font-bold text-xs">Requests</button>
        </div>

        {CHATS.map((chat) => (
          <button 
            key={chat.id} 
            onClick={() => setSelectedChat(chat)}
            className="w-full flex items-center gap-4 group active:scale-95 transition-transform"
          >
            <div className="relative">
              <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover bg-zinc-800" alt="" />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#010101]" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-white font-semibold text-sm">{chat.name}</h3>
              <div className="flex items-center gap-1.5">
                <p className="text-white/50 text-xs font-medium truncate max-w-[150px]">{chat.lastMsg}</p>
                <span className="text-white/20 text-[10px]">•</span>
                <span className="text-white/30 text-[10px]">{chat.time}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
