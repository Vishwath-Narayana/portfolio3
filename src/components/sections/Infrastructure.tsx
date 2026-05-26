import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Mono, Body, StaggeredReveal } from '../ui/Typography';
import { useRef } from 'react';

export const Infrastructure = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength1 = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const pathLength2 = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] overflow-hidden relative border-t border-primary-800">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col gap-8"
        >
           <Mono className="text-accent uppercase tracking-widest text-[10px] md:text-xs">05 — Infrastructure</Mono>
           <Heading className="tracking-tighter"><StaggeredReveal text="Living Systems." /></Heading>
           <Body className="text-balance text-primary-300/80 font-light leading-relaxed">
             Building interfaces is only half the equation. I architect resilient observability pipelines, container orchestration, and serverless edge networks that process real-time telemetry. Without strong foundations, the frontend is merely a facade.
           </Body>
        </motion.div>

        <div className="lg:col-span-7 relative h-[400px] md:h-[600px] w-full mt-12 lg:mt-0">
          {/* Deep network topology SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 600">
            {/* Base connections */}
            <path d="M 100,300 C 300,300 400,150 600,150" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 100,300 C 300,300 400,450 600,450" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 600,150 C 750,150 800,300 900,300" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 600,450 C 750,450 800,300 900,300" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 600,150 C 600,250 600,350 600,450" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 4" />

            {/* Flowing Telemetry Data (Scroll Driven) */}
            <motion.path 
              d="M 100,300 C 300,300 400,150 600,150" 
              fill="none" 
              stroke="#FF5A36" 
              strokeWidth="2" 
              style={{ pathLength: pathLength1 }}
            />
            <motion.path 
              d="M 600,450 C 750,450 800,300 900,300" 
              fill="none" 
              stroke="#22C55E" 
              strokeWidth="2" 
              style={{ pathLength: pathLength2 }}
            />
          </svg>

          {/* Nodes */}
          {/* Node: Edge Client */}
          <motion.div 
            className="md:absolute left-[10%] top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 flex flex-col items-center gap-4 group mb-8 md:mb-0"
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
            className="md:absolute left-[60%] top-[25%] md:-translate-y-1/2 md:-translate-x-1/2 flex flex-col items-center gap-4 group mb-8 md:mb-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            data-cursor="true"
            data-cursor-text="API"
          >
            <div className="w-20 h-20 bg-[#121212] border border-primary-800 flex items-center justify-center rounded-lg shadow-2xl relative overflow-hidden group-hover:border-accent transition-colors duration-500">
               <motion.div className="absolute inset-0 bg-accent/10" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
               <Mono className="text-[10px] z-10 text-text-light">GATEWAY</Mono>
            </div>
          </motion.div>

          {/* Node: Worker */}
          <motion.div 
            className="md:absolute left-[60%] top-[75%] md:-translate-y-1/2 md:-translate-x-1/2 flex flex-col items-center gap-4 group mb-8 md:mb-0"
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
            className="md:absolute left-[90%] top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 flex flex-col items-center gap-4 group"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            data-cursor="true"
            data-cursor-text="DATA"
          >
            <div className="w-24 h-24 bg-[#121212] border-2 border-primary-800 border-dashed flex flex-col items-center justify-center rounded-lg shadow-2xl relative overflow-hidden group-hover:border-primary-500 transition-colors duration-500">
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
