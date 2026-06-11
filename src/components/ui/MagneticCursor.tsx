import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Apple-level precision: Heavy, smooth, inertial motion
  const springConfig = { damping: 40, stiffness: 100, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const hoverIntentRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check if device is touch
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('a, button, [data-cursor]');
      
      if (hoverIntentRef.current) clearTimeout(hoverIntentRef.current);
      
      if (interactiveEl) {
        // Intent delay to prevent flickering during rapid scrolling/crossing
        hoverIntentRef.current = setTimeout(() => {
          setIsHovered(true);
          const text = interactiveEl.getAttribute('data-cursor-text');
          setHoverText(text || '');
        }, 60);
      } else {
        hoverIntentRef.current = setTimeout(() => {
          setIsHovered(false);
          setHoverText('');
        }, 60);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Hide cursor on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center rounded-full mix-blend-difference bg-white"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        width: isHovered ? (hoverText ? 80 : 48) : 32,
        height: isHovered ? (hoverText ? 80 : 48) : 32,
        marginLeft: isHovered ? (hoverText ? -40 : -24) : -16,
        marginTop: isHovered ? (hoverText ? -40 : -24) : -16,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 150, mass: 0.5 }}
    >
      {hoverText && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          className="text-black text-[10px] font-mono tracking-widest uppercase absolute"
        >
          {hoverText}
        </motion.span>
      )}
    </motion.div>
  );
};
