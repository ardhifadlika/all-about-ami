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
  ChevronLeft,
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
  const [currentInviteImage, setCurrentInviteImage] = useState(0);

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
  const memoryVideo = 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/birthday-assets/videos/memory-video.mp4';
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
    { 
      time: '10:00', 
      title: 'Pickup my princess 🚗', 
      desc: 'Dress comfortable, look pretty, and get ready for a full day of birthday magic built for you!', 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/pickup.png',
      icon: <Coffee className="w-5 h-5 text-[#ff70ae]" /> 
    },
    { 
      time: '10:00 - 14:00', 
      title: 'Flowers hunting 🌸', 
      desc: 'Finding the absolute prettiest, freshest blooms to make your birthday room look stunning.', 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/flowers.png',
      icon: <Flower className="w-5 h-5 text-[#ff70ae]" /> 
    },
    { 
      time: '14:00 - 19:00', 
      title: 'Misc to do ✨', 
      desc: 'Fun spontaneous activities, light treats, and capturing unforgettable snapshots of us.', 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/misc%20to%20do.png',
      icon: <Heart className="w-5 h-5 text-[#ff70ae]" /> 
    },
    { 
      time: '19:00 - 20:00', 
      title: 'Dinner Time 🍽️', 
      desc: '(Resto still secret) A luxurious, cozy, and private live-cooking dining date together!', 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/1st%20Resto.png',
      icon: <Utensils className="w-5 h-5 text-[#ff70ae]" /> 
    },
    { 
      time: '20:00 - End', 
      title: 'Open The Gifts 🎁', 
      desc: 'Unwrapping birthday surprises, making sweet midnight wishes, and finishing your magical day.', 
      image: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/schedule/Gifts.png',
      icon: <Gift className="w-5 h-5 text-[#ff70ae]" /> 
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

  const handleCameraBack = () => {
    stopCamera();
    setCapturedPhotos([null, null, null]);
    setCapturedPhoto(null);
    setShowCamera(false);
    setShowSurprise(false);
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

  const [capturedPhotos, setCapturedPhotos] = useState<(string | null)[]>([null, null, null]);
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
    if (photos.length < 3 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sweet vertical photobooth aspect ratio: 640x1600
    canvas.width = 640;
    canvas.height = 1600;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw three horizontal 3:2 bounding boxes with vertical offsets
    for (let i = 0; i < 3; i++) {
      const yOffset = 80 + i * (340 + 40); // Y: 80, 460, 840
      
      // Load taken shot
      try {
        const img = await loadImage(photos[i]);
        ctx.save();
        // Inner clipping bounding box
        ctx.beginPath();
        ctx.roundRect(52, yOffset + 12, 536, 316, 16);
        ctx.clip();
        
        // Draw centered cover cropping
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

        ctx.drawImage(img, dx, dy, dw, dh, 52, yOffset + 12, 536, 316);
        ctx.restore();
      } catch (err) {
        console.error("Slot drawing error:", err);
      }
    }

    // Overlay the beautiful custom Frame.png on top of everything!
    try {
      const frameImg = await loadImage('https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Frame.png');
      ctx.drawImage(frameImg, 0, 0, 640, 1600);
    } catch (e) {
      console.error("Error overlaying Frame.png:", e);
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
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
          {/* Information Card (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-full bg-white/60 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/40 shadow-2xl space-y-4 md:space-y-6 flex flex-col justify-between h-full"
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
                <div>
                  <p className="text-[10px] text-[#8A5A68] uppercase tracking-wider font-semibold">Date</p>
                  <p className="font-semibold text-sm md:text-base text-[#4A2230]">8 June 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#ff70ae]/10 flex items-center justify-center text-[#ff70ae]">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-[#8A5A68] uppercase tracking-wider font-semibold">Time</p>
                  <p className="font-semibold text-sm md:text-base text-[#4A2230]">10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#ff70ae]/10 flex items-center justify-center text-[#ff70ae]">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-[#8A5A68] uppercase tracking-wider font-semibold">Location</p>
                  <p className="font-semibold text-sm md:text-base text-[#4A2230]">Secret Place ✨</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#8A5A68] italic">I already planned everything for us ❤️</p>
          </motion.div>

          {/* Dynamic Polaroid Slideshow Card (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative flex justify-center items-center"
          >
            {/* Hanging Tape stickers or ribbon */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#ff70ae]/20 border border-[#ff70ae]/30 rounded-sm rotate-2 z-20 flex items-center justify-center text-[8px] font-bold text-[#ff70ae] tracking-widest shadow-sm">
              PRETTY GIRL
            </div>

            {/* Polaroid Base Frame */}
            <div className="bg-white p-4 pb-12 rounded-[2rem] shadow-2xl border border-pink-100/30 max-w-[280px] md:max-w-xs w-full rotate-[-2deg] transition-transform hover:rotate-0 duration-500 relative group">
              {/* Image slideshow window */}
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-pink-50 relative border border-pink-100">
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
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {invitationImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentInviteImage ? 'w-4 bg-[#ff70ae]' : 'w-1.5 bg-white/60'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Polaroid Footer caption */}
              <div className="mt-4 text-center">
                <p className="font-serif italic text-lg text-[#ff70ae] leading-none shrink-0 font-semibold">Little Ami 🌸</p>
                <p className="text-[10px] text-[#8A5A68] tracking-widest uppercase mt-1">Our birthday girl tonight</p>
              </div>
            </div>
          </motion.div>
        </div>
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
        <div className="w-full max-w-2xl space-y-4 md:space-y-8 select-none">
          <div className="text-center space-y-3.5 md:space-y-4">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase bg-pink-50/50 px-3 py-1.5 rounded-full border border-pink-100/20">Today's Plan</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Here's our little birthday schedule ✨</h2>
          </div>
          
          <div className="space-y-2 md:space-y-4 max-h-[60vh] md:max-h-none overflow-y-auto pr-1">
            {schedule.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex gap-3 md:gap-6 p-3 md:p-4 bg-white/40 backdrop-blur-md rounded-[1.2rem] md:rounded-3xl border border-white/20 items-center group cursor-default transition-all duration-300 hover:bg-white/75 hover:border-[#ff70ae]/30 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#ff70ae]/5"
              >
                {/* Image item thumbnail */}
                <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-xl md:rounded-[1.25rem] bg-white border border-[#ff70ae]/15 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300 relative flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5 md:space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="font-bold text-sm md:text-lg text-[#4A2230] truncate group-hover:text-[#ff70ae] transition-colors">{item.title}</h3>
                    <span className="text-[9px] md:text-sm font-semibold text-[#ff70ae] shrink-0 bg-[#fff5f8] px-2.5 py-0.5 rounded-full border border-pink-100/20">{item.time}</span>
                  </div>
                  <p className="text-[10px] md:text-sm text-[#8A5A68] leading-relaxed line-clamp-2">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMORIES SECTION */}
      <section id="memories" className="relative z-10 h-[100dvh] snap-start flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden py-4">
        <div className="w-full max-w-5xl text-center space-y-4 md:space-y-8 select-none">
          <div className="space-y-3.5 md:space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#ff70ae] uppercase bg-pink-50/50 px-3 py-1.5 rounded-full border border-pink-100/20">Memories</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Tiny moments that mean everything.</h2>
          </div>

          {/* 3 Horizontal Video Frames */}
          <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-4xl mx-auto w-full items-center justify-center pt-2">
            {[
              { id: 1, title: 'Cute Hugs 🧸', desc: 'Cozy moments in our safe place.', rotate: '-rotate-2 hover:rotate-0' },
              { id: 2, title: 'Your Smile 🌸', desc: 'Chasing sweet pastel pink skies.', rotate: 'rotate-1 hover:rotate-0' },
              { id: 3, title: 'Date Nights 🍰', desc: 'Sipping coffee, laughing forever.', rotate: 'rotate-3 hover:rotate-0' }
            ].map((vid) => (
              <motion.div
                key={vid.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative bg-black rounded-2xl md:rounded-[2rem] overflow-hidden aspect-[9/16] border-[3px] md:border-[6px] border-white shadow-xl flex flex-col justify-between p-2 md:p-3 cursor-default transition-all duration-300 ${vid.rotate}`}
              >
                {/* Vintage overlay texture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4))] pointer-events-none z-10" />
                <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[6px] md:text-[10px] font-mono text-red-500 font-bold">REC</span>
                </div>
                
                {/* Visual grid overlay to represent retro camera */}
                <div className="absolute inset-x-2 inset-y-8 border border-white/5 rounded-lg pointer-events-none z-10" />

                {/* Translucent Play container */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 z-10">
                  <div className="w-8 h-8 md:w-14 md:h-14 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/20 animate-pulse">
                    <Play size={16} className="translate-x-[1px] md:scale-125 text-white" fill="currentColor" />
                  </div>
                  <span className="text-[5px] md:text-[10px] font-mono text-white/40 tracking-widest uppercase">30 FPS</span>
                </div>

                {/* Subtitle / film sticker area */}
                <div className="z-10 bg-white/10 backdrop-blur-sm p-1 md:p-2.5 rounded-lg border border-white/10 text-left">
                  <p className="font-semibold text-[7px] md:text-xs text-white leading-none">{vid.title}</p>
                  <p className="text-[6px] md:text-[10px] text-white/70 line-clamp-1 mt-0.5">{vid.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE SECTION */}
      <section id="image-section" className="relative z-10 h-[100dvh] snap-start flex flex-col items-center justify-center overflow-hidden px-4 py-4">
        <motion.div
          style={{
            scale: 1 + imageSectionProgress * 0.05,
            y: imageSectionProgress * -15
          }}
          className="w-full max-w-5xl flex flex-col items-center justify-center gap-4 md:gap-6 h-full"
        >
          {/* Header */}
          <div className="text-center space-y-3.5 md:space-y-4 px-4 select-none">
            <div>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#ff70ae] uppercase bg-pink-50/80 px-4 py-1.5 rounded-full border border-pink-100/30 shadow-sm">
                Mini album of us
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#4A2230] leading-snug">Our Album of Love</h2>
            <p className="text-[10px] md:text-sm text-[#8A5A68] max-w-md mx-auto">
              Every sweet moment shared, hand in hand. Just waiting for our cute pictures to fill these frames tonight! ✨
            </p>
          </div>

          {/* Polaroid 3x2 Grid */}
          <div className="grid grid-cols-3 gap-2.5 md:gap-5 w-full max-w-4xl px-2 overflow-y-auto max-h-[60vh] md:max-h-none select-none items-center pt-2">
            {[
              { id: 'ours-0', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%206.png', title: 'Perfect Days 🌸', subtitle: 'Warm Sunshine', rotate: 'md:-rotate-2' },
              { id: 'ours-1', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%201.png', title: 'Cozy Chats ☕', subtitle: 'Pure Happiness', rotate: 'md:rotate-1' },
              { id: 'ours-2', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%202.png', title: 'Lovely Gaze 👀', subtitle: 'My Whole World', rotate: 'md:-rotate-1' },
              { id: 'ours-3', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%203.png', title: 'Warm Hugs 🧸', subtitle: 'Safest Place', rotate: 'md:rotate-2' },
              { id: 'ours-4', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%204.png', title: 'Sweet Laughs 😄', subtitle: 'Infinite Joy', rotate: 'md:-rotate-2' },
              { id: 'ours-5', src: 'https://rglsaquiaoptymkxbwdf.supabase.co/storage/v1/object/public/image-asset/memories/Ours%205.png', title: 'Together Always ♾️', subtitle: 'My Special One', rotate: 'md:rotate-1' },
            ].map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 3) * 0.05, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setGalleryToast(`Beautiful moment: "${card.title}" 🥺💕`)}
                className={`bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl border border-pink-50 relative cursor-pointer select-none transition-all duration-300 ${card.rotate} max-w-[120px] md:max-w-none mx-auto w-full`}
              >
                {/* Washi Tape Ribbon Effect */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3.5 md:w-16 md:h-5 bg-[#ff70ae]/15 backdrop-blur-[2px] border-x border-[#ff70ae]/10 rounded-sm rotate-2 flex items-center justify-center text-[5px] md:text-[7px] font-bold text-[#ff70ae]/70 tracking-wider">
                  LOVELY
                </div>

                {/* Inner Image Slot */}
                <div className="aspect-square w-full rounded-lg md:rounded-xl overflow-hidden border border-pink-100 bg-pink-50 relative flex flex-col items-center justify-center text-center">
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

              {/* Screens 3 & 4: Immersive Fullscreen-feeling Camera Workspace */}
              {showCamera && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="fixed inset-0 z-[105] bg-[#fff5f8] overflow-y-auto w-full h-full flex items-center justify-center py-6 px-4 md:px-8"
                >
                  <div className="w-full max-w-2xl bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-4 md:p-8 shadow-2xl select-none flex flex-col space-y-4 md:space-y-6 relative">
                    
                    {/* Top Status and Back-Close Action Bar */}
                    <div className="flex items-center justify-between shrink-0">
                      <button
                        onClick={handleCameraBack}
                        className="px-4 py-2 rounded-full bg-white border border-pink-100 text-[#ff70ae] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-pink-50 hover:border-pink-200 transition-colors"
                      >
                        <ChevronLeft size={16} strokeWidth={3} />
                        Close
                      </button>

                      <span className="text-[10px] md:text-xs font-extrabold text-[#ff70ae] tracking-wider uppercase bg-[#fff5f8] px-4 py-1.5 rounded-full border border-pink-200/30 shadow-sm">
                        Shot {activeSlotIndex + 1} of 3
                      </span>
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

                    {/* Result Slots Grid - Row of 3 interactive cards */}
                    <div className="grid grid-cols-3 gap-3 md:gap-5 w-full">
                      {[0, 1, 2].map((idx) => {
                        const photo = capturedPhotos[idx];
                        const isActive = activeSlotIndex === idx;
                        return (
                          <button
                            key={idx}
                            disabled={isCountingDown}
                            onClick={() => {
                              setActiveSlotIndex(idx);
                            }}
                            className={`aspect-[4/3] rounded-xl md:rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-center relative transition-all duration-300 bg-gray-50 shadow-sm ${
                              isActive
                                ? 'border-[#ff70ae] bg-white ring-4 ring-pink-100/50 scale-[1.03] shadow-md z-10'
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
                                <span className="text-[9px] md:text-xs font-semibold text-gray-400 capitalize whitespace-nowrap">
                                  Result {idx + 1}
                                </span>
                              </div>
                            )}

                            {isActive && (
                              <span className="absolute bottom-1 px-2 py-0.5 rounded-full bg-[#ff70ae] text-[6px] md:text-[8px] text-white font-extrabold uppercase tracking-wide">
                                Active
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Trigger CTA Button */}
                    <div className="w-full pt-1">
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
                        <button
                          disabled
                          className="w-full py-3.5 bg-gray-200 text-gray-400 rounded-2xl font-bold text-sm select-none cursor-not-allowed"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>

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
                                  <div className="w-48 h-3 bg-neutral-900 rounded-t-xl border-t border-b border-pink-200/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden">
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
                                    className="max-h-[48vh] md:max-h-[60vh] aspect-[640/1600] object-contain rounded-xl shadow-2xl border-white border-[6px] md:border-8 bg-white"
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
