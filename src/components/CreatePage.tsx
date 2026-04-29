import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Globe, Type, Send, AlertCircle, MessageCircle, Bot, RefreshCw, 
  Camera as CameraIcon, Image as ImageIcon, Music2, FlipHorizontal, 
  Wand2, Timer, Scissors, Smile, ChevronDown, Check, Play, Music
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type CreateMode = 'camera' | 'upload' | 'telegram';

const MOCK_SOUNDS = [
  { id: '1', title: 'Viral Hit 2024', author: 'Top Artist', duration: '0:15' },
  { id: '2', title: 'Summer Vibe', author: 'LoFi Beats', duration: '0:30' },
  { id: '3', title: 'Techno Pulse', author: 'DJ Night', duration: '0:22' },
  { id: '4', title: 'Acoustic Soul', author: 'Indie Artist', duration: '0:15' },
];

export default function CreatePage({ onCancel, onUploadSuccess }: { onCancel: () => void, onUploadSuccess: (video?: any) => void }) {
  const [mode, setMode] = useState<CreateMode>('camera');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [showSounds, setShowSounds] = useState(false);
  const [selectedSound, setSelectedSound] = useState(MOCK_SOUNDS[0]);
  
  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Telegram Cloud State
  const [isFetchingCloud, setIsFetchingCloud] = useState(false);
  const botToken = import.meta.env.VITE_TG_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TG_CHAT_ID;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setUser({ id: 'demo-user', user_metadata: { username: 'Demo_User' } });
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Initialize Camera
  useEffect(() => {
    if (mode === 'camera' && !videoUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, videoUrl, facingMode]);

  const startCamera = async () => {
    try {
      stopCamera(); // Clean up previous stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Camera access denied or device not found.');
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (optional but recommended)
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for demo
        setError('Video too large. Please select a clip under 50MB.');
        return;
      }
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setMode('upload');
      setError(null);
    }
  };

  const fetchCloudVideo = async () => {
    if (!botToken || !botToken.includes(':')) {
      setError('Telegram Bot Token invalid or missing.');
      return;
    }
    
    setIsFetchingCloud(true);
    setError(null);
    
    try {
      console.log('TokTok: Fetching Telegram updates for Chat:', chatId);
      // Fetch more updates to increase chances of finding the video
      const resp = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=50&offset=-50`);
      if (!resp.ok) throw new Error(`Telegram API Error: ${resp.status}`);
      
      const data = await resp.json();
      if (!data.ok) throw new Error(data.description || 'Failed to fetch bot updates');
      
      const updates = [...(data.result || [])].reverse();
      console.log(`TokTok: Found ${updates.length} total updates.`);
      
      let targetMessage = null;
      for (const update of updates) {
        const msg = update.message || update.channel_post || update.edited_message;
        if (!msg) continue;

        const currentChatId = String(msg.chat.id);
        const hasVideo = msg.video || msg.document || msg.animation;
        
        console.log(`TokTok: Checking msg from ${currentChatId}, hasVideo: ${!!hasVideo}`);

        if (chatId && currentChatId !== String(chatId)) continue;
        
        if (hasVideo) {
          targetMessage = msg;
          break;
        }
      }
      
      if (!targetMessage) {
        throw new Error(chatId 
          ? `No recent video found in chat ${chatId}. Make sure you sent a video to this chat recently!`
          : 'No recent video found. Send a video to your bot first!'
        );
      }

      const video = targetMessage.video || targetMessage.document || targetMessage.animation;
      const fileId = video.file_id;
      console.log('TokTok: Found video file_id:', fileId);

      const fileResp = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
      const fileData = await fileResp.json();
      if (!fileData.ok) throw new Error('Could not retrieve video file path');

      const url = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
      console.log('TokTok: Video URL generated successfully.');
      setVideoUrl(url);
      const videoCaption = targetMessage.caption || 'Imported from Telegram Cloud ☁️';
      if (targetMessage.caption) setDescription(targetMessage.caption);
      setMode('upload');

      // Auto-save to Supabase if configured
      if (isSupabaseConfigured) {
        const userData = user?.user_metadata || {};
        const username = userData.username || userData.full_name || user?.email?.split('@')[0] || `User_${user?.id?.slice(0, 5) || 'Guest'}`;
        const avatar = userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || Date.now()}`;

        const autoVideoData = {
          id: `tg-${fileId}-${Date.now()}`,
          user_id: user?.id || 'anonymous',
          video_url: url,
          url: url,
          description: videoCaption,
          username: username,
          user: username,
          avatar: avatar,
          likes: '0',
          comments: '0',
          shares: '0',
          bookmarks: '0',
          sound_name: 'Original Sound (Telegram)',
          soundName: 'Original Sound (Telegram)',
          created_at: new Date().toISOString()
        };

        // Attempt save with simple retry
        const saveToDb = async () => {
          try {
            const { error: saveErr } = await supabase.from('videos').insert([autoVideoData]);
            if (saveErr) throw saveErr;
            console.log('TokTok: Automatically saved Telegram video to database.');
            setStatus('Cloud Video Saved! ✅');
            setTimeout(() => setStatus(null), 3000);
          } catch (e) {
            console.error('Auto-save retry error:', e);
          }
        };
        
        saveToDb();
      }
      
    } catch (err: any) {
      console.error('Cloud Fetch Error:', err);
      setError(err.message === 'Failed to fetch' 
        ? 'Network Error: Cannot reach Telegram. Check Bot Token.' 
        : `Cloud: ${err.message}`
      );
    } finally {
      setIsFetchingCloud(false);
    }
  };

  const handlePublish = async () => {
    if (!videoUrl) {
      setError('Please select or capture a video first');
      return;
    }

    setLoading(true);
    setError(null);

    const userData = user?.user_metadata || {};
    // Extract name - Priority: metadata username > metadata full_name > email prefix > user_id
    const username = userData.username || userData.full_name || user?.email?.split('@')[0] || `User_${user?.id?.slice(0, 5) || 'Guest'}`;
    const avatar = userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || Date.now()}`;

    const videoData = {
      id: `local-${Date.now()}`,
      user_id: user?.id || 'anonymous',
      video_url: videoUrl,
      url: videoUrl, 
      description: description || 'Proudly Indian 🇮🇳',
      username: username,
      user: username, 
      avatar: avatar,
      likes: '0',
      comments: '0',
      shares: '0',
      bookmarks: '0',
      sound_name: selectedSound?.title || 'Original Sound',
      soundName: selectedSound?.title || 'Original Sound'
    };

    try {
      setLoading(true);
      setError(null);
      setStatus('Uploading to Telegram...');

      // 1. Send to Telegram if Token/ChatID exists
      let permanentUrl = videoUrl;
      if (botToken && chatId) {
        try {
          const formData = new FormData();
          formData.append('chat_id', chatId);
          formData.append('caption', `🎬 *New Reel by ${username}*\n\n📝 ${description || 'No description'}\n\n🎵 ${selectedSound?.title || 'Original Sound'}`);
          formData.append('parse_mode', 'Markdown');

          if (videoUrl.startsWith('blob:')) {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            formData.append('video', blob, 'video.mp4');
          } else {
            formData.append('video', videoUrl);
          }

          const tgResp = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
            method: 'POST',
            body: formData,
          });
          
          if (!tgResp.ok) {
            const tgErr = await tgResp.json();
            console.warn('Telegram Upload failed:', tgErr);
            setStatus('Telegram failed, trying database...');
          } else {
            console.log('Successfully uploaded to Telegram');
            const tgData = await tgResp.json();
            const fileId = tgData.result?.video?.file_id || tgData.result?.document?.file_id;
            
            if (fileId) {
              // Try to get permanent file path
              const pathResp = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
              const pathData = await pathResp.json();
              if (pathData.ok) {
                permanentUrl = `https://api.telegram.org/file/bot${botToken}/${pathData.result.file_path}`;
                console.log('TokTok: Generated permanent URL from Telegram:', permanentUrl);
              }
            }
            setStatus('Telegram success! Saving to database...');
          }
        } catch (tgError) {
          console.error('Telegram API Error:', tgError);
          setStatus('Telegram error, trying database...');
        }
      }

      console.log('TokTok: Starting database process...', { isSupabaseConfigured });

      // Update videoData with potentially more permanent URL
      const finalVideoData = { ...videoData, video_url: permanentUrl, url: permanentUrl };

      if (!isSupabaseConfigured) {
        console.warn('TokTok: No DB config. Using simulated share.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        onUploadSuccess(finalVideoData);
        return;
      }

      // If configured, try to insert with retries
      let retryCount = 0;
      const maxRetries = 3;
      let finalData = null;
      let finalError = null;

      while (retryCount <= maxRetries) {
        try {
          const insertPromise = supabase
            .from('videos')
            .insert([finalVideoData])
            .select();

          // Increase timeout to 120 seconds for slow/mobile connections
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timed out after 120s')), 120000)
          );

          const result: any = await Promise.race([insertPromise, timeoutPromise]);
          finalData = result.data;
          finalError = result.error;

          if (!finalError) break; // Success!
        } catch (attemptErr: any) {
          finalError = attemptErr;
          console.warn(`TokTok: DB Insert attempt ${retryCount + 1} failed:`, attemptErr.message);
        }
        
        retryCount++;
        if (retryCount <= maxRetries) {
          setStatus(`Retrying save (${retryCount}/${maxRetries})...`);
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      if (finalError) {
        throw new Error(finalError.message || 'Database connection unreachable');
      }
      
      console.log('TokTok: Published to Supabase:', finalData);
      onUploadSuccess(finalData?.[0] || finalVideoData);
    } catch (err: any) {
      console.error('TokTok Publish Error:', err);
      
      // Fallback to local success if it's a connection/timeout issue
      if (err.message?.includes('fetch') || err.message?.includes('timeout') || err.name === 'TypeError') {
        console.warn('TokTok: Network issue, falling back to local demo mode.');
        setError('Network slow. Posting in Local Mode...');
        // Ensure loading is off so user sees the "Post in Local Mode" message if it takes time
        setLoading(false);
        setTimeout(() => onUploadSuccess(videoData), 1200);
      } else {
        setError(`Post Failed: ${err.message}`);
        setLoading(false);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[120] flex flex-col font-sans overflow-hidden"
      id="instagram-pro-create"
    >
      {/* Background Layer: Camera or Preview */}
      <div className="absolute inset-0 z-0 bg-zinc-900">
        {mode === 'camera' && !videoUrl ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain bg-black"
            style={{ transform: 'none' }} // Removing mirror effect as requested "flip wala nhai"
          />
        ) : videoUrl ? (
          <video 
            src={videoUrl}
            autoPlay 
            loop 
            muted
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
             <div className="w-16 h-16 border-2 border-white/10 rounded-full animate-spin border-t-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Header Controls */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button onClick={onCancel} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <X className="w-7 h-7" />
        </button>
        
        <button 
          onClick={() => setShowSounds(true)}
          className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold"
        >
          <Music2 className="w-4 h-4 text-[#69C9D0]" />
          {selectedSound ? selectedSound.title : 'Add Music'}
        </button>

        <div className="w-7" />
      </div>

      {/* Sidebar Toolset */}
      <div className="absolute right-6 top-24 z-10 flex flex-col gap-6">
        {[
          { icon: FlipHorizontal, label: 'Flip', onClick: toggleCamera },
          { icon: Wand2, label: 'Effects' },
          { icon: Timer, label: 'Speed' },
          { icon: Smile, label: 'Filters' },
        ].map((tool, i) => (
          <button 
            key={i} 
            onClick={tool.onClick}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 group-active:scale-95 transition-all text-white">
              <tool.icon className="w-5 h-5" />
            </div>
            {tool.label && <span className="text-white text-[9px] font-bold uppercase tracking-widest drop-shadow-md">{tool.label}</span>}
          </button>
        ))}
      </div>

      {/* Bottom Main UI */}
      <div className="relative z-10 mt-auto pb-12 px-6 space-y-8">
        
        {/* Caption Panel (If video ready) */}
        {videoUrl && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-5 shadow-2xl"
          >
            <div className="flex gap-4">
              <div className="w-16 h-20 bg-zinc-800 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 relative">
                 <video src={videoUrl} className="w-full h-full object-cover" muted referrerPolicy="no-referrer" />
                 <div className="absolute inset-0 bg-black/20" />
              </div>
              <textarea 
                placeholder="Write a caption... #reels #video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm focus:outline-none resize-none pt-1 placeholder:text-white/20"
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-2 flex items-center gap-3">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                 <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider line-clamp-1">{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button 
                onClick={() => { setVideoUrl(''); setMode('camera'); }}
                className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl active:scale-95 transition-all"
              >
                Discard
              </button>
              <button 
                onClick={handlePublish}
                disabled={loading}
                className="flex-[2] py-4 bg-[#EE1D52] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-[#EE1D52]/20"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Share Reel</>}
              </button>
            </div>
          </motion.div>
        )}

        {/* Record/Action Row */}
        {!videoUrl && (
          <div className="flex items-center justify-around px-4">
            <label className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white group-active:scale-90 transition-all overflow-hidden relative shadow-lg">
                 <ImageIcon className="w-7 h-7" />
                 <input type="file" accept="video/*" className="hidden" onChange={handleLocalUpload} />
              </div>
              <span className="text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">Album</span>
            </label>

            <button 
              onClick={() => setIsRecording(!isRecording)}
              className="relative group p-1"
            >
              <div className="absolute inset-0 bg-[#EE1D52] rounded-full blur-[12px] opacity-40 group-hover:opacity-60 transition-all" />
              <div className="relative w-24 h-24 rounded-full border-4 border-white/90 flex items-center justify-center transition-all group-active:scale-90">
                 <div className={`transition-all duration-300 bg-[#EE1D52] ${isRecording ? 'w-10 h-10 rounded-lg' : 'w-20 h-20 rounded-full shadow-inner'}`} />
              </div>
            </button>

            <button 
              onClick={fetchCloudVideo}
              disabled={isFetchingCloud}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-14 h-14 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white transition-all shadow-lg ${isFetchingCloud ? 'animate-pulse' : 'group-active:scale-90'}`}>
                 {isFetchingCloud ? <RefreshCw className="w-7 h-7 animate-spin" /> : <Bot className="w-7 h-7" />}
              </div>
              <span className="text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">Cloud</span>
            </button>
          </div>
        )}

        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-8 overflow-x-auto no-scrollbar py-2">
           {['Post', 'Story', 'Reel', 'Live'].map((m) => (
             <button 
               key={m} 
               onClick={() => {
                 if (m === 'Reel') { setMode('camera'); setVideoUrl(''); }
               }}
               className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap ${m === 'Reel' ? 'text-white scale-110' : 'text-white/30 hover:text-white/50'}`}
             >
               {m}
             </button>
           ))}
        </div>
      </div>

      {/* Sounds Modal */}
      <AnimatePresence>
        {showSounds && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 bg-[#010101] z-[130] flex flex-col"
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
              <button onClick={() => setShowSounds(false)} className="text-white"><X className="w-6 h-6"/></button>
              <h2 className="text-white font-bold">Music library</h2>
              <div className="w-6"/>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div className="bg-zinc-900 rounded-xl p-4 flex items-center gap-3">
                 <Music className="w-5 h-5 text-white/40" />
                 <input type="text" placeholder="Search sounds..." className="bg-transparent border-none text-white text-sm focus:outline-none flex-1" />
              </div>
              <div className="space-y-1">
                {MOCK_SOUNDS.map(sound => (
                  <button 
                    key={sound.id}
                    onClick={() => { setSelectedSound(sound); setShowSounds(false); }}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#EE1D52]/20 transition-colors">
                          <Play className="w-5 h-5 text-white" />
                       </div>
                       <div className="text-left">
                          <p className="text-white text-sm font-bold">{sound.title}</p>
                          <p className="text-white/40 text-xs">{sound.author} • {sound.duration}</p>
                       </div>
                    </div>
                    {selectedSound.id === sound.id && <Check className="w-5 h-5 text-[#69C9D0]" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification (Error or Status) */}
      <AnimatePresence>
        {(error || status) && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`absolute top-0 left-6 right-6 z-[150] p-4 rounded-2xl flex items-center gap-3 shadow-2xl ${error ? 'bg-[#EE1D52]' : 'bg-zinc-800'}`}
          >
            {error ? <AlertCircle className="w-5 h-5 text-white" /> : <RefreshCw className="w-5 h-5 text-[#69C9D0] animate-spin" />}
            <p className="text-white text-xs font-bold uppercase tracking-wider">{error || status}</p>
            <button onClick={() => { setError(null); setStatus(null); }} className="ml-auto"><X className="w-4 h-4 text-white/60"/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
