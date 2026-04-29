import { motion, AnimatePresence } from 'motion/react';
import { Grid3X3, Heart, Bookmark, Lock, Settings, Menu, Plus, LogOut, ChevronLeft, UserPlus, UserMinus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import EditProfilePage from './EditProfilePage';
import SettingsPage from './SettingsPage';

import VerifiedBadge from './VerifiedBadge';

export default function ProfilePage({ 
  user, 
  currentUser,
  onNavigate,
  onBack 
}: { 
  user: any, 
  currentUser: any,
  onNavigate: (view: 'main' | 'followers' | 'following') => void,
  onBack?: () => void
}) {
  const [activeTab, setActiveTab] = useState('videos');
  const [showEdit, setShowEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const userData = user?.user_metadata || {};
  const username = userData.username || user?.email?.split('@')[0] || 'user';
  const fullName = userData.full_name || 'TokTok User';
  const avatar = userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;
  const bio = userData.bio || 'Tap + to share your first video! 🚀';

  const isOwnProfile = user?.id === currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      // Fetch Videos
      const vidPromise = isSupabaseConfigured 
        ? supabase.from('videos').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        : Promise.resolve({ data: [], error: null });

      // Fetch Follow Counts
      const followerPromise = isSupabaseConfigured
        ? supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id)
        : Promise.resolve({ count: 0 });

      const followingPromise = isSupabaseConfigured
        ? supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', user.id)
        : Promise.resolve({ count: 0 });

      // Check if following
      const followCheckPromise = (!isOwnProfile && isSupabaseConfigured)
        ? supabase.from('follows').select('*').eq('follower_id', currentUser?.id).eq('following_id', user.id).single()
        : Promise.resolve({ data: null });

      const [vidRes, fRes, fingRes, checkRes] = await Promise.all([
        vidPromise, followerPromise, followingPromise, followCheckPromise
      ]);
      
      if (vidRes.data) setUserVideos(vidRes.data);
      setFollowerCount(fRes.count || 0);
      setFollowingCount(fingRes.count || 0);
      setIsFollowing(!!checkRes.data);
      
      setLoading(false);
    };

    fetchData();
  }, [user?.id, currentUser?.id, isOwnProfile]);

  const toggleFollow = async () => {
    if (!currentUser) return;
    
    // Optimistic UI
    const prevFollowing = isFollowing;
    setIsFollowing(!prevFollowing);
    setFollowerCount(prev => prevFollowing ? prev - 1 : prev + 1);

    if (!isSupabaseConfigured) {
      // Demo mode: just keep the state
      return;
    }

    try {
      if (prevFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', user.id);
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUser.id,
            following_id: user.id
          });
      }
    } catch (err) {
      console.error('Follow error:', err);
      // Revert if error
      setIsFollowing(prevFollowing);
      setFollowerCount(prev => prevFollowing ? prev + 1 : prev - 1);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const stats = [
    { label: 'Following', count: followingCount, id: 'following' },
    { label: 'Followers', count: followerCount, id: 'followers' },
    { label: 'Likes', count: userVideos.reduce((acc, v) => acc + (v.likes || 0), 0), id: 'likes' },
  ];

  return (
    <div className="h-full w-full relative">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full bg-[#010101] overflow-y-auto scrollbar-hide pb-24"
        id="profile-page"
      >
        {/* Profile Header Navigation */}
        <div className="sticky top-0 z-30 bg-[#010101]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <h2 className="text-white font-black italic text-lg tracking-tighter">@{username}</h2>
              <VerifiedBadge className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            {isOwnProfile && (
              <button onClick={handleLogout}>
                <LogOut className="w-5 h-5 text-[#EE1D52]" />
              </button>
            )}
            <button onClick={() => setShowSettings(true)}>
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#69C9D0] to-[#EE1D52] rounded-full blur-[2px] opacity-75 animate-pulse" />
            <div className="relative w-28 h-28 rounded-full border-4 border-[#010101] overflow-hidden bg-zinc-800">
              <img src={avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-1 right-1 bg-[#EE1D52] border-2 border-[#010101] rounded-full p-1">
                <Plus className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          
          <h1 className="mt-4 text-white font-bold text-lg tracking-tight">{fullName}</h1>
          <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase mt-1">
            {isOwnProfile ? 'ACCOUNT OWNER' : 'CREATOR NODE'}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-8 mt-8 w-full justify-center">
            {stats.map(stat => (
              <button 
                key={stat.id} 
                className="flex flex-col items-center group"
                onClick={() => (stat.id === 'followers' || stat.id === 'following') && onNavigate(stat.id)}
              >
                <span className="text-white font-black text-lg tracking-tight group-active:scale-95 transition-transform">{stat.count}</span>
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{stat.label}</span>
              </button>
            ))}
          </div>

          {/* Profile Controls */}
          <div className="flex items-center gap-2 mt-8 px-4 w-full max-w-[320px]">
            {isOwnProfile ? (
              <>
                <button 
                  onClick={() => setShowEdit(true)}
                  className="flex-1 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/90 active:scale-95 transition-all"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-3 bg-white/5 text-white rounded-xl"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={toggleFollow}
                  className={`flex-1 py-3 font-black uppercase text-[10px] tracking-widest rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${
                    isFollowing 
                      ? 'bg-zinc-800 text-white' 
                      : 'bg-white text-black'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-3 h-3" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      Follow
                    </>
                  )}
                </button>
                <button 
                  className="flex-1 py-3 bg-zinc-800 text-white font-black uppercase text-[10px] tracking-widest rounded-xl active:scale-95 transition-all"
                >
                  Message
                </button>
              </>
            )}
          </div>

          <p className="mt-6 text-white/60 text-xs px-12 text-center leading-relaxed">
            {bio}
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-t border-white/5 flex items-center">
          {[
            { id: 'videos', icon: Grid3X3 },
            { id: 'likes', icon: Heart },
            { id: 'bookmarks', icon: Bookmark },
            { id: 'locked', icon: Lock },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex justify-center py-4 relative group`}
            >
              <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-white/30'}`} />
              {activeTab === tab.id && (
                <motion.div layoutId="profile-tab-bar" className="absolute bottom-0 w-12 h-[2px] bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {activeTab === 'videos' && (
          userVideos.length > 0 ? (
            <div className="grid grid-cols-3 gap-[1px] mt-[1px]">
              {userVideos.map((vid) => (
                <div key={vid.id} className="aspect-[3/4] bg-zinc-900 border border-white/5 relative group cursor-pointer overflow-hidden">
                   <video 
                     src={vid.video_url || (vid as any).url} 
                     className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                     preload="metadata"
                   />
                   <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-white fill-current" />
                      <span className="text-white text-[10px] font-bold">{vid.likes || 0}</span>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 opacity-20 space-y-4">
              <Grid3X3 className="w-12 h-12 text-white" />
              <p className="text-[10px] uppercase font-black tracking-[0.4em]">No videos yet</p>
            </div>
          )
        )}

        {(activeTab === 'likes' || activeTab === 'bookmarks' || activeTab === 'locked') && (
           <div className="flex flex-col items-center justify-center py-24 opacity-20 space-y-4">
            <Lock className="w-12 h-12 text-white" />
            <p className="text-[10px] uppercase font-black tracking-[0.4em]">Private content</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showEdit && (
          <EditProfilePage user={user} onBack={() => setShowEdit(false)} />
        )}
        {showSettings && (
          <SettingsPage onBack={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
