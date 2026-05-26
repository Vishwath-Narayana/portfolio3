import { motion } from 'framer-motion';
import { Heading, Mono } from '../ui/Typography';
import { useState, useEffect } from 'react';

const capabilityGroups = [
  {
    title: 'Design Systems',
    items: ['Component Architecture', 'Design Tokens', 'Figma Variables', 'Accessibility (WCAG)', 'Interactive Prototypes']
  },
  {
    title: 'Frontend Engineering',
    items: ['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion / GSAP', 'WebGL / Three.js']
  },
  {
    title: 'Backend & Cloud',
    items: ['Node.js / Express', 'PostgreSQL / Prisma', 'REST / GraphQL', 'Serverless Functions', 'Redis Caching']
  },
  {
    title: 'DevOps & Infra',
    items: ['Docker', 'CI/CD Pipelines', 'AWS / Vercel', 'System Architecture', 'Performance Profiling']
  }
];

export const Capabilities = () => {
  const [activeItem, setActiveItem] = useState({ col: 0, row: 0 });

  // Periodically cycle active item to simulate dependency scanner
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem(prev => {
        const nextRow = (prev.row + 1) % 5;
        const nextCol = nextRow === 0 ? (prev.col + 1) % 4 : prev.col;
        return { col: nextCol, row: nextRow };
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-primary-900 border-t border-primary-800 select-none">
      <div className="max-w-[1600px] mx-auto">
        <motion.div 
          className="mb-24 flex justify-between items-end border-b border-primary-800 pb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading>Capabilities Matrix</Heading>
          <Mono>03 — System</Mono>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {capabilityGroups.map((group, index) => (
            <motion.div 
              key={index}
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex justify-between items-center border-b border-primary-800 pb-3">
                <Mono className="text-accent">{group.title}</Mono>
                <span className="font-mono text-[8px] text-primary-600">[SYS_GRP_{String(index + 1).padStart(2, '0')}]</span>
              </div>
              <ul className="flex flex-col gap-0">
                {group.items.map((item, idx) => {
                  const isActive = activeItem.col === index && activeItem.row === idx;
                  return (
                    <li 
                      key={idx} 
                      className={`flex justify-between items-center text-sm md:text-base border-b border-primary-800/40 py-4 group transition-all duration-500 px-2 rounded-sm relative overflow-hidden ${isActive ? 'text-accent bg-accent/5' : 'text-text-light/80 hover:text-white hover:bg-primary-800/20'}`}
                    >
                      {/* Active scanner glow line */}
                      {isActive && (
                        <motion.div 
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent"
                          layoutId="activeCapScannerGlow"
                        />
                      )}
                      
                      <div className="flex items-center gap-3">
                        <span>{item}</span>
                        {isActive && (
                          <span className="text-[8px] font-mono border border-accent/30 bg-accent/10 px-1 rounded animate-pulse select-none">
                            SCANNING
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-primary-700 group-hover:text-primary-500 tracking-tighter uppercase select-none">
                          {isActive ? 'INTEG_OK' : 'READY'}
                        </span>
                        <Mono className={`text-[9px] transition-colors duration-300 ${isActive ? 'text-accent' : 'text-primary-700 group-hover:text-primary-500'}`}>
                          SYS_{String(idx + 1).padStart(2, '0')}
                        </Mono>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
