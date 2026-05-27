import { motion, useScroll, useTransform } from 'framer-motion';
import { Body } from '../ui/Typography';
import { useRef, useEffect } from 'react';

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

// ─── Architectural Typography ──────────────────────────────────────────────────
// Each word is individually tuned for opacity AND blur — creating genuine
// atmospheric depth rather than just transparency variation.
// BUILDING is closest (sharpest, brightest). ALIVE. is deepest (blurred, near-invisible).
const ArchitecturalTypography = ({ y }: { y: any }) => (
  <motion.div
    className="absolute pointer-events-none select-none z-[2]"
    style={{ top: '-2%', left: '-1%', right: 0, y }}
  >
    <div
      className="font-black text-[#EAE5E1] overflow-visible"
      style={{
        fontSize: 'clamp(5.2rem, 18vw, 25rem)',
        lineHeight: 0.8,
        letterSpacing: '-0.035em',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* BUILDING — foreground word. Most visible. No blur. Anchors everything. */}
      <motion.div
        animate={{ opacity: [0.15, 0.24, 0.15] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      >
        BUILDING
      </motion.div>

      {/* SYSTEMS — slight recession. Very subtle blur begins. */}
      <motion.div
        style={{
          paddingLeft: '4%',
          filter: 'blur(0.3px)',
        }}
        animate={{ opacity: [0.085, 0.13, 0.085] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      >
        SYSTEMS
      </motion.div>

      {/* THAT FEEL — mid-depth. Blur increases. Fades toward the dark right vignette. */}
      <motion.div
        style={{
          paddingLeft: '9%',
          filter: 'blur(0.8px)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(255,255,255,1) 30%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0.2) 88%, transparent 100%)',
          maskImage: 'linear-gradient(to right, rgba(255,255,255,1) 30%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0.2) 88%, transparent 100%)',
        }}
        animate={{ opacity: [0.048, 0.078, 0.048] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      >
        THAT FEEL
      </motion.div>

      {/* ALIVE. — deepest distance. Heaviest blur. Almost disappears completely. */}
      <motion.div
        style={{
          paddingLeft: '16%',
          filter: 'blur(1.8px)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0.08) 78%, transparent 92%)',
          maskImage: 'linear-gradient(to right, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0.08) 78%, transparent 92%)',
        }}
        animate={{ opacity: [0.025, 0.048, 0.025] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
      >
        ALIVE.
      </motion.div>
    </div>
  </motion.div>
);

// ─── Intelligence Panel ────────────────────────────────────────────────────────
// Embedded into the atmospheric environment rather than floating above it.
// The panel uses a very dark semi-transparent bg so the typography bleeds
// faintly through its left edge. Left bleed gradient ties it to the bg fog.
const IntelligencePanel = () => (
  <motion.div
    className="absolute z-[20] hidden md:flex flex-col"
    style={{
      right: '4.5%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 'clamp(230px, 19vw, 288px)',
    }}
    initial={{ opacity: 0, x: 18 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1.6, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
  >
    {/* Atmospheric bleed — soft fog hazing left edge of panel into the bg */}
    <div className="absolute -left-8 -top-4 -bottom-4 w-12 pointer-events-none z-0"
      style={{
        background: 'linear-gradient(to right, transparent 0%, rgba(255,45,15,0.015) 50%, transparent 100%)',
        filter: 'blur(8px)',
      }}
    />
    <div
      className="relative bg-[#020202]/82 backdrop-blur-2xl z-[1]"
      style={{
        border: '1px solid rgba(255,255,255,0.032)',
        borderLeft: '1px solid rgba(255,255,255,0.022)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.008), 0 40px 120px rgba(0,0,0,0.98), inset 1px 0 0 rgba(255,255,255,0.012)',
      }}
    >
      {/* Header */}
      <div className="px-5 py-2.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-[5px] h-[5px] rounded-full bg-[rgba(255,65,35,0.7)]"
            animate={{ opacity: [0.7, 0.2, 0.7] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="font-mono text-[7px] text-primary-700 uppercase tracking-[0.2em]">
            System Intelligence
          </span>
        </div>
        <span className="font-mono text-[6.5px] text-primary-800">04.2</span>
      </div>

      {/* Philosophy */}
      <div className="px-5 pt-5 pb-4">
        <Body
          className="text-primary-400 font-light max-w-none"
          style={{ fontSize: '12px', lineHeight: 1.75 } as any}
        >
          Multidisciplinary technologist bridging deep infrastructure and cinematic digital interfaces.
        </Body>
      </div>

      {/* Separator */}
      <div className="mx-5 flex items-center gap-3 pb-1">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.03)' }} />
        <span className="font-mono text-[6px] text-primary-800 uppercase tracking-widest">Processes</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>

      {/* Process list */}
      <div className="px-5 pt-2 pb-3">
        {[
          { id: '01', label: 'Architectural UI/UX',        active: true },
          { id: '02', label: 'Frontend & Motion Physics',   active: true },
          { id: '03', label: 'Systems Infrastructure',      active: true },
          { id: '04', label: 'Creative Engineering',        active: false },
        ].map(p => (
          <div
            key={p.id}
            className="flex items-center justify-between py-[5px] group"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.022)' }}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[6.5px] text-primary-800 w-5">{p.id}</span>
              <span className="text-[11px] font-light text-primary-500 group-hover:text-primary-200 transition-colors duration-700">
                {p.label}
              </span>
            </div>
            <div className={`w-[5px] h-[5px] rounded-full ${p.active ? 'bg-green-700/60' : 'bg-primary-900'}`} />
          </div>
        ))}
      </div>

      {/* Footer metrics */}
      <div className="px-5 py-2.5 grid grid-cols-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.035)' }}>
        {[
          { label: 'Latency', value: '12ms' },
          { label: 'Uptime',  value: '99.9%' },
          { label: 'Region',  value: 'EU-W' },
        ].map(s => (
          <div key={s.label} className="flex flex-col gap-[3px]">
            <span className="font-mono text-[5.5px] text-primary-800 uppercase tracking-widest">{s.label}</span>
            <span className="font-mono text-[8.5px] text-primary-400">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Corner marks */}
      <div className="absolute top-0 left-0 w-2 h-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderLeft: '1px solid rgba(255,255,255,0.07)' }} />
      <div className="absolute bottom-0 right-0 w-2 h-2" style={{ borderBottom: '1px solid rgba(255,65,35,0.2)', borderRight: '1px solid rgba(255,65,35,0.2)' }} />
    </div>
  </motion.div>
);

// ─── Bottom Anchor ─────────────────────────────────────────────────────────────
const BottomAnchor = () => (
  <div className="absolute z-[20] bottom-0 left-0 right-0 flex justify-between items-end px-[5%] pb-8 pointer-events-none select-none">
    {/* Year — in foreground, overlapping the bg typography, adding depth collision */}
    <motion.div
      className="font-black leading-none tracking-tighter text-white"
      style={{
        fontSize: 'clamp(3.8rem, 9vw, 11rem)',
        mixBlendMode: 'screen',
      }}
      animate={{ opacity: [0.028, 0.052, 0.028] }}
      transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
    >
      2026
    </motion.div>

    <div className="hidden md:flex flex-col gap-0.5 text-right pb-1">
      <span className="font-mono text-[6.5px] text-primary-800 uppercase">
        MEM <span className="text-primary-700 ml-1">4096 MB</span>
      </span>
      <span className="font-mono text-[6.5px] text-primary-800 uppercase">
        PROC <span className="text-primary-700 ml-1">0x2E4A</span>
      </span>
    </div>
  </div>
);

// ─── Root ──────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Typography parallaxes slower than panels — creates depth separation on scroll
  const yTypo = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const opacityAll = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 700 }}
    >
      {/* ── LAYER 0: Directional volumetric fog atmosphere ── */}
      <Atmosphere />

      <motion.div style={{ opacity: opacityAll }} className="absolute inset-0">
        {/* ── LAYER 1: Architectural background typography ── */}
        <ArchitecturalTypography y={yTypo} />

        {/* ── LAYER 1.5: Slow-drifting atmospheric haze ── */}
        <DriftingHaze />

        {/* ── LAYER 2: Directional ambient particle field ── */}
        <AmbientParticles />

        {/* ── LAYER 2.5: Atmospheric pulse — the cinematic moment ── */}
        <AtmosphericPulse />

        {/* ── LAYER 3: Intelligence panel, embedded in environment ── */}
        <IntelligencePanel />
        <BottomAnchor />
      </motion.div>

      {/* ── LAYER 3.5: Left architectural shadow anchor ── */}
      <LeftArchitecturalAnchor />

      {/* ── LAYER 4: Foreground cinematic depth framing ── */}
      <ForegroundDepth />
    </section>
  );
};
