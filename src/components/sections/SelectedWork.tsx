import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Heading, Mono, Body } from '../ui/Typography';

// ─── Ambient Topology SVG Overlay ────────────────────────────────────────────
// Subtle procedural node/trace diagram that drifts slowly behind UI replicas
const TopologyOverlay = ({ seed }: { seed: number }) => {
  // Deterministic node positions based on seed
  const nodes = Array.from({ length: 7 }, (_, i) => ({
    cx: String((Math.sin(seed + i * 1.7) * 0.5 + 0.5) * 80 + 10),
    cy: String((Math.cos(seed + i * 2.3) * 0.5 + 0.5) * 70 + 15),
  }));
  // Connect some node pairs
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 3], [2, 5], [1, 4],
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id={`glow-${seed}`}>
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(255,90,54,0.12)"
          strokeWidth="0.3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2 + i * 0.3, delay: i * 0.15, ease: 'easeOut' }}
        />
      ))}

      {/* Flowing signal dot on one edge */}
      <motion.circle
        r="0.6"
        fill="rgba(255,90,54,0.5)"
        filter={`url(#glow-${seed})`}
        cx={nodes[0].cx}
        cy={nodes[0].cy}
        initial={{ cx: nodes[0].cx, cy: nodes[0].cy }}
        animate={{
          cx: [nodes[0].cx, nodes[1].cx, nodes[2].cx, nodes[3].cx, nodes[0].cx],
          cy: [nodes[0].cy, nodes[1].cy, nodes[2].cy, nodes[3].cy, nodes[0].cy],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: seed * 0.5 }}
      />
      <motion.circle
        r="0.4"
        fill="rgba(255,90,54,0.3)"
        cx={nodes[4].cx}
        cy={nodes[4].cy}
        initial={{ cx: nodes[4].cx, cy: nodes[4].cy }}
        animate={{
          cx: [nodes[4].cx, nodes[5].cx, nodes[6].cx, nodes[4].cx],
          cy: [nodes[4].cy, nodes[5].cy, nodes[6].cy, nodes[4].cy],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: seed * 0.3 + 1 }}
      />

      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.cx} cy={n.cy} r="1"
          fill="rgba(255,90,54,0.08)"
          stroke="rgba(255,90,54,0.2)"
          strokeWidth="0.3"
          initial={{ r: 1, opacity: 0.3 }}
          animate={{ r: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
        />
      ))}

      {/* Faint grid scan lines */}
      {[20, 40, 60, 80].map(y => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" />
      ))}
      {[25, 50, 75].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" />
      ))}
    </svg>
  );
};

// ─── Unified Projects Data ────────────────────────────────────────────────────
const allProjects = [
  {
    title: 'AgentOS',
    description: 'Distributed execution environment and cognitive tracing CLI for autonomous parallel agents.',
    tech: 'React • Framer Motion • WebGL',
    status: 'ACTIVE',
    color: 'from-zinc-900 to-zinc-950',
    seed: 1.2
  },
  {
    title: 'InfraScale',
    description: 'Enterprise observability platform rendering real-time global mesh network packet traces.',
    tech: 'Next.js • Prisma • PostgreSQL • Docker',
    status: 'ACTIVE',
    color: 'from-stone-900 to-stone-950',
    seed: 2.7
  },
  {
    title: 'Nexus Mesh',
    description: 'Zero-trust microservices control plane featuring automated mTLS certificate rotation.',
    tech: 'Go • gRPC • Envoy • Kubernetes',
    status: 'LIVE',
    color: 'from-neutral-900 to-neutral-950',
    seed: 4.1
  },
  {
    title: 'DataFlow Proxy',
    description: 'High-throughput ingress routing layer for real-time telemetry streaming at scale.',
    tech: 'Rust • Tokio • WebSockets',
    status: 'LIVE',
    color: 'from-slate-900 to-slate-950',
    seed: 5.5
  },
  {
    title: 'Cognitive Cache',
    description: 'Distributed vector database caching layer built to minimize LLM agent latency.',
    tech: 'Python • Redis • FastAPI • CUDA',
    status: 'DEPRECATED',
    color: 'from-zinc-900 to-zinc-950',
    seed: 6.8
  },
  {
    title: 'Observa',
    description: 'Lightweight distributed tracing and log aggregation sidecar utilizing eBPF hooks.',
    tech: 'Go • eBPF • Prometheus',
    status: 'LIVE',
    color: 'from-stone-900 to-stone-950',
    seed: 7.2
  },
  {
    title: 'Neural CDN',
    description: 'Edge-compute routing network optimized for decentralized AI model inference.',
    tech: 'Cloudflare Workers • Rust • WASM',
    status: 'BETA',
    color: 'from-neutral-900 to-neutral-950',
    seed: 8.9
  },
  {
    title: 'Quantum Ledger',
    description: 'Immutable audit trail architecture designed for distributed financial systems.',
    tech: 'TypeScript • Postgres • Kafka',
    status: 'ARCHIVED',
    color: 'from-slate-900 to-slate-950',
    seed: 9.1
  },
];

// ─── System Card Component ────────────────────────────────────────────────────
const SystemCard = ({ project, index }: { project: typeof allProjects[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-[#0A0A0A] border border-primary-800/80 rounded-md overflow-hidden hover:border-red-900/50 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,90,54,0.1)] hover:-translate-y-1"
    >
      {/* Background layer with topology overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40 z-0`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-screen scale-110 origin-center">
           <TopologyOverlay seed={project.seed} />
        </div>
      </div>
      
      {/* Illumination edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/50 transition-all duration-700 z-10" />

      {/* Content Area */}
      <div className="relative z-10 flex flex-col p-6 md:p-8 gap-5 h-full">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl md:text-2xl font-medium tracking-tight text-text-light group-hover:text-white transition-colors">
            {project.title}
          </h3>
          <p className="text-sm md:text-base text-primary-400 font-light leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Metadata Spacer */}
        <div className="flex-1 min-h-[1.5rem]" />

        {/* Metadata Footer */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex justify-between items-start border-t border-primary-800/60 pt-5">
            <div className="flex flex-col gap-1.5 max-w-[70%]">
              <span className="font-mono text-[9px] text-primary-600 uppercase tracking-widest">Stack</span>
              <Mono className="text-[10px] text-primary-400">{project.tech}</Mono>
            </div>
            
            <div className="flex flex-col gap-1.5 items-end">
              <span className="font-mono text-[9px] text-primary-600 uppercase tracking-widest">Status</span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                project.status === 'LIVE' || project.status === 'ACTIVE' ? 'border-green-900/50 text-green-500 bg-green-950/20' :
                project.status === 'BETA' ? 'border-yellow-900/50 text-yellow-500 bg-yellow-950/20' :
                'border-primary-700/50 text-primary-500 bg-primary-800/30'
              }`}>
                {project.status}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 group/cta cursor-none pt-3 overflow-hidden">
            <span className="font-mono text-[10px] tracking-[0.15em] text-accent/60 group-hover:text-accent transition-colors uppercase">
              Inspect Architecture
            </span>
            <motion.span
              className="font-mono text-[10px] text-accent/60 group-hover:text-accent"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const SelectedWork = () => {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-primary-900 relative z-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Standard Section Header */}
        <motion.div
          className="mb-16 md:mb-24 flex flex-col border-b border-primary-800/60 pb-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Mono className="text-accent text-sm md:text-base font-semibold">01 — PROJECTS</Mono>
          <div className="h-[1px] w-8 md:w-16 bg-primary-700" />
          <Heading className="text-3xl md:text-4xl lg:text-5xl tracking-tighter uppercase text-text-light mt-2">
            System Registry
          </Heading>
          <Body className="max-w-2xl text-primary-400 font-light text-base md:text-lg leading-relaxed mt-2">
            A curated collection of products, systems, infrastructure experiments, and engineering artifacts.
          </Body>
        </motion.div>

        {/* Unified Systems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {allProjects.map((project, index) => (
            <SystemCard
              key={index}
              project={project}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
