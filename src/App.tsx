/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Camera, 
  Music, 
  Music2, 
  Play, 
  Square, 
  X, 
  ChevronRight,
  Gift,
  Coffee,
  Utensils,
  Camera as CameraIcon,
  Flower
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
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isMemoryPlaying, setIsMemoryPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [galleryToast, setGalleryToast] = useState<string | null>(null);

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
  const memoryVideo = 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/birthday-assets/videos/memory-video.mp4';
  const imageSectionImage = 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/background/Ours%202.png';

  // Helper to check for placeholder URLs
  const isPlaceholder = (url: string) => !url || url.includes('YOUR_PROJECT') || url.includes('PASTE');

  const backgroundImages = {
    cuteAmi: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/background/Cute%20Ami%202.png',
    love: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/background/love.png',
    tree: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/background/tree.png',
  };

  const sectionNav = [
    { id: 'hero', label: 'Home' },
    { id: 'invitation', label: 'Invitation' },
    { id: 'dresscode', label: 'Dresscode' },
    { id: 'schedule', label: "Today's Plan" },
    { id: 'memories', label: 'Memories' },
    { id: 'image-section', label: 'Our Album' },
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
    { time: '13:00', title: 'Pickup My Princess', desc: 'Starting our special birthday date together 💕', icon: <Coffee className="w-6 h-6 text-[#ff70ae]" /> },
    { time: '14:00 - 18:00', title: 'Misc To Do', desc: 'Spending the afternoon together and making memories ✨', icon: <Heart className="w-6 h-6 text-[#ff70ae]" /> },
    { time: '18:30 - 19:00', title: 'Dinner Time', desc: 'Dinner together at MAISON TATSUYA Teppanyaki ❤️', icon: <Utensils className="w-6 h-6 text-[#ff70ae]" /> },
    { time: '19:00 - End', title: 'Open The Gifts', desc: 'Ending the night with surprises made specially for you 🎁', icon: <Gift className="w-6 h-6 text-[#ff70ae]" /> },
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
    const imageToLetterProgress = (page.scrollTop - imageSectionStart) / window.innerHeight;

    setActiveSection(section.id);
    setScrollProgress(maxScroll > 0 ? page.scrollTop / maxScroll : 0);
    setImageSectionProgress(Math.min(1, Math.max(0, imageToLetterProgress)));
  };

  const handleOpenInvitation = () => {
    setIsOpening(true);
    setIsPlaying(true);
    
    setTimeout(() => {
      setInvitationOpened(true);
      setTimeout(() => {
        setIsOpening(false);
        document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth' });
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
    if (showSurprise) {
      stopCamera();
      setShowCamera(false);
      setCapturedPhoto(null);
      setCameraError(null);
    }
    setShowSurprise(prev => !prev);
  };

  const handleOpenCamera = async () => {
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

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Forced 9:16 aspect ratio for portrait capture
    const videoAspect = video.videoWidth / video.videoHeight;
    const targetAspect = 9 / 16;
    
    // Setting canvas to high quality portrait resolution
    canvas.width = 1080;
    canvas.height = 1920;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    let sx, sy, sw, sh;
    if (videoAspect > targetAspect) {
      // Input is wider than 9:16 (usual case for landscape webcams)
      sh = video.videoHeight;
      sw = sh * targetAspect;
      sx = (video.videoWidth - sw) / 2;
      sy = 0;
    } else {
      // Input is taller than 9:16
      sw = video.videoWidth;
      sh = sw / targetAspect;
      sx = 0;
      sy = (video.videoHeight - sh) / 2;
    }

    // Fill background black in case of edge cases
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw cropped video frame
    context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    // Draw Frame and Icons on Canvas
    const drawElements = () => {
      return new Promise<void>((resolve) => {
        const loveImg = new Image();
        loveImg.crossOrigin = "anonymous";
        loveImg.src = backgroundImages.love;
        
        const finish = () => {
          const iconSize = canvas.width * 0.15;
          const padding = canvas.width * 0.04;

          // Draw a cute white border
          context.strokeStyle = 'white';
          context.lineWidth = canvas.width * 0.03;
          context.beginPath();
          context.roundRect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, canvas.width * 0.04);
          context.stroke();

          // Bottom Left
          context.drawImage(loveImg, padding * 1.8, canvas.height - iconSize - padding * 1.8, iconSize, iconSize);
          // Bottom Right
          context.save();
          context.translate(canvas.width - iconSize - padding * 1.8 + iconSize/2, canvas.height - iconSize - padding * 1.8 + iconSize/2);
          context.scale(-1, 1);
          context.drawImage(loveImg, -iconSize/2, -iconSize/2, iconSize, iconSize);
          context.restore();
          
          resolve();
        };

        loveImg.onload = finish;
        loveImg.onerror = () => {
          console.error("Failed to load frame icon image");
          resolve();
        };
      });
    };

    await drawElements();
    
    const image = canvas.toDataURL('image/png');
    setCapturedPhoto(image);
    setUploadStatus('idle'); // Reset upload status
    
    const stream = video.srcObject as MediaStream | null;
    if (stream) stream.getTracks().forEach(track => track.stop());
    setShowCamera(false);
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

  return (
    <div
      ref={pageRef}
      onScroll={handlePageScroll}
      className={`h-[100dvh] snap-y snap-mandatory scroll-smooth bg-[#fff5f8] text-[#4A2230] overflow-x-hidden relative selection:bg-[#ff70ae]/30 ${!invitationOpened ? 'overflow-y-hidden' : 'overflow-y-scroll'}`}
    >
      {/* Background Parallax Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {floatingBackground.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute opacity-20 md:opacity-40 ${item.wrapperClass}`}
            style={{ y: scrollProgress * item.parallax }}
            animate={{
              y: [0, -20, 0],
              rotate: [item.rotate, -item.rotate, item.rotate],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img 
              src={item.src} 
              alt="" 
              className={`object-contain drop-shadow-xl ${item.imageClass}`} 
            />
          </motion.div>
        ))}

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
        {invitationOpened && activeSection !== 'hero' && (
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
                    stiffness: 700, 
                    damping: 22, 
                    mass: 0.3
                  }}
                  className={`w-52 h-10 px-5 rounded-full flex items-center justify-between outline-none cursor-pointer transition-all duration-300 select-none ${
                    isActive 
                      ? 'bg-white/85 backdrop-blur-2xl border border-white/60 shadow-lg shadow-[#ff70ae]/10' 
                      : 'bg-transparent border border-transparent hover:bg-white/35 hover:border-white/20'
                  }`}
                >
                  <span className={`text-sm font-serif font-medium tracking-wide transition-all duration-300 transform-gpu ${
                    isActive 
                      ? 'text-[#ff70ae] font-semibold opacity-100' 
                      : 'text-[#4A2230]/40 group-hover/sidebar:text-[#4A2230]/75 group-hover/sidebar:opacity-100 hover:!text-[#ff70ae] hover:!font-semibold'
                  }`}>
                    {item.label}
                  </span>
                  <div className={`rounded-full transition-all duration-300 transform-gpu ${
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
      <section id="hero" className="relative z-10 h-[100dvh] snap-start flex flex-col items-center justify-center px-6 text-center overflow-hidden">
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
            Someone planned a special birthday night for you.
          </h1>
          <p className="text-base md:text-lg text-[#8A5A68] font-light max-w-xs mx-auto leading-relaxed">
            Open this invitation when you're ready for your special day 💕
          </p>
          <button
            onClick={handleOpenInvitation}
            className="group relative h-12 px-[16px] mx-[16px] my-[12px] inline-flex items-center justify-center bg-[#ff70ae] text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#ff70ae]/20 overflow-hidden text-sm md:text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Invitation <Heart className="w-4 h-4 fill-current" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
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
                <div className="relative w-48 h-48 md:w-64 md:h-64">
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
                  className="mt-12 text-[#ff70ae] font-serif text-2xl text-center font-semibold italic"
                >
                  Creating magic for you...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* INVITATION SECTION */}
      <section id="invitation" className="relative z-10 h-[100dvh] snap-start flex items-center justify-center px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/60 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/40 shadow-2xl space-y-4 md:space-y-8 flex flex-col justify-between"
        >
          <div className="space-y-3.5 md:space-y-5">
            <span className="text-xs font-bold tracking-widest text-[#ff70ae] uppercase">Invitation</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Ami's 24th Birthday</h2>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#ff70ae]/10 flex items-center justify-center text-[#ff70ae]">
                <Calendar size={20} />
              </div>
              <p className="font-medium text-sm md:text-base">8 June 2026</p>
            </div>
            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#ff70ae]/10 flex items-center justify-center text-[#ff70ae]">
                <Clock size={20} />
              </div>
              <p className="font-medium text-sm md:text-base">13:00</p>
            </div>
            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#ff70ae]/10 flex items-center justify-center text-[#ff70ae]">
                <MapPin size={20} />
              </div>
              <p className="font-medium text-xs md:text-sm">MAISON TATSUYA Teppanyaki Summarecon Bekasi</p>
            </div>
          </div>

          <p className="text-sm text-[#8A5A68]">I already planned everything for us ❤️</p>
          
          <div className="w-full flex justify-center">
            <a
              href="https://maps.app.goo.gl/WXDou4CoJxN9cbbr9"
              target="_blank"
              rel="noreferrer"
              className="w-[calc(100%-32px)] h-12 px-[16px] mx-[16px] my-[12px] flex items-center justify-center gap-2 bg-[#ff70ae] text-white rounded-2xl font-semibold hover:bg-[#ff5a9e] transition-colors text-sm md:text-base"
            >
              View Location <ChevronRight size={18} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* DRESSCODE SECTION */}
      <section id="dresscode" className="relative z-10 h-[100dvh] snap-start flex items-center justify-center px-6 overflow-hidden py-4">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6 text-center md:text-left order-2 md:order-1"
          >
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase">Dresscode</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Pink and Jeans 💖</h2>
            <p className="text-sm md:text-lg text-[#8A5A68] leading-relaxed">
              Let's match! Wear your favorite pink top paired with stylish jeans for our special date.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative order-1 md:order-2"
          >
            {/* Cute Pink Ornaments around the frame */}
            {/* 1. Flower Top-Left */}
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                rotate: [0, 8, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.15, rotate: 15 }}
              className="absolute -top-4 -left-4 md:-top-7 md:-left-7 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#fff5f8] border-4 md:border-[6px] border-white text-[#ff70ae] shadow-[0_8px_16px_rgba(255,112,174,0.35)] flex items-center justify-center cursor-pointer select-none"
            >
              <Flower className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" fill="#ff70ae" fillOpacity={0.2} />
            </motion.div>

            {/* 2. Heart Top-Right */}
            <motion.div
              animate={{ 
                scale: [1, 1.06, 1],
                y: [0, -3, 0]
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.2 }}
              className="absolute -top-7 right-4 md:-top-11 md:right-8 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#fff5f8] border-4 md:border-[6px] border-white text-[#ff70ae] shadow-[0_8px_16px_rgba(255,112,174,0.35)] flex items-center justify-center cursor-pointer select-none"
            >
              <Heart className="w-5 h-5 md:w-7 md:h-7 stroke-[2.5]" fill="#ff70ae" fillOpacity={0.3} />
            </motion.div>

            {/* 3. Camera Bottom-Left/Middle-Left */}
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, -8, 0]
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              whileHover={{ scale: 1.15, rotate: -15 }}
              className="absolute bottom-6 -left-6 md:bottom-12 md:-left-10 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#fff5f8] border-4 md:border-[6px] border-white text-[#ff70ae] shadow-[0_8px_16px_rgba(255,112,174,0.35)] flex items-center justify-center cursor-pointer select-none"
            >
              <CameraIcon className="w-5 h-5 md:w-7 md:h-7 stroke-[2.5]" fill="#ff70ae" fillOpacity={0.15} />
            </motion.div>

            <div className="aspect-[4/5] max-w-[200px] md:max-w-none mx-auto rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 md:border-8 border-white shadow-2xl bg-white/40">
              <img src={dresscodeImage} alt="Dresscode" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-1 md:-bottom-6 md:-right-6 bg-white p-2 md:p-6 rounded-xl md:rounded-3xl shadow-xl border border-pink-50">
              <p className="font-serif italic text-[#ff70ae] text-[10px] md:text-lg">Perfect Pair ✨</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section id="schedule" className="relative z-10 h-[100dvh] snap-start flex items-center justify-center px-4 md:px-6 py-6 md:py-10">
        <div className="w-full max-w-2xl space-y-4 md:space-y-12">
          <div className="text-center space-y-3 md:space-y-5">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase">Today's Plan</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Here's our little birthday schedule ✨</h2>
          </div>
          
          <div className="space-y-3 md:space-y-6">
            {schedule.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 md:gap-6 p-3 md:p-6 bg-white/40 backdrop-blur-md rounded-[1.2rem] md:rounded-3xl border border-white/20 items-center group hover:bg-white/60 transition-all cursor-default"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-lg md:rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  {/* Scaling the icon for mobile */}
                  <div className="scale-75 md:scale-100">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-0.5 md:space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="font-bold text-sm md:text-xl truncate">{item.title}</h3>
                    <span className="text-[9px] md:text-sm font-medium text-[#ff70ae] shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[10px] md:text-base text-[#8A5A68] line-clamp-1 md:line-clamp-2">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMORIES SECTION */}
      <section id="memories" className="relative z-10 h-[100dvh] snap-start flex flex-col items-center justify-center px-6 overflow-hidden py-4">
        <div className="w-full max-w-5xl text-center space-y-6 md:space-y-12">
          <div className="space-y-3 md:space-y-5">
            <span className="text-xs font-bold tracking-widest text-[#ff70ae] uppercase">Memories</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Tiny moments that mean everything.</h2>
          </div>

          <div className="relative group max-w-[200px] md:max-w-sm mx-auto aspect-[9/16] rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl bg-pink-50">
            {!isPlaceholder(memoryVideo) && !videoError ? (
              <>
                <video
                  ref={memoryVideoRef}
                  src={memoryVideo}
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                  onError={() => {
                    setIsMemoryPlaying(false);
                    setVideoError(true);
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <button
                    onClick={toggleMemoryVideo}
                    className="w-20 h-20 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[#ff70ae] hover:scale-110 transition-transform shadow-xl"
                  >
                    {isMemoryPlaying ? <Square size={32} fill="currentColor" /> : <Play size={32} className="ml-2" fill="currentColor" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#ff70ae] shadow-sm">
                  <Play size={32} className="ml-1" />
                </div>
                <p className="text-sm text-[#8A5A68]">Memory video path not set yet 💕</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* IMAGE SECTION */}
      <section id="image-section" className="relative z-10 h-[100dvh] snap-start flex flex-col items-center justify-center overflow-hidden px-4 py-8">
        <motion.div
          style={{
            scale: 1 + imageSectionProgress * 0.05,
            y: imageSectionProgress * -20
          }}
          className="w-full max-w-6xl flex flex-col items-center justify-center gap-4 md:gap-8"
        >
          {/* Header */}
          <div className="text-center space-y-3.5 md:space-y-5 px-4">
            <div>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#ff70ae] uppercase bg-pink-50/80 px-4 py-1.5 rounded-full border border-pink-100/30 shadow-sm">
                Future Memories Center
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Our Album of Love</h2>
            <p className="text-[10px] md:text-sm text-[#8A5A68] max-w-md mx-auto md:pt-1">
              Every sweet moment shared, hand in hand. Just waiting for our cute pictures to fill these frames tonight! ✨
            </p>
          </div>

          {/* Polaroid Placeholders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl px-4 items-center justify-center">
            {[
              {
                id: 'coffee',
                title: 'Our First Coffee ☕',
                time: 'Warmest Hugs',
                desc: 'Reserved for that perfect cozy laugh we shared...',
                icon: <Coffee className="w-8 h-8 text-[#ff70ae]/80" />,
                rotateClass: 'md:-rotate-3 hover:md:rotate-0',
              },
              {
                id: 'sweet',
                title: 'Prettiest Smile 🌸',
                time: 'My Safest Place',
                desc: 'Waiting for your bright face and lovely outfit tonight...',
                icon: <Heart className="w-8 h-8 text-[#ff70ae]/80 animate-pulse" />,
                rotateClass: 'md:rotate-2 hover:md:rotate-0',
              },
              {
                id: 'dinner',
                title: 'Tonight\'s Teppanyaki 🍽️',
                time: '8 June 2026',
                desc: 'Delicious memories loading live from Maison Tatsuya...',
                icon: <Utensils className="w-8 h-8 text-[#ff70ae]/80" />,
                rotateClass: 'md:-rotate-1 hover:md:rotate-0',
              }
            ].map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.03 }}
                onClick={() => setGalleryToast(`Can't wait to fill "${card.title}" with our photos tonight! 📸💖`)}
                className={`bg-white/90 p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl border border-white/80 flex flex-col gap-4 relative cursor-pointer select-none transition-all duration-300 ${card.rotateClass} max-w-[280px] md:max-w-none mx-auto w-full`}
              >
                {/* Washi Tape Ribbon Effect */}
                <div className="absolute -top-3 left-1/2 -track-x-1/2 -translate-x-1/2 w-16 h-5 bg-[#ff70ae]/15 backdrop-blur-[2px] border-x border-[#ff70ae]/10 rounded-sm rotate-2 flex items-center justify-center text-[7px] font-bold text-[#ff70ae]/60 tracking-wider">
                  LOVELY
                </div>

                {/* Inner Empty State Photo Slot */}
                <div className="aspect-square w-full rounded-xl md:rounded-2xl border-2 border-dashed border-[#ff70ae]/30 bg-gradient-to-br from-[#fff5f8]/80 to-[#ffeff5]/40 flex flex-col items-center justify-center gap-3 relative overflow-hidden group/slot">
                  {/* Glowing background halo */}
                  <div className="absolute inset-x-0 inset-y-0 bg-[#ff70ae]/2 opacity-0 group-hover/slot:opacity-100 transition-opacity duration-300 rounded-xl" />
                  
                  <div className="bg-white/80 p-3 rounded-full shadow-sm text-[#ff70ae] group-hover/slot:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-[#ff70ae]/70 tracking-wide uppercase px-2 text-center">
                    Picture placeholder
                  </span>
                  <p className="text-[8px] md:text-[10px] text-[#8A5A68]/60 text-center max-w-[150px] px-2 leading-relaxed font-light">
                    We'll put our beautiful photo here later!
                  </p>
                </div>

                {/* Custom Handwritten Caption Panel */}
                <div className="space-y-1.5 pt-1 text-left px-1">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="font-serif font-bold text-sm md:text-base text-[#4A2230] truncate">
                      {card.title}
                    </h3>
                    <span className="text-[8px] md:text-[10px] text-[#ff70ae]/80 font-bold tracking-wider shrink-0 uppercase">
                      {card.time}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-[#8A5A68] italic font-light leading-relaxed line-clamp-2">
                    "{card.desc}"
                  </p>
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
                className="bg-[#4A2230] text-pink-100 px-6 py-2.5 rounded-full text-xs md:text-sm font-medium shadow-lg shadow-[#ff70ae]/15 border border-[#ff70ae]/20 flex items-center gap-2 mt-4 max-w-md text-center max-h-12 overflow-hidden"
              >
                <Heart className="w-4 h-4 fill-current text-[#ff70ae] shrink-0" />
                <span>{galleryToast}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* LETTER SECTION */}
      <section id="letter" className="relative z-10 h-[100dvh] snap-start flex items-center justify-center px-6 py-4 lg:py-0 overflow-hidden">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-4 md:space-y-8 text-center lg:text-left">
            <div className="space-y-3.5 md:space-y-5">
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase">A Little Note</span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Happy Birthday, Ami Sayang 💖</h2>
            </div>
            
            <div className="space-y-3 md:space-y-6 text-sm md:text-xl text-[#6D4552] font-light leading-relaxed">
              <p>Thank you for always being my safest place, my favorite person, and the prettiest part of my days.</p>
              <p>I hope this birthday becomes one of the happiest memories for you.</p>
              <p>And tonight, I just want to spend every little moment with you ❤️</p>
            </div>

            <div className="pt-4 md:pt-8 border-t border-[#ffd6e7]">
              <p className="text-[10px] md:text-sm italic text-[#8A5A68] mb-1 md:mb-2">With Love,</p>
              <p className="text-lg md:text-2xl font-serif text-[#ff70ae]">Ardhi Satria</p>
              <p className="text-[9px] md:text-xs tracking-widest uppercase text-[#8A5A68] mt-1">8 June 2026</p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
             <motion.img 
              initial={{ rotate: 5, scale: 0.9 }}
              whileInView={{ rotate: -2, scale: 1 }}
              src={imageSectionImage} 
              alt="Ami" 
              className="w-full max-w-[160px] md:max-w-sm aspect-[3/4] object-cover rounded-[1.5rem] md:rounded-[3rem] shadow-2xl border-white border-2 md:border-[10px]" 
            />
          </div>
        </div>
      </section>

      {/* SURPRISE SECTION */}
      <section id="surprise" className="relative z-10 h-[100dvh] snap-start flex items-center justify-center px-6">
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
          {showSurprise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl md:bg-[#ffeff6]/90"
            >
              {/* Close Button - Clear and prominent */}
              <button
                onClick={handleSurprise}
                className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center bg-[#ff70ae] text-white rounded-full shadow-2xl z-[200] hover:scale-110 active:scale-90 transition-all border-4 border-white"
                aria-label="Close"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full h-full md:h-[94vh] md:max-w-md md:aspect-[9/16] bg-white md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col"
              >
                {/* Intro Screen */}
                {!showCamera && !capturedPhoto && (
                  <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
                    <div className="w-24 h-24 bg-[#ffeff6] rounded-full flex items-center justify-center text-[#ff70ae] shadow-inner mb-2">
                       <CameraIcon size={40} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-serif text-[#4A2230]">Show your cute face 🥺</h3>
                      <p className="text-[#8A5A68] leading-relaxed">
                        I want to see your beautiful reaction to this little website I made for you...
                        This moment deserves to be remembered ✨
                      </p>
                    </div>
                    {cameraError && (
                      <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">{cameraError}</p>
                    )}
                    <button
                      onClick={handleOpenCamera}
                      className="w-[calc(100%-32px)] max-w-xs h-12 px-[16px] mx-[16px] my-[12px] bg-[#ff70ae] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ff5a9e] active:scale-95 transition-all shadow-xl shadow-[#ff70ae]/20"
                    >
                      Open Camera 📸
                    </button>
                  </div>
                )}

                {/* Full Preview Camera / Result UI (Forced 9:16) */}
                {(showCamera || capturedPhoto) && (
                  <div className="relative flex-1 bg-black overflow-hidden group">
                    {showCamera ? (
                      <>
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover"
                          onLoadedMetadata={(e) => {
                            const video = e.currentTarget;
                            video.play().catch(err => console.error("Video play error:", err));
                          }}
                        />
                        {/* Interactive Framing Guides Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-10 p-8 flex flex-col items-center justify-center">
                          {/* Main Face Frame */}
                          <motion.div 
                            animate={{ 
                              borderColor: ["rgba(255,255,255,0.4)", "rgba(255,112,174,0.8)", "rgba(255,255,255,0.4)"],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-full aspect-[3/4] border-2 border-dashed border-white/50 rounded-[4rem] relative"
                          >
                            {/* Inner Corner Guides */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full" />
                          </motion.div>

                          {/* Outer Corners */}
                          <div className="absolute top-10 left-10 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-2xl" />
                          <div className="absolute top-10 right-10 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-2xl" />
                          <div className="absolute bottom-10 left-10 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-2xl" />
                          <div className="absolute bottom-10 right-10 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-2xl" />

                          {/* Live Status Badge */}
                          <div className="absolute top-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                            <div className="w-2 h-2 bg-[#ff70ae] rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Ready to Smile?</span>
                          </div>

                          {/* Decorative Icons Overlay */}
                          <div className="absolute bottom-32 left-8 right-8 flex justify-between">
                            <img src={backgroundImages.love} alt="" className="w-14 h-14 object-contain animate-bounce" style={{ animationDuration: '3s' }} />
                            <img src={backgroundImages.love} alt="" className="w-14 h-14 object-contain animate-bounce scale-x-[-1]" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                          </div>
                        </div>

                        {/* Capture Button Bar */}
                        <div className="absolute bottom-12 inset-x-0 flex flex-col items-center gap-4 z-20">
                          <button
                            onClick={handleCapturePhoto}
                            className="relative w-24 h-24 flex items-center justify-center group"
                          >
                            <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping group-active:animate-none" />
                            <div className="relative w-20 h-20 rounded-full border-4 border-white p-2 transition-transform group-hover:scale-105 active:scale-90">
                              <div className="w-full h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                            </div>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <img src={capturedPhoto!} alt="Captured" className="w-full h-full object-cover" />
                        
                        {/* Result Controls Bar */}
                        <div className="absolute bottom-12 inset-x-0 px-4 flex flex-col gap-3 z-20">
                          <div className="flex gap-4 mx-[16px] my-[12px]">
                            <button
                              disabled={isUploading}
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = capturedPhoto!;
                                link.download = 'ami-birthday-memory.png';
                                link.click();
                                handleUploadToSupabase();
                              }}
                              className={`flex-1 h-12 px-[16px] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 ${isUploading ? 'bg-pink-300 cursor-not-allowed' : 'bg-[#ff70ae] shadow-pink-500/20 hover:scale-[1.02]'}`}
                            >
                              {isUploading ? 'Uploading...' : uploadStatus === 'success' ? 'Saved! ✨' : 'Save Memory 💖'}
                            </button>
                            <button
                              onClick={handleOpenCamera}
                              disabled={isUploading}
                              className="flex-1 h-12 px-[16px] bg-white/20 backdrop-blur-md text-white border border-white/40 rounded-2xl font-bold active:scale-95 transition-all hover:bg-white/30 flex items-center justify-center text-sm"
                            >
                              Retake 📸
                            </button>
                          </div>
                          
                          {uploadStatus === 'error' && (
                            <p className="text-[10px] text-white bg-red-500/50 backdrop-blur-md py-2 px-4 rounded-full text-center">
                              Cloud save failed, but it's saved locally! 💾
                            </p>
                          )}
                          {uploadStatus === 'success' && (
                            <p className="text-[10px] text-white bg-green-500/50 backdrop-blur-md py-2 px-4 rounded-full text-center">
                              Shared to our cloud memories ✨
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Floating Controls */}
      <div className="fixed bottom-8 left-8 z-[60]">
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <button
        onClick={toggleMusic}
        className={`fixed bottom-8 right-8 z-[60] w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 ${isPlaying ? 'bg-[#ff70ae] text-white' : 'bg-white text-[#ff70ae] border border-pink-100'}`}
      >
        {isPlaying ? (
          <Music className="w-6 h-6 animate-pulse" />
        ) : (
          <MusicSlash className="w-6 h-6" />
        )}
      </button>
    </div>
  );

}
