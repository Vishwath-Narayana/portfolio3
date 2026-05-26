import { motion, useScroll, useTransform } from 'framer-motion';
import { Display, Mono, Body, ThinText, StaggeredReveal, VerticalText } from '../ui/Typography';
import { GridLines } from '../ui/GridLines';
import { useRef, useEffect, useState } from 'react';

const ArchitectureNode = ({ mousePos }: { mousePos: { x: number, y: number } }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(1000);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
  }, []);

  useEffect(() => {
    const deltaX = mousePos.x - coords.x;
    const deltaY = mousePos.y - coords.y;
    setDistance(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
  }, [mousePos, coords]);

  const maxDist = 400;
  const isNear = distance < maxDist;
  const distortion = isNear ? (1 - distance / maxDist) * 15 : 0;
  
  return (
    <div 
      ref={ref}
      className="absolute right-[12%] top-1/2 -translate-y-1/2 w-80 h-80 z-10 pointer-events-none hidden lg:flex items-center justify-center mix-blend-screen"
    >
      {/* Telemetry Readout */}
      <div className="absolute font-mono text-[8px] text-primary-500 flex flex-col gap-1 -top-12 -left-12 opacity-65">
        <span>K8S_INGRESS: [us-east-1a]</span>
        <span>NODE_IP: 10.244.1.42</span>
        <span>LATENCY: {(12 + (distortion * 2)).toFixed(1)}MS</span>
        <span className="text-accent mt-1 border-t border-primary-800 pt-1">STATE: HEALTHY</span>
      </div>

      {/* Structural Bracket Grid */}
      <motion.div 
        className="absolute w-72 h-72 border-x-2 border-primary-700/30 flex flex-col justify-between p-4"
        animate={{
          scaleY: isNear ? 1 + (distortion * 0.005) : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="w-full h-px bg-primary-700/30"></div>
        <div className="flex justify-between items-center px-8">
           <div className="w-1.5 h-1.5 bg-primary-600/50"></div>
           <div className="w-1.5 h-1.5 bg-primary-600/50"></div>
        </div>
        <div className="w-full h-px bg-primary-700/30"></div>
      </motion.div>

      {/* Core Processing Block */}
      <motion.div 
        className="w-32 h-32 border border-primary-600/40 bg-primary-900/50 flex items-center justify-center relative overflow-hidden backdrop-blur-sm"
        animate={{
          rotateX: isNear ? distortion : 0,
          rotateY: isNear ? -distortion : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,90,54,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,90,54,0.1)_1px,transparent_1px)] bg-[size:0.5rem_0.5rem] opacity-30"></div>
        
        {/* Metric Bar */}
        <div className="absolute bottom-4 left-4 right-4 h-1 bg-primary-950 overflow-hidden">
           <motion.div 
             className="h-full bg-accent"
             animate={{ width: isNear ? '85%' : '42%' }}
             transition={{ type: "spring", stiffness: 100, damping: 15 }}
           />
        </div>
      </motion.div>

      {/* Telemetry crosshairs */}
      <div className="absolute w-[1px] h-[150%] bg-primary-800/20" />
      <div className="absolute h-[1px] w-[150%] bg-primary-800/20" />
    </div>
  );
};

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

  if (isMobile) return null;

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
      
      {/* Vertical Scan Line Sweep */}
      <motion.div 
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-50"
        animate={{
          top: ["-5%", "105%"]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Core Node */}
      <ArchitectureNode mousePos={mousePos} />
    </div>
  );
};

const GridCell = ({ col, row, mousePos }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0);
  const [shift, setShift] = useState({ x: 0, y: 0 });
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
    const deltaX = mousePos.x - centerX;
    const deltaY = mousePos.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDist = 350;
    
    let newIntensity = 0;
    let newShift = { x: 0, y: 0 };
    
    if (distance < maxDist) {
      newIntensity = 1 - distance / maxDist;
      
      // Calculate magnetic distortion (pull vertices slightly towards cursor)
      const force = newIntensity * 10; // Max 10px shift
      const angle = Math.atan2(deltaY, deltaX);
      newShift = {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force
      };
    }
    
    setIntensity(prev => {
      if (Math.abs(prev - newIntensity) > 0.02) {
        return newIntensity;
      }
      return prev;
    });

    setShift(prev => {
      if (Math.abs(prev.x - newShift.x) > 0.5 || Math.abs(prev.y - newShift.y) > 0.5) {
        return newShift;
      }
      return prev;
    });
  }, [mousePos]);

  return (
    <div 
      ref={ref}
      className="border-r border-b border-primary-700/10 transition-all duration-1000 ease-out relative"
      style={{
        backgroundColor: intensity > 0.05 ? `rgba(255, 90, 54, ${intensity * 0.08})` : 'transparent',
      }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (col * 0.05) + (row * 0.05), duration: 2, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${shift.x}px, ${shift.y}px)`
        }}
      >
        {intensity > 0.8 && <div className="w-1.5 h-1.5 bg-accent/50 rounded-full shadow-[0_0_6px_rgba(255,90,54,0.8)]" />}
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
  const yVertical = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-16 overflow-hidden bg-primary-900">
      <ProceduralGrid />
      <GridLines className="opacity-30" />

      {/* Floating Low-Opacity Telemetry Feeds */}
      <div className="absolute left-6 md:left-12 lg:left-24 top-48 z-10 pointer-events-none hidden md:flex flex-col gap-1 font-mono text-[9px] text-primary-500/30 max-w-xs leading-relaxed uppercase select-none">
        <span>service_mesh: active</span>
        <span>istio_ingress: route_configured [0.012s]</span>
        <span>pod_autoscaler: max_replicas=24</span>
        <span>cache_hit_ratio: 94.2%</span>
        <span>db_connections: pooled [12/50]</span>
      </div>

      <div className="absolute right-6 md:right-12 lg:right-24 bottom-48 z-10 pointer-events-none hidden md:flex flex-col gap-1 font-mono text-[9px] text-primary-500/30 max-w-xs text-right leading-relaxed uppercase select-none">
        <span>env: production</span>
        <span>region: eu-west-1</span>
        <span>network_rx: 94.23 mb/s</span>
        <span>cpu_allocation: [||||||....] 62%</span>
        <span>memory_limit: 4.0gb</span>
      </div>

      {/* Micro-storytelling node */}
      <motion.div 
        className="absolute top-32 right-6 md:right-12 lg:right-24 hidden md:flex items-center gap-4 z-20 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
         <Mono className="text-[10px] text-primary-500">[SYSTEM_READY]</Mono>
         <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse"></div>
      </motion.div>

      {/* Parallax Vertical Type */}
      <motion.div 
         style={{ y: yVertical }} 
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
