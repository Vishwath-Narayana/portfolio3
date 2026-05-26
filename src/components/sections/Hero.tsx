import { motion, useScroll, useTransform } from 'framer-motion';
import { Mono, Body } from '../ui/Typography';
import { useRef, useEffect, useState } from 'react';

// ─── LAYER 0: Deep Atmosphere ────────────────────────────────────────────────
const Atmosphere = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Base darkness */}
    <div className="absolute inset-0 bg-[#020202]" />

    {/* Volumetric red bloom — centered, radiates outward */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full"
      style={{ background: 'radial-gradient(ellipse at center, rgba(255,70,40,0.07) 0%, rgba(255,70,40,0.02) 40%, transparent 70%)' }} />

    {/* Deep corner vignettes */}
    <div className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,2,2,0.85) 100%)' }} />

    {/* Fine grid — deepest layer */}
    <div className="absolute inset-0 opacity-[0.025]"
      style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

    {/* Coarser grid overlay */}
    <div className="absolute inset-0 opacity-[0.04]"
      style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '320px 320px' }} />

    {/* Horizontal scanlines */}
    <div className="absolute inset-0 opacity-[0.025]"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.8) 3px, rgba(0,0,0,0.8) 4px)' }} />
  </div>
);

// ─── LAYER 1: Background Typography ─────────────────────────────────────────
const BackgroundTypography = ({ yParallax }: { yParallax: any }) => (
  <motion.div
    className="absolute z-[2] pointer-events-none select-none overflow-hidden"
    style={{ top: '8%', left: '-3%', width: '68%', y: yParallax }}
  >
    <motion.div
      animate={{ opacity: [0.055, 0.1, 0.055] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      className="font-sans font-black leading-[0.78] tracking-tighter text-[#D8D8D8]"
      style={{ fontSize: 'clamp(4rem, 16vw, 22rem)' }}
    >
      <div>BUILDING</div>
      <div style={{ marginLeft: '6%' }}>SYSTEMS</div>
      <div style={{ marginLeft: '12%' }}>THAT FEEL</div>
      <div style={{ marginLeft: '20%' }}>ALIVE.</div>
    </motion.div>
  </motion.div>
);

// ─── LAYER 2: Orbital Infrastructure Core ────────────────────────────────────
const InfrastructureCore = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let raf: number;
    let start = performance.now();
    const loop = (now: number) => {
      setTick((now - start) / 1000); // seconds elapsed
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Orbit helper: returns [x, y] for a point on an ellipse at time t
  const orbit = (rx: number, ry: number, period: number, phase = 0, t = tick) => {
    const angle = (t / period) * Math.PI * 2 + phase;
    return [Math.cos(angle) * rx, Math.sin(angle) * ry];
  };

  const SIZE = 560;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  // Node positions
  const [n1x, n1y] = orbit(190, 60, 80, 0);
  const [n2x, n2y] = orbit(190, 60, 80, Math.PI);
  const [n3x, n3y] = orbit(100, 130, 55, 1.2);
  const [n4x, n4y] = orbit(100, 130, 55, 1.2 + Math.PI);
  const [p1x, p1y] = orbit(240, 90, 120, 0.5);
  const [p2x, p2y] = orbit(240, 90, 120, 0.5 + Math.PI * 0.6);
  const [p3x, p3y] = orbit(160, 60, 65, 2.5);

  // Radar sweep angle
  const sweepAngle = ((tick % 6) / 6) * 360;

  return (
    <div
      className="absolute z-[10] pointer-events-none"
      style={{ width: SIZE, height: SIZE, left: '50%', top: '50%', transform: 'translate(-45%, -50%)' }}
    >
      {/* Volumetric glow behind SVG */}
      <div className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,70,40,0.12) 0%, rgba(255,70,40,0.04) 40%, transparent 70%)', transform: 'scale(1.4)' }} />

      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0">
        <defs>
          {/* Radar sweep gradient */}
          <radialGradient id="sweep-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,70,40,0.0)" />
            <stop offset="80%" stopColor="rgba(255,70,40,0.0)" />
            <stop offset="100%" stopColor="rgba(255,70,40,0.08)" />
          </radialGradient>
          <clipPath id="core-clip">
            <circle cx={CX} cy={CY} r={240} />
          </clipPath>
          {/* Node glow filter */}
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Outermost reference ring ── */}
        <circle cx={CX} cy={CY} r={240} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={238} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

        {/* ── Structural rings ── */}
        <circle cx={CX} cy={CY} r={200} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="4 12" />
        <circle cx={CX} cy={CY} r={170} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={130} fill="none" stroke="rgba(255,70,40,0.12)" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={90}  fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 8" />
        <circle cx={CX} cy={CY} r={50}  fill="none" stroke="rgba(255,70,40,0.15)" strokeWidth="1" />

        {/* ── Outer orbit path (elliptical) ── */}
        <ellipse cx={CX} cy={CY} rx={190} ry={60} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        {/* ── Inner orbit path ── */}
        <ellipse cx={CX} cy={CY} rx={100} ry={130} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

        {/* ── Radar sweep sector ── */}
        <g clipPath="url(#core-clip)">
          <path
            d={`M ${CX} ${CY} L ${CX + 240 * Math.cos((sweepAngle - 90) * Math.PI / 180)} ${CY + 240 * Math.sin((sweepAngle - 90) * Math.PI / 180)} A 240 240 0 0 1 ${CX + 240 * Math.cos((sweepAngle - 60) * Math.PI / 180)} ${CY + 240 * Math.sin((sweepAngle - 60) * Math.PI / 180)} Z`}
            fill="rgba(255,70,40,0.04)"
          />
          {/* Sweep leading edge */}
          <line
            x1={CX} y1={CY}
            x2={CX + 240 * Math.cos((sweepAngle - 90) * Math.PI / 180)}
            y2={CY + 240 * Math.sin((sweepAngle - 90) * Math.PI / 180)}
            stroke="rgba(255,70,40,0.3)" strokeWidth="0.5"
          />
        </g>

        {/* ── Telemetry axis lines ── */}
        <line x1={CX - 240} y1={CY} x2={CX + 240} y2={CY} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <line x1={CX} y1={CY - 240} x2={CX} y2={CY + 240} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <line x1={CX - 170} y1={CY - 170} x2={CX + 170} y2={CY + 170} stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
        <line x1={CX + 170} y1={CY - 170} x2={CX - 170} y2={CY + 170} stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />

        {/* ── Orbital nodes ── */}
        {/* Primary fast-orbit nodes */}
        <circle cx={CX + n1x} cy={CY + n1y} r={4} fill="rgba(255,70,40,0.9)" filter="url(#node-glow)" />
        <circle cx={CX + n2x} cy={CY + n2y} r={3} fill="rgba(255,70,40,0.7)" filter="url(#node-glow)" />
        {/* Secondary orbit nodes */}
        <circle cx={CX + n3x} cy={CY + n3y} r={2.5} fill="rgba(255,255,255,0.6)" filter="url(#node-glow)" />
        <circle cx={CX + n4x} cy={CY + n4y} r={2} fill="rgba(255,255,255,0.4)" filter="url(#node-glow)" />
        {/* Outer particles */}
        <circle cx={CX + p1x} cy={CY + p1y} r={1.5} fill="rgba(255,255,255,0.35)" />
        <circle cx={CX + p2x} cy={CY + p2y} r={1.5} fill="rgba(255,255,255,0.35)" />
        <circle cx={CX + p3x} cy={CY + p3y} r={1.5} fill="rgba(255,70,40,0.5)" />

        {/* ── Telemetry lines from orbiting nodes to center ── */}
        <line x1={CX + n1x} y1={CY + n1y} x2={CX} y2={CY} stroke="rgba(255,70,40,0.15)" strokeWidth="0.5" strokeDasharray="4 6" />
        <line x1={CX + n3x} y1={CY + n3y} x2={CX} y2={CY} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />

        {/* ── Node cross-link telemetry arcs ── */}
        <path
          d={`M ${CX + n1x} ${CY + n1y} Q ${CX} ${CY - 80} ${CX + n3x} ${CY + n3y}`}
          fill="none" stroke="rgba(255,70,40,0.08)" strokeWidth="0.5"
        />

        {/* ── Central nucleus ── */}
        <circle cx={CX} cy={CY} r={14} fill="rgba(2,2,2,1)" stroke="rgba(255,70,40,0.5)" strokeWidth="1" filter="url(#core-glow)" />
        <circle cx={CX} cy={CY} r={8} fill="rgba(255,80,50,0.9)" filter="url(#core-glow)" />
        <circle cx={CX} cy={CY} r={4} fill="white" />
      </svg>

      {/* Outer atmospheric haze ring */}
      <div className="absolute rounded-full border border-white/[0.03]"
        style={{ inset: '-20px' }} />
    </div>
  );
};

// ─── LAYER 3 (FG): Right Intelligence Panel ──────────────────────────────────
const IntelligencePanel = () => (
  <motion.div
    className="absolute z-[20] flex flex-col"
    style={{ right: '4%', top: '50%', transform: 'translateY(-50%)', width: 'clamp(260px, 22vw, 320px)' }}
    initial={{ opacity: 0, x: 24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1.2, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {/* Panel body */}
    <div className="relative border border-white/[0.06] bg-[#040404]/80 backdrop-blur-xl"
      style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5)' }}>
      
      {/* Top header bar */}
      <div className="border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-accent"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }} />
          <span className="font-mono text-[9px] text-primary-500 uppercase tracking-widest">SYS.INTEL // ACTIVE</span>
        </div>
        <span className="font-mono text-[8px] text-primary-700">v4.2.1</span>
      </div>

      {/* Philosophy content */}
      <div className="px-5 py-5">
        <Body className="text-primary-200 text-[13px] leading-relaxed font-light max-w-none">
          Multidisciplinary technologist bridging deep infrastructure and cinematic digital interfaces.
        </Body>
      </div>

      {/* Separator */}
      <div className="mx-5 border-t border-dashed border-white/[0.05]" />

      {/* Daemon list */}
      <div className="px-5 py-4 flex flex-col gap-1">
        <Mono className="text-[8px] text-primary-700 mb-3 block">ACTIVE_DAEMONS</Mono>
        {[
          { id: '0x01', label: 'Architectural UI/UX', status: 'RUN' },
          { id: '0x02', label: 'Frontend & Motion Physics', status: 'RUN' },
          { id: '0x03', label: 'Resilient Infrastructure', status: 'RUN' },
          { id: '0x04', label: 'Creative Engineering', status: 'IDLE' },
        ].map(d => (
          <div key={d.id} className="flex items-center justify-between py-1.5 group border-b border-white/[0.03] last:border-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[8px] text-primary-700 group-hover:text-primary-400 transition-colors">{d.id}</span>
              <span className="text-[12px] text-primary-300 group-hover:text-white transition-colors font-light">{d.label}</span>
            </div>
            <span className={`font-mono text-[8px] uppercase ${d.status === 'RUN' ? 'text-green-500/70' : 'text-primary-600'}`}>{d.status}</span>
          </div>
        ))}
      </div>

      {/* Bottom stats bar */}
      <div className="border-t border-white/[0.06] px-5 py-3 grid grid-cols-3 gap-4">
        {[
          { label: 'LATENCY', value: '12MS' },
          { label: 'UPTIME', value: '99.9%' },
          { label: 'REGION', value: 'EU-W' },
        ].map(stat => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-mono text-[7px] text-primary-700 uppercase">{stat.label}</span>
            <span className="font-mono text-[10px] text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Accent corner bracket */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent/30" />
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent/20" />
    </div>
  </motion.div>
);

// ─── LAYER 3 (FG): Orchestration Node ────────────────────────────────────────
const OrchestrationNode = () => (
  <motion.div
    className="absolute z-[20] hidden lg:flex flex-col gap-3"
    style={{ left: '4%', top: '18%' }}
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1.4, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="border border-white/[0.06] bg-[#040404]/60 backdrop-blur-sm px-4 py-3 w-56">
      <div className="flex items-center gap-2 mb-3 border-b border-white/[0.05] pb-2">
        <motion.div className="w-1 h-1 bg-accent rounded-full"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }} />
        <span className="font-mono text-[8px] text-primary-500 uppercase tracking-widest">Orchestration</span>
      </div>
      {[
        { key: 'GLOBAL_STATE', val: 'SYNC', accent: false },
        { key: 'EDGE_NODES', val: '24 ACTIVE', accent: false },
        { key: 'MESH_LAT', val: '12MS', accent: true },
        { key: 'INGRESS', val: '4.2GB/S', accent: false },
      ].map(r => (
        <div key={r.key} className="flex justify-between items-center py-1">
          <span className="font-mono text-[8px] text-primary-600">{r.key}</span>
          <span className={`font-mono text-[8px] ${r.accent ? 'text-accent' : 'text-primary-300'}`}>{r.val}</span>
        </div>
      ))}
      {/* Horizontal connector to core */}
      <div className="absolute top-1/2 -right-[6vw] h-px w-[6vw] bg-gradient-to-r from-white/[0.06] to-transparent" />
    </div>
  </motion.div>
);

// ─── LAYER 3 (FG): Top-Right Telemetry ───────────────────────────────────────
const TelemetryStrip = () => (
  <motion.div
    className="absolute z-[20] hidden md:flex flex-col gap-1 text-right"
    style={{ right: '4%', top: '18%' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.6, duration: 1.4 }}
  >
    <div className="font-mono text-[8px] text-primary-700 uppercase tracking-widest mb-2 border-b border-white/[0.04] pb-1">
      TELEMETRY_STREAM
    </div>
    {[
      ['ENV', 'PRODUCTION'],
      ['NETWORK_RX', '94.23 MB/S'],
      ['CPU_ALLOC', '62%'],
      ['MEM_LIMIT', '4.0 GB'],
    ].map(([k, v]) => (
      <div key={k} className="flex gap-4 justify-end font-mono text-[8px]">
        <span className="text-primary-700">{k}</span>
        <span className="text-primary-400 w-20 text-right">{v}</span>
      </div>
    ))}
  </motion.div>
);

// ─── LAYER 3 (FG): Bottom Metrics ────────────────────────────────────────────
const BottomMetrics = () => (
  <div className="absolute z-[20] bottom-8 left-0 right-0 flex justify-between items-end px-[4%] pointer-events-none select-none">
    {/* Year watermark — sits in foreground, overlapping bg typography */}
    <motion.div
      className="font-black leading-none tracking-tighter text-white/[0.05] mix-blend-screen"
      style={{ fontSize: 'clamp(5rem, 12vw, 14rem)' }}
      animate={{ opacity: [0.04, 0.07, 0.04] }}
      transition={{ duration: 20, repeat: Infinity }}
    >
      2026
    </motion.div>
    <div className="flex flex-col gap-1 text-right font-mono text-[8px] text-primary-700 uppercase pb-2">
      <span>MEM_ALLOC: <span className="text-primary-500">4096MB</span></span>
      <span>SWAP: <span className="text-primary-500">0%</span></span>
      <span>PID: <span className="text-primary-500">0x2E4A</span></span>
    </div>
  </div>
);

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const opacityAll = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleMid = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 700 }}
    >
      {/* ── LAYER 0: Deep atmosphere ── */}
      <Atmosphere />

      <motion.div style={{ opacity: opacityAll }} className="absolute inset-0">
        {/* ── LAYER 1: Background typography (parallax, behind everything) ── */}
        <BackgroundTypography yParallax={yBg} />

        {/* ── LAYER 2: Midground orbital core ── */}
        <motion.div style={{ scale: scaleMid }} className="absolute inset-0">
          <InfrastructureCore />
        </motion.div>

        {/* ── LAYER 3: Foreground UI panels & overlays ── */}
        <OrchestrationNode />
        <TelemetryStrip />
        <IntelligencePanel />
        <BottomMetrics />
      </motion.div>
    </section>
  );
};
