import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Heading, Mono, Body, StaggeredReveal } from '../ui/Typography';

const TerminalReplica = () => {
  const [lines, setLines] = useState<string[]>([]);
  const fullText = [
    "[INFO] Initializing distributed deployment...",
    "[INFO] Fetching cluster configuration from etcd.",
    "[WARN] Node eu-west-1c experiencing high latency.",
    "[INFO] Rerouting traffic to eu-west-1a.",
    "[OK] Deployment payload constructed (1.4GB).",
    "[INFO] Pushing image to container registry...",
    "[OK] Image pushed successfully.",
    "[INFO] Scaling replica set to 24 instances.",
    "> Awaiting health check signals..."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < fullText.length) {
        const text = fullText[currentLine];
        setLines(prev => [...prev, text]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-x-4 md:inset-x-12 bottom-0 h-64 bg-[#0A0A0A] border border-primary-700/80 rounded-t-lg shadow-2xl p-4 flex flex-col font-mono text-[10px] md:text-xs text-primary-300 transform translate-y-32 group-hover:translate-y-8 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex justify-between items-center border-b border-primary-800 pb-3 mb-4">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-700 hover:bg-red-500 transition-colors"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-primary-700 hover:bg-yellow-500 transition-colors"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-primary-700 hover:bg-green-500 transition-colors"></div>
        </div>
        <span className="text-primary-600 tracking-wider">bash — root@deploy-server — 80x24</span>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col gap-1.5">
        {lines.map((line, i) => {
          if (!line) return null;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
              {line.startsWith('[OK]') ? (
                <span className="text-green-500/90">{line}</span>
              ) : line.startsWith('[WARN]') ? (
                <span className="text-yellow-500/90">{line}</span>
              ) : line.startsWith('>') ? (
                <span className="text-accent animate-pulse">{line}</span>
              ) : (
                <span className="text-primary-400">{line}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const DashboardReplica = () => {
  return (
    <div className="absolute inset-x-4 md:inset-x-12 bottom-0 h-64 bg-primary-900 border border-primary-700/80 rounded-t-lg shadow-2xl flex flex-col transform translate-y-32 group-hover:translate-y-8 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
      <div className="h-12 bg-primary-950 border-b border-primary-800 flex items-center px-6 justify-between">
        <div className="flex gap-6">
          <span className="text-[10px] font-mono text-primary-200 bg-primary-800 px-3 py-1.5 rounded-md shadow-sm">Overview</span>
          <span className="text-[10px] font-mono text-primary-500 px-2 py-1.5 hover:text-primary-300 transition-colors">Metrics</span>
          <span className="text-[10px] font-mono text-primary-500 px-2 py-1.5 hover:text-primary-300 transition-colors">Traces</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-primary-400">Live</span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
        </div>
      </div>
      <div className="flex-1 p-5 grid grid-cols-3 gap-5">
        <div className="col-span-2 border border-primary-800 bg-[#0A0A0A] rounded flex flex-col p-4 relative overflow-hidden">
          <span className="text-[10px] font-mono text-primary-500 mb-2">Requests / sec (Global)</span>
          {/* Realistic SVG Chart */}
          <div className="flex-1 w-full relative mt-2">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <motion.path 
                d="M0,35 L10,32 L20,38 L30,25 L40,28 L50,15 L60,20 L70,5 L80,10 L90,2 L100,8" 
                fill="none" 
                stroke="#FF5A36" 
                strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <path d="M0,40 L0,35 L10,32 L20,38 L30,25 L40,28 L50,15 L60,20 L70,5 L80,10 L90,2 L100,8 L100,40 Z" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 90, 54, 0.2)" />
                  <stop offset="100%" stopColor="rgba(255, 90, 54, 0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-5">
           <div className="flex-1 border border-primary-800 bg-[#0A0A0A] rounded flex flex-col justify-center items-center">
             <span className="text-[10px] font-mono text-primary-500 mb-1">P99 Latency</span>
             <span className="text-2xl font-mono text-text-light tracking-tighter">42ms</span>
           </div>
           <div className="flex-1 border border-red-900/30 bg-red-950/20 rounded flex flex-col justify-center items-center relative overflow-hidden">
             <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
             <span className="text-[10px] font-mono text-red-500/70 mb-1 z-10">Error Rate</span>
             <span className="text-xl font-mono text-red-400 z-10">0.01%</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const projects = [
  {
    title: 'AgentOS',
    role: 'System Architecture',
    year: '2025',
    challenge: 'Designing a dense, brutalist interface for autonomous agents that prevents cognitive overload while exposing deep system metrics.',
    architecture: 'React, Framer Motion, WebGL',
    color: 'from-zinc-900 to-zinc-950',
    ui: TerminalReplica
  },
  {
    title: 'InfraScale',
    role: 'DevOps & Full Stack',
    year: '2024',
    challenge: 'Translating complex distributed network telemetry into human-readable, warm visual data through a scalable dashboard.',
    architecture: 'Next.js, Prisma, PostgreSQL, Docker',
    color: 'from-stone-900 to-stone-950',
    ui: DashboardReplica
  }
];

const ProjectCard = ({ 
  project, 
  index, 
  scrollYProgress 
}: { 
  project: typeof projects[0]; 
  index: number; 
  scrollYProgress: any; 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : (index % 2 !== 0 ? 150 : -150)]);
  const UIComponent = project.ui;

  return (
    <motion.div 
      style={{ y }}
      className={`group flex flex-col gap-8 ${index % 2 !== 0 ? 'lg:mt-48' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div 
        data-cursor="true"
        data-cursor-text="EXPLORE"
        className={`aspect-[4/5] w-full rounded-md overflow-hidden bg-gradient-to-br ${project.color} relative border border-primary-700/50 p-6 md:p-8 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover:scale-[1.02] cursor-none shadow-2xl`}
      >
         <div className="flex justify-between items-start opacity-60 z-10">
           <Mono className="text-[10px]">{project.role}</Mono>
           <Mono className="text-[10px]">{project.year}</Mono>
         </div>
         
         <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] font-mono text-6xl md:text-8xl tracking-tighter mix-blend-overlay uppercase z-0 text-center px-4">
           {project.title}
         </div>

         {/* Realistic UI Replicas */}
         <UIComponent />
      </div>
      
      <div className="flex flex-col gap-6">
        <h3 className="text-3xl font-medium tracking-tight border-b border-primary-700/50 pb-4 text-text-light">{project.title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <Mono className="text-[10px] text-primary-500 uppercase tracking-widest">The Challenge</Mono>
            <Body className="text-sm md:text-base text-primary-300 font-light">{project.challenge}</Body>
          </div>
          <div className="flex flex-col gap-2">
            <Mono className="text-[10px] text-primary-500 uppercase tracking-widest">Infrastructure Stack</Mono>
            <Body className="text-sm md:text-base font-mono text-primary-400">{project.architecture}</Body>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SelectedWork = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-primary-800 relative z-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">
        <motion.div 
          className="mb-24 flex flex-col md:flex-row justify-between md:items-end border-b border-primary-700 pb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading className="tracking-tighter"><StaggeredReveal text="System Architecture" /></Heading>
          <Mono className="text-primary-500">01 — 02</Mono>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              index={index} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
