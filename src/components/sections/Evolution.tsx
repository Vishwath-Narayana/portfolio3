import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Mono, Body, StaggeredReveal } from '../ui/Typography';
import { useRef } from 'react';

const events = [
  { year: '2026', title: 'Creative Engineering Systems', description: 'Fusing backend architecture with physics-based frontend interactions to build products that feel fundamentally alive.' },
  { year: '2025', title: 'Cloud & Infrastructure', description: 'Obsessed with edge computing, CI/CD, and serverless. Realized that fragile architecture ruins perfect UX.' },
  { year: '2024', title: 'Backend Architecture', description: 'Shifted focus to the metal. Designing normalized databases and scalable APIs to power dense data-heavy applications.' },
  { year: '2023', title: 'Motion Engineering', description: 'Moved beyond static CSS into DOM interpolation and WebGL. Making interfaces communicate through inertia.' },
  { year: '2022', title: 'Frontend Systems', description: 'Mastering component lifecycles and global state management. Building robust design systems for scale.' },
  { year: '2021', title: 'Interface Design', description: 'Discovered the emotional impact of typography precision, modular grids, and brutalist spatial systems.' },
];

const TimelineItem = ({ event }: { event: typeof events[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0.25, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.7 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group relative py-6 select-none"
    >
      {/* Node locator indicator */}
      <div className="hidden md:block absolute left-[15%] -translate-x-[4px] top-10 w-[9px] h-[9px] rounded-full bg-[#1A1A1A] border border-primary-800 z-10 transition-all duration-500 group-hover:bg-accent group-hover:scale-125 group-hover:shadow-[0_0_8px_rgba(255,90,54,0.8)]" />

      <div className="md:col-span-2 pt-1 z-10">
        <Mono className="text-primary-900/40 text-lg md:text-xl group-hover:text-accent transition-colors duration-500">{event.year}</Mono>
      </div>
      <div className="md:col-span-4 z-10">
        <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-2 text-balance text-primary-900/90 group-hover:translate-x-2 transition-transform duration-500 ease-out">{event.title}</h3>
      </div>
      <div className="md:col-span-6 md:pt-1 z-10">
        <Body className="text-primary-800/70 max-w-lg font-light leading-relaxed text-sm md:text-base">{event.description}</Body>
      </div>
    </motion.div>
  );
};

export const Evolution = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Scale the timeline vertical track linking to scroll progress
  const scaleY = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-warm-100 text-primary-900 selection:bg-accent selection:text-white border-t border-primary-900/5 relative overflow-hidden">
       {/* Paper Grain Texture Overlay */}
       <svg className="absolute inset-0 z-0 w-full h-full opacity-[0.35] pointer-events-none mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilterEvolution">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilterEvolution)"/>
      </svg>

       <div className="max-w-[1600px] mx-auto relative z-10">
          <motion.div 
          className="mb-16 flex flex-col md:flex-row justify-between md:items-end border-b border-primary-900/10 pb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading className="tracking-tighter"><StaggeredReveal text="Creative Evolution" /></Heading>
          <Mono className="text-primary-900/50">03 — Trajectory</Mono>
        </motion.div>

        <div className="flex flex-col gap-12 lg:gap-16 relative">
          
          {/* Scroll-Linked Continuous Vertical Line */}
          <div className="hidden md:block absolute left-[15%] top-10 bottom-10 w-[1px] bg-primary-900/10 z-0 pointer-events-none" />
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="hidden md:block absolute left-[15%] top-10 bottom-10 w-[1px] bg-accent z-0 origin-top pointer-events-none shadow-[0_0_6px_rgba(255,90,54,0.4)]"
          />

          {events.map((event, index) => (
            <TimelineItem 
              key={index} 
              event={event} 
            />
          ))}
        </div>
       </div>
    </section>
  );
};
