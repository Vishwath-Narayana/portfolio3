import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Mono, Body, StaggeredReveal, VerticalText } from '../ui/Typography';
import { cn } from '../../lib/utils';
import { useRef } from 'react';

export const Philosophy = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-warm-50 text-primary-900 selection:bg-accent selection:text-white relative overflow-hidden">
      
      {/* Paper Grain Texture */}
      <svg className="absolute inset-0 z-0 w-full h-full opacity-[0.4] pointer-events-none mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilterPhilosophy">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilterPhilosophy)"/>
      </svg>

      {/* Subtle architectural lines */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Parallax Annotations */}
      <motion.div style={{ y: y2 }} className="absolute right-12 top-48 hidden lg:block opacity-30 z-10">
        <VerticalText className="font-mono text-xs tracking-widest text-primary-900">SYS_LOG: ARCHITECTURE_OVER_AESTHETICS</VerticalText>
      </motion.div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10">
        
        <div className="lg:col-span-4 flex flex-col gap-8 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-48"
          >
            <Mono className="text-primary-900/40 mb-6 block">02 — Philosophy</Mono>
            <Heading className="max-w-xs text-balance tracking-tighter">
              <StaggeredReveal text="Infrastructure dictates the human experience." />
            </Heading>
          </motion.div>
        </div>

        <motion.div style={{ y: y1 }} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-xl font-medium tracking-tight">The Illusion of Frontend</h3>
            <Body className={cn("text-primary-800/80")}>
              We often treat the interface as the product. But a beautiful UI backed by brittle architecture is a facade. Real user experience is bound by latency, deployment models, and database design. I engineer from the metal up.
            </Body>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-xl font-medium tracking-tight">Motion as Feedback</h3>
            <Body className={cn("text-primary-800/80")}>
              Motion isn't decoration; it's communication. Using physics-based DOM interpolation, I design interactions that provide subconscious reassurance. A system that moves with natural inertia feels inherently more trustworthy.
            </Body>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-xl font-medium tracking-tight">Systems, Not Pages</h3>
            <Body className={cn("text-primary-800/80")}>
              I do not design pages. I design scalable token architectures and modular components that empower product teams. True scalability comes from minimizing entropy at the foundation.
            </Body>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-xl font-medium tracking-tight">Engineering Empathy</h3>
            <Body className={cn("text-primary-800/80")}>
              The best developers understand the cognitive load of their end users. The best designers understand the runtime cost of their animations. I exist in the overlap, ensuring neither side compromises the other.
            </Body>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
