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
// Asymmetric: bloom originates lower-left where the typographic mass is heaviest.
// This creates natural visual gravity and breaks perfect symmetry.
const Atmosphere = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030303]" />

    {/* Structural fine grid */}
    <div className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.026) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.026) 1px, transparent 1px)',
        backgroundSize: '88px 88px',
      }}
    />

    {/* Coarse structural grid — slightly brighter at intersections */}
    <div className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.048) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.048) 1px, transparent 1px)',
        backgroundSize: '352px 352px',
      }}
    />

    {/* Primary bloom — LOWER LEFT, asymmetric. This is the scene's light source. */}
    <motion.div
      className="absolute"
      style={{
        width: '140vw', height: '130vh',
        left: '-15%', bottom: '-20%',
        background: 'radial-gradient(ellipse at 30% 70%, rgba(255,52,22,0.09) 0%, rgba(255,40,15,0.04) 35%, rgba(255,25,8,0.015) 60%, transparent 75%)',
        filter: 'blur(60px)',
        borderRadius: '50%',
      }}
      animate={{ opacity: [0.75, 1.1, 0.75] }}
      transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Secondary glow — upper center for counter-balance, much dimmer */}
    <motion.div
      className="absolute"
      style={{
        width: '60vw', height: '50vh',
        left: '30%', top: '-5%',
        background: 'radial-gradient(ellipse at center, rgba(255,60,30,0.025) 0%, transparent 65%)',
        filter: 'blur(80px)',
        borderRadius: '50%',
      }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
    />

    {/* Deep asymmetric vignette — heavier on right, lighter where the bloom is */}
    <div className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse 110% 100% at 20% 75%, transparent 25%, rgba(3,3,3,0.75) 80%),
          linear-gradient(to right, transparent 0%, rgba(3,3,3,0.7) 100%)
        `,
      }}
    />

    {/* Foreground depth vignette — thin dark bands at screen edges */}
    <div className="absolute inset-0"
      style={{
        background: 'linear-gradient(to bottom, rgba(3,3,3,0.5) 0%, transparent 12%, transparent 80%, rgba(3,3,3,0.65) 100%)',
      }}
    />

    {/* Barely visible horizontal CRT texture */}
    <div className="absolute inset-0 opacity-[0.014]"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,1) 3px, rgba(0,0,0,1) 4px)' }}
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
// Dark architectural forms at the very front — they silhouette the scene.
// These create a cinematic "window into a space" rather than a flat screen.
const ForegroundDepth = () => (
  <div className="absolute inset-0 z-[25] pointer-events-none">
    {/* Left vertical dark column — feels like a building edge framing the scene */}
    <div
      className="absolute top-0 bottom-0 left-0"
      style={{ width: '6vw', background: 'linear-gradient(to right, rgba(3,3,3,0.88) 0%, rgba(3,3,3,0.4) 60%, transparent 100%)' }}
    />
    {/* Bottom atmospheric fog — ground-level depth */}
    <div
      className="absolute left-0 right-0 bottom-0"
      style={{ height: '18vh', background: 'linear-gradient(to top, rgba(3,3,3,0.75) 0%, transparent 100%)' }}
    />
    {/* Top fade — subtle, prevents harsh viewport edge */}
    <div
      className="absolute left-0 right-0 top-0"
      style={{ height: '10vh', background: 'linear-gradient(to bottom, rgba(3,3,3,0.6) 0%, transparent 100%)' }}
    />
  </div>
);

// ─── Architectural Typography ──────────────────────────────────────────────────
// The true hero. Each word exists at a different opacity level — simulating
// depth and partial illumination from the lower-left bloom. Words extend
// beyond viewport edges, get aggressively cropped, and fade into darkness.
// This IS the composition's emotional mass.
const ArchitecturalTypography = ({ y }: { y: any }) => (
  <motion.div
    className="absolute pointer-events-none select-none z-[2]"
    style={{ top: '-2%', left: '-1%', right: 0, y }}
  >
    <motion.div
      className="font-black text-[#E8E2DF] overflow-hidden"
      style={{
        fontSize: 'clamp(5rem, 17.5vw, 24rem)',
        lineHeight: 0.82,
        letterSpacing: '-0.03em',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
      animate={{ opacity: [1, 1, 1] }} // base container stays constant; per-line varies
    >
      {/* BUILDING — most visible, anchors the composition */}
      <motion.div
        animate={{ opacity: [0.14, 0.21, 0.14] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      >
        BUILDING
      </motion.div>

      {/* SYSTEMS — slightly indented, slightly less bright */}
      <motion.div
        style={{ paddingLeft: '4%' }}
        animate={{ opacity: [0.09, 0.15, 0.09] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        SYSTEMS
      </motion.div>

      {/* THAT FEEL — more indented, begins fading toward darkness */}
      <motion.div
        style={{ paddingLeft: '9%' }}
        animate={{ opacity: [0.055, 0.09, 0.055] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      >
        THAT FEEL
      </motion.div>

      {/* ALIVE. — maximum indent, disappears into the dark right edge */}
      <motion.div
        style={{
          paddingLeft: '16%',
          // Mask: word fades toward the right where the dark vignette is
          WebkitMaskImage: 'linear-gradient(to right, rgba(255,255,255,1) 40%, rgba(255,255,255,0.3) 75%, transparent 95%)',
          maskImage: 'linear-gradient(to right, rgba(255,255,255,1) 40%, rgba(255,255,255,0.3) 75%, transparent 95%)',
        }}
        animate={{ opacity: [0.035, 0.065, 0.035] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      >
        ALIVE.
      </motion.div>
    </motion.div>
  </motion.div>
);

// ─── Intelligence Panel ────────────────────────────────────────────────────────
// Positioned right-of-center, slightly inside the atmosphere. Softer borders,
// blended into the environmental bloom rather than floating above it.
const IntelligencePanel = () => (
  <motion.div
    className="absolute z-[20] hidden md:flex flex-col"
    style={{
      right: '5%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 'clamp(230px, 19vw, 288px)',
    }}
    initial={{ opacity: 0, x: 18 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1.6, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
  >
    <div
      className="relative bg-[#030303]/75 backdrop-blur-2xl"
      style={{
        border: '1px solid rgba(255,255,255,0.042)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.012), 0 40px 100px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.03)',
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

  // Typography parallaxes slower than panels — reinforces depth separation
  const yTypo = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const opacityAll = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 700 }}
    >
      {/* ── LAYER 0: Atmosphere, grids, volumetric asymmetric bloom ── */}
      <Atmosphere />

      <motion.div style={{ opacity: opacityAll }} className="absolute inset-0">
        {/* ── LAYER 1: Architectural background typography (true hero) ── */}
        <ArchitecturalTypography y={yTypo} />

        {/* ── LAYER 2: Directional ambient particle field ── */}
        <AmbientParticles />

        {/* ── LAYER 2.5: Atmospheric pulse — the "moment" ── */}
        <AtmosphericPulse />

        {/* ── LAYER 3: Intelligence panel ── */}
        <IntelligencePanel />
        <BottomAnchor />
      </motion.div>

      {/* ── LAYER 4: Foreground architectural depth (always visible) ── */}
      <ForegroundDepth />
    </section>
  );
};
