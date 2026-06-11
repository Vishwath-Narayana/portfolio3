import { motion, animate } from 'framer-motion';
import { Mono, Heading } from '../ui/Typography';
import { useRef, useEffect, useState, useMemo, memo } from 'react';

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
  2: { bg: 'rgba(255,90,54,0.42)',   glow: 'none', label: 'Moderate activity' },
  3: { bg: 'rgba(255,90,54,0.68)',   glow: 'none', label: 'High activity' },
  4: { bg: 'rgba(255,120,70,0.92)',  glow: '0 0 8px rgba(255,90,54,0.4)', label: 'Intense activity' },
};

// ─── Metric Row ──────────────────────────────────────────────────────────────

interface MetricRowProps {
  label: string;
  value: string;
  status?: 'active' | 'idle' | 'building' | 'none';
  delay?: number;
  highlight?: boolean;
}

const MetricRow = memo(({ label, value, status = 'none', delay = 0, highlight = false }: MetricRowProps) => {
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
      className="flex items-center justify-between py-3 border-b group"
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
});
MetricRow.displayName = 'MetricRow';

// ─── Activity Cell ────────────────────────────────────────────────────────────

interface CellProps {
  intensity: number;
  isRecent: boolean;
  weekIndex: number;
  dayIndex: number;
  onHover: (info: TooltipInfo | null) => void;
}

const ActivityCell = memo(({ intensity, isRecent, weekIndex, dayIndex, onHover }: CellProps) => {
  const style = INTENSITY_STYLES[intensity];
  const isNow = weekIndex === WEEKS - 1;

  return (
    <div
      onMouseEnter={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        onHover({ week: weekIndex, day: dayIndex, intensity, x: rect.left + rect.width / 2, y: rect.top });
      }}
      onMouseLeave={() => {
        onHover(null);
      }}
      className="rounded-[2px] cursor-pointer transition-all duration-150 hover:scale-125 hover:!bg-[#FF7850] hover:!shadow-[0_0_12px_rgba(255,90,54,0.7)] hover:z-20 relative"
      style={{
        width: '100%',
        paddingBottom: '100%',
        background: style.bg,
        boxShadow: style.glow,
        outline: isNow && dayIndex === 0 ? '1px solid rgba(255,90,54,0.35)' : 'none',
        outlineOffset: '1px',
      }}
    >
      {/* Pulse ring on recent high-intensity cells */}
      {isRecent && intensity >= 3 && (
        <span
          className="absolute inset-0 rounded-[2px] animate-pulse"
          style={{ background: 'rgba(255,90,54,0.18)', animationDuration: '3s' }}
        />
      )}
    </div>
  );
});
ActivityCell.displayName = 'ActivityCell';

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

const ActivitySparkline = memo(({ data }: { data: number[][] }) => {
  // Aggregate weekly totals for last 24 weeks
  const weeklyTotals = useMemo(() => {
    return data.slice(-24).map(week => week.reduce((a, b) => a + b, 0));
  }, [data]);
  const max = Math.max(...weeklyTotals, 1);

  return (
    <div className="flex flex-col gap-2 pt-1 pb-1">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
          24-Week Trend
        </span>
        <span className="font-mono text-[8px]" style={{ color: 'rgba(255,90,54,0.5)' }}>
          ↑ {weeklyTotals[weeklyTotals.length - 1] * 4}+ commits
        </span>
      </div>
      <div className="flex items-end gap-[2px] h-8 mt-1">
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
});
ActivitySparkline.displayName = 'ActivitySparkline';

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
  // Parallax removed for scroll performance

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

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
      className="py-24 md:py-36 px-6 md:px-12 lg:px-24 overflow-hidden relative border-t select-none"
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

        {/* Standard Section Header */}
        <motion.div
          className="mb-16 md:mb-24 flex flex-col border-b border-white/5 pb-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Mono className="text-accent text-sm md:text-base font-semibold">04 — BUILD TELEMETRY</Mono>
          <div className="h-[1px] w-8 md:w-16 bg-white/10" />
          <Heading className="text-3xl md:text-4xl lg:text-5xl tracking-tighter uppercase text-white/90 mt-2">
            Real Activity Visualization
          </Heading>
          <p className="max-w-2xl text-white/40 font-light text-base md:text-lg leading-relaxed mt-2">
            A live representation of coding activity, project development, experiments, deployments, and continuous system building.
          </p>
        </motion.div>

        {/* ── Split Layout: Unified Telemetry System ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="mt-8 md:mt-12 flex flex-col rounded bg-white/[0.012] border border-white/[0.05] overflow-hidden relative shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
        >
          {/* Shared top scanning line indicator */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-accent/10 via-accent/40 to-accent/10 opacity-60" />

          {/* Unified Core Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

            {/* ─── LEFT: Build Activity Panel ─── */}
            <div className="lg:col-span-4 flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.02] bg-black/20">

              {/* Metrics panel */}
              <div className="p-5 flex flex-col relative z-10 border-b border-white/[0.02] bg-white/[0.005]">
              <div className="flex justify-between items-center pb-4 mb-1 border-b border-white/[0.04]">
                <span className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  system_status_&_activity
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-widest text-accent/70">
                  <span className="w-1 h-1 rounded-full bg-accent animate-pulse inline-block" />
                  LIVE
                </span>
              </div>
              <MetricRow label="PROJECTS_LAUNCHED"   value="14"          status="none"     delay={0.05} />
              <MetricRow label="EXPERIMENTS_CREATED" value="47"          status="none"     delay={0.1}  />
              <MetricRow label="COMMITS_THIS_YEAR"   value={`${commitApprox.toLocaleString()}`} status="none" delay={0.15} highlight />
              <MetricRow label="ACTIVE_BUILD_STREAK" value="146 DAYS"    status="building" delay={0.2}  highlight />
              <MetricRow label="DEPLOYMENTS"         value="38"          status="none"     delay={0.25} />
              <MetricRow label="AI_MODELS_TESTED"    value="12"          status="none"     delay={0.3}  />
              <MetricRow label="SYSTEM_STATUS"       value="BUILDING"    status="building" delay={0.35} highlight />
              <MetricRow label="CURRENT_FOCUS"       value="DATA ENGINEERING" status="active"  delay={0.4}  />
            </div>

            {/* 24-week sparkline */}
            <div className="p-5 border-b border-white/[0.03]">
              <ActivitySparkline data={activityData} />
            </div>

            {/* Timeline reference callouts */}
            <div className="p-5 flex flex-col gap-4 bg-white/[0.005] flex-grow">
              <span className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Timeline Reference
              </span>
              {[
                { period: 'Jun–Aug 2025', note: 'Backend architecture deep-dive', intensity: 2 },
                { period: 'Sep–Nov 2025', note: 'Cloud + infra systems sprint', intensity: 3 },
                { period: 'Dec 2025',     note: 'Portfolio v2 launch',           intensity: 4 },
                { period: 'Jan–Mar 2026', note: 'Data engineering systems',  intensity: 4 },
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
            </div>

            </div>

            {/* ─── RIGHT: Main Telemetry Wall ─── */}
            <div className="lg:col-span-8 flex flex-col bg-black/10">

              {/* Heatmap Panel */}
              <div className="flex flex-col relative z-10 border-b border-white/[0.02] bg-white/[0.005]">
                <div className="flex justify-between items-center px-5 py-4 border-b border-white/[0.02]">
                <span className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  contribution_map · github_activity · 2025–2026
                </span>
                <HeatmapLegend />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`p-5 overflow-x-auto ${isScrolling ? 'pointer-events-none' : ''}`}
              >
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
                      <div
                        key={w}
                        className="flex flex-col gap-[3px] flex-1 min-w-0 relative"
                        style={{
                          borderLeft: w === WEEKS - 1 ? '1px solid rgba(255,90,54,0.25)' : 'none',
                          paddingLeft: w === WEEKS - 1 ? 2 : 0,
                        }}
                      >
                        {week.map((intensity, d) => (
                          <ActivityCell
                            key={d}
                            intensity={intensity}
                            isRecent={w >= recentThreshold}
                            weekIndex={w}
                            dayIndex={d}
                            onHover={setTooltip}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom: stats strip */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.04]">
                  <span className="font-mono text-[8px] tracking-widest uppercase text-white/15">
                    Total active days: <span className="text-accent/60">{activityData.flat().filter(v => v > 0).length}</span> / 364
                  </span>
                  <span className="font-mono text-[8px] tracking-widest uppercase text-white/15">
                    Longest streak: <span className="text-accent/60">146 days</span>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── Mini Stat Cards Row ── */}
            {/* Removed outer borders, converted to a grid row separated by vertical dividers */}
            <div className="grid grid-cols-3 border-b border-white/[0.04] bg-black/20">
              {[
                { label: 'Commits This Year', value: commitApprox, suffix: '', subtext: '↑ 34% vs prior year', color: 'text-accent/50' },
                { label: 'Active Build Days', value: activityData.flat().filter(v => v > 0).length, suffix: '', subtext: `${Math.round((activityData.flat().filter(v => v > 0).length / 364) * 100)}% consistency rate`, color: 'text-green-500/50' },
                { label: 'Current Streak', value: 146, suffix: 'd', subtext: 'Personal best', color: 'text-accent/50' },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`p-5 flex flex-col gap-1.5 relative ${i < 2 ? 'border-r border-white/[0.04]' : ''}`}
                >
                  <span className="font-mono text-[7px] tracking-[0.18em] uppercase text-white/20">{card.label}</span>
                  <span className="font-mono text-2xl md:text-3xl font-semibold tracking-tighter text-white/90">
                    <AnimatedCounter target={card.value} suffix={card.suffix} />
                  </span>
                  <span className={`font-mono text-[8px] tracking-wide ${card.color}`}>{card.subtext}</span>
                  {/* Subtle inner glow to mimic active state */}
                  <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 40px ${card.color.includes('green') ? 'rgba(34,197,94,0.02)' : 'rgba(255,90,54,0.02)'}` }} />
                </div>
              ))}
            </div>

            {/* ── Ambient Signal Strip & Engineering Momentum ── */}
            <div className="flex flex-col p-5 bg-white/[0.008] flex-grow">
              {/* Signal Strip Header */}
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block shadow-[0_0_5px_rgba(255,90,54,0.8)]" />
                  <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-accent/70">
                    System Online — Continuous build in progress
                  </span>
                </div>
                <span className="font-mono text-[8px] tracking-widest text-white/15">
                  146-day streak active
                </span>
              </div>

              {/* Animated Waveform Graph (increased height to prevent cropping, organic motion) */}
              <div className={`relative w-full h-36 overflow-hidden mb-4 rounded border border-white/[0.03] bg-black/40 transition-opacity duration-300 ${isScrolling ? 'opacity-40' : 'opacity-100'}`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10%_25%] pointer-events-none" />
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 80">
                  <defs>
                    <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,90,54,0.3)" />
                      <stop offset="100%" stopColor="rgba(255,90,54,0)" />
                    </linearGradient>
                  </defs>

                  {/* Background filled wave */}
                  <motion.path
                    fill="url(#wave-grad)"
                    d="M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30 L 200 80 L 0 80 Z"
                    initial={{ d: "M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30 L 200 80 L 0 80 Z" }}
                    animate={{
                      d: [
                        "M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30 L 200 80 L 0 80 Z",
                        "M 0 45 Q 20 50 40 30 T 80 50 T 120 35 T 160 25 T 200 40 L 200 80 L 0 80 Z",
                        "M 0 35 Q 20 30 40 45 T 80 20 T 120 45 T 160 30 T 200 50 L 200 80 L 0 80 Z",
                        "M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30 L 200 80 L 0 80 Z"
                      ]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ opacity: 0.6 }}
                  />
                  
                  {/* Primary wave stroke */}
                  <motion.path
                    fill="none"
                    stroke="rgba(255,90,54,0.5)"
                    strokeWidth="0.75"
                    d="M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30"
                    initial={{ d: "M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30" }}
                    animate={{
                      d: [
                        "M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30",
                        "M 0 45 Q 20 50 40 30 T 80 50 T 120 35 T 160 25 T 200 40",
                        "M 0 35 Q 20 30 40 45 T 80 20 T 120 45 T 160 30 T 200 50",
                        "M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30"
                      ]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  
                  {/* Secondary jitter wave stroke */}
                  <motion.path
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.5"
                    d="M 0 35 Q 20 30 40 45 T 80 20 T 120 45 T 160 30 T 200 50"
                    initial={{ d: "M 0 35 Q 20 30 40 45 T 80 20 T 120 45 T 160 30 T 200 50" }}
                    animate={{
                      d: [
                        "M 0 35 Q 20 30 40 45 T 80 20 T 120 45 T 160 30 T 200 50",
                        "M 0 40 Q 20 20 40 35 T 80 40 T 120 25 T 160 45 T 200 30",
                        "M 0 45 Q 20 50 40 30 T 80 50 T 120 35 T 160 25 T 200 40",
                        "M 0 35 Q 20 30 40 45 T 80 20 T 120 45 T 160 30 T 200 50"
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Occasional Micro Spikes (rendered only when stationary) */}
                  {!isScrolling && (
                    <>
                      <motion.path
                        fill="none"
                        stroke="rgba(255,90,54,0.8)"
                        strokeWidth="1"
                        d="M 100 80 L 100 20"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 4.5, ease: 'circOut' }}
                        style={{ transformOrigin: 'bottom' }}
                      />
                      <motion.path
                        fill="none"
                        stroke="rgba(255,90,54,0.8)"
                        strokeWidth="1"
                        d="M 140 80 L 140 10"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 7.2, ease: 'circOut' }}
                        style={{ transformOrigin: 'bottom' }}
                      />
                    </>
                  )}
                </svg>
                <div className="absolute top-2 left-3 font-mono text-[7px] text-white/30 uppercase tracking-widest">
                  Commit Intensity Trend
                </div>
              </div>

              {/* Build Logs */}
              <div className="flex flex-col gap-2.5 font-mono text-[9px] tracking-wide text-white/45 pl-1 border-l border-accent/20 pb-4">
                <div className="flex items-start gap-4 hover:text-white/70 transition-colors ml-2">
                  <span className="text-accent/70">23:41</span>
                  <span>[SYS] deployed portfolio v3 edge network</span>
                </div>
                <div className="flex items-start gap-4 hover:text-white/70 transition-colors ml-2">
                  <span className="text-accent/70">01:12</span>
                  <span>[PERF] optimized telemetry rendering engine</span>
                </div>
                <div className="flex items-start gap-4 hover:text-white/70 transition-colors ml-2">
                  <span className="text-accent/70">02:07</span>
                  <span>[CORE] rebuilt motion interpolation for WebGL</span>
                </div>
                <div className="flex items-start gap-4 hover:text-white/70 transition-colors ml-2">
                  <span className="text-accent/70">14:22</span>
                  <span>[FEAT] integrated experimental AI agents</span>
                </div>
              </div>

              </div>
            </div>

          </div>

          </motion.div>
        </div>
      </section>
    );
  };
