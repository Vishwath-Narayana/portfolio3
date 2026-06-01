import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Mono, Body } from '../ui/Typography';
import { useRef } from 'react';

const events = [
  { year: '2021', title: 'Interface Design', description: 'Discovered the emotional impact of typography precision, modular grids, and brutalist spatial systems.' },
  { year: '2022', title: 'Frontend Systems', description: 'Mastering component lifecycles and global state management. Building robust design systems for scale.' },
  { year: '2023', title: 'Motion Engineering', description: 'Moved beyond static CSS into DOM interpolation and WebGL. Making interfaces communicate through inertia.' },
  { year: '2024', title: 'Backend Architecture', description: 'Shifted focus to the metal. Designing normalized databases and scalable APIs to power dense data-heavy applications.' },
  { year: '2025', title: 'Cloud & Infrastructure', description: 'Obsessed with edge computing, CI/CD, and serverless. Realized that fragile architecture ruins perfect UX.' },
  { year: '2026', title: 'Creative Engineering Systems', description: 'Fusing backend architecture with physics-based frontend interactions to build products that feel fundamentally alive.' },
];

const TimelineItem = ({ event, isLast }: { event: typeof events[0], isLast: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0.25, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.7 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-[80px_48px_1fr] md:grid-cols-[100px_64px_1fr] items-start group relative pb-16 md:pb-24 select-none"
    >
      {/* Col 1: Year */}
      <div className="pt-1 text-right pr-2">
        <Mono className={`text-xl transition-colors duration-500 ${isLast ? 'text-accent font-medium' : 'text-primary-900/40 group-hover:text-accent'}`}>
          {event.year}
        </Mono>
      </div>

      {/* Col 2: Spine Node */}
      <div className="flex justify-center relative pt-[10px] z-20">
        {/* Mask to hide the spine line below the last node */}
        {isLast && (
          <div className="absolute top-[16px] -bottom-[200px] left-[-20px] right-[-20px] bg-warm-100 z-0" />
        )}
        
        {/* The Node */}
        <div className={`rounded-full border z-10 transition-all duration-500 ${isLast ? 'w-[13px] h-[13px] bg-accent border-accent shadow-[0_0_12px_rgba(255,90,54,0.6)] -translate-y-[2px]' : 'w-[9px] h-[9px] bg-[#1A1A1A] border-primary-800 group-hover:bg-accent group-hover:scale-125 group-hover:shadow-[0_0_8px_rgba(255,90,54,0.8)]'}`} />
      </div>

      {/* Col 3: Content */}
      <div className="flex flex-col gap-3 pl-2 md:pl-6 pt-0 z-20">
        <h3 className={`font-medium tracking-tight text-balance transition-transform duration-500 ease-out leading-tight ${isLast ? 'text-3xl lg:text-4xl text-primary-900' : 'text-2xl lg:text-3xl text-primary-900/90 group-hover:translate-x-3'}`}>
          {event.title}
        </h3>
        <Body className="text-primary-800/80 max-w-3xl font-light leading-relaxed text-base md:text-lg">
          {event.description}
        </Body>
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

  const scaleY = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section ref={containerRef} className="pt-24 md:pt-36 pb-12 md:pb-16 px-6 md:px-12 lg:px-24 bg-warm-100 text-primary-900 selection:bg-accent selection:text-white border-t border-primary-900/5 relative overflow-hidden">
       {/* Paper Grain Texture Overlay */}
       <svg className="absolute inset-0 z-0 w-full h-full opacity-[0.35] pointer-events-none mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilterEvolution">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilterEvolution)"/>
      </svg>

        <div className="max-w-[1600px] mx-auto relative z-10">
          {/* Standard Section Header */}
          <motion.div
            className="mb-16 md:mb-24 flex flex-col border-b border-primary-900/10 pb-6 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Mono className="text-accent text-sm md:text-base font-semibold">05 — TRAJECTORY</Mono>
            <div className="h-[1px] w-8 md:w-16 bg-primary-900/20" />
            <Heading className="text-3xl md:text-4xl lg:text-5xl tracking-tighter uppercase text-primary-900 mt-2">
              Creative Evolution
            </Heading>
          </motion.div>

        <div className="max-w-5xl mx-auto flex flex-col relative">
          
          {/* Static Background Spine */}
          <div className="absolute left-[104px] md:left-[132px] -translate-x-[0.5px] top-[14px] bottom-0 w-[1px] bg-primary-900/10 z-0 pointer-events-none" />
          
          {/* Dynamic Active Journey Spine */}
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="absolute left-[104px] md:left-[132px] -translate-x-[0.5px] top-[14px] bottom-0 w-[1px] bg-accent z-10 origin-top pointer-events-none shadow-[0_0_6px_rgba(255,90,54,0.4)]"
          />

          {events.map((event, index) => (
            <TimelineItem 
              key={index} 
              event={event} 
              isLast={index === events.length - 1}
            />
          ))}
        </div>
        
       </div>
    </section>
  );
};

