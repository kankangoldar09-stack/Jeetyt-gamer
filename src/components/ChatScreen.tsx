import { ArrowLeft, Video, Phone, Info, Music2, Send, Image as ImageIcon, Smile, Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Message {
  id: string;
  text?: string;
  isMe: boolean;
  timestamp: string;
  type: 'text' | 'music';
  musicData?: {
    title: string;
    artist: string;
  };
}

export default function ChatScreen({ friend, onBack }: { friend: any; onBack: () => void }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Yo, check this track out!', isMe: false, timestamp: '2:15 PM', type: 'text' },
    { id: '2', type: 'music', musicData: { title: 'Neon Dreams', artist: 'SynthWave Player' }, isMe: false, timestamp: '2:16 PM' },
    { id: '3', text: 'This is fire 🔥', isMe: true, timestamp: '2:18 PM', type: 'text' },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message,
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }]);
    setMessage('');
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[#010101] z-[60] flex flex-col"
    >
      {/* Chat Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-[#010101]">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-2 text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={friend.avatar} className="w-9 h-9 rounded-full object-cover" alt="" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#010101]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">{friend.name}</h2>
              <p className="text-green-500 text-[10px] font-medium uppercase tracking-wider">Active Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white">
          <Phone className="w-5 h-5" />
          <Video className="w-5 h-5" />
          <Info className="w-5 h-5" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <div className="flex flex-col items-center py-8 space-y-2 opacity-60">
          <img src={friend.avatar} className="w-20 h-20 rounded-full object-cover" alt="" />
          <h3 className="text-white font-bold text-lg">{friend.name}</h3>
          <p className="text-white/40 text-xs">Instagram • {friend.user}</p>
          <button className="bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-lg mt-2">View Profile</button>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
              msg.isMe 
                ? 'bg-[#EE1D52] text-white rounded-tr-none' 
                : 'bg-zinc-800 text-white rounded-tl-none'
            }`}>
              {msg.type === 'text' ? (
                <p className="text-sm leading-relaxed">{msg.text}</p>
              ) : (
                <div className="flex items-center gap-3 bg-black/20 p-2 rounded-xl">
                  <div className="w-10 h-10 bg-[#69C9D0]/20 rounded-lg flex items-center justify-center">
                    <Music2 className="w-6 h-6 text-[#69C9D0]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold truncate">{msg.musicData?.title}</p>
                    <p className="text-[10px] opacity-60 truncate">{msg.musicData?.artist}</p>
                  </div>
                </div>
              )}
              <p className={`text-[9px] mt-1 opacity-40 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#010101] border-t border-white/5">
        <div className="flex items-center gap-3 bg-zinc-900 rounded-full px-4 py-2">
          <button className="text-white opacity-60 p-1">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Message..." 
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none py-1"
          />
          {message.trim() ? (
            <button onClick={sendMessage} className="text-[#69C9D0] font-bold text-sm">Send</button>
          ) : (
            <div className="flex items-center gap-3 text-white opacity-60">
              <Mic className="w-5 h-5" />
              <Smile className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
