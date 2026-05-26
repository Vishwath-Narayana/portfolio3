import { motion, useScroll, useTransform } from 'framer-motion';
import { Display, Mono, Body, ThinText, StaggeredReveal, VerticalText } from '../ui/Typography';
import { GridLines } from '../ui/GridLines';
import { useRef, useEffect, useState } from 'react';

const ProceduralGrid = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isMobile) return null; // Save performance on mobile

  const cols = 24;
  const rows = 12;
  const cells = Array.from({ length: cols * rows }).map((_, i) => i);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen">
      <div className="grid w-full h-full" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
        {cells.map((i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return <GridCell key={i} col={col} row={row} mousePos={mousePos} cols={cols} rows={rows} />;
        })}
      </div>
    </div>
  );
};

const GridCell = ({ col, row, mousePos }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0);
  const coordsRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    coordsRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const handleResize = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      coordsRef.current = {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2
      };
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!coordsRef.current) return;
    const { x: centerX, y: centerY } = coordsRef.current;
    const distance = Math.sqrt(Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2));
    const maxDist = 400;
    
    let newIntensity = 0;
    if (distance < maxDist) {
      newIntensity = 1 - distance / maxDist;
    }
    
    setIntensity(prev => {
      if (Math.abs(prev - newIntensity) > 0.02) {
        return newIntensity;
      }
      return prev;
    });
  }, [mousePos]);

  return (
    <div 
      ref={ref}
      className="border-r border-b border-primary-700/10 transition-all duration-1000 ease-out relative"
      style={{
        backgroundColor: intensity > 0.05 ? `rgba(255, 90, 54, ${intensity * 0.1})` : 'transparent',
      }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (col * 0.05) + (row * 0.05), duration: 2, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center"
      >
        {intensity > 0.8 && <div className="w-1 h-1 bg-accent/40 rounded-full" />}
      </motion.div>
    </div>
  );
};

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-16 overflow-hidden bg-primary-900">
      <ProceduralGrid />
      <GridLines className="opacity-30" />

      {/* Micro-storytelling node */}
      <motion.div 
        className="absolute top-32 right-6 md:right-12 lg:right-24 hidden md:flex items-center gap-4 z-20 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
         <Mono className="text-[10px] text-primary-500">[SYS_BOOT_COMPLETE]</Mono>
         <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse"></div>
      </motion.div>

      {/* Parallax Vertical Type */}
      <motion.div 
         style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }} 
         className="absolute left-6 md:left-12 lg:left-24 bottom-32 z-0 hidden lg:block opacity-10"
      >
         <VerticalText className="text-[120px] font-mono leading-none tracking-tighter mix-blend-overlay">2026</VerticalText>
      </motion.div>

      <motion.div style={{ y, opacity, scale }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end w-full max-w-[1600px] mx-auto z-10 relative">
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            <Mono className="mb-6 md:mb-10 inline-block text-accent border border-accent/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">Procedural Architecture</Mono>
            <Display className="text-balance leading-[0.85] tracking-tighter md:text-[8rem] lg:text-[10rem]">
              <StaggeredReveal text="Creative" /> <br />
              <ThinText className="text-primary-300 mix-blend-screen"><StaggeredReveal text="Engineering" /></ThinText><br/>
              <StaggeredReveal text="Systems." />
            </Display>
          </motion.div>
        </div>
        
        <motion.div 
          className="lg:col-span-4 flex flex-col gap-12 lg:pb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Body className="text-balance max-w-sm text-primary-200 md:text-xl font-light">
            I am a multidisciplinary technologist bridging the gap between deep infrastructure and cinematic digital interfaces.
          </Body>
          
          <div className="flex flex-col gap-4 border-l border-primary-800 pl-6">
            <Mono className="text-[10px] text-primary-500 uppercase tracking-widest">Active Daemons</Mono>
            <ul className="text-text-muted font-light flex flex-col gap-3">
              <li className="flex items-center gap-4 text-sm md:text-base group" data-cursor="true" data-cursor-text="INSPECT">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 group-hover:bg-accent transition-colors duration-300"></span> Architectural UI/UX
              </li>
              <li className="flex items-center gap-4 text-sm md:text-base group" data-cursor="true" data-cursor-text="INSPECT">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 group-hover:bg-accent transition-colors duration-300"></span> Frontend & Motion Physics
              </li>
              <li className="flex items-center gap-4 text-sm md:text-base group" data-cursor="true" data-cursor-text="INSPECT">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 group-hover:bg-accent transition-colors duration-300"></span> Resilient Infrastructure
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
