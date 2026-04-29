import { motion } from 'motion/react';
import { 
  X, Search, ChevronRight, User, ShieldCheck, Lock, Bell, Clock, 
  Eye, UserMinus, MessageCircle, AtSign, Share2, Archive, Accessibility, 
  Globe, BarChart3, HelpCircle, Info, Heart, Star, Ban, Volume2, 
  Monitor, Smartphone, CreditCard, LifeBuoy, ShieldAlert, KeyRound, 
  CircleUser, Users, History, Megaphone, Palette, Languages, 
  CloudRain, ShieldCheck as Verified, LogOut
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const SETTINGS_GROUPS = [
  {
    title: 'Your Account',
    items: [
      { id: 'account-center', icon: CircleUser, label: 'Account Center', sub: 'Password, security, personal details, ad preferences', color: '#69C9D0' },
    ]
  },
  {
    title: 'How you use TokTok',
    items: [
      { id: 'notifs', icon: Bell, label: 'Notifications' },
      { id: 'time', icon: Clock, label: 'Time spent' },
    ]
  },
  {
    title: 'Who can see your content',
    items: [
      { id: 'privacy', icon: Lock, label: 'Account privacy' },
      { id: 'close-friends', icon: Star, label: 'Close friends' },
      { id: 'blocked', icon: Ban, label: 'Blocked' },
      { id: 'hide-story', icon: Eye, label: 'Hide story and live' },
    ]
  },
  {
    title: 'How others can interact with you',
    items: [
      { id: 'messages', icon: MessageCircle, label: 'Messages and story replies' },
      { id: 'tags', icon: AtSign, label: 'Tags and mentions' },
      { id: 'comments', icon: MessageCircle, label: 'Comments' },
      { id: 'sharing', icon: Share2, label: 'Sharing and remixes' },
      { id: 'restricted', icon: UserMinus, label: 'Restricted' },
    ]
  },
  {
    title: 'What you see',
    items: [
      { id: 'favorites', icon: Heart, label: 'Favorites' },
      { id: 'muted', icon: Volume2, label: 'Muted accounts' },
      { id: 'content-prefs', icon: Monitor, label: 'Content preferences' },
    ]
  },
  {
    title: 'Your app and media',
    items: [
      { id: 'archiving', icon: Archive, label: 'Archiving and downloading' },
      { id: 'accessibility', icon: Accessibility, label: 'Accessibility' },
      { id: 'language', icon: Languages, label: 'Language' },
      { id: 'data-usage', icon: Smartphone, label: 'Data usage and media quality' },
      { id: 'website-perms', icon: Globe, label: 'Website permissions' },
    ]
  },
  {
    title: 'For professionals',
    items: [
      { id: 'creator-tools', icon: BarChart3, label: 'Creator tools and controls' },
      { id: 'ad-prefs', icon: Megaphone, label: 'Ad preferences' },
      { id: 'verified', icon: Verified, label: 'Verification request' },
    ]
  },
  {
    title: 'More info and support',
    items: [
      { id: 'help', icon: LifeBuoy, label: 'Help' },
      { id: 'privacy-center', icon: ShieldCheck, label: 'Privacy Center' },
      { id: 'safety', icon: ShieldAlert, label: 'Safety' },
      { id: 'about', icon: Info, label: 'About' },
    ]
  }
];

export default function SettingsPage({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onBack();
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[#010101] z-[90] flex flex-col font-sans"
      id="settings-full-screen"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 bg-[#010101]">
        <button onClick={onBack} className="p-2 -ml-2 text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="ml-2 text-white font-bold text-lg">Settings and activity</h2>
      </div>

      {/* Search Bar */}
      <div className="p-4 mt-2">
        <div className="bg-zinc-900 rounded-xl px-4 py-3 flex items-center gap-3 active:ring-1 ring-[#69C9D0]/50 transition-all">
          <Search className="w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Search" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Settings Scroll Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
        {SETTINGS_GROUPS.map((group, gIdx) => (
          <div key={group.title} className="mt-6">
            <h3 className="px-5 text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-2">
              {group.title}
            </h3>
            <div className="space-y-[1px] bg-white/5">
              {group.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())).map((item) => (
                <button 
                  key={item.id} 
                  className="w-full bg-[#010101] flex items-center justify-between px-5 py-4 group active:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-1 rounded-md">
                      <item.icon className="w-5 h-5 text-white" strokeWidth={1.5} style={'color' in item ? { color: item.color as string } : {}} />
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-medium tracking-tight group-hover:text-[#69C9D0] transition-colors">{item.label}</p>
                      {'sub' in item && <p className="text-white/30 text-[10px] tracking-tight">{item.sub as string}</p>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Technical Footer */}
        <div className="mt-12 px-5 py-8 border-t border-white/5 space-y-6">
          <div>
            <span className="text-[10px] font-black italic text-white tracking-widest">TokTok</span>
            <div className="mt-2 text-white/20 text-[9px] uppercase tracking-[0.5em] font-medium">From GEN-AI OpenSource</div>
          </div>

          <div className="space-y-4">
            <button className="text-[#69C9D0] text-xs font-bold uppercase tracking-widest block py-2">Add Account</button>
            <button 
              onClick={handleLogout}
              className="text-[#EE1D52] text-xs font-bold uppercase tracking-widest block py-2"
            >
              Log Out kankan_goldar
            </button>
            <button className="text-[#EE1D52] text-xs font-bold uppercase tracking-widest block py-2">Log Out All Accounts</button>
          </div>

          <div className="pt-8 text-center opacity-10">
             <div className="text-[8px] font-mono tracking-widest uppercase">Encryption Key: 0x82...FA92</div>
             <div className="text-[8px] font-mono tracking-widest uppercase mt-1">Global Relay: ACTIVE</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
