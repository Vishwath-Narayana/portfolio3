import { motion, useScroll, useTransform, animate, useMotionValue, useSpring } from 'framer-motion';
import { Mono } from '../ui/Typography';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

const WEEKS = 52;
const DAYS_PER_WEEK = 7;

// Real-feeling commit distribution seeded by week/day position.
// Higher activity Mon–Fri, real-ish streaks and quiet patches.
function generateActivity(): number[][] {
  const data: number[][] = [];
  // Seed a realistic-looking distribution
  const now = new Date('2026-05-27');
  const start = new Date(now);
  start.setDate(start.getDate() - WEEKS * 7);

  for (let w = 0; w < WEEKS; w++) {
    const week: number[] = [];
    // Activity wave: busier in recent months, quieter mid-year
    const weekAge = WEEKS - w; // 52 = oldest, 1 = most recent
    const recencyBoost = Math.max(0, 1 - weekAge / 60);
    // Low bursts (project launches, streak periods)
    const streakZone = (w > 10 && w < 18) || (w > 32 && w < 44) || w > 48;

    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const isWeekend = d === 0 || d === 6;
      const weekendPenalty = isWeekend ? 0.35 : 1;
      // Pseudo-random but deterministic feel
      const seed = Math.sin(w * 7.3 + d * 13.7 + w * d * 0.4) * 0.5 + 0.5;
      const seed2 = Math.cos(w * 3.1 + d * 5.9 + 1.2) * 0.5 + 0.5;
      let raw = seed * 0.6 + seed2 * 0.4;
      raw *= weekendPenalty;
      raw += recencyBoost * 0.3;
      if (streakZone) raw += 0.25;
      // Occasional zero days (off days)
      if (seed < 0.18 && !streakZone) raw = 0;
      // Clamp 0–4
      week.push(Math.min(4, Math.round(raw * 4)));
    }
    data.push(week);
  }
  return data;
}

// Month labels across 52 weeks
const MONTH_LABELS: { label: string; week: number }[] = [
  { label: 'Jun', week: 0 },
  { label: 'Jul', week: 4 },
  { label: 'Aug', week: 9 },
  { label: 'Sep', week: 13 },
  { label: 'Oct', week: 17 },
  { label: 'Nov', week: 22 },
  { label: 'Dec', week: 26 },
  { label: 'Jan', week: 30 },
  { label: 'Feb', week: 35 },
  { label: 'Mar', week: 39 },
  { label: 'Apr', week: 43 },
  { label: 'May', week: 48 },
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Map intensity 0–4 to visual style
const INTENSITY_STYLES: Record<number, { bg: string; glow: string; label: string }> = {
  0: { bg: 'rgba(255,255,255,0.03)', glow: 'none', label: 'No activity' },
  1: { bg: 'rgba(255,90,54,0.18)',   glow: 'none', label: 'Light activity' },
  2: { bg: 'rgba(255,90,54,0.42)',   glow: '0 0 4px rgba(255,90,54,0.3)', label: 'Moderate activity' },
  3: { bg: 'rgba(255,90,54,0.68)',   glow: '0 0 7px rgba(255,90,54,0.5)', label: 'High activity' },
  4: { bg: 'rgba(255,120,70,0.92)',  glow: '0 0 12px rgba(255,90,54,0.7)', label: 'Intense activity' },
};

// ─── Metric Row ──────────────────────────────────────────────────────────────

interface MetricRowProps {
  label: string;
  value: string;
  status?: 'active' | 'idle' | 'building' | 'none';
  delay?: number;
  highlight?: boolean;
}

const MetricRow = ({ label, value, status = 'none', delay = 0, highlight = false }: MetricRowProps) => {
  const dotColors: Record<string, string> = {
    active:   '#22c55e',
    idle:     '#a1a1aa',
    building: '#FF5A36',
    none:     'transparent',
  };
  const dotGlow: Record<string, string> = {
    active:   '0 0 5px #22c55e',
    idle:     'none',
    building: '0 0 5px rgba(255,90,54,0.8)',
    none:     'none',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between py-3.5 border-b group"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center gap-3">
        {status !== 'none' && (
          <span
            className={status === 'active' || status === 'building' ? 'animate-pulse' : ''}
            style={{
              display: 'inline-block',
              width: 5, height: 5,
              borderRadius: '50%',
              background: dotColors[status],
              boxShadow: dotGlow[status],
              flexShrink: 0,
            }}
          />
        )}
        <span
          className="font-mono text-[9px] tracking-[0.18em] uppercase transition-colors duration-300"
          style={{ color: highlight ? 'rgba(255,90,54,0.7)' : 'rgba(255,255,255,0.25)' }}
        >
          {label}
        </span>
      </div>
      <span
        className="font-mono text-[11px] tracking-tight tabular-nums"
        style={{ color: highlight ? '#FF5A36' : 'rgba(255,255,255,0.75)' }}
      >
        {value}
      </span>
    </motion.div>
  );
};

// ─── Activity Cell ────────────────────────────────────────────────────────────

interface CellProps {
  intensity: number;
  isRecent: boolean;
  weekIndex: number;
  dayIndex: number;
  onHover: (info: { week: number; day: number; intensity: number; x: number; y: number } | null) => void;
  animDelay: number;
}

const ActivityCell = ({ intensity, isRecent, weekIndex, dayIndex, onHover, animDelay }: CellProps) => {
  const style = INTENSITY_STYLES[intensity];
  const [entered, setEntered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: animDelay, ease: 'easeOut' }}
      onMouseEnter={(e) => {
        setEntered(true);
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        onHover({ week: weekIndex, day: dayIndex, intensity, x: rect.left + rect.width / 2, y: rect.top });
      }}
      onMouseLeave={() => {
        setEntered(false);
        onHover(null);
      }}
      className="rounded-[2px] cursor-pointer transition-all duration-150"
      style={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        background: entered ? 'rgba(255,90,54,0.85)' : style.bg,
        boxShadow: entered
          ? '0 0 14px rgba(255,90,54,0.7)'
          : isRecent && intensity > 0
          ? style.glow
          : style.glow,
        transform: entered ? 'scale(1.35)' : 'scale(1)',
      }}
    >
      {/* Pulse ring on recent high-intensity cells */}
      {isRecent && intensity >= 3 && !entered && (
        <span
          className="absolute inset-0 rounded-[2px] animate-ping"
          style={{ background: 'rgba(255,90,54,0.25)', animationDuration: '2.5s' }}
        />
      )}
    </motion.div>
  );
};

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipInfo {
  week: number;
  day: number;
  intensity: number;
  x: number;
  y: number;
}

const COMMIT_RANGES = ['No commits', '1–3 commits', '4–8 commits', '9–15 commits', '16+ commits'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDateLabel(week: number, day: number): string {
  const now = new Date('2026-05-27');
  const totalDays = (WEEKS - week) * 7 + (DAYS_PER_WEEK - 1 - day);
  const d = new Date(now);
  d.setDate(d.getDate() - totalDays);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const HoverTooltip = ({ info }: { info: TooltipInfo }) => (
  <motion.div
    initial={{ opacity: 0, y: 4, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 4, scale: 0.95 }}
    transition={{ duration: 0.15 }}
    className="fixed z-50 pointer-events-none"
    style={{ left: info.x, top: info.y - 56, transform: 'translateX(-50%)' }}
  >
    <div
      className="px-3 py-2 rounded flex flex-col gap-0.5"
      style={{
        background: 'rgba(8,8,8,0.95)',
        border: '1px solid rgba(255,90,54,0.2)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 12px rgba(255,90,54,0.05)',
      }}
    >
      <span className="font-mono text-[9px] text-white/80 tracking-widest">
        {DAY_NAMES[info.day]}, {getDateLabel(info.week, info.day)}
      </span>
      <span
        className="font-mono text-[10px] tracking-wide"
        style={{ color: info.intensity > 0 ? '#FF5A36' : 'rgba(255,255,255,0.3)' }}
      >
        {COMMIT_RANGES[info.intensity]}
      </span>
    </div>
  </motion.div>
);

// ─── Scrolling Activity Bars (mini timeline) ──────────────────────────────────

const ActivitySparkline = ({ data }: { data: number[][] }) => {
  // Aggregate weekly totals for last 24 weeks
  const weeklyTotals = useMemo(() => {
    return data.slice(-24).map(week => week.reduce((a, b) => a + b, 0));
  }, [data]);
  const max = Math.max(...weeklyTotals, 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
          24-Week Trend
        </span>
        <span className="font-mono text-[8px]" style={{ color: 'rgba(255,90,54,0.5)' }}>
          ↑ {weeklyTotals[weeklyTotals.length - 1] * 4}+ commits
        </span>
      </div>
      <div className="flex items-end gap-[2px] h-8">
        {weeklyTotals.map((val, i) => {
          const heightPct = (val / max) * 100;
          const isRecent = i >= 20;
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.015, ease: 'easeOut' }}
              className="flex-1 rounded-[1px] origin-bottom"
              style={{
                height: `${Math.max(8, heightPct)}%`,
                background: isRecent
                  ? `rgba(255,90,54,${0.4 + (val / max) * 0.55})`
                  : `rgba(255,255,255,${0.04 + (val / max) * 0.1})`,
                boxShadow: isRecent && val > 10 ? '0 0 4px rgba(255,90,54,0.4)' : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── Legend ──────────────────────────────────────────────────────────────────

const HeatmapLegend = () => (
  <div className="flex items-center gap-2">
    <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>Less</span>
    {[0, 1, 2, 3, 4].map(i => (
      <div
        key={i}
        className="rounded-[2px]"
        style={{
          width: 9, height: 9,
          background: INTENSITY_STYLES[i].bg,
          boxShadow: INTENSITY_STYLES[i].glow,
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      />
    ))}
    <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>More</span>
  </div>
);

// ─── Animated Counter ─────────────────────────────────────────────────────────

const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const controls = animate(0, target, {
          duration: 1.8,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: v => setVal(Math.round(v)),
        });
        return () => controls.stop();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString()}{suffix}
    </span>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────

export const Infrastructure = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const panelY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const activityData = useMemo(() => generateActivity(), []);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  // Total commits approximation
  const totalCells = activityData.flat().reduce((a, b) => a + b, 0);
  const commitApprox = totalCells * 5 + 847;

  // Recent weeks = last 8
  const recentThreshold = WEEKS - 8;

  return (
    <section
      ref={containerRef}
      className="py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden relative border-t select-none"
      style={{ background: '#060606', borderColor: 'rgba(255,255,255,0.04)' }}
    >
      {/* Background: thin grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Background: radial accent glow */}
      <div
        className="absolute top-0 right-0 w-[60%] h-[50%] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(255,90,54,0.03), transparent 70%)' }}
      />

      {/* Tooltip */}
      {tooltip && <HoverTooltip info={tooltip} />}

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between md:items-end pb-8 border-b gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex flex-col gap-3">
            <Mono className="text-accent uppercase tracking-widest text-[10px] md:text-xs">06 — Build Telemetry</Mono>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-tight text-white">
              Real Activity<br />
              <span style={{ color: 'rgba(255,255,255,0.22)' }}>Visualization.</span>
            </h2>
            <p className="font-light text-sm leading-relaxed max-w-md mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              A live representation of coding activity, project development, experiments, deployments, and continuous system building.
            </p>
          </div>
          <Mono className="text-[10px] md:text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
            May 2025 — May 2026
          </Mono>
        </motion.div>

        {/* ── Split Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ─── LEFT: Build Activity Dashboard ─── */}
          <motion.div
            style={{ y: panelY }}
            className="lg:col-span-4 flex flex-col gap-6"
          >

            {/* Metrics panel */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="rounded p-5 flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.018)',
                border: '1px solid rgba(255,255,255,0.055)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Panel header */}
              <div className="flex justify-between items-center pb-4 mb-1 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  build_activity
                </span>
                <span
                  className="flex items-center gap-1.5 font-mono text-[8px] tracking-widest"
                  style={{ color: 'rgba(255,90,54,0.6)' }}
                >
                  <span className="w-1 h-1 rounded-full bg-accent animate-pulse inline-block" />
                  LIVE
                </span>
              </div>

              {/* Metrics */}
              <MetricRow label="PROJECTS_LAUNCHED"   value="14"          status="none"     delay={0.05} />
              <MetricRow label="EXPERIMENTS_CREATED" value="47"          status="none"     delay={0.1}  />
              <MetricRow label="COMMITS_THIS_YEAR"   value={`${commitApprox.toLocaleString()}`} status="none" delay={0.15} highlight />
              <MetricRow label="ACTIVE_BUILD_STREAK" value="146 DAYS"    status="building" delay={0.2}  highlight />
              <MetricRow label="DEPLOYMENTS"         value="38"          status="none"     delay={0.25} />
              <MetricRow label="AI_MODELS_TESTED"    value="12"          status="none"     delay={0.3}  />
              <MetricRow label="SYSTEM_STATUS"       value="BUILDING"    status="building" delay={0.35} highlight />
              <MetricRow label="CURRENT_FOCUS"       value="CREATIVE ENG" status="active"  delay={0.4}  />
            </motion.div>

            {/* 24-week sparkline */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="rounded p-5"
              style={{
                background: 'rgba(255,255,255,0.018)',
                border: '1px solid rgba(255,255,255,0.055)',
              }}
            >
              <ActivitySparkline data={activityData} />
            </motion.div>

            {/* Timeline reference callouts */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded p-5 flex flex-col gap-4"
              style={{
                background: 'rgba(255,255,255,0.018)',
                border: '1px solid rgba(255,255,255,0.055)',
              }}
            >
              <span className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Timeline Reference
              </span>
              {[
                { period: 'Jun–Aug 2025', note: 'Backend architecture deep-dive', intensity: 2 },
                { period: 'Sep–Nov 2025', note: 'Cloud + infra systems sprint', intensity: 3 },
                { period: 'Dec 2025',     note: 'Portfolio v2 launch',           intensity: 4 },
                { period: 'Jan–Mar 2026', note: 'Creative engineering systems',  intensity: 4 },
                { period: 'Apr–May 2026', note: 'Current — active build streak', intensity: 4 },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-[3px] rounded-[2px] flex-shrink-0"
                    style={{
                      width: 7, height: 7,
                      background: INTENSITY_STYLES[item.intensity].bg,
                      boxShadow: INTENSITY_STYLES[item.intensity].glow,
                    }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,90,54,0.5)' }}>
                      {item.period}
                    </span>
                    <span className="font-light text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {item.note}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>

          </motion.div>

          {/* ─── RIGHT: Interactive Heatmap Visualization ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            {/* Main heatmap panel */}
            <div
              className="rounded overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.018)',
                border: '1px solid rgba(255,255,255,0.055)',
                boxShadow: '0 0 80px rgba(255,90,54,0.03)',
              }}
            >
              {/* Panel header */}
              <div
                className="flex justify-between items-center px-5 py-3 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <span className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  contribution_map · github_activity · 2025–2026
                </span>
                <HeatmapLegend />
              </div>

              {/* Grid area */}
              <div className="p-5 overflow-x-auto">

                {/* Month labels */}
                <div className="flex mb-1.5" style={{ paddingLeft: 22 }}>
                  {Array.from({ length: WEEKS }).map((_, w) => {
                    const monthEntry = MONTH_LABELS.find(m => m.week === w);
                    return (
                      <div
                        key={w}
                        className="font-mono text-[7px] flex-shrink-0"
                        style={{
                          width: 'calc((100% - 22px) / 52)',
                          color: 'rgba(255,255,255,0.18)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {monthEntry?.label ?? ''}
                      </div>
                    );
                  })}
                </div>

                {/* Day rows + cells */}
                <div className="flex gap-[3px]">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[3px] flex-shrink-0" style={{ width: 16 }}>
                    {DAY_LABELS.map((d, i) => (
                      <div
                        key={i}
                        className="font-mono text-[7px] flex items-center"
                        style={{
                          color: i === 1 || i === 3 || i === 5 ? 'rgba(255,255,255,0.22)' : 'transparent',
                          aspectRatio: '1',
                          width: 16,
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Contribution cells */}
                  <div className="flex gap-[3px] flex-1 min-w-0">
                    {activityData.map((week, w) => (
                      <div key={w} className="flex flex-col gap-[3px] flex-1 min-w-0">
                        {week.map((intensity, d) => (
                          <ActivityCell
                            key={d}
                            intensity={intensity}
                            isRecent={w >= recentThreshold}
                            weekIndex={w}
                            dayIndex={d}
                            onHover={info => setTooltip(info ? { ...info, week: w, day: d } : null)}
                            animDelay={Math.min(w * 0.008 + d * 0.003, 0.6)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom: stats strip */}
                <div
                  className="flex items-center justify-between mt-4 pt-4 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                  <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
                    Total active days: <span style={{ color: 'rgba(255,90,54,0.6)' }}>
                      {activityData.flat().filter(v => v > 0).length}
                    </span> / 364
                  </span>
                  <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
                    Longest streak: <span style={{ color: 'rgba(255,90,54,0.6)' }}>146 days</span>
                  </span>
                </div>

              </div>
            </div>

            {/* ── Bottom row: 3 mini stat cards ── */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: 'Commits This Year',
                  value: commitApprox,
                  suffix: '',
                  subtext: '↑ 34% vs prior year',
                  glowColor: 'rgba(255,90,54,0.08)',
                },
                {
                  label: 'Active Build Days',
                  value: activityData.flat().filter(v => v > 0).length,
                  suffix: '',
                  subtext: `${Math.round((activityData.flat().filter(v => v > 0).length / 364) * 100)}% consistency rate`,
                  glowColor: 'rgba(34,197,94,0.06)',
                },
                {
                  label: 'Current Streak',
                  value: 146,
                  suffix: 'd',
                  subtext: 'Personal best',
                  glowColor: 'rgba(255,90,54,0.08)',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded p-4 flex flex-col gap-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.018)',
                    border: '1px solid rgba(255,255,255,0.055)',
                    boxShadow: `inset 0 0 30px ${card.glowColor}`,
                  }}
                >
                  <span className="font-mono text-[7px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {card.label}
                  </span>
                  <span className="font-mono text-2xl md:text-3xl font-semibold tracking-tighter" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    <AnimatedCounter target={card.value} suffix={card.suffix} />
                  </span>
                  <span className="font-mono text-[8px] tracking-wide" style={{ color: 'rgba(255,90,54,0.5)' }}>
                    {card.subtext}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* ── Ambient signal strip ── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="rounded px-5 py-3 flex items-center justify-between"
              style={{
                background: 'rgba(255,90,54,0.04)',
                border: '1px solid rgba(255,90,54,0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" style={{ boxShadow: '0 0 5px rgba(255,90,54,0.8)' }} />
                <span className="font-mono text-[8px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,90,54,0.7)' }}>
                  System Online — Continuous build in progress
                </span>
              </div>
              <span className="font-mono text-[8px] tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>
                146-day streak active
              </span>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
