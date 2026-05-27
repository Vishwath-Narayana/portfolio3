import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Mono, Body, StaggeredReveal, VerticalText } from '../ui/Typography';
import { useRef } from 'react';

export const Philosophy = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -160]);

  // Background clip sweep transition (dark to light)
  const clipPercent = useTransform(scrollYProgress, [0.05, 0.35], [100, 0]);
  const clipPath = useTransform(clipPercent, v => `inset(0px 0px ${v}% 0px)`);

  // Text opacity fade linked to the sweep transition
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0.1, 1]);

  return (
    <section ref={containerRef} className="py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-[#0B0B0B] text-primary-900 selection:bg-accent selection:text-white relative overflow-hidden z-10 transition-colors duration-700">
      
      {/* Light Surface Layer (Sweeps Down on Scroll) */}
      <motion.div 
        style={{ clipPath }}
        className="absolute inset-0 bg-warm-50 z-0 pointer-events-none"
      />

      {/* Paper Grain Texture Overlay */}
      <svg className="absolute inset-0 z-0 w-full h-full opacity-[0.35] pointer-events-none mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilterPhilosophy">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilterPhilosophy)"/>
      </svg>

      {/* Subtle architectural lines */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Parallax Annotations */}
      <motion.div style={{ y: y2 }} className="absolute right-12 top-48 hidden lg:block opacity-35 z-10 select-none">
        <VerticalText className="font-mono text-xs tracking-widest text-primary-900">SYS_LOG: ARCHITECTURE_OVER_AESTHETICS</VerticalText>
      </motion.div>

      <motion.div 
        style={{ opacity: textOpacity }}
        className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10"
      >
        <div className="lg:col-span-4 flex flex-col gap-8 relative">
          <div className="sticky top-48">
            <Mono className="text-primary-900/40 mb-6 block">02 — Philosophy</Mono>
            <Heading className="max-w-xs text-balance tracking-tighter text-primary-900">
              <StaggeredReveal text="Infrastructure dictates the human experience." />
            </Heading>
          </div>
        </div>

        <motion.div style={{ y: y1 }} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-x-20 lg:gap-y-16 lg:pt-32">
          {/* Card 1 */}
          <div className="flex flex-col gap-5 border-t border-primary-900/10 pt-8 group">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-accent font-semibold">[SYS_01]</span>
              <span className="font-mono text-[9px] text-primary-900/40 uppercase">Frontend Facade</span>
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-primary-900">The Illusion of Frontend</h3>
            <Body className="text-primary-800/80 leading-relaxed text-sm md:text-base font-light">
              We often treat the interface as the product. But a beautiful UI backed by brittle architecture is a facade. Real user experience is bound by latency, deployment models, and database design. I engineer from the metal up.
            </Body>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-5 border-t border-primary-900/10 pt-8 group">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-accent font-semibold">[SYS_02]</span>
              <span className="font-mono text-[9px] text-primary-900/40 uppercase">Motion Physics</span>
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-primary-900">Motion as Feedback</h3>
            <Body className="text-primary-800/80 leading-relaxed text-sm md:text-base font-light">
              Motion isn't decoration; it's communication. Using physics-based DOM interpolation, I design interactions that provide subconscious reassurance. A system that moves with natural inertia feels inherently more trustworthy.
            </Body>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-5 border-t border-primary-900/10 pt-8 group">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-accent font-semibold">[SYS_03]</span>
              <span className="font-mono text-[9px] text-primary-900/40 uppercase">Token Architecture</span>
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-primary-900">Systems, Not Pages</h3>
            <Body className="text-primary-800/80 leading-relaxed text-sm md:text-base font-light">
              I do not design pages. I design scalable token architectures and modular components that empower product teams. True scalability comes from minimizing entropy at the foundation.
            </Body>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col gap-5 border-t border-primary-900/10 pt-8 group">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-accent font-semibold">[SYS_04]</span>
              <span className="font-mono text-[9px] text-primary-900/40 uppercase">Cognitive Load</span>
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-primary-900">Engineering Empathy</h3>
            <Body className="text-primary-800/80 leading-relaxed text-sm md:text-base font-light">
              The best developers understand the cognitive load of their end users. The best designers understand the runtime cost of their animations. I exist in the overlap, ensuring neither side compromises the other.
            </Body>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
