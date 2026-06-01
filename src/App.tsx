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

type StripColor = 'soft-pink' | 'pink' | 'blue' | 'black' | 'brown' | 'white';

interface ColorOption {
  id: StripColor;
  name: string;
  dotColor: string;
  bgColor: string;
  borderColor: string;
  activeColor: string;
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
            Someone planned something special for your birthday.
          </h1>
          <p className="text-base md:text-lg text-[#8A5A68] font-light max-w-xs mx-auto leading-relaxed">
            A little surprise has been prepared just for you. Open it when you're ready. 💕
          </p>
          <button
            onClick={handleOpenInvitation}
            className="group relative h-12 px-[16px] mx-[16px] my-[12px] inline-flex items-center justify-center bg-[#ff70ae] text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#ff70ae]/20 overflow-hidden text-sm md:text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Your Surprise 💗
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

            <p className="text-xs md:text-sm text-[#8A5A68] italic">Someone planned a special birthday day for you ❤️</p>
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
              Every sweet moment shared, hand in hand. Just waiting for our cute pictures to fill these frames tonight! ✨
            </p>
          </div>

          {/* Polaroid Container - Horizontal Scroll on Mobile / Fixed Responsive Grid on Desktop in Portrait 2:3 Aspect ratio */}
          <div className="flex lg:grid lg:grid-cols-3 gap-4 md:gap-5 lg:gap-5 xl:gap-6 w-full max-w-3xl xl:max-w-4xl px-6 md:px-8 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 select-none items-center pt-2 justify-start lg:justify-center snap-x scrollbar-none">
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
                className={`bg-white p-2 sm:p-2.5 lg:p-2.5 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl border border-pink-50 relative cursor-pointer select-none transition-all duration-300 ${card.rotate} w-[62vw] xs:w-[58vw] sm:w-[45vw] md:w-[32vw] lg:w-auto h-auto lg:h-[25vh] xl:h-[28vh] aspect-[2/3] shrink-0 snap-center`}
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
            
            {/* Interactive Love Stamp in top right corner on desktop */}
            <div className="absolute top-6 right-6 hidden md:block">
              <motion.div 
                whileHover={{ scale: 1.12, rotate: 8 }}
                onClick={triggerConfetti}
                className="w-16 h-20 bg-white border-2 border-dashed border-[#ff70ae]/50 p-1 rounded-sm shadow-md flex flex-col items-center justify-center cursor-pointer select-none relative"
                title="Seal of Love - Click for magic! 💕"
              >
                {/* Wavy scalloped stamp border details */}
                <div className="absolute -inset-[3px] border border-dotted border-pink-200 pointer-events-none rounded-sm" />
                <div className="w-9 h-9 bg-pink-50 rounded-full flex items-center justify-center border border-pink-100 text-[#ff70ae]">
                  <Heart className="w-4 h-4 fill-current text-[#ff70ae] animate-pulse" />
                </div>
                <span className="text-[7px] font-mono font-bold text-[#ff70ae]/80 uppercase mt-2.5 tracking-wider">Love Stamp</span>
                <span className="text-[5px] font-mono text-[#8A5A68]/60 uppercase tracking-widest mt-0.5">8 JUN 2026</span>
              </motion.div>
            </div>

              <div className="space-y-3 md:space-y-6 relative z-10 pr-0 md:pr-14">
                <div className="space-y-1.5 md:space-y-3.5">
                  <div className="flex items-center gap-2">
                    <Flower className="w-4 h-4 text-[#ff70ae] animate-spin-slow" />
                    <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#ff70ae] uppercase">A Little Note</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-serif text-[#4A2230] leading-snug font-bold">
                    Happy Birthday,<br />Ami Sayang 💗
                  </h2>
                </div>
                
                {/* Note Content Text - Scrollable to fit all device heights and ratios perfectly */}
                <div className="space-y-3 text-xs md:text-sm lg:text-base text-[#4A2230] font-medium leading-relaxed md:leading-loose md:max-h-[48vh] md:overflow-y-auto pr-1 md:pr-4 custom-scrollbar">
                  <p className="mt-1">
                    Honestly, I don't know how to fit everything i wanna say into just a few paragraphs.
                  </p>
                  <p className="mt-2">
                    Thank you for being my favorite person. Thank you for all the laughs, all the random conversations, all the little moments that make my days so much better.
                  </p>
                  <p className="mt-2">
                    Being with you makes even ordinary days feel special.
                  </p>
                  <p className="mt-2">
                    I hope this year brings you more happiness, more reasons to smile, and all the good things you've been wishing for. You deserve so much love, kindness, and beautiful things in life.
                  </p>
                  <p className="mt-2">
                    And if there's one thing I want you to remember today, it's that you are deeply loved. More than you know.
                  </p>
                  <p className="mt-2">
                    Thank you for always being my safest place, my comfort, and one of the best things that has ever happened to me.
                  </p>
                  <p className="mt-2">
                    I can't wait to make more memories with you, go on more little adventures, and spend more birthdays by your side.
                  </p>
                  <p className="mt-2 font-semibold text-rose-600 flex items-center gap-1.5 flex-wrap">
                    Happy 24th birthday, Ami. ❤️
                  </p>
                  <p className="font-semibold text-rose-600">
                    I love you, always.
                  </p>
                </div>

                {/* Sender signature block */}
                <div className="pt-4 md:pt-6 border-t border-[#ffd6e7] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] md:text-xs italic text-[#8A5A68] mb-0.5">With Love,</p>
                    <p className="text-base md:text-xl font-serif text-[#ff70ae] font-semibold tracking-wide">Ardhi Satria</p>
                    <p className="text-[8px] md:text-xs tracking-widest uppercase text-[#8A5A68]/70 font-mono mt-0.5">8 June 2026 ✨</p>
                  </div>
                
                {/* Clickable wax seal or shiny heart interactive stamp at the bottom corner */}
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
    </div>
  );

}
