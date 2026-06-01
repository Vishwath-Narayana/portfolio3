import { motion, useScroll, useTransform, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { Body } from '../ui/Typography';
import { useRef, useEffect, useState } from 'react';

// ─── Particle Field ────────────────────────────────────────────────────────────
// 16 curated particles with directional environmental flow (rightward drift +
// gentle upward float). Each has a depth value that controls size and opacity.
// NOT decorative — they create spatial z-depth.
const AmbientParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    type P = { x: number; y: number; vx: number; vy: number; depth: number; phase: number };
    const particles: P[] = Array.from({ length: 16 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0.018 + Math.random() * 0.012,  // directional rightward
      vy: -(0.006 + Math.random() * 0.006), // upward
      depth: 0.2 + Math.random() * 0.8,
      phase: (i / 16) * Math.PI * 2,
    }));

    let t = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.003;

      for (const p of particles) {
        // Gentle sinusoidal lateral sway on top of directional movement
        p.x += p.vx + Math.sin(t * 0.7 + p.phase) * 0.04;
        p.y += p.vy + Math.cos(t * 0.5 + p.phase * 1.4) * 0.02;

        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;

        const opacity = (0.06 + p.depth * 0.18);
        const size = 0.5 + p.depth * 1.2;
        // Depth tint: far = cooler, near = warm white
        const warm = Math.round(p.depth * 30);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${210 + warm}, ${200 + warm * 0.6}, ${210}, ${opacity})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// ─── Atmosphere ────────────────────────────────────────────────────────────────
// Asymmetric directional volumetric fog — NOT a circular bloom.
// Multiple elongated haze layers at different angles create
// environmental depth illumination rather than a hero-gradient cliché.
const Atmosphere = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030303]" />

    {/* Fine structural grid — slightly faded toward right edge */}
    <div className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px)',
        backgroundSize: '88px 88px',
        WebkitMaskImage: 'linear-gradient(to right, rgba(255,255,255,1) 30%, rgba(255,255,255,0.4) 100%)',
        maskImage: 'linear-gradient(to right, rgba(255,255,255,1) 30%, rgba(255,255,255,0.4) 100%)',
      }}
    />

    {/* Coarse architectural grid */}
    <div className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '352px 352px',
      }}
    />

    {/* PRIMARY FOG: diagonal haze rising from lower-left — the main light source.
        An elongated ellipse rotated ~35° acts like a cinematic key light. */}
    <motion.div
      className="absolute"
      style={{
        width: '160vw', height: '60vh',
        left: '-30%', bottom: '-5%',
        background: 'linear-gradient(135deg, rgba(255,52,20,0.11) 0%, rgba(255,38,12,0.05) 40%, transparent 70%)',
        filter: 'blur(70px)',
        transform: 'rotate(-18deg)',
        transformOrigin: 'left bottom',
      }}
      animate={{ opacity: [0.7, 1.05, 0.7] }}
      transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* SECONDARY FOG: horizontal haze across bottom third — ground warmth */}
    <motion.div
      className="absolute bottom-0 left-0 right-0"
      style={{
        height: '45vh',
        background: 'linear-gradient(to top, rgba(255,45,15,0.05) 0%, rgba(255,35,10,0.02) 50%, transparent 100%)',
        filter: 'blur(50px)',
      }}
      animate={{ opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
    />

    {/* COUNTER-BALANCE: very faint cool haze upper-right — creates tonal depth */}
    <div
      className="absolute"
      style={{
        width: '50vw', height: '40vh',
        right: 0, top: 0,
        background: 'linear-gradient(225deg, rgba(180,185,200,0.018) 0%, transparent 65%)',
        filter: 'blur(60px)',
      }}
    />

    {/* Deep asymmetric vignette: heavier right and top, open lower-left */}
    <div className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse 115% 105% at 18% 78%, transparent 22%, rgba(3,3,3,0.72) 78%),
          linear-gradient(to right, transparent 10%, rgba(3,3,3,0.65) 100%)
        `,
      }}
    />

    {/* Edge fades */}
    <div className="absolute inset-0"
      style={{
        background: 'linear-gradient(to bottom, rgba(3,3,3,0.55) 0%, transparent 14%, transparent 78%, rgba(3,3,3,0.7) 100%)',
      }}
    />

    {/* CRT scanlines — barely perceptible */}
    <div className="absolute inset-0 opacity-[0.013]"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,1) 3px, rgba(0,0,0,1) 4px)' }}
    />
  </div>
);

// ─── Drifting Haze ─────────────────────────────────────────────────────────────
// A single cinematic motion layer: two large blurred divs drift slowly across
// the scene at different speeds. Imperceptible as animation, felt as atmosphere.
const DriftingHaze = () => (
  <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
    <motion.div
      className="absolute"
      style={{
        width: '80vw', height: '80vh',
        left: '5%', top: '10%',
        background: 'radial-gradient(ellipse at 40% 60%, rgba(255,50,18,0.03) 0%, transparent 65%)',
        filter: 'blur(90px)',
        borderRadius: '60% 40% 50% 50% / 50% 50% 40% 60%',
      }}
      animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
      transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute"
      style={{
        width: '60vw', height: '60vh',
        right: '10%', bottom: '15%',
        background: 'radial-gradient(ellipse at 55% 45%, rgba(255,40,12,0.02) 0%, transparent 60%)',
        filter: 'blur(100px)',
        borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
      }}
      animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
      transition={{ duration: 65, repeat: Infinity, ease: 'easeInOut', delay: 12 }}
    />
  </div>
);

// ─── Left Architectural Shadow ──────────────────────────────────────────────────
// A subtle structural presence on the left that creates compositional
// weight without being a UI element. Reads as a deep architectural column
// or building edge — the same cinematic language as film noir.
const LeftArchitecturalAnchor = () => (
  <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden hidden lg:block">
    {/* Main shadow column */}
    <div
      className="absolute top-0 bottom-0"
      style={{
        left: 0,
        width: '14vw',
        background: 'linear-gradient(to right, rgba(3,3,3,0.82) 0%, rgba(3,3,3,0.45) 45%, rgba(3,3,3,0.12) 75%, transparent 100%)',
      }}
    />
    {/* Faint vertical edge line — structural seam */}
    <div
      className="absolute top-[8%] bottom-[8%]"
      style={{
        left: '13vw',
        width: '1px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 80%, transparent 100%)',
      }}
    />
  </div>
);

// ─── The "Moment" ──────────────────────────────────────────────────────────────
// Every 17 seconds, a soft radial pulse radiates from the lower-left bloom origin.
// It's the one unforgettable detail — barely visible but emotionally felt.
const AtmosphericPulse = () => (
  <div className="absolute z-[5] pointer-events-none overflow-hidden inset-0">
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '60vw', height: '60vw',
        left: '-8%', bottom: '-10%',
        border: '1px solid rgba(255,60,25,0.12)',
        background: 'transparent',
      }}
      animate={{ scale: [0.4, 1.6], opacity: [0.25, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatDelay: 13,  // 13s quiet + 4s pulse = 17s total cycle
        ease: [0.16, 1, 0.3, 1],
      }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '40vw', height: '40vw',
        left: '-4%', bottom: '-5%',
        border: '1px solid rgba(255,60,25,0.07)',
        background: 'transparent',
      }}
      animate={{ scale: [0.5, 2.0], opacity: [0.2, 0] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        repeatDelay: 12.5,
        delay: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  </div>
);

// ─── Foreground Depth ──────────────────────────────────────────────────────────
// Foreground framing elements that sit in front of all content,
// creating the sense of looking into a deep spatial environment.
const ForegroundDepth = () => (
  <div className="absolute inset-0 z-[25] pointer-events-none">
    {/* Left column — primary foreground frame, heavier now */}
    <div
      className="absolute top-0 bottom-0 left-0"
      style={{
        width: '9vw',
        background: 'linear-gradient(to right, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.55) 50%, rgba(3,3,3,0.15) 80%, transparent 100%)',
      }}
    />
    {/* Right column — lighter, doesn't compete with panel */}
    <div
      className="absolute top-0 bottom-0 right-0"
      style={{
        width: '4vw',
        background: 'linear-gradient(to left, rgba(3,3,3,0.7) 0%, transparent 100%)',
      }}
    />
    {/* Bottom ground fog */}
    <div
      className="absolute left-0 right-0 bottom-0"
      style={{ height: '22vh', background: 'linear-gradient(to top, rgba(3,3,3,0.8) 0%, rgba(3,3,3,0.2) 60%, transparent 100%)' }}
    />
    {/* Top fade */}
    <div
      className="absolute left-0 right-0 top-0"
      style={{ height: '12vh', background: 'linear-gradient(to bottom, rgba(3,3,3,0.65) 0%, transparent 100%)' }}
    />
  </div>
);

// ─── Interactive Typography ────────────────────────────────────────────────────
const InteractiveWord = ({ text, mouseX, mouseY, delay }: { text: string, mouseX: any, mouseY: any, delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 120, damping: 20 });
  const y = useSpring(0, { stiffness: 120, damping: 20 });
  const glow = useSpring(0, { stiffness: 80, damping: 20 });

  useAnimationFrame(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mX = mouseX.get();
    const mY = mouseY.get();
    
    if (mX === 0 && mY === 0) return;

    const dist = Math.sqrt(Math.pow(mX - centerX, 2) + Math.pow(mY - centerY, 2));
    const maxDist = 400;

    if (dist < maxDist) {
      const pull = Math.pow(1 - dist / maxDist, 2) * 12;
      const dx = (centerX - mX) / dist || 0;
      const dy = (centerY - mY) / dist || 0;
      x.set(dx * pull);
      y.set(dy * pull);
      glow.set(1 - dist / maxDist);
    } else {
      x.set(0);
      y.set(0);
      glow.set(0);
    }
  });

  const textShadow = useTransform(glow, v => `0 0 ${v * 40}px rgba(255,90,54,${v * 0.3})`);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1], delay }}
      style={{ x, y, textShadow }}
      className="inline-block cursor-default"
    >
      {text}
    </motion.div>
  );
};

const InteractiveHeadline = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  return (
    <div 
      className="font-black text-white leading-[0.9] tracking-[-0.03em] flex flex-col items-start gap-1 md:gap-2"
      style={{
        fontSize: 'clamp(2.8rem, 6.5vw, 7.5rem)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div className="flex gap-4">
        <InteractiveWord text="HEY," mouseX={mouseX} mouseY={mouseY} delay={0.05} />
        <InteractiveWord text="I'M" mouseX={mouseX} mouseY={mouseY} delay={0.12} />
      </div>
      <InteractiveWord text="VISHWATH." mouseX={mouseX} mouseY={mouseY} delay={0.2} />
    </div>
  );
};

// ─── Cinematic Portrait ────────────────────────────────────────────────────────
const CinematicPortrait = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const proximity = useSpring(0, { stiffness: 50, damping: 20 });

  useAnimationFrame(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mX = mouseX.get();
    const mY = mouseY.get();
    
    if (mX === 0 && mY === 0) return;

    const dist = Math.sqrt(Math.pow(mX - centerX, 2) + Math.pow(mY - centerY, 2));
    const maxDist = 500;
    
    if (dist < maxDist) {
      proximity.set(1 - dist / maxDist);
    } else {
      proximity.set(0);
    }
  });

  const imgScale = useTransform(proximity, [0, 1], [1, 1.05]);
  const glowOpacity = useTransform(proximity, [0, 1], [0.2, 0.5]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1], delay: 0.7 }}
      className="relative flex items-center justify-center pointer-events-none mx-auto lg:ml-auto"
      style={{ width: 'clamp(260px, 30vw, 360px)', aspectRatio: '3/4' }}
    >
      {/* Background Glow */}
      <motion.div 
        className="absolute inset-0 bg-accent blur-[80px]"
        style={{ opacity: glowOpacity }}
      />
      
      {/* Portrait Container */}
      <div className="relative w-full h-full overflow-hidden border border-white/10 bg-[#020202]">
        <motion.img 
          src="/portrait.png" 
          alt="Vishwath"
          style={{ scale: imgScale }}
          className="w-full h-full object-cover mix-blend-luminosity opacity-80"
        />
        
        {/* Soft Red Overlay for Atmosphere */}
        <div className="absolute inset-0 bg-accent mix-blend-overlay opacity-30" />
        
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 4px)' }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        
        {/* Telemetry Accents */}
        <div className="absolute top-4 left-4 flex gap-2 items-center">
          <span className="w-[5px] h-[5px] rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(255,90,54,0.8)]" />
          <span className="font-mono text-[7.5px] text-white/50 tracking-[0.2em] uppercase">ID_VERIFIED</span>
        </div>
        
        <div className="absolute bottom-5 left-5 flex flex-col gap-1">
          <span className="font-mono text-[10px] text-white/80 tracking-widest uppercase">VISHWATH</span>
          <span className="font-mono text-[6.5px] text-accent/80 tracking-widest uppercase">SYS.V3_ACTIVE</span>
        </div>
      </div>
      
      {/* Framing Brackets */}
      <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-white/20" />
      <div className="absolute -top-3 -right-3 w-6 h-6 border-t border-r border-white/20" />
      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b border-l border-white/20" />
      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-white/20" />
    </motion.div>
  );
};

// ─── Non-Blocking Lightweight Intro ────────────────────────────────────────────
const LightweightIntro = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center bg-[#020202]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.9, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 4px)' }}
      />
      
      <div className="flex flex-col items-center gap-2">
        <motion.span
          className="font-mono text-[9px] tracking-[0.4em] text-accent/80 uppercase"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        >
          Identity Verified
        </motion.span>
        <motion.span
          className="font-mono text-[8px] tracking-[0.35em] text-white/40 uppercase"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        >
          Initializing Personal Systems
        </motion.span>
      </div>
    </motion.div>
  );
};

// ─── Root ──────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const opacityAll = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 700 }}
    >
      {/* ── NON-BLOCKING BOOT SEQUENCE OVERLAY ── */}
      <LightweightIntro />

      {/* ── LAYER 0: Directional volumetric fog atmosphere ── */}
      <motion.div
        initial={{ opacity: 0.1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Atmosphere />
      </motion.div>

      <motion.div style={{ opacity: opacityAll }} className="absolute inset-0">
        {/* ── LAYER 1.5: Slow-drifting atmospheric haze ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: 'easeInOut' }}
        >
          <DriftingHaze />
        </motion.div>

        {/* ── LAYER 2: Directional ambient particle field ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.2, ease: 'easeInOut' }}
        >
          <AmbientParticles />
        </motion.div>

        {/* ── LAYER 2.5: Atmospheric pulse ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.4, ease: 'easeInOut' }}
        >
          <AtmosphericPulse />
        </motion.div>

        {/* ── LAYER 3: Foreground Content Grid ── */}
        <div className="absolute inset-0 z-[20] flex flex-col justify-center px-8 md:px-12 lg:px-24 pointer-events-auto">
          <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT SIDE: Typography */}
            <div className="lg:col-span-8 flex flex-col gap-8 md:gap-10 pl-4 md:pl-8 lg:pl-16">


              <InteractiveHeadline mouseX={mouseX} mouseY={mouseY} />

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="max-w-md lg:mt-4 flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-accent/90 font-mono text-[10px] tracking-widest uppercase">
                    Creative Designer & Developer
                  </span>
                  <Body className="text-white/40 font-light" style={{ fontSize: '15px', lineHeight: 1.7 } as any}>
                    Building cinematic interfaces, scalable systems, and precision-engineered digital experiences.
                  </Body>
                </div>
                
                {/* Domain Tags */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {['SYSTEM DESIGN', 'ARCHITECTURE', 'PAYMENTS', 'DEVOPS', 'AI SYSTEMS'].map((tag) => (
                    <div key={tag} className="flex items-center gap-2 opacity-60">
                      <span className="w-1 h-1 bg-accent/40" />
                      <span className="font-mono text-[8.5px] tracking-[0.2em] text-white/50 uppercase">{tag}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: Cinematic Portrait */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end mt-16 lg:mt-0">
              <CinematicPortrait mouseX={mouseX} mouseY={mouseY} />
            </div>

          </div>
        </div>
      </motion.div>

      {/* ── LAYER 3.5: Left architectural shadow anchor ── */}
      <LeftArchitecturalAnchor />

      {/* ── LAYER 4: Foreground cinematic depth framing ── */}
      <ForegroundDepth />
    </section>
  );
};
