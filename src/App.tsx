/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import InteractiveCursor from './components/InteractiveCursor';
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Camera, 
  Music, 
  Music2, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Square, 
  X, 
  ChevronRight,
  ChevronLeft,
  Gift,
  Coffee,
  Utensils,
  Camera as CameraIcon,
  Flower,
  Download
} from 'lucide-react';

function MusicSlash({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9 18V5l12-2v13" className="opacity-50" />
      <circle cx="6" cy="18" r="3" className="opacity-50" />
      <circle cx="18" cy="16" r="3" className="opacity-50" />
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

type StripColor = 'soft-pink' | 'pink' | 'blue' | 'black' | 'brown' | 'white';

interface ColorOption {
  id: StripColor;
  name: string;
  dotColor: string;
  bgColor: string;
  borderColor: string;
  activeColor: string;
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; duration: number; delay: number; scale: number; opacity: number; sway: number }[]>([]);

  useEffect(() => {
    // Generate a set of static randomized hearts on mount to prevent any infinite run loop overhead
    const initialHearts = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: Math.random() * 92 + 4, // 4% to 96%
      size: Math.random() * 12 + 10, // 10px to 22px
      duration: Math.random() * 12 + 14, // 14s to 26s for elegant slow drift
      delay: Math.random() * -30, // negative delay so they are instantly scattered up the screen on load
      scale: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      opacity: Math.random() * 0.2 + 0.12, // subtle opacity range (12% to 32%)
      sway: Math.random() * 50 - 25, // horizontal sway range
    }));
    setHearts(initialHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[45]">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0 text-pink-400/70"
          style={{
            left: `${heart.left}%`,
            opacity: heart.opacity,
            fontSize: `${heart.size}px`,
          }}
          animate={{
            y: ['105vh', '-10vh'],
            x: [0, heart.sway, -heart.sway * 1.2, heart.sway * 0.8, 0],
            rotate: [0, heart.sway * 1.5, -heart.sway * 1.5, 0],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          <svg
            className="w-full h-full fill-current"
            viewBox="0 0 24 24"
            width={heart.size}
            height={heart.size}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

interface MemoryVideoPlayerProps {
  videoSrc: string;
  onPlayStateChange: (isPlaying: boolean) => void;
  memoryVideoRef: React.RefObject<HTMLVideoElement | null>;
}

function MemoryVideoPlayer({ videoSrc, onPlayStateChange, memoryVideoRef }: MemoryVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const video = memoryVideoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleTimeUpdate = () => {
    const video = memoryVideoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = memoryVideoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = memoryVideoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = memoryVideoRef.current;
    if (!video) return;
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    video.volume = vol;
    if (vol === 0) {
      setIsMuted(true);
      video.muted = true;
    } else {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const toggleMute = () => {
    const video = memoryVideoRef.current;
    if (!video) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    video.muted = nextMute;
    if (nextMute) {
      video.volume = 0;
    } else {
      video.volume = volume;
    }
  };

  const toggleFullscreen = () => {
    const video = memoryVideoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative w-full aspect-video md:aspect-[16/9] max-w-2xl bg-neutral-900 rounded-2xl md:rounded-3xl overflow-hidden border border-pink-100 shadow-xl group/player"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={memoryVideoRef}
        src={videoSrc}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => {
          setIsPlaying(true);
          onPlayStateChange(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          onPlayStateChange(false);
        }}
        playsInline
      />

      {/* Big Animated Center Play Overlay Button */}
      <AnimatePresence>
        {(!isPlaying || !showControls) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/10">
            {!isPlaying && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileActive={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-16 h-16 md:w-20 md:h-20 bg-white/90 hover:bg-white text-[#ff70ae] rounded-full flex items-center justify-center shadow-2xl border border-pink-100/50 pointer-events-auto cursor-pointer"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 fill-current translate-x-0.5 text-[#ff70ae]" />
              </motion.button>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Styled Controls Overlay */}
      <motion.div 
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 5 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 md:p-4 flex flex-col gap-2 md:gap-3 z-20 pointer-events-auto"
      >
        {/* Progress Slider (Timeline Track) */}
        <div className="flex items-center gap-3 w-full group/timeline">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 h-1.5 rounded-lg bg-white/30 accent-[#ff70ae] cursor-pointer hover:h-2 transition-all appearance-none"
          />
        </div>

        {/* Action Button Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Play/Pause icon button */}
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-[#ff70ae] transition-colors focus:outline-none cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />}
            </button>

            {/* Time labels */}
            <span className="text-white/90 text-[10px] md:text-xs font-mono select-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volume control */}
            <div className="flex items-center gap-1.5 md:gap-2 group/volume">
              <button
                type="button"
                onClick={toggleMute}
                className="text-white hover:text-[#ff70ae] transition-colors focus:outline-none cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-12 sm:w-16 h-1 rounded-lg bg-white/20 accent-white group-hover/volume:w-16 sm:group-hover/volume:w-20 cursor-pointer transition-all appearance-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Fullscreen Option */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-white hover:text-[#ff70ae] transition-colors focus:outline-none cursor-pointer"
              title="Full screen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const COLOR_OPTIONS: ColorOption[] = [
  { id: 'soft-pink', name: 'Soft Pink', dotColor: '#ffd2e1', bgColor: 'bg-[#fff0f4]', borderColor: 'border-[#ffccd7]', activeColor: 'ring-2 ring-pink-300 shadow-xs' },
  { id: 'pink', name: 'Pink', dotColor: '#ff70ae', bgColor: 'bg-[#ffeaf3]', borderColor: 'border-[#ffaed1]', activeColor: 'ring-2 ring-pink-400 shadow-xs' },
  { id: 'blue', name: 'Blue', dotColor: '#7cb1ff', bgColor: 'bg-[#ecf4ff]', borderColor: 'border-[#cbdfff]', activeColor: 'ring-2 ring-blue-300 shadow-xs' },
  { id: 'black', name: 'Black', dotColor: '#1f2937', bgColor: 'bg-[#f3f4f6]', borderColor: 'border-[#cbd5e1]', activeColor: 'ring-2 ring-gray-600 shadow-xs' },
  { id: 'brown', name: 'Brown', dotColor: '#a16a3f', bgColor: 'bg-[#faf6f0]', borderColor: 'border-[#e2d1bd]', activeColor: 'ring-2 ring-amber-700 shadow-xs' },
  { id: 'white', name: 'White', dotColor: '#ffffff', bgColor: 'bg-[#ffffff]', borderColor: 'border-[#e4e5e7]', activeColor: 'ring-2 ring-gray-300 shadow-xs' },
];

export default function App() {
  const pageRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const memoryVideoRef = useRef<HTMLVideoElement>(null);

  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageSectionProgress, setImageSectionProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showDownloadChoice, setShowDownloadChoice] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'photobooth'>('landing');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isMemoryPlaying, setIsMemoryPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [galleryToast, setGalleryToast] = useState<string | null>(null);
  const [currentInviteImage, setCurrentInviteImage] = useState(0);
  const [activeScheduleStep, setActiveScheduleStep] = useState(0);
  const [isSurpriseButtonHovered, setIsSurpriseButtonHovered] = useState(false);
  const [letterLanguage, setLetterLanguage] = useState<'en' | 'id'>('en');
  const [isHoveringSignature, setIsHoveringSignature] = useState(false);
  const [fallingHearts, setFallingHearts] = useState<Array<{
    id: number;
    x: number;
    size: number;
    duration: number;
    emoji: string;
    rotation: number;
  }>>([]);

  useEffect(() => {
    if (!isHoveringSignature) return;

    // Immediately trigger a small initial burst when hovering over the signature
    const initialHearts = Array.from({ length: 8 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: Math.random() * 90 + 5, // Keep within 5% to 95%
      size: Math.random() * 14 + 14, // 14px to 28px
      duration: Math.random() * 1.5 + 2.0, // 2s to 3.5s
      emoji: ['💝', '💖', '💕', '💗', '💓', '❤️', '🧁', '✨', '🌸'][Math.floor(Math.random() * 9)],
      rotation: Math.random() * 120 - 60,
    }));
    setFallingHearts((prev) => [...prev, ...initialHearts]);

    // Create custom interval to keep generating falling hearts while hovered
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5,
        size: Math.random() * 14 + 14,
        duration: Math.random() * 1.5 + 2.0,
        emoji: ['💝', '💖', '💕', '💗', '💓', '❤️', '🧁', '✨', '🌸'][Math.floor(Math.random() * 9)],
        rotation: Math.random() * 120 - 60,
      };
      setFallingHearts((prev) => {
        const filtered = prev.filter((h) => Date.now() - h.id < 4500);
        return [...filtered, newHeart];
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isHoveringSignature]);

  useEffect(() => {
    if (fallingHearts.length === 0) return;
    const timer = setTimeout(() => {
      setFallingHearts((prev) => prev.filter((h) => Date.now() - h.id < 4500));
    }, 1000);
    return () => clearTimeout(timer);
  }, [fallingHearts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInviteImage((prev) => (prev + 1) % invitationImages.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (galleryToast) {
      const timer = setTimeout(() => {
        setGalleryToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [galleryToast]);

  // Supabase public URL for assets (keeping user's provided ones)
  const dresscodeImage = 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/dresscode/3D%20ami.png';
  const memoryVideo = 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Our-Video.mov';
  const imageSectionImage = 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/background/Ours%202.png';

  // Helper to check for placeholder URLs
  const isPlaceholder = (url: string) => !url || url.includes('YOUR_PROJECT') || url.includes('PASTE');

  const backgroundImages = {
    cuteAmi: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/background/Cute%20Ami%202.png',
    love: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/background/love.png',
    tree: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/background/tree.png',
  };

  const invitationImages = [
    'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/invitation/lil%20ami%202.png',
    'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/invitation/lil%20ami.png'
  ];

  const sectionNav = [
    { id: 'hero', label: 'Home' },
    { id: 'invitation', label: 'Invitation' },
    { id: 'dresscode', label: 'Dresscode' },
    { id: 'schedule', label: "Today's Plan" },
    { id: 'image-section', label: 'Our Album' },
    { id: 'video-section', label: 'Our Video' },
    { id: 'letter', label: 'A Little Note' },
    { id: 'surprise', label: 'Last Thing' },
  ];

  const floatingBackground = [
    { src: backgroundImages.cuteAmi, wrapperClass: 'top-[9%] left-[5%] md:left-[7%]', imageClass: 'w-28 md:w-44', parallax: -120, rotate: -10, duration: 8 },
    { src: backgroundImages.cuteAmi, wrapperClass: 'top-[43%] right-[2%] md:right-[7%]', imageClass: 'w-24 md:w-40', parallax: -76, rotate: 9, duration: 9 },
    { src: backgroundImages.love, wrapperClass: 'top-[18%] right-[11%] md:right-[20%]', imageClass: 'w-10 md:w-14', parallax: -150, rotate: 14, duration: 7 },
    { src: backgroundImages.love, wrapperClass: 'top-[58%] left-[9%] md:left-[17%]', imageClass: 'w-9 md:w-12', parallax: -96, rotate: -12, duration: 8.5 },
    { src: backgroundImages.love, wrapperClass: 'top-[76%] right-[18%] md:right-[24%]', imageClass: 'w-8 md:w-11', parallax: -132, rotate: -6, duration: 7.8 },
    { src: backgroundImages.love, wrapperClass: 'top-[31%] left-[18%] md:left-[26%]', imageClass: 'w-8 md:w-11', parallax: -64, rotate: 10, duration: 9.2 },
  ];

  const bottomTrees = [
    { src: backgroundImages.tree, wrapperClass: 'bottom-[-18px] left-[-34px] md:left-[calc(50%-38rem)]', imageClass: 'w-48 md:w-72', parallax: -48 },
    { src: backgroundImages.tree, wrapperClass: 'bottom-[-24px] right-[-44px] md:right-[calc(50%-39rem)]', imageClass: 'w-44 scale-x-[-1] md:w-72', parallax: -64 },
  ];

  const schedule = [
    { 
      time: '12:00', 
      title: 'Pickup My Princess 🚗', 
      desc: 'The best part of today starts when I see you. 💕', 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/Pick%20up.png',
      icon: <Heart className="w-5 h-5 text-[#ff70ae]" /> 
    },
    { 
      time: '13:00', 
      title: 'Photobooth 📸✨', 
      desc: "Let's capture the first smiles of your birthday before our adventure begins.", 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/Photobooth.png',
      icon: <CameraIcon className="w-5 h-5 text-[#ff70ae]" /> 
    },
    { 
      time: '14:00', 
      title: 'Lunch Date 🤫💖', 
      desc: "A little birthday surprise I've been keeping just for you.", 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/Lunch.png',
      icon: <Utensils className="w-5 h-5 text-[#ff70ae]" /> 
    },
    { 
      time: '16:00', 
      title: 'Open The Gifts 🎀✨', 
      desc: "I've been waiting for this moment for so long... surprise time.", 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/Gifts%20(1).png',
      icon: <Gift className="w-5 h-5 text-[#ff70ae]" /> 
    },
    { 
      time: '17:00 - end', 
      title: 'Just Us ❤️', 
      desc: 'No plans, no rush. Just us, good music, and little moments together.', 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/Strolling%20around.png',
      icon: <Flower className="w-5 h-5 text-[#ff70ae]" /> 
    },
  ];

  const scrollToSection = (sectionId: string) => {
    if (!invitationOpened) return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePageScroll = () => {
    const page = pageRef.current;
    if (!page) return;

    if (!invitationOpened) {
      if (page.scrollTop > 0) {
        page.scrollTop = 0;
      }
      return;
    }

    const sectionIndex = Math.round(page.scrollTop / window.innerHeight);
    const section = sectionNav[Math.min(sectionNav.length - 1, Math.max(0, sectionIndex))];
    const maxScroll = page.scrollHeight - page.clientHeight;
    
    const imageSectionIndex = sectionNav.findIndex((item) => item.id === 'image-section');
    const imageSectionStart = imageSectionIndex * window.innerHeight;
    const imageToLetterProgress = (page.scrollTop - imageSectionStart) / (window.innerHeight * 2);

    setActiveSection(section.id);
    setScrollProgress(maxScroll > 0 ? page.scrollTop / maxScroll : 0);
    setImageSectionProgress(Math.min(1, Math.max(0, imageToLetterProgress)));
  };

  const triggerIntenseBirthdayConfetti = () => {
    // Left side burst
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { x: 0.1, y: 0.85 },
      colors: ['#ff70ae', '#ff3366', '#ffccd5', '#ffd700', '#ffffff', '#e879f9'],
      ticks: 350,
      scalar: 1.2,
    });
    // Right side burst
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { x: 0.9, y: 0.85 },
      colors: ['#ff70ae', '#ff3366', '#ffccd5', '#ffd700', '#ffffff', '#e879f9'],
      ticks: 350,
      scalar: 1.2,
    });
    // Center rocket explosion of hearts/stars and colorful particles
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#ff1493', '#ff69b4', '#ff85a1', '#ffd700', '#fff0f5'],
        ticks: 240,
        scalar: 1.4,
      });
    }, 180);
    // Extra mini delay bursts for that magical continuing shower feel
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 75,
        origin: { x: 0.2, y: 0.7 },
        colors: ['#ff70ae', '#ffd700'],
        ticks: 200,
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 75,
        origin: { x: 0.8, y: 0.7 },
        colors: ['#ff70ae', '#ffd700'],
        ticks: 200,
      });
    }, 400);
  };

  const handleOpenInvitation = () => {
    setIsOpening(true);
    setIsPlaying(true);
    triggerIntenseBirthdayConfetti();
    
    setTimeout(() => {
      setInvitationOpened(true);
      setTimeout(() => {
        setIsOpening(false);
        document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth' });
        // Secondary triumphant burst when scrolling fits the screen
        setTimeout(() => {
          triggerIntenseBirthdayConfetti();
        }, 500);
      }, 1500);
    }, 500);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleSurprise = () => {
    if (currentView === 'photobooth') {
      stopCamera();
      setShowCamera(false);
      setCapturedPhoto(null);
      setCameraError(null);
      setCurrentView('landing');
      setShowSurprise(false);
    } else {
      setShowSurprise(true);
      setCurrentView('photobooth');
    }
  };

  const handleCameraBack = () => {
    stopCamera();
    setCapturedPhotos(Array(photoMode).fill(null));
    setCapturedPhoto(null);
    setShowCamera(false);
    setShowSurprise(false);
    setCurrentView('landing');
    setMobilePhotoboothStep('capture');
  };

  const handleOpenCamera = async () => {
    setMobilePhotoboothStep('capture');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setShowCamera(true);
      
      // Delay slightly to ensure video element is mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Video play failed:", e));
          };
        }
      }, 100);
    } catch (error: any) {
      console.error('Camera access error:', error);
      setCameraError(error.message || "Could not access camera. Please check permissions.");
    }
  };

  const [photoMode, setPhotoMode] = useState<3 | 6>(3);
  const [capturedPhotos, setCapturedPhotos] = useState<(string | null)[]>([null, null, null]);
  const [stripDesign, setStripDesign] = useState<StripColor>('soft-pink');
  const [mobilePhotoboothStep, setMobilePhotoboothStep] = useState<'capture' | 'preview'>('capture');

  const handlePhotoModeChange = (mode: 3 | 6) => {
    setPhotoMode(mode);
    setCapturedPhotos(Array(mode).fill(null));
    setActiveSlotIndex(0);
  };

  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);

  const captureSingleShot = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    
    // We capture wide 16:9 ratio high-res image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1280;
    tempCanvas.height = 720;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    
    // Mirror the video naturally for a natural front hook
    ctx.save();
    ctx.translate(tempCanvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    ctx.restore();
    
    const shotDataUrl = tempCanvas.toDataURL('image/png');
    
    // Trigger shutter flash
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 150);

    const updated = [...capturedPhotos];
    updated[activeSlotIndex] = shotDataUrl;
    setCapturedPhotos(updated);

    // Auto-advance to the next empty slot
    const nextEmptyIndex = updated.findIndex((item) => item === null);
    if (nextEmptyIndex !== -1) {
      setActiveSlotIndex(nextEmptyIndex);
    } else {
      setMobilePhotoboothStep('preview');
    }
  };

  const handleCapturePhoto = () => {
    if (isCountingDown || shutterFlash || !showCamera) return;
    
    setIsCountingDown(true);
    let secondsLeft = 3;
    setCountdown(secondsLeft);
    
    const timer = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        setCountdown(secondsLeft);
      } else {
        clearInterval(timer);
        setCountdown(null);
        setIsCountingDown(false);
        // Take single photo
        captureSingleShot();
      }
    }, 850); // Countdown speed
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.error(`Failed to load ${src}, falling back with mock box`);
        const dummy = document.createElement('canvas');
        dummy.width = 100;
        dummy.height = 100;
        const dImg = new Image();
        dImg.src = dummy.toDataURL();
        resolve(dImg);
      };
      img.src = src;
    });
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#ff70ae';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size/1.5, -size/1.5, -size * 1.2, size/3, 0, size);
    ctx.bezierCurveTo(size * 1.2, size/3, size/1.5, -size/1.5, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  const generateCompositeStrip = async (photos: string[]) => {
    const isDouble = photoMode === 6;
    if (photos.length < (isDouble ? 6 : 3) || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size
    canvas.width = isDouble ? 1280 : 640;
    canvas.height = 1600;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Helper to draw a vertical column of 3 photos
    const drawColumn = async (colPhotos: string[], startX: number) => {
      for (let i = 0; i < 3; i++) {
        const yOffset = 80 + i * (340 + 40); // Y: 80, 460, 840
        try {
          const img = await loadImage(colPhotos[i]);
          ctx.save();
          // Inner clipping block
          ctx.beginPath();
          ctx.roundRect(startX + 52, yOffset + 12, 536, 316, 16);
          ctx.clip();
          
          // Cover crop
          const imgAspect = img.width / img.height;
          const targetAspect = 536 / 316;
          let dx, dy, dw, dh;
          if (imgAspect > targetAspect) {
            dh = img.height;
            dw = dh * targetAspect;
            dx = (img.width - dw) / 2;
            dy = 0;
          } else {
            dw = img.width;
            dh = dw / targetAspect;
            dx = 0;
            dy = (img.height - dh) / 2;
          }
          ctx.drawImage(img, dx, dy, dw, dh, startX + 52, yOffset + 12, 536, 316);
          ctx.restore();
        } catch (err) {
          console.error("Column drawing error:", err);
        }
      }
    };

    if (isDouble) {
      // Draw first column (photos 0, 1, 2)
      await drawColumn(photos.slice(0, 3), 0);
      // Draw second column (photos 3, 4, 5)
      await drawColumn(photos.slice(3, 6), 640);
    } else {
      await drawColumn(photos, 0);
    }

    // Overlay the beautiful custom design Frame on top of everything!
    try {
      const frame1Strips: Record<StripColor, string> = {
        'soft-pink': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Soft%20Pink.png',
        'pink': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Pink.png',
        'blue': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Blue.png',
        'black': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Black.png',
        'brown': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Brown.png',
        'white': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20White.png',
      };

      const frame2Strips: Record<StripColor, string> = {
        'soft-pink': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Soft%20Pink.png',
        'pink': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Pink.png',
        'blue': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Blue.png',
        'black': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Black.png',
        'brown': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Brown.png',
        'white': 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20White.png',
      };

      const frameUrl = isDouble ? frame2Strips[stripDesign] : frame1Strips[stripDesign];
      const frameImg = await loadImage(frameUrl);
      if (isDouble) {
        ctx.drawImage(frameImg, 0, 0, 1280, 1600);
      } else {
        ctx.drawImage(frameImg, 0, 0, 640, 1600);
      }
    } catch (e) {
      console.error("Error overlaying custom Frame:", e);
    }

    const resultUrl = canvas.toDataURL('image/png');
    setCapturedPhoto(resultUrl);
    setUploadStatus('idle'); // Settle idle for uploading
  };

  const triggerConfetti = () => {
    // Elegant left burst
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { x: 0.1, y: 0.6 },
      colors: ['#ff70ae', '#ffb6d5', '#ffccd5', '#ffffff', '#ffd700'],
      ticks: 280
    });
    // Elegant right burst
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { x: 0.9, y: 0.6 },
      colors: ['#ff70ae', '#ffb6d5', '#ffccd5', '#ffffff', '#ffd700'],
      ticks: 280
    });
    // Magical center delay burst
    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 110,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#ff70ae', '#ffd700', '#ffffff'],
        ticks: 200
      });
    }, 250);
  };

  const downloadLetterAsImage = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1150;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Enable text smoothing
      ctx.imageSmoothingEnabled = true;

      // 1. Background Gradient (Soft warm white to cute pale rose-crest)
      const bgGrad = ctx.createLinearGradient(0, 0, 800, 1150);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.5, '#fffefd');
      bgGrad.addColorStop(1, '#fff4f6');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1150);

      // 2. Vintage Grid texture
      ctx.fillStyle = 'rgba(255, 112, 174, 0.08)';
      for (let x = 0; x < 800; x += 32) {
        for (let y = 0; y < 1150; y += 32) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // 3. Double Borders
      // Outer pinstripe border
      ctx.strokeStyle = '#ffeaf1';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 1090);

      // Inner dotted/dashed border
      ctx.strokeStyle = '#ffaed1';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(40, 40, 720, 1070);
      ctx.setLineDash([]); // Reset line dash

      // Helper to draw cute hearts
      const drawHeart = (cx: number, cy: number, size: number, color: string) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(size / 2, -size / 2, size, 0, 0, size);
        ctx.bezierCurveTo(-size, 0, -size / 2, -size / 2, 0, 0);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      };

      // 4. Corner Decorations
      drawHeart(70, 70, 14, '#ff70ae');
      drawHeart(70, 1080, 14, '#ff70ae');
      drawHeart(730, 1080, 14, '#ff70ae');
      drawHeart(730, 70, 14, '#ff70ae');

      // 6. Left side headers
      ctx.fillStyle = '#ff70ae';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('✿  A LITTLE NOTE', 80, 110);

      // Happy Birthday headline
      ctx.fillStyle = '#4A2230';
      ctx.font = 'bold 36px Georgia, "Times New Roman", serif';
      ctx.fillText('Happy Birthday,', 80, 165);
      ctx.fillText('Ami Sayang 💗', 80, 215);

      // Draw separator line under title
      ctx.strokeStyle = '#ffd6e7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 255);
      ctx.lineTo(540, 255);
      ctx.stroke();

      // 7. Write Note Content
      const paragraphs = [
        "Honestly, I don't know how to fit everything i wanna say into just a few paragraphs.",
        "Thank you for being my favorite person. Thank you for all the laughs, all the random conversations, all the little moments that make my days so much better.",
        "Being with you makes even ordinary days feel special.",
        "I hope this year brings you more happiness, more reasons to smile, and all the good things you've been wishing for. You deserve so much love, kindness, and beautiful things in life.",
        "And if there's one thing I want you to remember today, it's that you are deeply loved. More than you know.",
        "Thank you for always being my safest place, my comfort, and one of the best things that has ever happened to me.",
        "I can't wait to make more memories with you, go on more little adventures, and spend more birthdays by your side.",
        "Happy 24th birthday, Ami. ❤️",
        "I love you, always."
      ];

      ctx.fillStyle = '#4A2230';
      ctx.textAlign = 'left';
      
      let currentY = 305;
      const maxWidth = 640;
      const lineHeight = 32;

      // Text wrapping function inside canvas helper
      const wrapText = (textStr: string, xPos: number, yPos: number, maxW: number, lineH: number, isSpecial = false) => {
        if (isSpecial) {
          ctx.font = 'bold 18px Georgia, serif';
          ctx.fillStyle = '#e11d48'; // rose-600
        } else {
          ctx.font = '500 17px sans-serif';
          ctx.fillStyle = '#4a2230';
        }

        const words = textStr.split(' ');
        let line = '';
        let startY = yPos;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxW && n > 0) {
            ctx.fillText(line, xPos, startY);
            line = words[n] + ' ';
            startY += lineH;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, xPos, startY);
        return startY + lineH; // Return ending Y position for next paragraph
      };

      for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
        const text = paragraphs[pIdx];
        const isSpecial = text.includes('Happy 24th') || text.includes('I love you, always');
        currentY = wrapText(text, 80, currentY, maxWidth, lineHeight, isSpecial);
        currentY += 12; // Paragraph bottom spacing
      }

      // 8. Footer Block
      // Horizontal rules
      ctx.strokeStyle = '#ffd6e7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 935);
      ctx.lineTo(720, 935);
      ctx.stroke();

      // Add signature labels
      ctx.fillStyle = '#8a5a68';
      ctx.font = 'italic 15px Georgia, serif';
      ctx.fillText('With Love,', 80, 975);

      ctx.fillStyle = '#ff70ae';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText('Ardhi Satria', 80, 1010);

      ctx.fillStyle = '#8a5a68';
      ctx.font = '13px monospace';
      ctx.fillText('8 JUNE 2026 ✨', 80, 1038);

      // Place decorative seal inside footer download canvas
      drawHeart(670, 990, 20, '#ff5293');
      ctx.fillStyle = '#ff70ae';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SEALED WITH', 670, 1030);
      ctx.fillText('LOVE', 670, 1045);

      // Perform download
      const dataUrl = canvas.toDataURL('image/png');
      const dlLink = document.createElement('a');
      dlLink.href = dataUrl;
      dlLink.download = 'ami-birthday-little-note.png';
      dlLink.click();
      
      setGalleryToast('Little note saved beautifully as an image! 💌✨');
    } catch (err) {
      console.error(err);
      setGalleryToast('Oops, could not download image.');
    }
  };

  const downloadResearchJournalAsImage = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 5500;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;

      // 2. Paper Header (Academic Style)
      ctx.fillStyle = '#2d1a22';
      ctx.font = 'bold 13px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('JOURNAL OF MARITAL & AMATORY SCIENCES  •  VOLUME 24  •  ISSUE 1', 500, 85);
      
      // Thin line separator for header
      ctx.strokeStyle = '#2d1a22';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 105);
      ctx.lineTo(920, 105);
      ctx.stroke();

      // Research Journal Title Block
      ctx.fillStyle = '#8a1f49'; // deep premium rose-crimson
      ctx.font = 'bold 28px Georgia, serif';
      ctx.fillText('RESEARCH JOURNAL', 500, 155);

      let currentY = 210;
      const leftMargin = 110;
      const rightMargin = 110;
      const lineLen = 1000 - leftMargin - rightMargin;

      const drawText = (
        textStr: string,
        font: string,
        fillStyle: string,
        lineH: number,
        align: 'left' | 'center' = 'left',
        isBullet = false
      ) => {
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        ctx.textAlign = align;

        const words = textStr.split(' ');
        let line = '';
        const xPos = align === 'center' ? 500 : (isBullet ? leftMargin + 20 : leftMargin);

        if (isBullet && align === 'left') {
          ctx.fillText('•', leftMargin, currentY);
        }

        for (let n = 0; n < words.length; n++) {
          const testLine = line + (line === '' ? '' : ' ') + words[n];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > (isBullet ? lineLen - 20 : lineLen)) {
            ctx.fillText(line, xPos, currentY);
            line = words[n];
            currentY += lineH;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, xPos, currentY);
        currentY += lineH;
      };

      const drawDivider = () => {
        ctx.strokeStyle = 'rgba(45, 26, 34, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(110, currentY);
        ctx.lineTo(890, currentY);
        ctx.stroke();
        currentY += 25;
      };

      // Title Details
      drawText('Title: Long-Term Observation of a Woman Named Dian Islami (Ami)', 'bold 22px Georgia, serif', '#2d1a22', 32, 'center');
      currentY += 5;
      drawText('Lead Researcher: Ardhi Satria    •    Date: 3 June 2026', 'italic 16px Georgia, serif', '#5f4c51', 24, 'center');
      currentY += 15;
      drawDivider();
      currentY += 10;

      // 1. Abstract
      drawText('Abstract', 'bold 18px Georgia, serif', '#8a1f49', 28, 'left');
      currentY += 5;
      drawText('Penelitian ini merupakan studi lanjutan terhadap seorang perempuan bernama Dian Islami, yang lebih dikenal sebagai Ami, dan telah berlangsung selama beberapa tahun terakhir.', 'italic 15px Georgia, serif', '#423c3e', 24, 'left');
      currentY += 8;
      drawText('Hasil penelitian menunjukkan bahwa subjek memiliki pengaruh positif yang signifikan terhadap kehidupan peneliti, termasuk peningkatan rasa tenang, kebahagiaan, rasa dicintai, dan optimisme terhadap masa depan.', 'italic 15px Georgia, serif', '#423c3e', 24, 'left');
      currentY += 8;
      drawText('Temuan terbaru juga menunjukkan bahwa seluruh hipotesis yang pernah dibuat sebelumnya masih terbukti valid hingga saat ini.', 'italic 15px Georgia, serif', '#423c3e', 24, 'left');
      currentY += 20;
      drawDivider();

      // 2. Introduction
      drawText('Introduction', 'bold 18px Georgia, serif', '#8a1f49', 28, 'left');
      currentY += 10;
      drawText('Sebelum mengenal Ami, peneliti memiliki beberapa asumsi tentang hidup dan tentang cinta.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 8;
      drawText('Peneliti mengira bahwa mencintai seseorang berarti harus selalu khawatir kehilangan.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 8;
      drawText('Peneliti mengira bahwa effort sebesar yang selama ini diterima hanyalah sesuatu yang terjadi pada orang lain.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 8;
      drawText('Peneliti juga mengira bahwa dirinya akan tetap menjadi orang yang cuek dan sulit mengekspresikan perasaan.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 8;
      drawText('Namun setelah Ami hadir, sebagian besar asumsi tersebut terbukti tidak akurat.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 20;
      drawDivider();

      // 3. Findings
      drawText('Findings', 'bold 18px Georgia, serif', '#8a1f49', 28, 'left');
      currentY += 15;

      // Finding #1
      drawText('Finding #1', 'bold 16px Georgia, serif', '#8a1f49', 24, 'left');
      drawText('Ami adalah perempuan yang jauh lebih kuat dari yang ia sadari.', 'bold 15px Georgia, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Selama masa observasi, ditemukan bahwa subjek mampu menghadapi banyak hal dalam hidup tanpa kehilangan kelembutan hatinya.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Ami mampu menanggung luka, kesedihan, dan berbagai tantangan dengan cara yang sering kali tidak diketahui orang lain.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Temuan ini menjadi salah satu alasan utama peneliti sangat mengagumi subjek.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 18;

      // Finding #2
      drawText('Finding #2', 'bold 16px Georgia, serif', '#8a1f49', 24, 'left');
      drawText('Dicintai dengan setara ternyata nyata.', 'bold 15px Georgia, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Sebelum penelitian dimulai, peneliti tidak memiliki banyak data mengenai hubungan yang saling mengusahakan satu sama lain.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Namun setelah mengenal Ami, ditemukan bahwa cinta tidak selalu harus membuat seseorang merasa takut ditinggalkan.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Cinta juga bisa terasa aman.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Cinta juga bisa terasa tenang.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Dan Ami adalah orang pertama yang membuat peneliti benar-benar memahami hal tersebut.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 18;

      // Finding #3
      drawText('Finding #3', 'bold 16px Georgia, serif', '#8a1f49', 24, 'left');
      drawText('Ami selalu hadir, terutama saat keadaan sedang sulit.', 'bold 15px Georgia, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Data menunjukkan bahwa ketika peneliti berada dalam masa yang tidak mudah, subjek secara konsisten memberikan dukungan, perhatian, dan rasa nyaman.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Bahkan pada saat-saat di mana Ami tidak bisa menyelesaikan masalah peneliti secara langsung, kehadirannya saja sudah cukup untuk membuat keadaan terasa lebih ringan.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Temuan ini memperkuat keyakinan bahwa Ami bukan hanya hadir saat keadaan baik, tetapi juga memilih bertahan saat keadaan sulit.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 18;

      // Finding #4
      drawText('Finding #4', 'bold 16px Georgia, serif', '#8a1f49', 24, 'left');
      drawText('Ami membuat peneliti ingin menjadi pribadi yang lebih baik.', 'bold 15px Georgia, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Observasi menunjukkan adanya perubahan perilaku pada peneliti setelah mengenal subjek.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Peneliti menjadi lebih peduli terhadap hal-hal kecil.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Lebih memahami bahwa perhatian sederhana bisa memiliki makna yang besar.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Lebih berusaha menunjukkan rasa sayang dibanding hanya menyimpannya dalam pikiran.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Meskipun prosesnya masih berlangsung, seluruh perubahan tersebut berawal dari Ami.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 18;

      // Finding #5
      drawText('Finding #5', 'bold 16px Georgia, serif', '#8a1f49', 24, 'left');
      drawText('Rasa kagum tidak berkurang seiring waktu.', 'bold 15px Georgia, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Berdasarkan teori umum, banyak hal akan terasa biasa setelah dijalani cukup lama.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Namun teori tersebut tidak berlaku pada penelitian ini.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Semakin lama peneliti mengenal Ami, semakin banyak alasan untuk bersyukur karena dipertemukan dengannya.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 25;
      drawDivider();

      // 4. Discussion
      drawText('Discussion', 'bold 18px Georgia, serif', '#8a1f49', 28, 'left');
      currentY += 10;
      drawText('Salah satu pertanyaan yang terus muncul selama penelitian berlangsung adalah: "What if we never met?"', 'bold 15px Georgia, serif', '#2d1a22', 24, 'left');
      currentY += 10;
      drawText('Setelah dilakukan berbagai simulasi and analisis, peneliti menyimpulkan bahwa hidup tetap akan berjalan.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Namun hidup tersebut tidak akan memiliki Ami.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 12;

      drawText('Tidak akan ada seseorang yang selalu ditunggu setiap minggu.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 4;
      drawText('Tidak akan ada telepon-telepon panjang di malam hari.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 4;
      drawText('Tidak akan ada cerita random yang selalu berhasil membuat hari terasa lebih menyenangkan.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 4;
      drawText('Tidak akan ada rasa nyaman yang selama ini menjadi bagian dari keseharian peneliti.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 12;

      drawText('Dan mungkin, peneliti tidak akan pernah tahu bahwa dirinya bisa dicintai sedalam ini.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 25;
      drawDivider();

      // 5. Conclusion
      drawText('Conclusion', 'bold 18px Georgia, serif', '#8a1f49', 28, 'left');
      currentY += 10;
      drawText('Pada usia 24 tahun, Dian Islami (Ami) tetap menjadi salah satu penemuan terbaik dalam hidup peneliti.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Seluruh data yang terkumpul menunjukkan bahwa subjek masih menjadi tempat pulang, tempat bercerita, tempat bertumbuh, dan orang yang paling ingin peneliti perjuangkan.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 25;
      drawDivider();

      // 6. Future Research
      drawText('Future Research', 'bold 18px Georgia, serif', '#8a1f49', 28, 'left');
      currentY += 10;
      drawText('Penelitian akan terus dilanjutkan dengan fokus pada:', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 12;
      drawText('More memories.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 4;
      drawText('More late-night conversations.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 4;
      drawText('More adventures.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 4;
      drawText('More dreams achieved together.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 4;
      drawText('More birthdays celebrated together.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 4;
      drawText('And hopefully, one day, building a home together.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left', true);
      currentY += 25;
      drawDivider();

      // 7. Final Statement
      drawText('Final Statement', 'bold 18px Georgia, serif', '#8a1f49', 28, 'left');
      currentY += 10;
      drawText('Selamat ulang tahun yang ke-24, Ami. ❤️', 'bold 16px Georgia, serif', '#2d1a22', 24, 'left');
      currentY += 10;
      drawText('Terima kasih karena sudah bertahan sejauh ini.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Terima kasih karena sudah memilih untuk mencintai Ardhi dengan cara yang begitu tulus.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 4;
      drawText('Terima kasih karena sudah menjadi alasan yang membuat Ardhi percaya bahwa cinta yang sehat, tenang, dan diperjuangkan bersama itu benar-benar ada.', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 16;

      drawText('Setelah seluruh data dikumpulkan, dianalisis, dan ditinjau ulang, tidak ditemukan satu pun bukti yang mampu membantah kesimpulan berikut:', '15px "Times New Roman", Times, serif', '#2d1a22', 24, 'left');
      currentY += 20;

      // Special box for Dian Islami adalah orang yang paling Ardhi syukuri
      ctx.fillStyle = '#fff9f6';
      ctx.fillRect(leftMargin, currentY, lineLen, 70);
      ctx.strokeStyle = '#8a1f49';
      ctx.lineWidth = 1;
      ctx.strokeRect(leftMargin, currentY, lineLen, 70);
      
      ctx.font = 'bold 16px Georgia, serif';
      ctx.fillStyle = '#8a1f49';
      ctx.textAlign = 'center';
      ctx.fillText('Dian Islami adalah orang yang paling Ardhi syukuri dalam hidupnya.', 500, currentY + 41);
      currentY += 105;

      drawText('Dan dengan tingkat keyakinan 100%,', 'italic 16px Georgia, serif', '#2d1a22', 24, 'center');
      currentY += 5;
      
      ctx.font = 'bold 22px Georgia, serif';
      ctx.fillStyle = '#8a1f49';
      ctx.fillText('Ardhi Satria sayang banget sama Ami.', 500, currentY + 10);
      currentY += 45;

      drawText('*End of Report.*', 'italic 13px Georgia, serif', '#8a5a68', 20, 'center');
      currentY += 35;

      // Double Signatures / Seal of Approval block
      ctx.strokeStyle = '#2d1a22';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(110, currentY);
      ctx.lineTo(890, currentY);
      ctx.stroke();
      currentY += 25;

      // Left signature
      ctx.font = 'bold 13px "Times New Roman", Times, serif';
      ctx.fillStyle = '#2d1a22';
      ctx.textAlign = 'left';
      ctx.fillText('Lead Researcher Approval:', 120, currentY + 15);
      
      // Hand write font-like signature
      ctx.font = 'italic 26px Georgia, serif';
      ctx.fillStyle = '#8a1f49';
      ctx.fillText('Ardhi Satria', 120, currentY + 48);

      ctx.font = '12px "Times New Roman", Times, serif';
      ctx.fillStyle = '#666';
      ctx.fillText('Ardhi Satria, B.S. (Beloved Spouse)', 120, currentY + 74);

      // Cute seal stamp in bottom right
      ctx.save();
      const sealX = 760;
      const sealY = currentY + 10;
      ctx.beginPath();
      ctx.arc(sealX, sealY + 40, 45, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 111, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sealX, sealY + 40, 41, 0, Math.PI * 2);
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();

      ctx.font = 'bold 10px Courier New, Courier, monospace';
      ctx.fillStyle = 'rgba(239, 68, 111, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('APPROVED', sealX, sealY + 40);
      ctx.fillText('AMI\'S DAY', sealX, sealY + 53);
      ctx.fillText('8 JUN 2026', sealX, sealY + 66);

      // Calculate dynamic final height to hug the actual drawn content perfectly with balanced margins
      const finalHeight = Math.ceil(sealY + 140);

      // Create final canvas that matches the exact content height
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = 1000;
      finalCanvas.height = finalHeight;
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) return;

      finalCtx.imageSmoothingEnabled = true;

      // 1. Clean ivory academic paper background texture
      finalCtx.fillStyle = '#fcfbf7';
      finalCtx.fillRect(0, 0, 1000, finalHeight);

      // Cute faint grid (academic watermark)
      finalCtx.fillStyle = 'rgba(138, 90, 104, 0.02)';
      for (let x = 0; x < 1000; x += 40) {
        finalCtx.fillRect(x, 0, 1, finalHeight);
      }
      for (let y = 0; y < finalHeight; y += 40) {
        finalCtx.fillRect(0, y, 1000, 1);
      }

      // Outer margin borders relative to finalHeight
      finalCtx.strokeStyle = '#2d1a22';
      finalCtx.lineWidth = 1.5;
      finalCtx.strokeRect(40, 40, 920, finalHeight - 80); // dynamic outer border matching 40px margin

      finalCtx.strokeStyle = 'rgba(45, 26, 34, 0.2)';
      finalCtx.lineWidth = 1;
      finalCtx.strokeRect(50, 50, 900, finalHeight - 100); // dynamic inner thin line matching 50px margin

      // Copy the drawn content from the transparent temp canvas on top
      finalCtx.drawImage(canvas, 0, 0, 1000, finalHeight, 0, 0, 1000, finalHeight);

      // Perform direct download of the image
      const dataUrl = finalCanvas.toDataURL('image/png');
      const dlLink = document.createElement('a');
      dlLink.href = dataUrl;
      dlLink.download = 'ami-long-term-research-journal.png';
      dlLink.click();
      
      setGalleryToast('Special Research Journal downloaded as image! 📄🎓✨');
    } catch (err) {
      console.error(err);
      setGalleryToast('Oops, could not construct the journal image.');
    }
  };

  const downloadResearchJournalAsText = () => {
    try {
      const text = `# Research Journal

**Title:** Long-Term Observation of a Woman Named Dian Islami (Ami)

**Lead Researcher:** Ardhi Satria

**Date:** 3 June 2026

---

## Abstract

Penelitian ini merupakan studi lanjutan terhadap seorang perempuan bernama **Dian Islami**, yang lebih dikenal sebagai **Ami**, dan telah berlangsung selama beberapa tahun terakhir.

Hasil penelitian menunjukkan bahwa subjek memiliki pengaruh positif yang signifikan terhadap kehidupan peneliti, termasuk peningkatan rasa tenang, kebahagiaan, rasa dicintai, dan optimisme terhadap masa depan.

Temuan terbaru juga menunjukkan bahwa seluruh hipotesis yang pernah dibuat sebelumnya masih terbukti valid hingga saat ini.

---

## Introduction

Sebelum mengenal Ami, peneliti memiliki beberapa asumsi tentang hidup dan tentang cinta.

Peneliti mengira bahwa mencintai seseorang berarti harus selalu khawatir kehilangan.

Peneliti mengira bahwa effort sebesar yang selama ini diterima hanyalah sesuatu yang terjadi pada orang lain.

Peneliti juga mengira bahwa dirinya akan tetap menjadi orang yang cuek dan sulit mengekspresikan perasaan.

Namun setelah Ami hadir, sebagian besar asumsi tersebut terbukti tidak akurat.

---

## Findings

### Finding #1

**Ami adalah perempuan yang jauh lebih kuat dari yang ia sadari.**

Selama masa observasi, ditemukan bahwa subjek mampu menghadapi banyak hal dalam hidup tanpa kehilangan kelembutan hatinya.

Ami mampu menanggung luka, kesedihan, dan berbagai tantangan dengan cara yang sering kali tidak diketahui orang lain.

Temuan ini menjadi salah satu alasan utama peneliti sangat mengagumi subjek.

---

### Finding #2

**Dicintai dengan setara ternyata nyata.**

Sebelum penelitian dimulai, peneliti tidak memiliki banyak data mengenai hubungan yang saling mengusahakan satu sama lain.

Namun setelah mengenal Ami, ditemukan bahwa cinta tidak selalu harus membuat seseorang merasa takut ditinggalkan.

Cinta juga bisa terasa aman.

Cinta juga bisa terasa tenang.

Dan Ami adalah orang pertama yang membuat peneliti benar-benar memahami hal tersebut.

---

### Finding #3

**Ami selalu hadir, terutama saat keadaan sedang sulit.**

Data menunjukkan bahwa ketika peneliti berada dalam masa yang tidak mudah, subjek secara konsisten memberikan dukungan, perhatian, dan rasa nyaman.

Bahkan pada saat-saat di mana Ami tidak bisa menyelesaikan masalah peneliti secara langsung, kehadirannya saja sudah cukup untuk membuat keadaan terasa lebih ringan.

Temuan ini memperkuat keyakinan bahwa Ami bukan hanya hadir saat keadaan baik, tetapi juga memilih bertahan saat keadaan sulit.

---

### Finding #4

**Ami membuat peneliti ingin menjadi pribadi yang lebih baik.**

Observasi menunjukkan adanya perubahan perilaku pada peneliti setelah mengenal subjek.

Peneliti menjadi lebih peduli terhadap hal-hal kecil.

Lebih memahami bahwa perhatian sederhana bisa memiliki makna yang besar.

More berusaha menunjukkan rasa sayang dibanding hanya menyimpannya dalam pikiran.

Meskipun prosesnya masih berlangsung, seluruh perubahan tersebut berawal dari Ami.

---

### Finding #5

**Rasa kagum tidak berkurang seiring waktu.**

Berdasarkan teori umum, banyak hal akan terasa biasa setelah dijalani cukup lama.

Namun teori tersebut tidak berlaku pada penelitian ini.

Semakin lama peneliti mengenal Ami, semakin banyak alasan untuk bersyukur karena dipertemukan dengannya.

---

## Discussion

Salah satu pertanyaan yang terus muncul selama penelitian berlangsung adalah:

**"What if we never met?"**

Setelah dilakukan berbagai simulasi dan analisis, peneliti menyimpulkan bahwa hidup tetap akan berjalan.

Namun hidup tersebut tidak akan memiliki Ami.

Tidak akan ada seseorang yang selalu ditunggu setiap minggu.

Tidak akan ada telepon-telepon panjang di malam hari.

Tidak akan ada cerita random yang selalu berhasil membuat hari terasa lebih menyenangkan.

Tidak akan ada rasa nyaman yang selama ini menjadi bagian dari keseharian peneliti.

Dan mungkin, peneliti tidak akan pernah tahu bahwa dirinya bisa dicintai sedalam ini.

---

## Conclusion

Pada usia 24 tahun, **Dian Islami (Ami)** tetap menjadi salah satu penemuan terbaik dalam hidup peneliti.

Seluruh data yang terkumpul menunjukkan bahwa subjek masih menjadi tempat pulang, tempat bercerita, tempat bertumbuh, dan orang yang paling ingin peneliti perjuangkan.

---

## Future Research

Penelitian akan terus dilanjutkan dengan fokus pada:

* More memories.
* More late-night conversations.
* More adventures.
* More dreams achieved together.
* More birthdays celebrated together.
* And hopefully, one day, building a home together.

---

## Final Statement

Selamat ulang tahun yang ke-24, Ami. ❤️

Terima kasih karena sudah bertahan sejauh ini.

Terima kasih karena sudah memilih untuk mencintai Ardhi dengan cara yang begitu tulus.

Terima kasih karena sudah menjadi alasan yang membuat Ardhi percaya bahwa cinta yang sehat, tenang, dan diperjuangkan bersama itu benar-benar ada.

Setelah seluruh data dikumpulkan, dianalisis, dan ditinjau ulang, tidak ditemukan satu pun bukti yang mampu membantah kesimpulan berikut:

### **Dian Islami adalah orang yang paling Ardhi syukuri dalam hidupnya.**

Dan dengan tingkat keyakinan 100%,

### **Ardhi Satria sayang banget sama Ami.**

*End of Report.*`;

      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const dlLink = document.createElement('a');
      dlLink.href = url;
      dlLink.download = 'ami-long-term-research-journal.md';
      dlLink.click();
      URL.revokeObjectURL(url);
      setGalleryToast('Special Research Journal downloaded as text file! 📝✨');
    } catch (err) {
      console.error(err);
      setGalleryToast('Oops, could not download text file.');
    }
  };

  const handleUploadToSupabase = async () => {
    if (!capturedPhoto || isUploading) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    
    try {
      const response = await fetch('/api/upload-reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: capturedPhoto,
          filename: `ami_reaction_${Date.now()}.png`
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUploadStatus('success');
        triggerConfetti();
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Supabase upload error:', err);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleMemoryVideo = () => {
    if (!memoryVideoRef.current) return;
    if (isMemoryPlaying) {
      memoryVideoRef.current.pause();
    } else {
      memoryVideoRef.current.play();
    }
    setIsMemoryPlaying(!isMemoryPlaying);
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  // Sync music state with iframe src
  useEffect(() => {
    if (!audioRef.current) return;
    const baseUrl = 'https://www.youtube.com/embed/WCce-3XMdJs';
    audioRef.current.src = `${baseUrl}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=WCce-3XMdJs&enablejsapi=1`;
  }, [isPlaying]);

  const renderLiveFilmStrip = (widthClass: string = "w-36 sm:w-40 md:w-44") => {
    return photoMode === 3 ? (
      /* Single 3-Shot Strip HTML preview */
      <div className={`relative ${widthClass} aspect-[640/1600] bg-white rounded-xl shadow-xl border border-pink-100/30 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300`}>
        <div className="absolute inset-0 z-0">
          {/* Slot 1 */}
          <div style={{ top: '5.75%', left: '8.125%', width: '83.75%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[0] ? (
              <img src={capturedPhotos[0]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[9px] font-mono text-pink-300 uppercase tracking-widest animate-pulse">Smile 📸</span>
            )}
          </div>
          {/* Slot 2 */}
          <div style={{ top: '29.5%', left: '8.125%', width: '83.75%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[1] ? (
              <img src={capturedPhotos[1]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[9px] font-mono text-pink-300 uppercase tracking-widest">Shot 2</span>
            )}
          </div>
          {/* Slot 3 */}
          <div style={{ top: '53.25%', left: '8.125%', width: '83.75%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[2] ? (
              <img src={capturedPhotos[2]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[9px] font-mono text-pink-300 uppercase tracking-widest">Shot 3</span>
            )}
          </div>
        </div>
        <img 
          src={
            stripDesign === 'soft-pink' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Soft%20Pink.png' :
            stripDesign === 'pink' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Pink.png' :
            stripDesign === 'blue' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Blue.png' :
            stripDesign === 'black' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Black.png' :
            stripDesign === 'brown' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20Brown.png' :
            'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%201%20strip%20-%20White.png'
          } 
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none select-none" 
        />
      </div>
    ) : (
      /* Double 6-Shot Strip HTML preview */
      <div className={`relative ${widthClass} aspect-[1280/1600] bg-white rounded-xl shadow-xl border border-pink-100/30 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300`}>
        <div className="absolute inset-0 z-0">
          {/* Left strip (Photos 0, 1, 2) */}
          <div style={{ top: '5.75%', left: '4.0625%', width: '41.875%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[0] ? (
              <img src={capturedPhotos[0]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[8px] font-mono text-pink-300 uppercase tracking-widest animate-pulse">Shot 1</span>
            )}
          </div>
          <div style={{ top: '29.5%', left: '4.0625%', width: '41.875%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[1] ? (
              <img src={capturedPhotos[1]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[8px] font-mono text-pink-300 uppercase tracking-widest">Shot 2</span>
            )}
          </div>
          <div style={{ top: '53.25%', left: '4.0625%', width: '41.875%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[2] ? (
              <img src={capturedPhotos[2]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[8px] font-mono text-pink-300 uppercase tracking-widest">Shot 3</span>
            )}
          </div>

          {/* Right strip (Photos 3, 4, 5) */}
          <div style={{ top: '5.75%', left: '54.0625%', width: '41.875%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[3] ? (
              <img src={capturedPhotos[3]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[8px] font-mono text-pink-300 uppercase tracking-widest animate-pulse">Shot 4</span>
            )}
          </div>
          <div style={{ top: '29.5%', left: '54.0625%', width: '41.875%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[4] ? (
              <img src={capturedPhotos[4]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[8px] font-mono text-pink-300 uppercase tracking-widest">Shot 5</span>
            )}
          </div>
          <div style={{ top: '53.25%', left: '54.0625%', width: '41.875%', height: '19.75%' }} className="absolute bg-[#fffbfc] overflow-hidden flex items-center justify-center">
            {capturedPhotos[5] ? (
              <img src={capturedPhotos[5]} className="w-full h-full object-cover select-none animate-fade-in" />
            ) : (
              <span className="text-[8px] font-mono text-pink-300 uppercase tracking-widest">Shot 6</span>
            )}
          </div>
        </div>
        <img 
          src={
            stripDesign === 'soft-pink' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Soft%20Pink.png' :
            stripDesign === 'pink' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Pink.png' :
            stripDesign === 'blue' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Blue.png' :
            stripDesign === 'black' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Black.png' :
            stripDesign === 'brown' ? 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20Brown.png' :
            'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/Frame/Frame%202%20Strip%20-%20White.png'
          } 
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none select-none" 
        />
      </div>
    );
  };

  if (currentView === 'photobooth') {
    return (
      <div className="min-h-[100dvh] bg-[#fff5f8] text-[#4A2230] relative select-none w-full flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <FloatingHearts />
        <canvas ref={canvasRef} className="hidden" />

        {/* Intro Popup screen (displays when camera is NOT open yet) */}
        {!showCamera ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative border border-pink-100/30 flex flex-col items-center text-center space-y-6 md:space-y-8 select-none m-4"
          >
            {/* Close button in top-right of the modal box */}
            <button
              onClick={handleSurprise}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-full transition-all active:scale-90 shadow-sm z-30 cursor-pointer"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#fff5f8] rounded-full flex items-center justify-center text-[#ff70ae] shadow-inner mb-1 border border-pink-100">
              <CameraIcon size={36} />
            </div>

            <div className="space-y-3.5">
              <h3 className="text-2xl md:text-3xl font-serif text-[#4A2230] font-semibold">Show your cute face 🥺</h3>
              <p className="text-xs md:text-sm text-[#8A5A68] leading-relaxed max-w-xs mx-auto">
                I want to see your beautiful reaction to this little website I made for you... Keep this sweet moment remembered forever ✨
              </p>
            </div>

            {cameraError && (
              <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 w-full">
                {cameraError}
              </p>
            )}

            <button
              onClick={handleOpenCamera}
              className="w-full h-12 bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-200/50 active:scale-95 text-sm md:text-base cursor-pointer"
            >
              Open Camera 📸
            </button>
          </motion.div>
        ) : (
          /* Actual Camera Feed and Style Panel Page */
          <div className="w-full max-w-5xl lg:max-w-6xl mx-auto z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-6 lg:gap-8 items-stretch w-full">
              
              {/* Left Column: Camera, Trigger, & Settings Slots / Capture Panel */}
              <div className={`${mobilePhotoboothStep === 'capture' ? 'flex' : 'hidden lg:flex'} flex-col bg-white border border-pink-100/50 rounded-[2rem] p-4 sm:p-5 md:p-8 shadow-xl justify-between gap-4 w-full`}>
                
                {/* Top Status and Back-Close Action Bar */}
                <div className="flex items-center justify-between shrink-0 mb-1">
                  <button
                    onClick={handleCameraBack}
                    className="inline-flex items-center gap-1.5 bg-[#fff0f4] hover:bg-[#ffe0ea] border border-[#ffccd7] text-[#ff70ae] px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <X size={14} strokeWidth={3} />
                    <span>Close</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center bg-[#fff0f4] border border-[#ffccd7]/30 text-[#ff70ae] px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs select-none">
                      Shot {activeSlotIndex + 1} of {photoMode}
                    </span>
                  </div>
                </div>

                {/* Layout Selector choice: Visible only on mobile capture */}
                <div className="w-full lg:hidden bg-[#fff0f4]/40 p-3 rounded-2xl border border-pink-100 flex flex-col items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-bold text-[#ff70ae] uppercase tracking-wide block text-center">
                    Select Size 📐
                  </span>
                  <div className="inline-flex bg-[#fff5f8] p-1 rounded-full border border-pink-100/80 w-full">
                    <button
                      type="button"
                      onClick={() => handlePhotoModeChange(3)}
                      className={`flex-1 py-1.5 px-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        photoMode === 3 
                          ? 'bg-[#ff70ae] text-white shadow-sm' 
                          : 'text-[#8A5A68] hover:text-[#ff70ae]'
                      }`}
                    >
                      🎞️ 3-Shot Strip
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePhotoModeChange(6)}
                      className={`flex-1 py-1.5 px-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        photoMode === 6 
                          ? 'bg-[#ff70ae] text-white shadow-sm' 
                          : 'text-[#8A5A68] hover:text-[#ff70ae]'
                      }`}
                    >
                      ✨ 6-Shot Strip
                    </button>
                  </div>
                </div>

                {/* Camera Feed Viewport */}
                <div className="relative w-full aspect-[4/3] sm:aspect-video bg-neutral-900 rounded-2xl sm:rounded-[1.5rem] overflow-hidden shadow-inner border border-pink-100 flex items-center justify-center group/cam shadow-[#ff70ae]/5">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(e) => {
                      e.currentTarget.play().catch(err => console.error("Webcam playback error:", err));
                    }}
                    className="w-full h-full object-cover scale-x-[-1]"
                  />

                  {/* Align text pill top-center overlay */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[9px] md:text-xs font-bold text-white uppercase tracking-widest leading-none select-none">
                      {isCountingDown ? "Hold still! 📸" : "Align your beautiful smile ✨"}
                    </div>
                  </div>

                  {/* Camera Shutter Countdown Overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center z-30 select-none">
                      <motion.div
                        key={countdown}
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: [0.3, 1.3, 1], opacity: [0, 1, 1] }}
                        transition={{ duration: 0.55 }}
                        className="text-7xl md:text-8xl font-black font-serif text-[#ff70ae] drop-shadow-[0_4px_16px_rgba(255,255,255,0.85)] italic"
                      >
                        {countdown}
                      </motion.div>
                    </div>
                  )}

                  {/* Camera flash visual frame feedback */}
                  {shutterFlash && (
                    <div className="absolute inset-0 bg-white z-[90] pointer-events-none" />
                  )}
                </div>

                {/* Prominent Take Picture Button */}
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={isCountingDown}
                  className="w-full py-3.5 sm:py-4 bg-white hover:bg-pink-50/20 border-2 border-[#ff70ae] text-[#ff70ae] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
                >
                  <Camera size={18} strokeWidth={2.5} />
                  <span>Take Picture</span>
                </button>

                {/* Result Slots Matrix */}
                <div className="space-y-1.5 w-full">
                  <span className="text-[10px] font-bold text-[#8A5A68] uppercase tracking-wider block text-center mb-1 select-none">
                    Snap slots panel 🎬
                  </span>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
                    {capturedPhotos.map((photo, idx) => {
                      const isActive = activeSlotIndex === idx;
                      return (
                        <button
                          key={idx}
                          disabled={isCountingDown}
                          onClick={() => {
                            setActiveSlotIndex(idx);
                          }}
                          className={`aspect-[4/3] rounded-xl sm:rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-center relative transition-all duration-300 bg-[#fbfbfb] shadow-2xs ${
                            isActive
                              ? 'border-[#ff70ae] bg-pink-50/25 ring-4 ring-pink-100/50 scale-[1.01] z-10 shadow-sm'
                              : 'border-pink-50/40 hover:bg-white hover:border-[#ff70ae]/30 cursor-pointer'
                          }`}
                        >
                          {photo ? (
                            <div className="relative w-full h-full group">
                              <img src={photo} alt={`Captured ${idx + 1}`} className="w-full h-full object-cover select-none" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[9px] text-white font-extrabold tracking-wider uppercase select-none">
                                  Retake 📸
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-1 text-center select-none">
                              <span className="text-[10px] sm:text-xs font-bold text-gray-400 capitalize whitespace-nowrap">
                                Shot {idx + 1}
                              </span>
                            </div>
                          )}

                          {isActive && (
                            <span className="absolute bottom-1 px-1.5 py-0.5 rounded-full bg-[#ff70ae] text-[6px] md:text-[8px] text-white font-black uppercase tracking-wide leading-none">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Proceed to stylist trigger on mobile (always rendered, but color disabled/gray unless ALL pictures captured) */}
                <div className="lg:hidden w-full pt-1">
                  <button
                    type="button"
                    disabled={!capturedPhotos.every(p => p !== null)}
                    onClick={() => {
                      if (capturedPhotos.every(p => p !== null)) {
                        setMobilePhotoboothStep('preview');
                      }
                    }}
                    className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm sm:text-base shadow-sm ${
                      capturedPhotos.every(p => p !== null)
                        ? "bg-[#ff70ae] hover:bg-[#ff5a9e] text-white cursor-pointer active:scale-95"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    Go to Style & Preview 🎨 ✨
                  </button>
                </div>
              </div>

              {/* Right Column: Real-time Live Film Strip Mockup Preview / Style Panel */}
              <div className={`${mobilePhotoboothStep === 'preview' ? 'flex' : 'hidden lg:flex'} flex-col bg-gradient-to-r from-[#ffeef2] to-[#ffdce7] rounded-[2rem] border border-[#ffd2e1] overflow-hidden shadow-xl self-start lg:sticky lg:top-4 mt-2 lg:mt-0 w-full`}>
                
                {/* Mobile-Only Step Header */}
                <div className="lg:hidden w-full flex items-center justify-between p-4 sm:p-5 border-b border-[#ffaed1]/25 select-none text-[#4A2230]">
                  <button
                    onClick={() => setMobilePhotoboothStep('capture')}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-pink-100/50 border border-[#ffccd7] text-[#ff70ae] px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <ChevronLeft size={14} strokeWidth={3} />
                    <span>Retake</span>
                  </button>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[12px] font-serif font-black text-[#5c3e47] tracking-wide uppercase">Image Preview</span>
                    <span className="text-[8px] text-[#805060]/70 font-sans uppercase tracking-widest font-black">Style Frame ✨</span>
                  </div>
                </div>

                {/* Desktop-Only Premium Header Banner */}
                <div className="hidden lg:flex p-5 text-center flex-col items-center justify-center select-none text-[#4A2230] border-b border-[#ffaed1]/25">
                  <h3 className="font-serif text-[#4A2230] text-xl sm:text-2xl font-bold tracking-wider uppercase">Image Preview</h3>
                  <p className="text-[10px] text-[#805060]/75 uppercase font-sans font-bold tracking-widest mt-1">See your beautiful image here</p>
                </div>

                {/* White Container Body workspace */}
                <div className="bg-white rounded-b-[2rem] p-4 sm:p-6 md:p-8 flex flex-col justify-between flex-grow gap-4 sm:gap-6">
                  
                  {/* Select Size Choices widget: Visible ONLY on desktop (lg) inside right styled column */}
                  <div className="hidden lg:block w-full space-y-2 bg-[#fff8fa] p-3 rounded-2xl border border-pink-100/40">
                    <div className="space-y-1.5 w-full flex flex-col items-center">
                      <span className="text-[10px] font-bold text-[#8A5A68] uppercase tracking-wider block text-center">
                        Select Size 📐
                      </span>
                      <div className="inline-flex bg-pink-100/20 p-1 rounded-full border border-pink-200/10 w-full">
                        <button
                          type="button"
                          onClick={() => handlePhotoModeChange(3)}
                          className={`flex-1 py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            photoMode === 3 
                              ? 'bg-[#ff70ae] text-white shadow-2xs scale-[1.01]' 
                              : 'text-[#8A5A68] hover:text-[#ff70ae]'
                          }`}
                        >
                          🎞️ 3-Shot Strip
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePhotoModeChange(6)}
                          className={`flex-1 py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            photoMode === 6 
                              ? 'bg-[#ff70ae] text-white shadow-2xs scale-[1.01]' 
                              : 'text-[#8A5A68] hover:text-[#ff70ae]'
                          }`}
                        >
                          ✨ 6-Shot Strip
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Frame Color Horizontal scrolling container */}
                  <div className="w-full lg:hidden p-3.5 bg-[#fff8fa] border border-pink-100/40 rounded-2xl flex flex-col items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-bold text-[#ff70ae] uppercase tracking-wider block text-center select-none">
                      Select Color 🌈
                    </span>
                    <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none snap-x px-1 w-full justify-start sm:justify-center">
                      {COLOR_OPTIONS.map((opt) => {
                        const isSelected = stripDesign === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setStripDesign(opt.id || 'soft-pink')}
                            className={`snap-center min-w-[76px] py-1.5 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none ${
                              isSelected
                                ? `${opt.bgColor} ${opt.borderColor} ${opt.activeColor} scale-[1.03] shadow-xs`
                                : 'bg-white border-pink-100/40 hover:border-pink-300'
                            }`}
                          >
                            <span 
                              className="w-4 h-4 rounded-full border border-black/10 shadow-inner shrink-0"
                              style={{ backgroundColor: opt.dotColor }}
                            />
                            <span className="text-[9px] font-semibold text-center text-[#5c3e47] tracking-tight leading-none truncate w-full">
                              {opt.id === 'soft-pink' ? 'Soft Pink' : opt.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Side-by-side Layout on Desktop: Live Film Strip Preview + Vertical Color Picker sidebar */}
                  <div className="hidden lg:grid grid-cols-[80px_1fr] gap-6 items-center justify-center py-2 flex-grow">
                    
                    {/* Vertical Color Customizer Sidebar on Left */}
                    <div className="flex flex-col items-center gap-2.5 p-3 bg-[#fff8fa] rounded-2xl border border-pink-50 shadow-2xs w-full self-center justify-center select-none">
                      <span className="text-[8px] font-extrabold text-[#8A5A68] uppercase tracking-widest text-center leading-none mb-1">
                        Select Color 🎨
                      </span>
                      <div className="flex flex-col gap-2 w-full">
                        {COLOR_OPTIONS.map((opt) => {
                          const isSelected = stripDesign === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setStripDesign(opt.id)}
                              className={`w-full py-2 px-1 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group ${
                                isSelected
                                  ? `${opt.bgColor} ${opt.borderColor} ${opt.activeColor} scale-[1.04]`
                                  : 'bg-white border-pink-100 hover:border-pink-300'
                              }`}
                            >
                              <span 
                                className="w-4 h-4 rounded-full border border-black/10 shadow-inner shrink-0 transition-transform group-hover:scale-105"
                                style={{ backgroundColor: opt.dotColor }}
                              />
                              <span className="text-[8px] font-black uppercase text-center text-[#5c3e47] tracking-tight leading-none truncate w-full">
                                {opt.id === 'soft-pink' ? 'Soft' : opt.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live render of Film Strip on Right */}
                    <div className="flex justify-center items-center h-full">
                      {renderLiveFilmStrip("w-36 sm:w-40 md:w-44 lg:w-48")}
                    </div>

                  </div>

                  {/* Live Preview Rendered AT THE BOTTOM on Mobile */}
                  <div className="lg:hidden w-full flex flex-col items-center justify-center py-4 bg-[#fff8fa]/30 rounded-2xl border border-pink-50/50 mt-1 select-none">
                    {renderLiveFilmStrip("w-38 sm:w-42")}
                  </div>

                  {/* Footer Trigger CTA Button */}
                  <div className="w-full mt-3 pt-3 border-t border-pink-50 select-none">
                    {capturedPhotos.every((p) => p !== null) ? (
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="button"
                          onClick={async () => {
                            await generateCompositeStrip(capturedPhotos as string[]);
                          }}
                          className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#ff70ae] to-[#ff5293] text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-pink-200/40 flex items-center justify-center gap-2 hover:from-[#ff5a9e] hover:to-[#ff3d85] transition-all cursor-pointer"
                        >
                          Create Photo Strip 💖
                        </motion.button>
                        <button
                          type="button"
                          onClick={() => setMobilePhotoboothStep('capture')}
                          className="lg:hidden w-full py-2.5 bg-white border border-[#ffd2e1] text-[#ff70ae] rounded-xl font-bold text-xs hover:bg-pink-50/20 transition-colors active:scale-95"
                        >
                          📸 Retake a Photo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          disabled
                          className="w-full py-3.5 sm:py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold text-xs sm:text-sm select-none cursor-not-allowed text-center"
                        >
                          Capture {capturedPhotos.filter(p => p !== null).length}/{photoMode} Photos to Save ✨
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobilePhotoboothStep('capture')}
                          className="lg:hidden w-full py-2.5 bg-white border border-[#ffd2e1] text-[#ff70ae] rounded-xl font-bold text-xs"
                        >
                          📸 Capture Remaining Shots
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>
              
            </div>
          </div>
        )}

        {/* Screen 5: Vertical Photo Strip Result Popup Modal inside photobooth page */}
        <AnimatePresence>
          {capturedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative border border-pink-100/20 max-h-[92vh] overflow-y-auto"
              >
                {/* Close button inside top corner of the strip mockup popup */}
                <button
                  onClick={() => setCapturedPhoto(null)}
                  className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-full transition-all active:scale-95 shadow-md z-30 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center justify-items-center">
                  
                  {/* Left Col: Renders composite vertical Photo Strip mockup */}
                  <div className="flex flex-col items-center justify-center relative w-full">
                    <div className="mb-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className={`${photoMode === 6 ? 'w-80' : 'w-48'} h-3 bg-neutral-900 rounded-t-xl border-t border-b border-pink-200/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden transition-all duration-500`}>
                          <div className="absolute inset-x-0 top-0.5 h-[1px] bg-pink-400 opacity-60 shadow-[0_0_4px_#ff70ae]" />
                        </div>
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#8A5A68] mt-1 bg-pink-50/80 px-2 py-0.5 rounded border border-pink-100/30">
                          PHOTO DISPENSER 📸
                        </span>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl p-1 bg-gradient-to-b from-neutral-50 to-neutral-100/30 border border-neutral-200/20 shadow-sm">
                      <motion.div
                        initial={{ y: -450, opacity: 0.3 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 35,
                          damping: 14,
                          mass: 1.15,
                          delay: 0.2
                        }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5 pointer-events-none rounded-xl z-10" />
                        <img
                          src={capturedPhoto}
                          alt="Our Memories Strip"
                          className={`max-h-[48vh] md:max-h-[60vh] ${photoMode === 6 ? 'aspect-[1280/1600]' : 'aspect-[640/1600]'} object-contain rounded-xl shadow-2xl border-white border-[6px] md:border-8 bg-white`}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Col: Details, Download & Upload Controls */}
                  <div className="w-full flex flex-col justify-center space-y-6 select-none max-w-sm">
                    <div className="text-center md:text-left space-y-2">
                      <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase bg-pink-50 px-3 py-1 rounded-full border border-pink-100/20">
                        Memory strip loaded
                      </span>
                      <h4 className="text-xl md:text-2xl font-serif text-[#4A2230] font-semibold">
                        Your Souvenir is Ready! 💖
                      </h4>
                      <p className="text-xs md:text-sm text-[#8A5A68]">
                        Download a high-resolution version of this photo strip or save it directly to our sweet live gallery album!
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        disabled={isUploading}
                        onClick={async () => {
                          const link = document.createElement('a');
                          link.href = capturedPhoto;
                          link.download = 'ami-birthday-strip.png';
                          link.click();
                          await handleUploadToSupabase();
                        }}
                        className={`w-full h-12 bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-200/50 transition-all active:scale-[0.97] text-sm md:text-base cursor-pointer ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {isUploading ? 'Uploading & Saving...' : uploadStatus === 'success' ? 'Saved & Shared! 🎉' : 'Save to Gallery 💖'}
                      </button>

                      <button
                        onClick={() => {
                          setCapturedPhotos([null, null, null]);
                          setCapturedPhoto(null);
                          setActiveSlotIndex(0);
                        }}
                        disabled={isUploading}
                        className="w-full h-12 bg-white text-[#ff70ae] border border-pink-200 rounded-2xl font-bold hover:bg-pink-50 transition-all active:scale-[0.97] flex items-center justify-center text-sm md:text-base cursor-pointer"
                      >
                        Retake 📸
                      </button>
                    </div>

                    {uploadStatus === 'error' && (
                      <p className="text-[10px] text-red-500 bg-red-50 py-2.5 px-4 rounded-xl text-center border border-red-100">
                        Cloud save failed, but it's downloaded locally! 💾
                      </p>
                    )}
                    {uploadStatus === 'success' && (
                      <p className="text-[10px] text-green-600 bg-green-50 py-2.5 px-4 rounded-xl text-center border border-[#ff70ae]/30 font-bold animate-pulse">
                        Perfect! Shared directly to our live gallery memory lane ✨
                      </p>
                    )}
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      onScroll={handlePageScroll}
      className={`h-[100dvh] md:snap-y md:snap-mandatory scroll-smooth bg-[#fff5f8] text-[#4A2230] overflow-x-hidden relative selection:bg-[#ff70ae]/30 ${!invitationOpened ? 'overflow-y-hidden' : 'overflow-y-scroll'}`}
    >
      <FloatingHearts />
      <div className="fixed inset-0 z-0 pointer-events-none">
        {bottomTrees.map((item, index) => (
          <div
            key={index}
            className={`absolute opacity-40 md:opacity-70 ${item.wrapperClass}`}
            style={{ transform: `translateY(${scrollProgress * item.parallax}px)` }}
          >
            <img src={item.src} alt="" className={`object-contain ${item.imageClass}`} />
          </div>
        ))}
      </div>

      {/* Music Iframe */}
      <iframe
        ref={audioRef}
        className="hidden"
        title="Background Music"
        allow="autoplay"
      />

      {/* Navigation - Genie Effect Sidebar - Hidden on Mobile */}
      <AnimatePresence>
        {invitationOpened && activeSection !== 'hero' && !showSurprise && (
          <motion.nav 
            initial={{ 
              opacity: 0, 
              x: 100, 
              scale: 0.35, 
              transformOrigin: 'right bottom' 
            }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 0.7,
            }}
            exit={{ 
              opacity: 0, 
              x: 100, 
              scale: 0.35 
            }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 120,
              duration: 0.8 
            }}
            className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3 items-end group/sidebar origin-right"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {sectionNav.map((item, index) => {
              const isActive = activeSection === item.id;
              
              // macOS Dock Fisheye scale factor calculation
              let factor = 1.0;
              if (hoveredIndex !== null) {
                const distance = Math.abs(hoveredIndex - index);
                if (distance === 0) {
                  factor = 1.25; // Directly hovered scales up significantly!
                } else if (distance === 1) {
                  factor = 1.12; // Immediate neighbors scale up beautifully
                } else if (distance === 2) {
                  factor = 1.04; // Secondary items scale up slightly
                }
              }

              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  animate={{ 
                    scale: factor,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 1100, 
                    damping: 20, 
                    mass: 0.1
                  }}
                  className={`w-52 h-10 px-5 rounded-full flex items-center justify-between outline-none cursor-pointer transition-colors duration-100 select-none ${
                    isActive 
                      ? 'bg-white/85 backdrop-blur-2xl border border-white/60 shadow-lg shadow-[#ff70ae]/10' 
                      : 'bg-transparent border border-transparent hover:bg-white/35 hover:border-white/20'
                  }`}
                >
                  <span className={`text-sm font-serif font-medium tracking-wide transition-colors duration-100 transform-gpu ${
                    isActive 
                      ? 'text-[#ff70ae] font-semibold opacity-100' 
                      : 'text-[#4A2230]/40 group-hover/sidebar:text-[#4A2230]/75 group-hover/sidebar:opacity-100 hover:!text-[#ff70ae] hover:!font-semibold'
                  }`}>
                    {item.label}
                  </span>
                  <div className={`rounded-full transition-colors duration-100 transform-gpu ${
                    isActive 
                      ? 'w-3 h-3 bg-[#ff70ae] scale-110 shadow-[0_0_10px_rgba(255,112,174,0.6)]' 
                      : 'w-1.5 h-1.5 bg-[#ff70ae]/30 group-hover/sidebar:bg-[#ff70ae]/65 hover:!bg-[#ff70ae] hover:!scale-125'
                  }`} />
                </motion.button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="hero" className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:snap-start flex flex-col items-center justify-center px-6 text-center overflow-hidden py-12 md:py-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 md:space-y-6 max-w-2xl"
        >
          <span className="inline-block text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#ff70ae]">
            For Ami ✨
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif leading-tight">
            Something special is waiting for you.
          </h1>
          <p className="text-base md:text-lg text-[#8A5A68] font-light max-w-xs mx-auto leading-relaxed">
            A little birthday surprise has been prepared just for you. Open it whenever you're ready. 💕
          </p>
          <motion.button
            onClick={handleOpenInvitation}
            onMouseEnter={() => setIsSurpriseButtonHovered(true)}
            onMouseLeave={() => setIsSurpriseButtonHovered(false)}
            animate={isSurpriseButtonHovered ? {
              scale: 1.12,
              y: -5,
              boxShadow: '0 25px 50px -12px rgba(255, 112, 174, 0.7)'
            } : {
              scale: [1, 1.05, 1],
              y: 0,
              boxShadow: [
                '0 10px 25px -5px rgba(255, 112, 174, 0.2)',
                '0 10px 30px 5px rgba(255, 112, 174, 0.44)',
                '0 10px 25px -5px rgba(255, 112, 174, 0.2)'
              ]
            }}
            transition={isSurpriseButtonHovered ? {
              type: "spring",
              stiffness: 400,
              damping: 15
            } : {
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            whileActive={{ scale: 0.95, y: 0 }}
            className="group relative h-12 px-[16px] mx-[16px] my-[12px] inline-flex items-center justify-center bg-[#ff70ae] text-white rounded-full font-medium transition-[background-color] shadow-xl overflow-hidden text-sm md:text-base cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Your Surprise 💗
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isOpening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-3xl flex items-center justify-center overflow-hidden"
            >
              <div className="relative flex flex-col items-center">
                {/* Heart Bucket with Water Filling Effect */}
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64">
                  <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-2xl">
                    <defs>
                      <clipPath id="heart-mask">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </clipPath>
                    </defs>
                    
                    {/* Background Heart (Empty State) */}
                    <path 
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                      fill="white"
                      stroke="#ff70ae"
                      strokeWidth="0.5"
                      className="opacity-20"
                    />

                    {/* Water Filling Level */}
                    <g clipPath="url(#heart-mask)">
                      <motion.g
                        animate={{ 
                          y: [20, 2, 20],
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {/* Main Liquid */}
                        <motion.rect
                          x="0"
                          y="4"
                          width="24"
                          height="24"
                          fill="#ff70ae"
                        />
                        
                        {/* Wave Effect Top */}
                        <motion.path
                          d="M 0 4 Q 3 1, 6 4 T 12 4 T 18 4 T 24 4 V 6 H 0 Z"
                          fill="#ff70ae"
                          animate={{ 
                            x: [-4, 0, -4],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Highlights for "Water" surface */}
                        <motion.path
                          d="M 0 5 Q 3 2, 6 5 T 12 5 T 18 5 T 24 5"
                          stroke="white"
                          strokeWidth="0.2"
                          fill="none"
                          className="opacity-40"
                          animate={{ 
                            x: [0, -4, 0],
                          }}
                          transition={{ 
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.g>
                    </g>

                    {/* Heart Glossy Glow overlay */}
                    <path 
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                      fill="none"
                      stroke="#ff70ae"
                      strokeWidth="0.8"
                      className="opacity-40"
                    />
                  </svg>
                </div>
                
                {/* Flying Hearts */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0.5, 1.5, 0.5],
                      x: (Math.random() - 0.5) * 600,
                      y: (Math.random() - 0.5) * 600,
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.1 }}
                    className="absolute top-1/2 left-1/2 text-[#ff70ae]/40"
                  >
                    <Heart size={32} fill="currentColor" />
                  </motion.div>
                ))}
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 md:mt-12 text-[#ff70ae] font-serif text-xl md:text-2xl text-center font-semibold italic"
                >
                  Creating magic for you...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* INVITATION SECTION */}
      <section id="invitation" className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:snap-start flex items-center justify-center px-4 md:px-6 overflow-hidden py-12 md:py-0">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center justify-center">
          {/* Information Card (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-full bg-white/60 backdrop-blur-2xl p-4 sm:p-6 md:p-10 rounded-[1.75rem] md:rounded-[3rem] border border-white/40 shadow-xl md:shadow-2xl space-y-3.5 md:space-y-6 flex flex-col justify-between order-2 md:order-1"
          >
            <div className="space-y-2 md:space-y-5">
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase">Invitation</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-[#4A2230] leading-tight md:leading-snug">Ami's 24th Birthday</h2>
            </div>
            
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-3 p-2 md:p-3 bg-white/50 rounded-xl md:rounded-2xl">
                <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg md:rounded-xl bg-[#ff70ae]/10 flex items-center justify-center text-[#ff70ae]">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] text-[#8A5A68] uppercase tracking-wider font-semibold">Date</p>
                  <p className="font-semibold text-xs md:text-base text-[#4A2230]">8 June 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 md:p-3 bg-white/50 rounded-xl md:rounded-2xl">
                <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg md:rounded-xl bg-[#ff70ae]/10 flex items-center justify-center text-[#ff70ae]">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] text-[#8A5A68] uppercase tracking-wider font-semibold">Time</p>
                  <p className="font-semibold text-xs md:text-base text-[#4A2230]">12:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 md:p-3 bg-white/50 rounded-xl md:rounded-2xl">
                <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg md:rounded-xl bg-[#ff70ae]/10 flex items-center justify-center text-[#ff70ae]">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] text-[#8A5A68] uppercase tracking-wider font-semibold">Location</p>
                  <p className="font-semibold text-xs md:text-base text-[#4A2230]">Secret Place ✨</p>
                </div>
              </div>
            </div>

            <p id="invitation-personal-note" className="text-xs md:text-sm text-[#8A5A68] italic">I have planned a special birthday for you 💗</p>
          </motion.div>

          {/* Dynamic Polaroid Slideshow Card (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative flex justify-center items-center order-1 md:order-2"
          >
            {/* Hanging Tape stickers or ribbon */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-5 md:w-24 md:h-6 bg-[#ff70ae]/20 border border-[#ff70ae]/30 rounded-sm rotate-2 z-20 flex items-center justify-center text-[7px] md:text-[8px] font-bold text-[#ff70ae] tracking-widest shadow-sm">
              PRETTY GIRL
            </div>

            {/* Polaroid Base Frame */}
            <div className="bg-white p-2.5 pb-8 md:p-4 md:pb-12 rounded-xl md:rounded-[2rem] shadow-lg md:shadow-2xl border border-pink-100/30 max-w-[170px] sm:max-w-[210px] md:max-w-xs w-full rotate-[-2deg] transition-transform hover:rotate-0 duration-500 relative group">
              {/* Image slideshow window */}
              <div className="aspect-square w-full rounded-lg md:rounded-xl overflow-hidden bg-pink-50 relative border border-pink-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentInviteImage}
                    src={invitationImages[currentInviteImage]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    alt="Little Ami"
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Visual Indicator Dots */}
                <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                  {invitationImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${idx === currentInviteImage ? 'w-3 md:w-4 bg-[#ff70ae]' : 'w-1 md:w-1.5 bg-white/60'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Polaroid Footer caption */}
              <div className="mt-2 md:mt-4 text-center">
                <p className="font-serif italic text-sm md:text-lg text-[#ff70ae] leading-none shrink-0 font-semibold">Little Ami 🌸</p>
                <p className="text-[8px] md:text-[10px] text-[#8A5A68] tracking-widest uppercase mt-0.5 md:mt-1">Our birthday girl tonight</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DRESSCODE SECTION */}
      <section id="dresscode" className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:snap-start flex items-center justify-center px-6 overflow-hidden py-12 md:py-0">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="order-2 md:order-1 w-full"
          >
            <div className="bg-white/60 backdrop-blur-2xl p-5 sm:p-6 md:p-10 rounded-[1.75rem] md:rounded-[3rem] border border-white/40 shadow-xl md:shadow-2xl text-center md:text-left space-y-3.5 md:space-y-6 max-w-md mx-auto md:mx-0">
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase bg-pink-100/30 px-3 py-1 rounded-full border border-pink-200/5">Dresscode 👗</span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#4A2230] leading-snug font-bold">Pink and Jeans 💖</h2>
              <p className="text-xs sm:text-sm md:text-base text-[#8A5A68] leading-relaxed">
                Let's match! Wear your favorite pink top paired with stylish jeans for our special date. Perfect for beautiful photos together!
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative order-1 md:order-2"
          >
            <div className="aspect-[4/5] max-w-[150px] sm:max-w-[200px] md:max-w-none mx-auto rounded-xl md:rounded-[2.5rem] overflow-hidden border-2 md:border-8 border-white shadow-lg md:shadow-2xl bg-white/40">
              <img src={dresscodeImage} alt="Dresscode" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 md:-bottom-6 md:-right-6 bg-white p-1.5 md:p-5 rounded-lg md:rounded-3xl shadow-md md:shadow-xl border border-pink-50">
              <p className="font-serif italic text-[#ff70ae] text-[9px] sm:text-xs md:text-lg leading-none">Perfect Pair ✨</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section id="schedule" className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:snap-start flex items-center justify-center px-4 md:px-6 overflow-hidden py-12 md:py-0">
        <div className="w-full max-w-6xl space-y-4 lg:space-y-8 select-none">
          <div className="text-center space-y-1 md:space-y-3">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase bg-pink-50/50 px-3 py-1.5 rounded-full border border-pink-100/20">Today's Journey</span>
            <h2 className="text-xl md:text-4xl lg:text-5xl font-serif text-[#4A2230] leading-snug">Our Beautiful Roadmap ✨</h2>
          </div>
          
          {/* MOBILE & TABLET LAYOUT: Vertical list connecting with dashed line styled exactly like the design mockup */}
          <div className="block lg:hidden w-full max-w-sm mx-auto relative px-4 pb-4">
            {/* The dashed line running down the center of the left time capsules */}
            <div className="absolute left-[54px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-[#ff70ae] pointer-events-none z-0" />
            
            <div className="space-y-4 relative z-10 w-full">
              {schedule.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="relative flex gap-3.5 items-center justify-start w-full"
                >
                  {/* Capsule/oval time badge EXACTLY like design mockup */}
                  <div className="w-[76px] h-9 shrink-0 rounded-full bg-white border border-[#ff70ae]/80 shadow-[0_2px_8px_rgba(255,112,174,0.12)] flex items-center justify-center font-sans font-black text-[#4A2230] text-[11px] sm:text-xs z-10 select-none">
                    <span>{item.time.split(' ')[0]}</span>
                  </div>

                  {/* White rounded Step Card EXACTLY like design mockup */}
                  <div className="flex-1 min-w-0 bg-white rounded-3xl border border-pink-100 p-3 shadow-[0_4px_20px_rgba(255,112,174,0.06)] flex items-center gap-3 transition-transform duration-300 hover:scale-[1.01]">
                    {/* Image with 1:1 Aspect Ratio (Square) */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 aspect-square rounded-[1.25rem] overflow-hidden bg-pink-50 border border-pink-100/30">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover select-none" />
                    </div>

                    {/* Left aligned title and subtext */}
                    <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                      {/* Headline */}
                      <h3 className="font-bold text-xs sm:text-[14px] text-[#4A2230] leading-tight font-sans truncate">
                        {item.title}
                      </h3>
                      {/* Subtext */}
                      <p className="text-[10px] sm:text-[11px] text-[#8A5A68] leading-tight font-sans font-medium mt-1 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* DESKTOP LAYOUT: 3 items in Row 1, 2 items in Row 2, connected with beautiful dashed timeline */}
          <div className="hidden lg:grid grid-cols-6 gap-x-6 gap-y-8 relative w-full px-4 max-w-5xl mx-auto">
            
            {/* Row 1 Connector: Center of Card 1 to Center of Card 3 */}
            <div className="absolute top-[68px] lg:top-[76px] xl:top-[84px] left-[16.6%] right-[16.6%] h-[2px] border-t-2 border-dashed border-[#ff70ae]/30 pointer-events-none z-0" />
            
            {/* Curve Road: Winding connection from Step 3 down to Step 4 */}
            <div className="absolute right-[16.6%] left-[33.3%] top-[68px] lg:top-[76px] xl:top-[84px] bottom-[68px] lg:bottom-[76px] xl:bottom-[84px] border-r-2 border-b-2 border-dashed border-[#ff70ae]/20 rounded-br-[3rem] pointer-events-none z-0" />

            {/* Row 2 Connector: Center of Card 4 to Center of Card 5 */}
            <div className="absolute bottom-[68px] lg:bottom-[76px] xl:bottom-[84px] left-[33.3%] right-[33.3%] h-[2px] border-t-2 border-dashed border-[#ff70ae]/30 pointer-events-none z-0" />

            {/* Row 1 Cards (idx 0 to 2, stepNumber 1 to 3, colspan-2 each) */}
            {schedule.slice(0, 3).map((item, i) => (
              <motion.div 
                key={i} 
                className="col-span-2 relative z-10"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="bg-white/45 hover:bg-white/80 backdrop-blur-md rounded-[1.75rem] p-4 pt-5 pb-3.5 border border-pink-100/50 hover:border-[#ff70ae]/40 flex flex-col items-center text-center transition-all duration-400 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(255,112,174,0.08)] relative group h-full">
                  {/* Step Badge */}
                  <div className="absolute -top-3 left-6 bg-[#ff70ae] text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-widest shadow-md shadow-[#ff70ae]/15">
                    STEP 0{i + 1}
                  </div>

                  {/* 1:1 Aspect Ratio Image Container */}
                  <div className="w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 aspect-square rounded-2xl overflow-hidden bg-white border border-[#ff70ae]/10 shadow-sm relative group-hover:scale-105 transition-transform duration-300 mb-3.5 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover select-none" />
                    {/* Time overlay badge */}
                    <div className="absolute bottom-1.5 right-1.5 bg-white/95 backdrop-blur-sm shadow-md px-2 py-0.5 rounded-full text-[9px] font-bold text-[#ff70ae] border border-pink-50 font-mono">
                      {item.time}
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="space-y-1 w-full flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="p-0.5 rounded-full text-[#ff70ae] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <h3 className="font-bold text-sm lg:text-base text-[#4A2230] group-hover:text-[#ff70ae] transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-[10px] lg:text-xs text-[#8A5A68] leading-normal px-1 font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Row 2 Cards with centered layout spacer col-span-1 */}
            <div className="col-span-1" />
            {schedule.slice(3, 5).map((item, i) => (
              <motion.div 
                key={i + 3} 
                className="col-span-2 relative z-10"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="bg-white/45 hover:bg-white/80 backdrop-blur-md rounded-[1.75rem] p-4 pt-5 pb-3.5 border border-pink-100/50 hover:border-[#ff70ae]/40 flex flex-col items-center text-center transition-all duration-400 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(255,112,174,0.08)] relative group h-full">
                  {/* Step Badge */}
                  <div className="absolute -top-3 left-6 bg-[#ff70ae] text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-widest shadow-md shadow-[#ff70ae]/15">
                    STEP 0{i + 4}
                  </div>

                  {/* 1:1 Aspect Ratio Image Container */}
                  <div className="w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 aspect-square rounded-2xl overflow-hidden bg-white border border-[#ff70ae]/10 shadow-sm relative group-hover:scale-105 transition-transform duration-300 mb-3.5 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover select-none" />
                    {/* Time overlay badge */}
                    <div className="absolute bottom-1.5 right-1.5 bg-white/95 backdrop-blur-sm shadow-md px-2 py-0.5 rounded-full text-[9px] font-bold text-[#ff70ae] border border-pink-50 font-mono">
                      {item.time}
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="space-y-1 w-full flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="p-0.5 rounded-full text-[#ff70ae] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <h3 className="font-bold text-sm lg:text-base text-[#4A2230] group-hover:text-[#ff70ae] transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-[10px] lg:text-xs text-[#8A5A68] leading-normal px-1 font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="col-span-1" />

          </div>
        </div>
      </section>

      {/* IMAGE SECTION */}
      <section id="image-section" className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:snap-start flex flex-col items-center justify-center overflow-hidden px-4 py-12 md:py-4">
        <motion.div
          style={{
            scale: 1 + imageSectionProgress * 0.05,
            y: imageSectionProgress * -15
          }}
          className="w-full max-w-5xl flex flex-col items-center justify-center gap-2 sm:gap-3 lg:gap-4 min-h-full md:h-full"
        >
          {/* Header */}
          <div className="text-center space-y-1.5 md:space-y-2 px-4 select-none">
            <div>
              <span className="text-[9px] md:text-xs font-bold tracking-[0.2em] text-[#ff70ae] uppercase bg-pink-50/80 px-4 py-1 rounded-full border border-pink-100/30 shadow-sm">
                Mini album of us
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-[#4A2230] leading-snug font-bold">Our Album of Love</h2>
            <p className="text-[9px] md:text-xs lg:text-[13px] text-[#8A5A68] max-w-md mx-auto leading-normal">
              Every sweet moment shared, hand in hand. Just waiting for our cute pictures to fill these frames today! ✨
            </p>
          </div>

          {/* Polaroid Container - Horizontal Scroll on Mobile / Fixed Responsive Grid on Desktop in Portrait 2:3 Aspect ratio */}
          <div className="flex lg:grid lg:grid-cols-3 gap-4 md:gap-5 lg:gap-5 xl:gap-6 w-full max-w-3xl xl:max-w-4xl px-6 md:px-8 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 select-none items-center pt-2 justify-start lg:justify-center snap-x snap-mandatory scrollbar-none scroll-px-6 md:scroll-px-8">
            {[
              { id: 'ours-0', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%206.png', title: 'Perfect Days 🌸', subtitle: 'Warm Sunshine', rotate: 'lg:-rotate-2' },
              { id: 'ours-1', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%201.png', title: 'Cozy Chats ☕', subtitle: 'Pure Happiness', rotate: 'lg:rotate-1' },
              { id: 'ours-2', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%202.png', title: 'Lovely Gaze 👀', subtitle: 'My Whole World', rotate: 'lg:-rotate-1' },
              { id: 'ours-3', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%203.png', title: 'Warm Hugs 🧸', subtitle: 'Safest Place', rotate: 'lg:rotate-2' },
              { id: 'ours-4', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%204.png', title: 'Sweet Laughs 😄', subtitle: 'Infinite Joy', rotate: 'lg:-rotate-2' },
              { id: 'ours-5', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%205.png', title: 'Together Always ♾️', subtitle: 'My Special One', rotate: 'lg:rotate-1' },
            ].map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.04 }}
                onClick={() => setGalleryToast(`Beautiful moment: "${card.title}" 🥺💕`)}
                className={`bg-white p-2 sm:p-2.5 lg:p-2.5 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl border border-pink-50 relative cursor-pointer select-none transition-all duration-300 ${card.rotate} w-[62vw] xs:w-[58vw] sm:w-[45vw] md:w-[32vw] lg:w-full lg:h-auto lg:aspect-square aspect-[2/3] shrink-0 snap-center`}
              >
                {/* Washi Tape Ribbon Effect */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3.5 md:w-16 md:h-4 bg-[#ff70ae]/15 backdrop-blur-[2px] border-x border-[#ff70ae]/10 rounded-sm rotate-2 flex items-center justify-center text-[5px] md:text-[6px] font-bold text-[#ff70ae]/70 tracking-wider">
                  LOVELY
                </div>

                {/* Inner Image Slot */}
                <div className="w-full h-full rounded-lg md:rounded-xl overflow-hidden border border-pink-100 bg-pink-50 relative flex flex-col items-center justify-center text-center">
                  <img src={card.src} alt={card.title} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {galleryToast && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#4A2230] text-pink-100 px-6 py-2 rounded-full text-xs md:text-sm font-medium shadow-lg shadow-[#ff70ae]/15 border border-[#ff70ae]/20 flex items-center gap-2 mt-2 max-w-md text-center"
              >
                <Heart className="w-4 h-4 fill-current text-[#ff70ae] shrink-0" />
                <span className="truncate max-w-[280px]">{galleryToast}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* VIDEO SECTION */}
      <section id="video-section" className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:snap-start flex flex-col items-center justify-center overflow-hidden px-4 py-8 md:py-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl flex flex-col items-center justify-center gap-4 sm:gap-6 lg:gap-8 min-h-full md:h-full"
        >
          {/* Header */}
          <div className="text-center space-y-1.5 md:space-y-2 px-4 select-none">
            <div>
              <span className="text-[9px] md:text-xs font-bold tracking-[0.2em] text-[#ff70ae] uppercase bg-pink-50/80 px-4 py-1 rounded-full border border-pink-100/30 shadow-sm">
                Sweet Video Diaries 🎞️
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-[#4A2230] leading-snug font-bold">Our Sweetest Memories</h2>
            <p className="text-[9px] md:text-xs lg:text-[13px] text-[#8A5A68] max-w-md mx-auto leading-normal">
              A collection of our favorite laughs, cute walks, and beautiful moments captured in video. Turn on the volume and press play! 💖
            </p>
          </div>

          {/* Custom Memory Video Player */}
          <MemoryVideoPlayer
            videoSrc={memoryVideo}
            onPlayStateChange={(playing) => {
              // Pause background music when video plays, resume background music when video pauses/stops
              setIsPlaying(!playing);
            }}
            memoryVideoRef={memoryVideoRef}
          />
        </motion.div>
      </section>

      {/* LETTER SECTION */}
      <section id="letter" className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:snap-start flex items-center justify-center px-6 py-12 md:py-0 overflow-hidden">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="w-full md:max-h-[85vh] flex flex-col relative bg-gradient-to-br from-white via-[#fffefd] to-[#fffbfc] rounded-[1.75rem] md:rounded-[3rem] p-4 sm:p-5 md:p-10 border border-pink-100/80 shadow-[0_15px_45px_rgba(255,112,174,0.06)] hover:shadow-[0_25px_60px_rgba(255,112,174,0.18)] hover:border-[#ff70ae]/40 transition-all duration-500 text-left select-none overflow-hidden group"
          >
            {/* Subtle vintage envelope style background textures */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffd5e5_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.14] pointer-events-none" />
            
            {/* Cascade of Falling Hearts */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              <AnimatePresence>
                {fallingHearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    initial={{ top: "-10%", left: `${heart.x}%`, opacity: 0, scale: 0.6, rotate: heart.rotation }}
                    animate={{ 
                      top: "105%",
                      x: [0, Math.random() * 30 - 15, Math.random() * 50 - 25],
                      opacity: [0, 1, 1, 0], 
                      scale: [0.6, 1.1, 1, 0.6],
                      rotate: heart.rotation + (Math.random() > 0.5 ? 60 : -60)
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: heart.duration, 
                      ease: "linear",
                      opacity: { times: [0, 0.1, 0.9, 1] },
                      scale: { times: [0, 0.1, 0.9, 1] }
                    }}
                    className="absolute select-none"
                    style={{ 
                      fontSize: `${heart.size}px`,
                      lineHeight: 1,
                    }}
                  >
                    {heart.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-3 md:space-y-6 relative z-10 pr-0 md:pr-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100/50 pb-4">
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center gap-2">
                      <Flower className="w-4 h-4 text-[#ff70ae] animate-spin-slow" />
                      <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase">A Little Note</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#4A2230] font-bold">
                      Happy Birthday, sayaaaaaanggg ❤️🎂
                    </h2>
                  </div>
                  
                  {/* Modern EN / ID Toggle Selector */}
                  <div className="flex items-center self-start sm:self-center bg-pink-50/80 p-1 rounded-full border border-pink-200/30 select-none">
                    <button
                      type="button"
                      onClick={() => setLetterLanguage('en')}
                      className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${
                        letterLanguage === 'en'
                          ? 'bg-[#ff70ae] text-white shadow-sm'
                          : 'text-[#8A5A68] hover:text-[#ff70ae]'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLetterLanguage('id')}
                      className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${
                        letterLanguage === 'id'
                          ? 'bg-[#ff70ae] text-white shadow-sm'
                          : 'text-[#8A5A68] hover:text-[#ff70ae]'
                      }`}
                    >
                      ID
                    </button>
                  </div>
                </div>
                
                {/* Note Content Text - Scrollable, Standard Uniform Styling (No artificial highlights) */}
                <div className="space-y-4 text-xs md:text-sm lg:text-[14px] text-[#4A2230] leading-relaxed md:leading-loose md:max-h-[46vh] md:overflow-y-auto pr-1 md:pr-4 custom-scrollbar font-medium">
                  {letterLanguage === 'id' ? (
                    <>
                      <p className="mt-1">
                        Gak kerasa ya, sekarang kamu udah 24 tahun.
                      </p>
                      <p>
                        Selamat ulang tahun yaa. Selamat karena udah berhasil lewatin satu tahun  dengan segala cerita, capek, bahagia, sedih, dan hal-hal yang mungkin gak semua orang tahu. Dan selamat juga karena sampai hari ini masih kuat ngadepin Abang yang kadang nyebelin ini. Itu pencapaian yang luar biasa loh. WKWK
                      </p>
                      <p>
                        Tapi kalau serius nih, Abang cuma mau bilang makasih.
                      </p>
                      <p>
                        Makasih karena kamu datang ke hidup Abang.
                      </p>
                      <p>
                        Sejak kenal kamu, banyak hal jadi terasa lebih menyenangkan. Weekend yang dulu biasa aja sekarang jadi sesuatu yang selalu ditunggu. Rasanya seneng aja kalau tau bakal ketemu kamu, ngobrol, jalan bareng, gangguin kamu, atau bahkan cuma duduk bareng sambil cerita hal-hal random, apalagi sampe deeptalk.
                      </p>
                      <p>
                        Makasih juga buat semua hal kecil yang kamu lakuin buat Abang. Buat masakan yang pernah kamu bikinin, buat waktu yang kamu luangin buat nyamperin Abang ke kantor, buat perhatian-perhatian kecil yang mungkin menurut kamu biasa aja tapi selalu bikin Abang merasa disayang.
                      </p>
                      <p>
                        Dan yang paling penting, makasih karena selalu ada.
                      </p>
                      <p>
                        Kamu udah lihat banyak versi Abang. Pas lagi seneng, pas lagi stres, pas lagi banyak pikiran, pas lagi nyebelin, pas lagi kentut, bahkan pas lagi ngadepin drama hidup. Tapi sampai sekarang kamu masih bertahan di sini. Jadi kadang Abang mikir, kamu ini manusia atau malaikat ya. Kayaknya dua-duanya deh. hehe gemesss 🤏🏻😭
                      </p>
                      <p>
                        Abang juga bangga banget sama kamu tauuuuuu...
                      </p>
                      <p>
                        Mungkin nggak semua orang tahu seberapa kuatnya kamu. Ada banyak hal yang udah kamu lewati, banyak hal yang mungkin kamu simpan sendiri. Tapi meskipun begitu, kamu tetap jadi orang yang ceria, baik, penuh tawa, petakilan, dan selalu bisa bikin Abang nyaman. Jujur, itu salah satu hal yang bikin Abang kagum sama kamu sampe sekarang.
                      </p>
                      <p>
                        Jadi kalau suatu saat kamu lagi capek, lagi sedih, atau ngerasa semuanya terasa berat, jangan dipendam sendiri ya. Kamu punya Abang sayangggg.
                      </p>
                      <p>
                        Kamu boleh cerita apa aja. Boleh ngeluh, boleh nangis, boleh marah, boleh manja, boleh kirim voice note panjang lebar  sampe beberapa menit. Abang bakal dengerin. Ya walaupun kalo pas Abang ketiduran mungkin balasnya agak telat dikit. 😌
                      </p>
                      <p>
                        Sayangggggg, kita masih punya banyak hal yang belum kita jalanin bareng.
                      </p>
                      <p>
                        Masih banyak tempat yang pengen kita datengin, makanan yang pengen kita cobain, trend tiktok yang pengen kita bikin, foto yang pengen kita ambil, dan mimpi yang pengen kita kejar sama-sama. Dan nikah yaa tentunya hehe
                      </p>
                      <p>
                        Jadi tolong jaga diri baik-baik ya. Tetap sehat, tetap bahagia, dan tetap jadi diri kamu yang sekarang. Diri kamu yang selalu berhasil bikin Abang nyaman, bikin Abang ketawa, dan bikin Abang bersyukur karena dipertemukan sama kamu. ❤️
                      </p>
                      <p className="pt-2 font-semibold">
                        Happy Birthday sekali lagi, sayang.
                      </p>
                      <p>
                        Makasih karena udah jadi orang favorit Abang, notifikasi yang selalu ditunggu, dan salah satu hal terbaik yang pernah hadir di hidup Abang.
                      </p>
                      <p>
                        Sekarang nikmatin hari spesial kamu yaa.
                      </p>
                      <p>
                        Dan ingat satu hal penting:
                      </p>
                      <p>
                        Kamu memang makin tua. Tapi tenang... Kamu masih lebih muda dari Abang kok. 😌❤️
                      </p>
                      <p className="pt-2 font-semibold">
                        Abang sayang banget sama kamu. Sayaaaaanngggggg bangettttt. Lebih banyak dari yang bisa Abang ungkapin lewat tulisan ini. 💗
                      </p>
                      <p className="pt-2 font-semibold text-[#ff70ae]">
                        Love you more sayang 💗<br />
                        Love you to the moon and back 💗<br />
                        I love you to my fullest capacity. 💗
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1">
                        It's crazy how you're already 24 years old now.
                      </p>
                      <p>
                        Happy Birthday yaaa. Congratulations for making it through another year with all the stories, struggles, happiness, sadness, and things that not everyone knows about. And congratulations as well for still being strong enough to deal with Abang until today. That's honestly a huge achievement. WKWK
                      </p>
                      <p>
                        But seriously, Abang just wants to say thank you.
                      </p>
                      <p>
                        Thank you for coming into my life.
                      </p>
                      <p>
                        Ever since I met you, so many things have become more enjoyable. Weekends that used to feel ordinary are now something I always look forward to. It just makes me happy knowing I'll get to see you, talk to you, go out with you, annoy you, or even just sit together talking about random things, especially when we end up having deep talks.
                      </p>
                      <p>
                        Thank you too for all the little things you do for Abang. For the meals you've cooked for me, for taking the time to come all the way to my office, and for all those little acts of care that might seem normal to you but always make me feel loved.
                      </p>
                      <p>
                        And most importantly, thank you for always being here.
                      </p>
                      <p>
                        You've seen so many versions of Abang. When I'm happy, stressed, overthinking, being annoying, farting, and even dealing with all the drama life throws at me. Yet somehow, you're still here. So sometimes Abang wonders... are you a human or an angel? I think you're both. Hehe gemesss 🤏🏻😭
                      </p>
                      <p>
                        And you know what? Abang is really, really proud of youuuuuu...
                      </p>
                      <p>
                        Maybe not everyone knows how strong you actually are. There are so many things you've gone through, so many things you've carried quietly on your own. But despite all of that, you still remain cheerful, kind, full of laughter, chaotic, and someone who always makes Abang feel comfortable. Honestly, that's one of the many reasons why Abang still admires you so much until today.
                      </p>
                      <p>
                        So if one day you're tired, sad, or feel like everything is becoming too heavy, please don't keep it all to yourself. You have Abang, sayangggg.
                      </p>
                      <p>
                        You can tell me anything. You can complain, cry, get mad, be clingy, or send me voice notes that are several minutes long. Abang will listen. Well... unless Abang accidentally falls asleep first, then my reply might be a little late. 😌
                      </p>
                      <p>
                        Sayangggggg, we still have so many things left to do together.
                      </p>
                      <p>
                        There are still so many places we want to visit, foods we want to try, TikTok trends we want to make, photos we want to take, and dreams we want to chase together. And of course... getting married too hehe.
                      </p>
                      <p>
                        So please take good care of yourself, okay? Stay healthy, stay happy, and stay exactly the way you are right now. The version of you that always makes Abang feel at home, makes Abang laugh, and makes Abang grateful that our paths crossed. ❤️
                      </p>
                      <p className="pt-2 font-semibold font-serif text-[#4A2230]">
                        Happy Birthday once again, sayang.
                      </p>
                      <p>
                        Thank you for being Abang's favorite person, my favorite notification, and one of the best things that has ever happened in my life.
                      </p>
                      <p>
                        Now go enjoy your special day yaaa.
                      </p>
                      <p>
                        And remember one important thing:
                      </p>
                      <p>
                        You're getting older. But don't worry... You're still younger than Abang. 😌❤️
                      </p>
                      <p className="pt-2 font-semibold">
                        Abang loves you so, so much. Sayaaaaanngggggg bangettttt. More than I could ever put into words. 💗
                      </p>
                      <p className="pt-2 font-semibold text-[#ff70ae]">
                        Love you more, sayang 💗<br />
                        Love you to the moon and back 💗<br />
                        I love you to my fullest capacity. 💗
                      </p>
                    </>
                  )}
                </div>

                {/* Sender signature block */}
                <div className="pt-4 md:pt-6 border-t border-[#ffd6e7] flex items-center justify-between">
                  <div 
                    onMouseEnter={() => setIsHoveringSignature(true)}
                    onMouseLeave={() => setIsHoveringSignature(false)}
                    className="cursor-pointer group/signature transition-all duration-300 relative py-1 px-2 -mx-2 rounded-lg hover:bg-pink-50/50"
                  >
                    <p className="text-[10px] md:text-xs italic text-[#8A5A68] mb-0.5 group-hover/signature:text-[#ff70ae] transition-colors">With Love,</p>
                    <p className="text-base md:text-xl font-serif text-[#ff70ae] font-semibold tracking-wide transition-all duration-300 group-hover/signature:scale-[1.02] origin-left">Ardhi Satria</p>
                    <p className="text-[8px] md:text-xs tracking-widest uppercase text-[#8A5A68]/70 font-mono mt-0.5">8 June 2026 ✨</p>
                  </div>
                
                {/* Clickable wax seal or shiny heart interactive stamp at the bottom corner */}
                <div className="flex items-center gap-4">
                  {/* Download button */}
                  <div className="flex flex-col items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileActive={{ scale: 0.9 }}
                      onClick={() => setShowDownloadChoice(true)}
                      className="w-12 h-12 bg-white hover:bg-pink-50 text-[#ff70ae] rounded-full flex items-center justify-center shadow-md border border-pink-200 relative cursor-pointer group"
                      title="Download options! 💌"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </motion.button>
                    <span className="text-[7px] font-mono font-bold tracking-widest text-[#8A5A68] uppercase">Save Note 💌</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: -12 }}
                      whileActive={{ scale: 0.9 }}
                      onClick={triggerConfetti}
                      className="w-12 h-12 bg-gradient-to-tr from-[#ff5293] to-[#ff70ae] hover:from-[#ff3a81] hover:to-[#ff5c9e] rounded-full flex items-center justify-center shadow-lg shadow-[#ff5293]/30 border-2 border-white relative cursor-pointer group"
                      title="Press to stamp love!"
                    >
                      <Heart className="w-5 h-5 fill-rose-100 text-white group-hover:scale-110 transition-transform" />
                      {/* Ring animation on hover */}
                      <span className="absolute inset-x-0 inset-y-0 rounded-full border border-pink-400 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 pointer-events-none" />
                    </motion.button>
                    <span className="text-[7px] font-mono font-bold tracking-widest text-[#8A5A68] uppercase">Seal & Sparkle ✨</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SURPRISE SECTION */}
      <section id="surprise" className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:snap-start flex items-center justify-center px-6 py-12 md:py-0">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4 md:space-y-5">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase">One More Thing 💕</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Before Our Date Begins...</h2>
            <p className="text-base md:text-lg text-[#8A5A68] font-light max-w-md mx-auto">
              I prepared one last tiny surprise before I pick you up ✨
            </p>
          </div>
          
          <button
            onClick={handleSurprise}
            className="h-12 px-[16px] mx-[16px] my-[12px] inline-flex items-center justify-center bg-[#ff70ae] text-white rounded-full font-bold text-base hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ff70ae]/30"
          >
            Press Me Princess 👀
          </button>
        </motion.div>

        {/* Surprise Full Page Overlay */}
        <AnimatePresence>
          {false && showSurprise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs"
            >
              {/* Screen 2: Intro Popup Modal (displays when camera is NOT open yet) */}
              {!showCamera && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative border border-pink-100/30 flex flex-col items-center text-center space-y-6 md:space-y-8 select-none m-4"
                >
                  {/* Close button in top-right of the modal box */}
                  <button
                    onClick={handleSurprise}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-full transition-all active:scale-90 shadow-sm z-30"
                    aria-label="Close"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>

                  <div className="w-20 h-20 md:w-24 md:h-24 bg-[#fff5f8] rounded-full flex items-center justify-center text-[#ff70ae] shadow-inner mb-1 border border-pink-100">
                    <CameraIcon size={36} />
                  </div>

                  <div className="space-y-3.5">
                    <h3 className="text-2xl md:text-3xl font-serif text-[#4A2230] font-semibold">Show your cute face 🥺</h3>
                    <p className="text-xs md:text-sm text-[#8A5A68] leading-relaxed max-w-xs mx-auto">
                      I want to see your beautiful reaction to this little website I made for you... Keep this sweet moment remembered forever ✨
                    </p>
                  </div>

                  {cameraError && (
                    <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 w-full">
                      {cameraError}
                    </p>
                  )}

                  <button
                    onClick={handleOpenCamera}
                    className="w-full h-12 bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-200/50 active:scale-95 text-sm md:text-base"
                  >
                    Open Camera 📸
                  </button>
                </motion.div>
              )}

              {showCamera && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="fixed inset-0 z-[105] bg-[#fff5f8] overflow-y-auto w-full h-full flex items-center justify-center py-6 px-4 md:px-8"
                >
                  <div className="w-full max-w-5xl md:max-w-6xl bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl select-none relative">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8 items-stretch">
                      
                      {/* Left Column: Camera, Trigger, & Settings Slots */}
                      <div className={`${mobilePhotoboothStep === 'capture' ? 'flex' : 'hidden lg:flex'} flex-col space-y-4 md:space-y-5 justify-between`}>
                        
                        {/* Top Status and Back-Close Action Bar */}
                        <div className="flex items-center justify-between shrink-0">
                          <button
                            onClick={handleCameraBack}
                            className="px-4 py-2 rounded-full bg-white border border-pink-100 text-[#ff70ae] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-pink-50 hover:border-pink-200 transition-colors"
                          >
                            <ChevronLeft size={16} strokeWidth={3} />
                            Close
                          </button>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] md:text-xs font-extrabold text-[#ff70ae] tracking-wider uppercase bg-[#fff5f8] px-3.5 py-1.5 rounded-full border border-pink-200/30 shadow-xs">
                              Shot {activeSlotIndex + 1} of {photoMode}
                            </span>
                          </div>
                        </div>

                        {/* Layout Selector: прямо на экране камеры для мобильного и десктопа */}
                        <div className="w-full bg-white/40 p-2 rounded-2xl border border-pink-100/30 shadow-2xs">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                            <span className="text-[10px] sm:text-xs font-bold text-[#8A5A68] uppercase tracking-wider">
                              Choose Layout Size 📐
                            </span>
                            <div className="inline-flex bg-pink-100/30 p-0.5 rounded-full border border-pink-200/10 w-full sm:w-auto min-w-[200px]">
                              <button
                                type="button"
                                onClick={() => handlePhotoModeChange(3)}
                                className={`flex-1 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                  photoMode === 3 
                                    ? 'bg-[#ff70ae] text-white shadow-xs' 
                                    : 'text-[#8A5A68] hover:text-[#ff70ae]'
                                }`}
                              >
                                🎞️ 3 Photos
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePhotoModeChange(6)}
                                className={`flex-1 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                  photoMode === 6 
                                    ? 'bg-[#ff70ae] text-white shadow-xs' 
                                    : 'text-[#8A5A68] hover:text-[#ff70ae]'
                                }`}
                              >
                                ✨ 6 Photos
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Camera Feed Viewport */}
                        <div className="relative w-full aspect-video bg-black rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg border border-pink-100/50 flex items-center justify-center group/cam shadow-[#ff70ae]/5">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            onLoadedMetadata={(e) => {
                              e.currentTarget.play().catch(err => console.error("Webcam playback error:", err));
                            }}
                            className="w-full h-full object-cover scale-x-[-1]"
                          />

                          {/* Align text pill top-center overlay */}
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                            <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[9px] md:text-xs font-bold text-white uppercase tracking-widest leading-none select-none">
                              {isCountingDown ? "Hold still! 📸" : "Align your beautiful smile ✨"}
                            </div>
                          </div>

                          {/* Interactive shutter release centered overlays */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                            <button
                              onClick={handleCapturePhoto}
                              disabled={isCountingDown}
                              className="relative w-14 h-14 rounded-full flex items-center justify-center bg-white/20 border border-white/50 hover:scale-105 active:scale-95 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                                <div className="w-10 h-10 rounded-full bg-[#ff70ae]/15 border border-[#ff70ae]/30 flex items-center justify-center">
                                  <div className="w-5 h-5 rounded-full bg-[#ff70ae]" />
                                </div>
                              </div>
                            </button>
                          </div>

                          {/* Shutter Countdown overlay */}
                          {countdown !== null && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-30 select-none">
                              <motion.div
                                key={countdown}
                                initial={{ scale: 0.3, opacity: 0 }}
                                animate={{ scale: [0.3, 1.3, 1], opacity: [0, 1, 1] }}
                                transition={{ duration: 0.55 }}
                                className="text-7xl md:text-8xl font-black font-serif text-[#ff70ae] drop-shadow-[0_4px_16px_rgba(255,255,255,0.85)] italic"
                              >
                                {countdown}
                              </motion.div>
                            </div>
                          )}

                          {/* Camera flash visual frame feedback */}
                          {shutterFlash && (
                            <div className="absolute inset-0 bg-white z-[90] pointer-events-none" />
                          )}
                        </div>

                        {/* Result Slots Matrix: Row of columns, wrapping onto 2 rows for 6 shots */}
                        <div className="grid grid-cols-3 gap-2.5 md:gap-4 w-full">
                          {capturedPhotos.map((photo, idx) => {
                            const isActive = activeSlotIndex === idx;
                            return (
                              <button
                                key={idx}
                                disabled={isCountingDown}
                                onClick={() => {
                                  setActiveSlotIndex(idx);
                                }}
                                className={`aspect-[4/3] rounded-xl md:rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-center relative transition-all duration-300 bg-gray-50 shadow-xs ${
                                  isActive
                                    ? 'border-[#ff70ae] bg-white ring-4 ring-pink-100/50 scale-[1.02] shadow-sm z-10'
                                    : 'border-pink-50/50 bg-gray-50/60 hover:bg-white hover:border-[#ff70ae]/20 cursor-pointer'
                                }`}
                              >
                                {photo ? (
                                  <div className="relative w-full h-full group">
                                    <img src={photo} alt={`Captured ${idx + 1}`} className="w-full h-full object-cover select-none" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="text-[8px] md:text-xs text-white font-bold tracking-wider uppercase select-none">
                                        Retake 📸
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center p-1 text-center select-none">
                                    <span className="text-[10px] md:text-xs font-semibold text-gray-400 capitalize whitespace-nowrap">
                                      Shot {idx + 1}
                                    </span>
                                  </div>
                                )}

                                {isActive && (
                                  <span className="absolute bottom-1 px-1.5 py-0.5 rounded-full bg-[#ff70ae] text-[6px] md:text-[8px] text-white font-extrabold uppercase tracking-wide">
                                    Active
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Proceed to stylist trigger on mobile if they have captured at least some pictures */}
                        {capturedPhotos.some(p => p !== null) && (
                          <div className="lg:hidden w-full pt-2">
                            <button
                              type="button"
                              onClick={() => setMobilePhotoboothStep('preview')}
                              className="w-full py-3.5 bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
                            >
                              Go to Style & Preview 🎨 ✨
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Real-time Live Film Strip Mockup Preview (Adaptive Step layout for mobile and desktop) */}
                      <div className={`${mobilePhotoboothStep === 'preview' ? 'flex' : 'hidden lg:flex'} flex-col items-center justify-start bg-pink-50/20 rounded-2xl p-4 md:p-5 border border-pink-100/30 w-full self-start lg:sticky lg:top-4 mt-2 lg:mt-0 max-h-[82vh] lg:max-h-[82vh] overflow-y-auto`}>
                        
                        {/* Mobile-Only Step Header */}
                        <div className="lg:hidden w-full flex items-center justify-between mb-4 border-b border-pink-100/40 pb-2.5">
                          <button
                            onClick={() => setMobilePhotoboothStep('capture')}
                            className="px-3.5 py-1.5 rounded-full bg-white border border-pink-100 text-[#ff70ae] font-bold text-[10px] flex items-center gap-1 shadow-2xs hover:bg-pink-50 transition-colors"
                          >
                            <ChevronLeft size={14} strokeWidth={3} />
                            Change Photo/Retake
                          </button>
                          <span className="text-[10px] font-black text-[#5c3e47] uppercase tracking-wider">Style frame ✨</span>
                        </div>

                        <div className="text-center mb-3">
                          <span className="text-[10px] font-bold tracking-widest text-[#ff70ae] bg-white px-3.5 py-1 rounded-full shadow-xs border border-pink-100/60 uppercase">
                            Live Film Strip Preview ✨
                          </span>
                          <p className="text-[10px] text-[#8A5A68] mt-1.5">See your custom keepsake building in real-time!</p>
                        </div>

                        {/* Layout Selectors Group: Hidden on mobile (since we put size selectors in the camera shot view) or visible on large screens */}
                        <div className="hidden lg:block w-full space-y-3 mb-3 bg-white/50 p-2.5 rounded-2xl border border-pink-100/20 shadow-xs">
                          {/* 1. Strip Count Choice Switcher */}
                          <div className="space-y-1 w-full flex flex-col items-center">
                            <span className="text-[9px] font-bold text-[#8A5A68] uppercase tracking-wider block text-center">
                              Select Size 📐
                            </span>
                            <div className="inline-flex bg-pink-100/30 p-0.5 rounded-full border border-pink-200/10 w-full">
                              <button
                                type="button"
                                onClick={() => handlePhotoModeChange(3)}
                                className={`flex-1 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                  photoMode === 3 
                                    ? 'bg-[#ff70ae] text-white shadow-xs scale-[1.01]' 
                                    : 'text-[#8A5A68] hover:text-[#ff70ae]'
                                  }`}
                              >
                                🎞️ 3-Shot Strip
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePhotoModeChange(6)}
                                className={`flex-1 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                  photoMode === 6 
                                    ? 'bg-[#ff70ae] text-white shadow-xs scale-[1.01]' 
                                    : 'text-[#8A5A68] hover:text-[#ff70ae]'
                                  }`}
                              >
                                ✨ 6-Shot Strip
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Frame color selectors:
                            1. VERTICAL on Desktop (lg:flex)
                            2. HORIZONTAL SCROLLING on Mobile (flex lg:hidden)
                        */}

                        {/* Mobile Frame Color Horizontal scrolling container */}
                        <div className="w-full lg:hidden space-y-2 mb-4 bg-white/40 border border-pink-100/20 p-2.5 rounded-2xl">
                          <span className="text-[10px] font-black text-[#8A5A68] uppercase tracking-widest block text-center">
                            Select Frame Color 🌈
                          </span>
                          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x px-1 max-w-full">
                            {COLOR_OPTIONS.map((opt) => {
                              const isSelected = stripDesign === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => setStripDesign(opt.id)}
                                  className={`snap-center min-w-[85px] py-1.5 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer select-none ${
                                    isSelected
                                      ? `${opt.bgColor} ${opt.borderColor} ${opt.activeColor} scale-[1.04] shadow-xs`
                                      : 'bg-white/90 border-pink-100/50 hover:bg-white hover:border-pink-300'
                                  }`}
                                >
                                  <span 
                                    className="w-4 h-4 rounded-full border border-black/15 shadow-inner shrink-0"
                                    style={{ backgroundColor: opt.dotColor }}
                                  />
                                  <span className="text-[9px] font-black uppercase text-center text-[#5c3e47] tracking-tight leading-none truncate w-full">
                                    {opt.id === 'soft-pink' ? 'Soft Pink' : opt.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Side-by-side Layout on Desktop: Live Film Strip Mockup + Vertical Color Customizer Sidebar */}
                        <div className="hidden lg:flex w-full flex-row items-center justify-center gap-3 md:gap-5 py-1">
                          
                          {/* Live render of Film Strip on Left */}
                          <div className="flex-1 flex justify-center items-center">
                            {renderLiveFilmStrip("w-36 sm:w-40 md:w-44")}
                          </div>

                          {/* Vertical Color Customizer Sidebar on Right */}
                          <div className="flex flex-col items-center gap-1.5 p-1.5 bg-white/70 rounded-2xl border border-pink-100/30 shadow-xs self-stretch justify-center w-[80px] sm:w-[90px]">
                            <span className="text-[9px] font-extrabold text-[#8A5A68] uppercase tracking-widest text-center leading-none mb-1 select-none">
                              Frame 🎨
                            </span>
                            <div className="flex flex-col gap-1 w-full">
                              {COLOR_OPTIONS.map((opt) => {
                                const isSelected = stripDesign === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setStripDesign(opt.id)}
                                    className={`w-full py-1.5 px-1.5 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer select-none ${
                                      isSelected
                                        ? `${opt.bgColor} ${opt.borderColor} ${opt.activeColor} scale-[1.03]`
                                        : 'bg-white/40 border-pink-100/10 hover:bg-white/95 hover:border-pink-200'
                                    }`}
                                  >
                                    <span 
                                      className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner shrink-0"
                                      style={{ backgroundColor: opt.dotColor }}
                                    />
                                    <span className="text-[8px] font-black uppercase text-center text-[#5c3e47] tracking-tight leading-none truncate w-full">
                                      {opt.id === 'soft-pink' ? 'Soft' : opt.name}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                        </div>

                        {/* Live Preview Rendered AT THE BOTTOM on Mobile */}
                        <div className="lg:hidden w-full flex flex-col items-center justify-center py-3 bg-white/10 rounded-2xl border border-pink-100/10">
                          {renderLiveFilmStrip("w-40 sm:w-44")}
                        </div>

                        {/* Footer Trigger CTA Button placed under live film strip preview */}
                        <div className="w-full mt-4 pt-4 border-t border-pink-100/30">
                          {capturedPhotos.every((p) => p !== null) ? (
                            <motion.button
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.01 }}
                              whileActive={{ scale: 0.99 }}
                              onClick={async () => {
                                await generateCompositeStrip(capturedPhotos as string[]);
                              }}
                              className="w-full py-3.5 bg-gradient-to-r from-[#ff70ae] to-[#ff5293] text-white rounded-2xl font-bold text-sm shadow-xl shadow-pink-200/50 flex items-center justify-center gap-2 hover:from-[#ff5a9e] hover:to-[#ff3d85] transition-all"
                            >
                              Create Photo Strip 💖
                            </motion.button>
                          ) : (
                            <div className="space-y-2">
                              <button
                                disabled
                                className="w-full py-3.5 bg-gray-200 text-gray-400 rounded-2xl font-bold text-sm select-none cursor-not-allowed"
                              >
                                Capture {capturedPhotos.filter(p => p !== null).length}/{photoMode} Photos to Save ✨
                              </button>
                              <button
                                type="button"
                                onClick={() => setMobilePhotoboothStep('capture')}
                                className="lg:hidden w-full py-2 bg-white border border-pink-200 text-[#ff70ae] rounded-xl font-bold text-xs"
                              >
                                📸 Capture Remaining Shots
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

                  {/* Screen 5: Vertical Photo Strip Result Popup Modal Dialog */}
                  <AnimatePresence>
                    {capturedPhoto && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="w-full max-w-2xl bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative border border-pink-100/20 max-h-[92vh] overflow-y-auto"
                        >
                          {/* Close button inside top corner of the strip mockup popup */}
                          <button
                            onClick={() => setCapturedPhoto(null)}
                            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-full transition-all active:scale-95 shadow-md z-30"
                            aria-label="Close"
                          >
                            <X size={20} strokeWidth={2.5} />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center justify-items-center">
                            
                            {/* Left Col: Renders the beautiful composite vertical Photo Strip mockup with Machine Slot Dispenser effect */}
                            <div className="flex flex-col items-center justify-center relative w-full">
                              {/* Classic Photo Dispenser Slot Mechanism Lid */}
                              <div className="mb-4 text-center">
                                <div className="inline-flex flex-col items-center">
                                  {/* Inner subtle mechanical slot slit */}
                                  <div className={`${photoMode === 6 ? 'w-80' : 'w-48'} h-3 bg-neutral-900 rounded-t-xl border-t border-b border-pink-200/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden transition-all duration-500`}>
                                    {/* Subtle glowing laser line resembling a high-tech photobooth slide */}
                                    <div className="absolute inset-x-0 top-0.5 h-[1px] bg-pink-400 opacity-60 shadow-[0_0_4px_#ff70ae]" />
                                  </div>
                                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#8A5A68] mt-1 bg-pink-50/80 px-2 py-0.5 rounded border border-pink-100/30">
                                    PHOTO DISPENSER 📸
                                  </span>
                                </div>
                              </div>

                              {/* Dispenser roll out viewport container */}
                              <div className="relative overflow-hidden rounded-2xl p-1 bg-gradient-to-b from-neutral-50 to-neutral-100/30 border border-neutral-200/20 shadow-sm">
                                {/* Vertical conveyor rolling movement */}
                                <motion.div
                                  initial={{ y: -450, opacity: 0.3 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 35,
                                    damping: 14,
                                    mass: 1.15,
                                    delay: 0.2
                                  }}
                                  className="relative"
                                >
                                  {/* Light reflection glass shine over lay */}
                                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5 pointer-events-none rounded-xl z-10" />
                                  
                                  <img
                                    src={capturedPhoto}
                                    alt="Our Memories Strip"
                                    className={`max-h-[48vh] md:max-h-[60vh] ${photoMode === 6 ? 'aspect-[1280/1600]' : 'aspect-[640/1600]'} object-contain rounded-xl shadow-2xl border-white border-[6px] md:border-8 bg-white`}
                                  />
                                </motion.div>
                              </div>
                            </div>

                            {/* Right Col: Details, Download & Upload Controls */}
                            <div className="w-full flex flex-col justify-center space-y-6 select-none max-w-sm">
                              <div className="text-center md:text-left space-y-2">
                                <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase bg-pink-50 px-3 py-1 rounded-full border border-pink-100/20">
                                  Memory strip loaded
                                </span>
                                <h4 className="text-xl md:text-2xl font-serif text-[#4A2230] font-semibold">
                                  Your Souvenir is Ready! 💖
                                </h4>
                                <p className="text-xs md:text-sm text-[#8A5A68]">
                                  Download a high-resolution version of this photo strip or save it directly to our sweet live gallery album!
                                </p>
                              </div>

                              <div className="flex flex-col gap-3">
                                <button
                                  disabled={isUploading}
                                  onClick={async () => {
                                    const link = document.createElement('a');
                                    link.href = capturedPhoto;
                                    link.download = 'ami-birthday-strip.png';
                                    link.click();
                                    await handleUploadToSupabase();
                                  }}
                                  className={`w-full h-12 bg-[#ff70ae] hover:bg-[#ff5a9e] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-200/50 transition-all active:scale-[0.97] text-sm md:text-base ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                  {isUploading ? 'Uploading & Saving...' : uploadStatus === 'success' ? 'Saved & Shared! 🎉' : 'Save to Gallery 💖'}
                                </button>

                                <button
                                  onClick={() => {
                                    setCapturedPhotos([null, null, null]);
                                    setCapturedPhoto(null);
                                    setActiveSlotIndex(0);
                                  }}
                                  disabled={isUploading}
                                  className="w-full h-12 bg-white text-[#ff70ae] border border-pink-200 rounded-2xl font-bold hover:bg-pink-50 transition-all active:scale-[0.97] flex items-center justify-center text-sm md:text-base"
                                >
                                  Retake 📸
                                </button>
                              </div>

                              {/* Action messaging triggers */}
                              {uploadStatus === 'error' && (
                                <p className="text-[10px] text-red-500 bg-red-50 py-2.5 px-4 rounded-xl text-center border border-red-100">
                                  Cloud save failed, but it's downloaded locally! 💾
                                </p>
                              )}
                              {uploadStatus === 'success' && (
                                <p className="text-[10px] text-green-600 bg-green-50 py-2.5 px-4 rounded-xl text-center border border-green-100 font-bold animate-pulse">
                                  Perfect! Shared directly to our live gallery memory lane ✨
                                </p>
                              )}
                            </div>

                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Choice Download Modal Overlay */}
      <AnimatePresence>
        {showDownloadChoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
            onClick={() => setShowDownloadChoice(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-pink-100 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={() => setShowDownloadChoice(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {/* Modal Title */}
                <div className="text-center space-y-1">
                  <div className="inline-flex p-3 bg-pink-50 text-[#ff70ae] rounded-full hover:scale-110 transition-transform">
                    <Download className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-[#4A2230] font-bold">
                    Save Special Notes 💮
                  </h3>
                  <p className="text-xs md:text-sm text-[#8A5A68]">
                    Choose which keepsake you would like to download!
                  </p>
                </div>

                {/* Option 1: The Sweet Birthday Note */}
                <div className="bg-[#fffbfb] hover:bg-[#fff9fa] border border-[#ffe0e6] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start gap-4 transition-all hover:shadow-md group">
                  <div className="bg-[#fff0f4] p-3 rounded-xl text-[#ff70ae] group-hover:scale-110 transition-transform">
                    <Flower className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-[#4A2230] flex items-center gap-1.5">
                        The Sweet Birthday Note 💌
                      </h4>
                      <p className="text-xs text-[#8A5A68] leading-relaxed">
                        A beautiful keepsake card of the letter shown on screen, formatted with decorative borders and corner hearts.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        downloadLetterAsImage();
                        setShowDownloadChoice(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff70ae] hover:bg-[#ff5a9e] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Card (PNG)
                    </button>
                  </div>
                </div>

                {/* Option 2: The Secret Research Journal */}
                <div className="bg-[#fcfcf9] hover:bg-[#fafaf4] border border-[#e8ebd3] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start gap-4 transition-all hover:shadow-md group">
                  <div className="bg-[#f5f5f0] p-3 rounded-xl text-[#8a1f49] group-hover:scale-110 transition-transform">
                    <Gift className="w-6 h-6 text-[#ff70ae]" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-[#2d1a22] flex items-center gap-1.5">
                        Official Research Journal 📄 <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">SECRET</span>
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        A comprehensive, lighthearted scientific-style journal paper entitled <span className="italic font-medium">"Long-Term Observation of a Woman Named Dian Islami (Ami)"</span>. Complete with abstract, data findings, research discussion, researcher signature, and dynamic stamps.
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => {
                          downloadResearchJournalAsImage();
                          setShowDownloadChoice(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2d1a22] hover:bg-stone-850 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Paper Image (PNG)
                      </button>

                      <button
                        onClick={() => {
                          downloadResearchJournalAsText();
                          setShowDownloadChoice(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#fafaf4] hover:bg-[#f3f3e8] text-[#2d1a22] border border-[#e4ebd3] text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#ff70ae] text-[#ff70ae]" />
                        Download Text File (.md)
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controls */}
      <div className="fixed bottom-8 left-8 z-[60]">
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <button
        onClick={toggleMusic}
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[60] w-11 h-11 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 ${isPlaying ? 'bg-[#ff70ae] text-white' : 'bg-white text-[#ff70ae] border border-pink-100'}`}
      >
        {isPlaying ? (
          <Music className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
        ) : (
          <MusicSlash className="w-5 h-5 md:w-6 md:h-6" />
        )}
      </button>

      {/* Global Interactive Cursor for Desktop */}
      <InteractiveCursor />
    </div>
  );

}
