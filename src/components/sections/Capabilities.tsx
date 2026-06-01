import { motion } from 'framer-motion';
import { Heading, Mono } from '../ui/Typography';
import { useState } from 'react';

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
  // hoveredItem: { col, row } — drives row isolation across all groups
  const [hoveredItem, setHoveredItem] = useState<{ col: number; row: number } | null>(null);

  return (
    <section className="py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-primary-900 border-t border-primary-800 select-none">
      <div className="max-w-[1600px] mx-auto">
        {/* Standard Section Header */}
        <motion.div
          className="mb-16 md:mb-24 flex flex-col border-b border-primary-800/60 pb-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Mono className="text-accent text-sm md:text-base font-semibold">03 — CAPABILITIES</Mono>
          <div className="h-[1px] w-8 md:w-16 bg-primary-700" />
          <Heading className="text-3xl md:text-4xl lg:text-5xl tracking-tighter uppercase text-text-light mt-2">
            Capabilities Matrix
          </Heading>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-16">
          {capabilityGroups.map((group, colIdx) => (
            <motion.div
              key={colIdx}
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: colIdx * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Group header */}
              <div className="flex justify-between items-center border-b border-primary-800 pb-4">
                <Mono className="text-accent">{group.title}</Mono>
                <span className="font-mono text-[8px] text-primary-700">
                  [{String(colIdx + 1).padStart(2, '0')}]
                </span>
              </div>

              <ul className="flex flex-col gap-1">
                {group.items.map((item, rowIdx) => {
                  const isHovered      = hoveredItem?.col === colIdx && hoveredItem?.row === rowIdx;
                  const isCrossLinked  = hoveredItem !== null && hoveredItem.col !== colIdx && hoveredItem.row === rowIdx;
                  const anyHovered     = hoveredItem !== null;
                  // Dim rows that are neither hovered nor cross-linked
                  const isDimmed       = anyHovered && !isHovered && !isCrossLinked;

                  return (
                    <li
                      key={rowIdx}
                      onMouseEnter={() => setHoveredItem({ col: colIdx, row: rowIdx })}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="relative flex justify-between items-center border-b border-primary-800/40 py-3.5 px-2 rounded-sm overflow-hidden transition-all duration-300"
                      style={{
                        opacity: isDimmed ? 0.22 : 1,
                        background: isHovered
                          ? 'rgba(255,90,54,0.055)'
                          : isCrossLinked
                          ? 'rgba(255,255,255,0.025)'
                          : 'transparent',
                      }}
                    >
                      {/* Left accent bar */}
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        style={{ originY: 0 }}
                      />

                      {/* Item name */}
                      <div className="flex items-center gap-3 z-10">
                        <span
                          className="text-sm md:text-base font-light transition-colors duration-300"
                          style={{ color: isHovered ? '#FF5A36' : isCrossLinked ? '#f5f5f5' : 'rgba(245,245,245,0.75)' }}
                        >
                          {item}
                        </span>
                        {isCrossLinked && (
                          <span className="font-mono text-[8px] text-primary-600 tracking-widest hidden md:inline">
                            ↔ RELATED
                          </span>
                        )}
                      </div>

                      {/* Right status tag */}
                      <div className="flex items-center gap-2 z-10 flex-shrink-0">
                        {isHovered && (
                          <motion.span
                            initial={{ opacity: 0, x: 4 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-mono text-[8px] text-accent/70"
                          >
                            ACTIVE
                          </motion.span>
                        )}
                        <span
                          className="font-mono text-[8px] transition-colors duration-300"
                          style={{ color: isHovered ? 'rgba(255,90,54,0.5)' : isCrossLinked ? 'rgba(255,255,255,0.25)' : '#1f1f1f' }}
                        >
                          SYS_{String(rowIdx + 1).padStart(2, '0')}
                        </span>
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
