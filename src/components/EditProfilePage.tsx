import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EditProfilePage({ user, onBack }: { user: any, onBack: () => void }) {
  const userData = user?.user_metadata || {};
  const [fullName, setFullName] = useState(userData.full_name || '');
  const [username, setUsername] = useState(userData.username || '');
  const [bio, setBio] = useState(userData.bio || 'Tap + to share your first video! 🚀');
  const [avatarUrl, setAvatarUrl] = useState(userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
          bio: bio,
          avatar_url: avatarUrl
        }
      });
      if (error) throw error;
      onBack();
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 bg-[#010101] z-[80] flex flex-col font-sans"
      id="edit-profile-screen"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-[#010101]">
        <button onClick={onBack} className="text-white p-2">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-white font-bold">Edit profile</h2>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="text-[#69C9D0] p-2 disabled:opacity-50"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center py-8">
        <label className="relative cursor-pointer group">
          <img 
            src={avatarUrl} 
            className="w-24 h-24 rounded-full object-cover border-2 border-white/10" 
            alt="Profile" 
          />
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        <button className="mt-4 text-[#69C9D0] text-sm font-bold tracking-tight">Edit picture or avatar</button>
      </div>

      {/* Fields */}
      <div className="px-4 space-y-6 mt-4">
        <div className="space-y-2">
          <label className="text-white/40 text-[10px] uppercase font-bold tracking-widest px-1">Name</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-[#EE1D52] transition-colors"
            placeholder="Name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-white/40 text-[10px] uppercase font-bold tracking-widest px-1">Username</label>
          <div className="flex items-center gap-1 border-b border-white/10 group focus-within:border-[#69C9D0] transition-colors">
            <span className="text-white/20 font-bold mb-1">@</span>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent py-2 text-white text-sm focus:outline-none"
              placeholder="Username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-white/40 text-[10px] uppercase font-bold tracking-widest px-1">Bio</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-[#EE1D52] transition-colors resize-none min-h-[80px]"
            placeholder="Bio"
          />
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-white/5">
        <button className="text-[#EE1D52] text-xs font-bold uppercase tracking-widest w-full text-left py-2">Switch to Professional Account</button>
        <button className="text-white/30 text-[10px] font-bold uppercase tracking-widest w-full text-left py-2">Personal Information Settings</button>
      </div>
    </motion.div>
  );
}
