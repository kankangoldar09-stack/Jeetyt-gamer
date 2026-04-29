import { House, Users, Plus, MessageSquare, User } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { icon: House, label: 'Home', id: 'home' },
  { icon: Users, label: 'Friends', id: 'friends' },
  { icon: Plus, label: 'Create', id: 'add', isSpecial: true },
  { icon: MessageSquare, label: 'Inbox', id: 'inbox' },
  { icon: User, label: 'Profile', id: 'profile' },
];

export default function BottomNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-black border-t border-white/5 flex items-center justify-around z-40 pb-safe" id="bottom-navigation">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`relative h-full w-full flex flex-col items-center justify-center transition-all ${activeTab === item.id ? 'opacity-100' : 'opacity-40'}`}
          id={`nav-item-${item.id}`}
        >
          {item.isSpecial ? (
            <div className="relative group p-0.5" id="add-btn-container">
              <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-[#69C9D0] via-white to-[#EE1D52] rounded-lg" />
              <div className="relative h-7 w-11 bg-black rounded-md flex items-center justify-center group-active:scale-90 transition-transform">
                <Plus className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <item.icon className="w-5 h-5 text-white" strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === item.id ? 'text-white' : 'text-white/40'}`}>
                {item.label}
              </span>
            </div>
          )}
          
          {activeTab === item.id && !item.isSpecial && (
            <motion.div
              layoutId="nav-line"
              className="absolute top-0 w-8 h-[1.5px] bg-white rounded-full"
            />
          )}
        </button>
      ))}
    </nav>
  );
}
