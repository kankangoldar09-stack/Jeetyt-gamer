/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { MonitorPlay } from 'lucide-react';
import Splash from './components/Splash.tsx';
import TopNav from './components/TopNav.tsx';
import BottomNav from './components/BottomNav.tsx';
import VideoCard from './components/VideoCard.tsx';
import InboxPage from './components/InboxPage.tsx';
import FriendsPage from './components/FriendsPage.tsx';
import ProfilePage from './components/ProfilePage.tsx';
import CreatePage from './components/CreatePage.tsx';
import FollowList from './components/FollowList.tsx';
import AuthPage from './components/AuthPage.tsx';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const MOCK_USER = {
  id: 'demo-user-123',
  email: 'demo@toktok.app',
  user_metadata: {
    username: 'Demo_Mode',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
  }
};

// Start with zero posts as requested
const MOCK_VIDEOS: any[] = [];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [profileView, setProfileView] = useState<'main' | 'followers' | 'following'>('main');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [viewingUser, setViewingUser] = useState<any>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setUser(MOCK_USER);
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!isSupabaseConfigured) {
          console.warn('TokTok: Supabase not configured. Using high-performance mock feed.');
          setVideos([]);
          return;
        }

        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20); // Only load recent to avoid lag
        
        if (error) {
          console.error('Initial video fetch error:', error);
          setVideos([]);
        } else if (data && data.length > 0) {
          setVideos(data);
        } else {
          setVideos([]);
        }
      } catch (err: any) {
        console.error('System error fetching videos:', err);
        setVideos([]);
      }
    };

    fetchVideos();

    // Optional: Real-time subscription
    let channel: any = null;
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('public:videos')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'videos' }, (payload) => {
          setVideos((prev) => [payload.new, ...prev]);
        })
        .subscribe();
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleUploadSuccess = (newVideo?: any) => {
    if (newVideo) {
      setVideos((prev) => [newVideo, ...prev]);
    }
    setActiveTab('home');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setProfileView('main');
  };

  if (authLoading) return null;

  return (
    <main className="h-screen w-screen bg-[#000000] overflow-hidden flex justify-center font-sans" id="app-root">
      {/* Constraints app to phone size on desktop */}
      <div className="h-full w-full max-w-[450px] bg-[#010101] relative shadow-2xl flex flex-col">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <Splash key="splash" onFinish={() => setShowSplash(false)} />
          ) : !user ? (
            <AuthPage onAuthSuccess={setUser} />
          ) : (
            <div key="main-content" className="h-full w-full flex flex-col relative">
              <div className="absolute inset-0 pointer-events-none technical-grid z-0 opacity-40"></div>
              
              <AnimatePresence>
                {activeTab === 'add' && (
                  <CreatePage onCancel={() => setActiveTab('home')} onUploadSuccess={handleUploadSuccess} />
                )}
              </AnimatePresence>

              {activeTab === 'home' ? (
                <>
                  <TopNav onSearchClick={() => {
                    setActiveTab('friends');
                  }} />
                  {/* Scrollable Feed */}
                  <div 
                    className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide" 
                    id="video-feed-container"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {videos.length > 0 ? (
                      videos.map((video) => (
                        <VideoCard 
                          key={video.id} 
                          video={video} 
                          onProfileClick={(vUser) => {
                            setViewingUser(vUser);
                            setActiveTab('profile');
                          }}
                        />
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center px-12 space-y-6">
                        <div className="relative">
                          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                            <MonitorPlay className="w-10 h-10 text-white/20" />
                          </div>
                          <div className="absolute -inset-2 border border-white/5 rounded-full animate-ping opacity-20" />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-white font-black uppercase tracking-tighter text-xl">Empty Network</h2>
                          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] leading-loose">No node transmissions detected in the current sector.</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('add')}
                          className="px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-full active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                          Broadcast First
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : activeTab === 'friends' ? (
                <FriendsPage initialSearchActive={activeTab === 'friends'} />
              ) : activeTab === 'inbox' ? (
                <InboxPage />
              ) : activeTab === 'profile' ? (
                <div className="flex-1 overflow-hidden relative">
                  <ProfilePage 
                    user={viewingUser || user} 
                    currentUser={user}
                    onNavigate={setProfileView} 
                    onBack={viewingUser ? () => setViewingUser(null) : undefined}
                  />
                  <AnimatePresence>
                    {(profileView === 'followers' || profileView === 'following') && (
                      <FollowList 
                        type={profileView} 
                        onBack={() => setProfileView('main')} 
                        onUserClick={(vUser) => {
                          setViewingUser(vUser);
                          setProfileView('main');
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ) : null}

              <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

