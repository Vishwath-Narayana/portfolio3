import { motion } from 'framer-motion';
import { Heading, Mono, Body, StaggeredReveal } from '../ui/Typography';

const events = [
  { year: '2026', title: 'Creative Engineering Systems', description: 'Fusing backend architecture with physics-based frontend interactions to build products that feel fundamentally alive.' },
  { year: '2025', title: 'Cloud & Infrastructure', description: 'Obsessed with edge computing, CI/CD, and serverless. Realized that fragile architecture ruins perfect UX.' },
  { year: '2024', title: 'Backend Architecture', description: 'Shifted focus to the metal. Designing normalized databases and scalable APIs to power dense data-heavy applications.' },
  { year: '2023', title: 'Motion Engineering', description: 'Moved beyond static CSS into DOM interpolation and WebGL. Making interfaces communicate through inertia.' },
  { year: '2022', title: 'Frontend Systems', description: 'Mastering component lifecycles and global state management. Building robust design systems for scale.' },
  { year: '2021', title: 'Interface Design', description: 'Discovered the emotional impact of typography precision, modular grids, and brutalist spatial systems.' },
];

export const Evolution = () => {
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-warm-100 text-primary-900 selection:bg-accent selection:text-white border-t border-primary-900/5 relative overflow-hidden">
       {/* Paper Grain Texture */}
       <svg className="absolute inset-0 z-0 w-full h-full opacity-[0.4] pointer-events-none mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilterEvolution">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilterEvolution)"/>
      </svg>

       <div className="max-w-[1600px] mx-auto relative z-10">
         <motion.div 
          className="mb-24 flex flex-col md:flex-row justify-between md:items-end border-b border-primary-900/10 pb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading className="tracking-tighter"><StaggeredReveal text="Creative Evolution" /></Heading>
          <Mono className="text-primary-900/50">03 — Trajectory</Mono>
        </motion.div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group relative"
            >
              {/* Connecting line */}
              {index !== events.length - 1 && (
                 <div className="hidden md:block absolute left-[15%] top-12 bottom-[-4rem] w-px bg-primary-900/10 origin-top transform scale-y-0 group-hover:scale-y-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
              )}

              <div className="md:col-span-2 pt-1">
                <Mono className="text-primary-900/40 text-lg md:text-xl group-hover:text-accent transition-colors duration-500">{event.year}</Mono>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-2 text-balance text-primary-900/90 group-hover:translate-x-2 transition-transform duration-500 ease-out">{event.title}</h3>
              </div>
              <div className="md:col-span-6 md:pt-1">
                <Body className="text-primary-800/70 max-w-lg font-light leading-relaxed">{event.description}</Body>
              </div>
            </motion.div>
          ))}
        </div>
       </div>
    </section>
  );
};
