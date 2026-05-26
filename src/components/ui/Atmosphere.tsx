import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Atmosphere = () => {
  const [time, setTime] = useState('');
  const [sysStatus, setSysStatus] = useState('ONLINE');
  const [latency, setLatency] = useState('14ms');

  // Mouse position tracking for active atmospheric drift (parallax)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  const springX2 = useSpring(mouseX, { damping: 80, stiffness: 120 });
  const springY2 = useSpring(mouseY, { damping: 80, stiffness: 120 });

  const springX3 = useSpring(mouseX, { damping: 30, stiffness: 300 });
  const springY3 = useSpring(mouseY, { damping: 30, stiffness: 300 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth) - 0.5;
      const yPercent = (clientY / window.innerHeight) - 0.5;
      mouseX.set(xPercent * 50); // Drift up to 50px
      mouseY.set(yPercent * 50);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Live clock and randomized telemetry updates
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toTimeString().split(' ')[0]);
      
      // Random latency shifts
      const randomLat = Math.floor(10 + Math.random() * 8);
      setLatency(`${randomLat}ms`);

      // Status flickering
      if (Math.random() > 0.98) {
        setSysStatus('CALIBRATING');
        setTimeout(() => setSysStatus('ONLINE'), 1500);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Cinematic Screen Overlays: Film Grain, Scanlines, and CRT Bezel */}
      <div className="film-grain" />
      <div className="scanlines" />
      <div className="crt-bezel" />

      {/* Screen Border Corner HUD Telemetry */}
      <div className="fixed inset-x-6 top-6 bottom-6 pointer-events-none z-40 hidden md:flex flex-col justify-between font-mono text-[9px] text-primary-500 uppercase tracking-widest mix-blend-screen opacity-40">
        {/* Top bar HUD */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>V3_SYS_OPERATIONAL_ENV</span>
          </div>
          <div className="flex gap-6">
            <span>PING: {latency}</span>
            <span>OS_STATUS: <span className={sysStatus === 'ONLINE' ? 'text-green-500' : 'text-yellow-500 animate-pulse'}>{sysStatus}</span></span>
          </div>
        </div>

        {/* Bottom bar HUD */}
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4">
            <span>LOC_SYS: [50.0755° N, 14.4378° E]</span>
            <span>MEM: 1.02GB / 8.00GB</span>
          </div>
          <div className="flex gap-6">
            <span>HEAP_ALLOCATION: 12.4%</span>
            <span className="tabular-nums">{time}</span>
          </div>
        </div>
      </div>

      {/* Ambient Multi-Depth Global Lighting Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Layer 1: Base Dark Purple Glow - Slow Drift */}
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] rounded-full bg-primary-800/15 blur-[200px]"
        />

        {/* Layer 2: Core Accent Glow - Pulsing and Shifted */}
        <motion.div 
          style={{ 
            x: springX2, 
            y: springY2 
          }}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-20%] right-[-10%] w-[65%] h-[65%] rounded-full bg-accent/5 blur-[250px]"
        />

        {/* Layer 3: Dynamic Center Node Glow - Emissive Highlight */}
        <motion.div 
          style={{ 
            x: springX3, 
            y: springY3 
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full bg-primary-700/10 blur-[140px]"
        />
      </div>
    </>
  );
};
