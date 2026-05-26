import { motion } from 'framer-motion';
import { Heading, Mono, Body } from '../ui/Typography';
import { useState } from 'react';

export const Playground = () => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodes = Array.from({ length: 144 }).map((_, i) => i);

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-primary-800 relative overflow-hidden flex flex-col justify-center">
      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        <motion.div 
          className="mb-16 flex flex-col items-center text-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Mono className="text-accent">04 — Experimental Playground</Mono>
          <Heading className="max-w-xl text-balance tracking-tighter">Interactive Systems</Heading>
          <Body className="mx-auto max-w-lg mt-4 text-primary-200">
            A creative coding sandbox exploring procedural generation and DOM physics. Hover to interact.
          </Body>
        </motion.div>

        <motion.div 
          className="w-full max-w-4xl mx-auto aspect-square md:aspect-[2/1] border border-primary-700/50 bg-primary-900 rounded-sm relative overflow-hidden flex items-center justify-center p-8 cursor-none"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          data-cursor="true"
          data-cursor-text="PLAY"
        >
          <div className="grid grid-cols-12 md:grid-cols-24 gap-1 md:gap-2 w-full h-full p-2 relative z-10">
            {nodes.map((node) => {
              const x = node % 24;
              const y = Math.floor(node / 24);
              const hX = hoveredNode !== null ? hoveredNode % 24 : -1;
              const hY = hoveredNode !== null ? Math.floor(hoveredNode / 24) : -1;
              const distance = hoveredNode !== null ? Math.sqrt(Math.pow(x - hX, 2) + Math.pow(y - hY, 2)) : 100;
              
              const intensity = Math.max(0, 1 - distance / 4);

              return (
                <div 
                  key={node}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="w-full h-full rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                  style={{
                    backgroundColor: intensity > 0 
                      ? `rgba(255, 90, 54, ${intensity * 0.9})` 
                      : 'rgba(255, 255, 255, 0.02)',
                    transform: `scale(${1 + intensity * 0.8})`,
                    boxShadow: intensity > 0.5 ? `0 0 ${intensity * 20}px rgba(255,90,54,0.5)` : 'none'
                  }}
                >
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
