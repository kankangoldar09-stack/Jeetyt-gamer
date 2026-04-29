import { Volume2, VolumeX, Heart, MessageCircle, Bookmark, Share2, Plus, Music2, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef } from 'react';

import VerifiedBadge from './VerifiedBadge';

interface VideoData {
  id: string;
  video_url: string;
  username: string;
  description: string;
  likes: string;
  comments: string;
  bookmarks: string;
  shares: string;
  avatar: string;
  user_id?: string;
}

export default function VideoCard({ video, onProfileClick }: { video: VideoData; onProfileClick?: (user: any) => void; key?: string }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; rotate: number }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.6 } // Video must be 60% visible to play
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotate = (Math.random() - 0.5) * 40; 
    const id = Date.now();

    setIsLiked(true);
    setHearts(prev => {
      const next = [...prev, { id, x, y, rotate }];
      if (next.length > 5) return next.slice(-5); // Keep only 5 active for performance
      return next;
    });
    
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 1000);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProfileClick) {
      onProfileClick({
        id: video.user_id || `user-${video.username}`,
        email: `${video.username}@toktok.app`,
        user_metadata: {
          username: video.username,
          avatar_url: video.avatar
        }
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={toggleMute}
      onDoubleClick={handleDoubleClick}
      className="relative h-screen w-full bg-black flex flex-col snap-start overflow-hidden cursor-pointer" 
      id={`video-card-${video.id}`}
    >
      {/* Video Background - Simplified for performance */}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
        {/* Subtle blurred background shell */}
        <div 
          className="absolute inset-0 opacity-20 blur-xl scale-125"
          style={{ 
            backgroundImage: `url(${video.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <video
          ref={videoRef}
          src={video.video_url || (video as any).url}
          className="relative z-10 max-h-full w-full object-contain pointer-events-none"
          loop
          playsInline
          muted={isMuted}
          preload="metadata"
        />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Mute Indicator Overlay */}
      <AnimatePresence>
        {isMuted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className="bg-black/40 p-4 rounded-full backdrop-blur-sm">
              <VolumeX className="w-12 h-12 text-white opacity-50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-20 right-4 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white/80 border border-white/10 active:scale-90 transition-transform"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Large Like Animation Overlay (TikTok Style) */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ scale: 0, opacity: 0, rotate: heart.rotate }}
              animate={{ 
                scale: [0, 1.5, 1.2], 
                opacity: [1, 1, 0],
                y: [0, -100, -250],
                rotate: heart.rotate + (Math.random() > 0.5 ? 20 : -20)
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                left: heart.x - 48, 
                top: heart.y - 48,
                position: 'absolute'
              }}
            >
              <Heart className="w-24 h-24 text-[#EE1D52] fill-[#EE1D52] drop-shadow-[0_0_20px_rgba(238,29,82,0.6)]" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Right Sidebar UI */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-10" id="video-sidebar">
        {/* User Profile */}
        <div className="relative mb-2">
          <button 
            onClick={handleProfileClick}
            className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white/10 active:scale-90 transition-transform"
          >
            <img 
              src={video.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username || 'default'}`} 
              alt={video.username} 
              className="w-full h-full object-cover" 
            />
          </button>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#EE1D52] rounded-full p-0.5" 
            id="follow-btn"
          >
            <Plus className="w-4 h-4 text-white" />
          </motion.button>
        </div>

        {/* Like */}
        <button 
          onClick={(e) => {
            setIsLiked(!isLiked);
            if (!isLiked) {
              // Simulate a center-tap heart if clicking the button
              const id = Date.now();
              setHearts(prev => [...prev, { id, x: window.innerWidth / 2, y: window.innerHeight / 2, rotate: 0 }]);
              setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1000);
            }
          }} 
          className="flex flex-col items-center gap-1 group"
          id="like-btn"
        >
          <motion.div 
            animate={{ scale: isLiked ? [1, 1.4, 1] : 1 }}
            className={`p-2 rounded-full transition-colors ${isLiked ? 'text-[#EE1D52]' : 'text-white'}`}
          >
            <Heart className={`w-8 h-8 ${isLiked ? 'fill-current' : 'fill-none'}`} />
          </motion.div>
          <span className="text-xs font-bold text-white drop-shadow-md">{isLiked ? '1.3M' : (video.likes || '0')}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1 group" id="comment-btn">
          <motion.div 
            whileTap={{ scale: 1.2 }}
            className="p-2 text-white"
          >
            <MessageCircle className="w-8 h-8 fill-none" />
          </motion.div>
          <span className="text-xs font-bold text-white drop-shadow-md">{video.comments || '0'}</span>
        </button>

        {/* Bookmark */}
        <button 
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="flex flex-col items-center gap-1 group" 
          id="bookmark-btn"
        >
          <motion.div 
            animate={{ rotate: isBookmarked ? [0, -15, 15, 0] : 0 }}
            className={`p-2 transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-white'}`}
          >
            <Bookmark className={`w-8 h-8 ${isBookmarked ? 'fill-current' : 'fill-none'}`} />
          </motion.div>
          <span className="text-xs font-bold text-white drop-shadow-md">{isBookmarked ? '90K' : (video.bookmarks || '0')}</span>
        </button>

        {/* Share */}
        <button 
          onClick={() => {
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
          }}
          className="flex flex-col items-center gap-1 group" 
          id="share-btn"
        >
          <motion.div 
            animate={{ 
              x: isShared ? [0, 10, -10, 0] : 0,
              color: isShared ? '#69C9D0' : '#FFFFFF'
            }}
            className="p-2"
          >
            <Share2 className="w-8 h-8 fill-none" />
          </motion.div>
          <span className="text-xs font-bold text-white drop-shadow-md tracking-tighter">
            {isShared ? 'Shared!' : (video.shares || '0')}
          </span>
        </button>

        {/* Music Disk Animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="mt-4 p-2.5 bg-zinc-800 rounded-full border-4 border-zinc-700 relative overflow-hidden"
          id="music-disk"
        >
           <Music2 className="w-5 h-5 text-white/50" />
           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Bottom Info UI */}
      <div className="absolute left-4 bottom-24 right-20 z-10 space-y-3" id="video-info">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-lg drop-shadow-sm">@{video.username || (video as any).user || 'IndianReels_User'}</h3>
             <VerifiedBadge className="w-4 h-4" />
          </div>
          <p className="text-white text-sm line-clamp-2 drop-shadow-sm leading-snug">
            {video.description}
          </p>
        </div>

        {/* Sound Info */}
        <div className="flex items-center gap-2 max-w-[80%]" id="sound-info">
          <Music2 className="w-4 h-4 text-white animate-pulse" />
          <div className="overflow-hidden flex-1">
            <motion.p
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="text-white text-xs font-medium whitespace-nowrap"
            >
              original sound - {video.username}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
