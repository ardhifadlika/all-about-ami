import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface LoveBubble {
  id: string;
  x: number;
  y: number;
  scale: number;
  char: string;
}

export default function InteractiveCursor() {
  const [isMobile, setIsMobile] = useState(true);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [bubbles, setBubbles] = useState<LoveBubble[]>([]);
  const [hideText, setHideText] = useState(false);
  
  const trailText = "Happy birthday sayang ❤️";
  const [typedLength, setTypedLength] = useState(0);

  // Typewriter effect logic
  useEffect(() => {
    if (isMobile) return;

    let isCancelled = false;
    let timer: NodeJS.Timeout;

    const runTypewriter = async () => {
      while (!isCancelled) {
        // Step 1: Type the text letter by letter
        for (let i = 0; i <= trailText.length; i++) {
          if (isCancelled) return;
          setTypedLength(i);
          // Wait between typing letters
          await new Promise(resolve => {
            timer = setTimeout(resolve, 100 + Math.random() * 50);
          });
        }

        // Step 2: Hold for 2 seconds at full text
        await new Promise(resolve => {
          timer = setTimeout(resolve, 2000);
        });

        if (isCancelled) return;

        // Step 3: Reset back to 0
        setTypedLength(0);
        
        // Wait 500ms pause before restarting the typewriter loop
        await new Promise(resolve => {
          timer = setTimeout(resolve, 500);
        });
      }
    };

    runTypewriter();

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isMobile, trailText]);

  // Check pointer capability to avoid running custom cursor on mobile touch screens
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const lastSpawnPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });

      // Check if hovering over any element designated to hide cursor text
      const target = e.target as HTMLElement | null;
      if (target) {
        setHideText(!!target.closest('.hover-hide-cursor-text'));
      }

      // Calculate distance moved from last bubble spawn position
      const dx = clientX - lastSpawnPos.current.x;
      const dy = clientY - lastSpawnPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn a subtle bubble/heart when mouse moves far enough (e.g. 25px)
      if (dist > 25) {
        lastSpawnPos.current = { x: clientX, y: clientY };
        
        const loveSymbols = ['❤️', '💖', '💕', '✨', '🫧', '🌸', '💗'];
        const randomSymbol = loveSymbols[Math.floor(Math.random() * loveSymbols.length)];
        const newBubble: LoveBubble = {
          id: Math.random().toString(36).substring(2, 9),
          x: clientX,
          y: clientY,
          scale: 0.5 + Math.random() * 0.7,
          char: randomSymbol
        };

        setBubbles(prev => [...prev.slice(-15), newBubble]); // limit to max 15 active bubbles to guarantee smooth frames
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  if (isMobile) return null;

  const currentTypedText = trailText.slice(0, typedLength);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Subtle Love Bubbles */}
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            initial={{ 
              opacity: 0.8, 
              scale: 0.2, 
              x: bubble.x - 10, 
              y: bubble.y - 10 
            }}
            animate={{ 
              opacity: 0,
              scale: bubble.scale * 1.5,
              y: bubble.y - 120 - Math.random() * 60, // float up
              x: bubble.x - 10 + (Math.random() - 0.5) * 60, // drift sideways
              rotate: (Math.random() - 0.5) * 45 // rotate slightly
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setBubbles(prev => prev.filter(b => b.id !== bubble.id));
            }}
            className="absolute text-lg filter drop-shadow-md pointer-events-none"
          >
            {bubble.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Elegant, clean horizontal typewriter text box with smooth spring following custom cursors */}
      <AnimatePresence>
        {!hideText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, x: mousePos.x + 18, y: mousePos.y + 12 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              opacity: { duration: 0.25 },
              scale: { duration: 0.25 },
              x: { type: "spring", stiffness: 220, damping: 22 },
              y: { type: "spring", stiffness: 220, damping: 22 }
            }}
            className="absolute pointer-events-none select-none text-[11px] font-semibold tracking-wide filter drop-shadow-md flex items-center bg-white/90 backdrop-blur-[2px] px-2.5 py-1 rounded-full border border-pink-100 shadow-[0_2px_10px_rgba(255,182,193,0.3)] whitespace-nowrap text-[#ff5293]"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              left: 0,
              top: 0,
            }}
          >
            <span className="mr-0.5">{currentTypedText}</span>
            {/* Blinking typewriter cursor bar */}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-[1.5px] h-3 bg-[#ff5293] inline-block ml-0.5"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Core Cursor Dot with Glowing Heart */}
      <div 
        className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-75 pointer-events-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
        }}
      >
        {/* Glow effect outer ring */}
        <div className="absolute w-6 h-6 rounded-full border border-[#ff70ae]/40 bg-pink-100/30 animate-ping opacity-60" />
        
        {/* Main baby heart center */}
        <Heart className="w-3.5 h-3.5 text-[#ff2a7f] fill-[#ff2a7f] drop-shadow-[0_0_4px_rgba(255,42,127,0.5)] animate-pulse" />
      </div>
    </div>
  );
}
