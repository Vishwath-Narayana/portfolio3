import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Heading, Mono, Body, StaggeredReveal } from '../ui/Typography';

const TerminalReplica = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const deployText = [
    "[INFO] Initializing terraform plan...",
    "[INFO] Acquiring state lock. Done.",
    "[WARN] module.eks_cluster.aws_eks_cluster.main: Refreshing state...",
    "[INFO] Plan: 4 to add, 1 to change, 0 to destroy.",
    "[OK] Apply complete! Resources: 4 added, 1 changed.",
    "[INFO] Updating kubeconfig for cluster 'prod-main'...",
    "[OK] Context set to 'prod-main'.",
    "[INFO] Rolling update for deployment/api-gateway triggered.",
    "> Awaiting health checks... [CLICK TO RUN BUILD]"
  ];

  const compileText = [
    "$ docker build -t us-east1-docker.pkg.dev/proj/repo/api:v2 .",
    "[INFO] Step 1/8 : FROM node:20-alpine AS builder",
    "[INFO] Step 3/8 : RUN npm ci --omit=dev",
    "[WARN] npm WARN deprecated core-js@2.6.12",
    "[INFO] Step 6/8 : COPY --from=builder /app/dist ./dist",
    "[OK] Successfully built 8a9b2c3d4e5f",
    "[INFO] Pushing image to Artifact Registry...",
    "[OK] sha256:1a2b3c... pushed successfully.",
    "> READY FOR DEPLOYMENT [CLICK TO DEPLOY]"
  ];

  const activeText = clickCount % 2 === 0 ? deployText : compileText;

  useEffect(() => {
    setLines([]);
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < activeText.length) {
        const text = activeText[currentLine];
        setLines(prev => [...prev, text]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 550);
    return () => clearInterval(interval);
  }, [clickCount]);

  return (
    <div 
      onClick={() => setClickCount(prev => prev + 1)}
      className="absolute inset-x-4 md:inset-x-12 bottom-0 h-64 bg-[#0A0A0A] border border-primary-700/80 rounded-t-lg shadow-2xl p-4 flex flex-col font-mono text-[10px] md:text-xs text-primary-300 transform translate-y-32 group-hover:translate-y-8 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer z-20 group/term select-none"
    >
      <div className="flex justify-between items-center border-b border-primary-800 pb-3 mb-4">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-700 group-hover/term:bg-red-500 transition-colors"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-primary-700 group-hover/term:bg-yellow-500 transition-colors"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-primary-700 group-hover/term:bg-green-500 transition-colors"></div>
        </div>
        <span className="text-primary-600 tracking-wider text-[9px] uppercase">bash — {clickCount % 2 === 0 ? 'root@deploy-sys' : 'root@compiler-sys'} — 80x24</span>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col gap-1.5 pointer-events-none">
        {lines.map((line, i) => {
          if (!line) return null;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
              {line.startsWith('[OK]') ? (
                <span className="text-green-500/90">{line}</span>
              ) : line.startsWith('[WARN]') ? (
                <span className="text-yellow-500/90">{line}</span>
              ) : line.startsWith('>') ? (
                <span className="text-accent animate-pulse font-semibold">{line}</span>
              ) : line.startsWith('$') ? (
                <span className="text-white font-bold">{line}</span>
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
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'traces'>('overview');
  const [latency, setLatency] = useState(42);
  const [errors, setErrors] = useState(0.01);

  // Live telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const offset = Math.random() > 0.5 ? 1 : -1;
        const newLat = prev + offset;
        return Math.max(38, Math.min(48, newLat));
      });
      setErrors(prev => {
        if (Math.random() > 0.8) {
          return parseFloat((0.01 + Math.random() * 0.03).toFixed(2));
        }
        return prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-x-4 md:inset-x-12 bottom-0 h-64 bg-primary-900 border border-primary-700/80 rounded-t-lg shadow-2xl flex flex-col transform translate-y-32 group-hover:translate-y-8 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden z-20">
      <div className="h-12 bg-primary-950 border-b border-primary-800 flex items-center px-6 justify-between select-none">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`text-[9px] uppercase font-mono px-2.5 py-1.5 rounded transition-all duration-300 cursor-pointer ${activeTab === 'overview' ? 'text-primary-200 bg-primary-800 shadow-sm' : 'text-primary-500 hover:text-primary-300'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('metrics')}
            className={`text-[9px] uppercase font-mono px-2.5 py-1.5 rounded transition-all duration-300 cursor-pointer ${activeTab === 'metrics' ? 'text-primary-200 bg-primary-800 shadow-sm' : 'text-primary-500 hover:text-primary-300'}`}
          >
            Metrics
          </button>
          <button 
            onClick={() => setActiveTab('traces')}
            className={`text-[9px] uppercase font-mono px-2.5 py-1.5 rounded transition-all duration-300 cursor-pointer ${activeTab === 'traces' ? 'text-primary-200 bg-primary-800 shadow-sm' : 'text-primary-500 hover:text-primary-300'}`}
          >
            Traces
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-primary-400 uppercase tracking-widest animate-pulse">Live Stream</span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
        </div>
      </div>
      
      <div className="flex-1 p-5 grid grid-cols-3 gap-5">
        <div className="col-span-2 border border-primary-800 bg-[#0A0A0A] rounded flex flex-col p-4 relative overflow-hidden">
          <span className="text-[10px] font-mono text-primary-500 mb-2 uppercase tracking-wider">
            {activeTab === 'overview' && 'Requests / sec (Global)'}
            {activeTab === 'metrics' && 'Resource Allocation'}
            {activeTab === 'traces' && 'Recent Network Events'}
          </span>
          
          <div className="flex-1 w-full relative mt-2 border-t border-primary-900 pt-2 border-dashed">
            {activeTab === 'overview' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <motion.path 
                  d="M0,35 L5,35 L5,28 L10,28 L10,32 L15,32 L15,20 L20,20 L20,25 L25,25 L25,15 L30,15 L30,22 L35,22 L35,10 L40,10 L40,18 L45,18 L45,8 L50,8 L50,15 L55,15 L55,5 L60,5 L60,12 L65,12 L65,25 L70,25 L70,20 L75,20 L75,30 L80,30 L80,15 L85,15 L85,10 L90,10 L90,20 L95,20 L95,25 L100,25" 
                  fill="none" 
                  stroke="#FF5A36" 
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <path d="M0,40 L0,35 L5,35 L5,28 L10,28 L10,32 L15,32 L15,20 L20,20 L20,25 L25,25 L25,15 L30,15 L30,22 L35,22 L35,10 L40,10 L40,18 L45,18 L45,8 L50,8 L50,15 L55,15 L55,5 L60,5 L60,12 L65,12 L65,25 L70,25 L70,20 L75,20 L75,30 L80,30 L80,15 L85,15 L85,10 L90,10 L90,20 L95,20 L95,25 L100,25 L100,40 Z" fill="url(#gradient)" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 90, 54, 0.15)" />
                    <stop offset="100%" stopColor="rgba(255, 90, 54, 0)" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {activeTab === 'metrics' && (
              <div className="flex flex-col gap-2.5 font-mono text-[9px] text-primary-400 mt-1">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between"><span>CLUSTER CPU USAGE</span><span>62%</span></div>
                  <div className="w-full h-1.5 bg-primary-950 rounded-full overflow-hidden border border-primary-800">
                    <motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 1 }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between"><span>CLUSTER MEMORY ALLOCATION</span><span>84%</span></div>
                  <div className="w-full h-1.5 bg-primary-950 rounded-full overflow-hidden border border-primary-800">
                    <motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: '84%' }} transition={{ duration: 1 }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'traces' && (
              <div className="flex flex-col gap-1.5 font-mono text-[9px] text-primary-400 select-none overflow-hidden h-full">
                <div className="flex justify-between text-green-500/90 border-b border-primary-950 pb-1">
                  <span>GET /api/v1/workload</span><span>200 OK</span><span>14ms</span>
                </div>
                <div className="flex justify-between text-green-500/90 border-b border-primary-950 pb-1">
                  <span>POST /api/v1/rebalance</span><span>201 CREATED</span><span>32ms</span>
                </div>
                <div className="flex justify-between text-yellow-500/90 border-b border-primary-950 pb-1">
                  <span>GET /api/v1/db-status</span><span>200 OK</span><span>{latency}ms</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-5 select-none">
           <div className="flex-1 border border-primary-800 bg-[#0A0A0A] rounded flex flex-col justify-center items-center">
             <span className="text-[10px] font-mono text-primary-500 mb-1 uppercase tracking-wider">Latency</span>
             <span className="text-2xl font-mono text-text-light tracking-tighter tabular-nums">{latency}ms</span>
           </div>
           <div className="flex-1 border border-red-900/30 bg-red-950/20 rounded flex flex-col justify-center items-center relative overflow-hidden">
             <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
             <span className="text-[10px] font-mono text-red-500/70 mb-1 z-10 uppercase tracking-wider">Error Rate</span>
             <span className="text-xl font-mono text-red-400 z-10 tabular-nums">{errors}%</span>
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
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Spring configurations for 3D magnetic tilt physics (Heavy & Computationally Expensive)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { damping: 40, stiffness: 90 });
  const springTiltY = useSpring(tiltY, { damping: 40, stiffness: 90 });

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate relative mouse position from -0.5 to 0.5
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Scale rotation angles (max 6 degrees tilt)
    const rX = -(mouseY / (height / 2)) * 6;
    const rY = (mouseX / (width / 2)) * 6;

    tiltX.set(rX);
    tiltY.set(rY);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : (index % 2 !== 0 ? 120 : -120)]);
  const UIComponent = project.ui;

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ y, rotateX: springTiltX, rotateY: springTiltY, transformStyle: "preserve-3d" }}
      className={`group flex flex-col gap-8 ${index % 2 !== 0 ? 'lg:mt-48' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div 
        data-cursor="true"
        data-cursor-text="EXPLORE"
        className={`aspect-[4/5] w-full rounded-md overflow-hidden bg-gradient-to-br ${project.color} relative border border-primary-700/50 group-hover:border-accent/40 p-6 md:p-8 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover:scale-[1.01] cursor-none shadow-2xl group-hover:shadow-[0_0_40px_rgba(255,90,54,0.15)]`}
        style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}
      >
         {/* Internal Graphic Grid Overlay to prevent visual collapse */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none" />

         <div className="flex justify-between items-start opacity-60 z-10 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
           <Mono className="text-[10px]">{project.role}</Mono>
           <Mono className="text-[10px]">{project.year}</Mono>
         </div>
         
         <div 
           className="absolute inset-0 flex items-center justify-center opacity-[0.02] font-mono text-6xl md:text-8xl tracking-tighter mix-blend-overlay uppercase z-0 text-center px-4 pointer-events-none select-none"
           style={{ transform: "translateZ(10px)" }}
         >
           {project.title}
         </div>

         {/* Realistic UI Replicas */}
         <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="w-full h-full absolute inset-0 pointer-events-auto">
           <UIComponent />
         </div>
      </div>
      
      <div className="flex flex-col gap-6" style={{ transform: "translateZ(20px)" }}>
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
