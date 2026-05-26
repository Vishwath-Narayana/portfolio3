import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Mono, Body, StaggeredReveal } from '../ui/Typography';
import { useRef, useEffect, useState } from 'react';

export const Infrastructure = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength1 = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const pathLength2 = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  const [logs, setLogs] = useState<{ id: number; time: string; text: string; type: string }[]>([]);

  // Simulation of live router observability log stream
  useEffect(() => {
    const mockLogs = [
      { text: "TCP_RST: PORT 443 [10.244.0.12]", type: "WARN" },
      { text: "NODE_WORKER_03: CPU LOAD 74% - AUTOSCALING", type: "INFO" },
      { text: "BGP_ROUTE_ADD: 192.168.1.0/24 VIA 10.0.0.1", type: "OK" },
      { text: "POD_SCALING: REPLICA_SET API_GW -> 12", type: "INFO" },
      { text: "EDGE_ROUTER: SHIFTING TRAFFIC TO EU-W1B", type: "WARN" },
      { text: "ETCD_LEADER_ELECTION: NODE_01 SUCCESS", type: "OK" },
      { text: "LATENCY_SPIKE: DB_CLUSTER (240ms)", type: "WARN" }
    ];

    // Initialize seed logs
    const seed = Array.from({ length: 4 }).map((_, i) => {
      const now = new Date();
      return {
        id: i,
        time: now.toTimeString().split(' ')[0],
        text: mockLogs[i % mockLogs.length].text,
        type: mockLogs[i % mockLogs.length].type
      };
    });
    setLogs(seed);

    let idCounter = 4;
    const interval = setInterval(() => {
      const now = new Date();
      const entry = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      setLogs(prev => [
        ...prev.slice(1),
        {
          id: idCounter++,
          time: now.toTimeString().split(' ')[0],
          text: entry.text,
          type: entry.type
        }
      ]);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] overflow-hidden relative border-t border-primary-800 select-none">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <div className="max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* Left Side: System Description & Log Terminal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col gap-8"
        >
          <div className="flex flex-col gap-3">
            <Mono className="text-accent uppercase tracking-widest text-[10px] md:text-xs">05 — Infrastructure</Mono>
            <Heading className="tracking-tighter"><StaggeredReveal text="Living Systems." /></Heading>
          </div>
          <Body className="text-balance text-primary-300/80 font-light leading-relaxed text-sm md:text-base">
            Building interfaces is only half the equation. I architect resilient observability pipelines, container orchestration, and serverless edge networks that process real-time telemetry. Without strong foundations, the frontend is merely a facade.
          </Body>

          {/* observabilty logs console */}
          <div className="border border-primary-800 bg-[#060606] rounded p-4 font-mono text-[9px] text-primary-400 h-44 overflow-hidden flex flex-col gap-1 relative shadow-2xl">
            <div className="flex justify-between border-b border-primary-800 pb-2 mb-2 text-primary-600 uppercase tracking-widest text-[8px]">
              <span>observability_log_stream</span>
              <span>active [ssh_node_01]</span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
              {logs.map((log) => (
                <motion.div key={log.id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <span className="text-primary-600">[{log.time}]</span>{' '}
                  <span className={log.type === 'OK' ? 'text-green-500/90' : log.type === 'WARN' ? 'text-yellow-500/90' : 'text-accent'}>
                    {log.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Alive SVG Topology Diagram */}
        <div className="lg:col-span-7 relative h-[400px] md:h-[600px] w-full mt-12 lg:mt-0 flex items-center justify-center">
          
          {/* Deep network topology SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 600">
            {/* Orthogonal Base connections */}
            <path d="M 100,300 L 250,300 L 250,150 L 600,150" fill="none" stroke="#141414" strokeWidth="2" />
            <path d="M 100,300 L 250,300 L 250,450 L 600,450" fill="none" stroke="#141414" strokeWidth="2" />
            <path d="M 600,150 L 750,150 L 750,300 L 900,300" fill="none" stroke="#141414" strokeWidth="2" />
            <path d="M 600,450 L 750,450 L 750,300 L 900,300" fill="none" stroke="#141414" strokeWidth="2" />
            <path d="M 600,150 L 600,450" fill="none" stroke="#141414" strokeWidth="2" strokeDasharray="4 4" />

            {/* Flowing Telemetry Data Lines (Scroll Driven) */}
            <motion.path 
              d="M 100,300 L 250,300 L 250,150 L 600,150" 
              fill="none" 
              stroke="rgba(255, 90, 54, 0.4)" 
              strokeWidth="1.5" 
              style={{ pathLength: pathLength1 }}
            />
            <motion.path 
              d="M 600,450 L 750,450 L 750,300 L 900,300" 
              fill="none" 
              stroke="rgba(34, 197, 94, 0.4)" 
              strokeWidth="1.5" 
              style={{ pathLength: pathLength2 }}
            />

            {/* Active Packet Flow 1 (Orange Edge -> Gateway) */}
            <motion.rect 
              width="6" height="6"
              fill="#FF5A36" 
              style={{ offsetPath: 'path("M 100,300 L 250,300 L 250,150 L 600,150")' }}
              animate={{ offsetDistance: ["0%", "33%", "33%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.6, 1] }}
            />

            {/* Active Packet Flow 2 (Green Edge -> Worker) */}
            <motion.rect 
              width="6" height="6"
              fill="#22C55E" 
              style={{ offsetPath: 'path("M 100,300 L 250,300 L 250,450 L 600,450")' }}
              animate={{ offsetDistance: ["0%", "33%", "33%", "100%"] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2, times: [0, 0.3, 0.5, 1] }}
            />

            {/* Active Packet Flow 3 (Gateway -> DB Cluster) */}
            <motion.rect 
              width="6" height="6"
              fill="#FF5A36" 
              style={{ offsetPath: 'path("M 600,150 L 750,150 L 750,300 L 900,300")' }}
              animate={{ offsetDistance: ["0%", "50%", "50%", "100%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5, times: [0, 0.4, 0.7, 1] }}
            />

            {/* Active Packet Flow 4 (Worker -> DB Cluster) */}
            <motion.rect 
              width="6" height="6"
              fill="#22C55E" 
              style={{ offsetPath: 'path("M 600,450 L 750,450 L 750,300 L 900,300")' }}
              animate={{ offsetDistance: ["0%", "50%", "50%", "100%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 2.1, times: [0, 0.4, 0.6, 1] }}
            />
          </svg>

          {/* Nodes */}
          {/* Node: Edge Client */}
          <motion.div 
            className="md:absolute left-[10%] top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 flex flex-col items-center gap-4 group mb-8 md:mb-0 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-cursor="true"
            data-cursor-text="EDGE"
          >
            <div className="w-16 h-16 bg-[#121212] border border-primary-800 flex items-center justify-center rounded-lg shadow-2xl relative overflow-hidden group-hover:border-accent transition-colors duration-500">
               <motion.div className="absolute inset-x-0 bottom-0 bg-accent/20" animate={{ height: ['20%', '80%', '40%'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
               <Mono className="text-[10px] z-10 text-text-light">EU-W1</Mono>
            </div>
          </motion.div>

          {/* Node: API Gateway */}
          <motion.div 
            className="md:absolute left-[60%] top-[25%] md:-translate-y-1/2 md:-translate-x-1/2 flex flex-col items-center gap-4 group mb-8 md:mb-0 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            data-cursor="true"
            data-cursor-text="API"
          >
            <div className="w-20 h-20 bg-[#121212] border border-primary-800 flex items-center justify-center rounded-lg shadow-2xl relative overflow-hidden group-hover:border-accent transition-colors duration-500">
               {/* Pulsing glow ring */}
               <div className="absolute inset-0 border border-accent/20 rounded-lg animate-ping pointer-events-none" />
               <motion.div className="absolute inset-0 bg-accent/10" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
               <Mono className="text-[10px] z-10 text-text-light">GATEWAY</Mono>
            </div>
          </motion.div>

          {/* Node: Worker */}
          <motion.div 
            className="md:absolute left-[60%] top-[75%] md:-translate-y-1/2 md:-translate-x-1/2 flex flex-col items-center gap-4 group mb-8 md:mb-0 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            data-cursor="true"
            data-cursor-text="WORKER"
          >
            <div className="w-20 h-20 bg-[#121212] border border-primary-800 flex flex-col items-center justify-center gap-2 rounded-lg shadow-2xl relative overflow-hidden group-hover:border-green-500 transition-colors duration-500">
               <div className="flex gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse"></span>
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse delay-75"></span>
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse delay-150"></span>
               </div>
               <Mono className="text-[8px] z-10 text-primary-500">PROC_03</Mono>
            </div>
          </motion.div>

          {/* Node: DB Cluster */}
          <motion.div 
            className="md:absolute left-[90%] top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 flex flex-col items-center gap-4 group z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            data-cursor="true"
            data-cursor-text="DATA"
          >
            <div className="w-24 h-24 bg-[#121212] border border-primary-800 flex flex-col items-center justify-center rounded-lg shadow-2xl relative overflow-hidden group-hover:border-primary-500 transition-colors duration-500">
               {/* Grid Background */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:0.5rem_0.5rem] opacity-50" />
               <div className="flex gap-1.5 items-end h-8 mb-2">
                 <motion.div className="w-1.5 bg-primary-600" animate={{ height: [12, 24, 12] }} transition={{ duration: 1.2, repeat: Infinity }} />
                 <motion.div className="w-1.5 bg-primary-600" animate={{ height: [8, 32, 8] }} transition={{ duration: 1.5, repeat: Infinity }} />
                 <motion.div className="w-1.5 bg-primary-600" animate={{ height: [16, 8, 16] }} transition={{ duration: 1.0, repeat: Infinity }} />
               </div>
               <Mono className="text-[10px] z-10 text-primary-500">CLUSTER</Mono>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
