import { motion, useScroll, useTransform } from 'framer-motion';
import { Mono, ThinText } from '../ui/Typography';
import { useRef, useEffect, useState } from 'react';

export const Contact = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const blurVal = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const blur = useTransform(blurVal, (v) => `blur(${v}px)`);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#050505] flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
       {/* Ambient glow system shutdown */}
       <motion.div 
         className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-[#050505] to-[#050505]"
         style={{ opacity: useTransform(scrollYProgress, [0, 1], [0, 1]) }}
       />

       <motion.div 
          style={isMobile ? {} : { scale, opacity, filter: blur }}
          className="text-center flex flex-col items-center gap-12 z-10 w-full max-w-[1600px] mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
             <Mono className="text-accent uppercase tracking-widest text-[10px] md:text-xs border border-accent/20 px-4 py-2 rounded-full backdrop-blur-sm bg-primary-900/30 shadow-[0_0_15px_rgba(255,90,54,0.1)]">
               System Offline. Ready for deployment.
             </Mono>
          </motion.div>
          
          <a 
            href="mailto:hello@example.com" 
            className="group relative inline-block mx-auto cursor-none w-full"
            data-cursor="true"
            data-cursor-text="CONNECT"
          >
            <h2 className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-bold tracking-tighter leading-[0.8] text-text-light group-hover:text-white transition-colors duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] inline-block text-center w-full pb-8">
              <ThinText className="text-primary-600 group-hover:text-primary-300 transition-colors duration-1000">BUILDING</ThinText><br/>
              SYSTEMS<br/>
              <ThinText className="text-primary-600 group-hover:text-primary-300 transition-colors duration-1000">THAT FEEL</ThinText><br/>
              ALIVE.
            </h2>
          </a>
       </motion.div>

       <motion.div 
         className="absolute bottom-8 md:bottom-12 w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-6 text-text-muted z-20"
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ delay: 1, duration: 1 }}
       >
         <Mono className="text-[10px]">&copy; 2026 VISHWATH. ALL SYSTEMS GO.</Mono>
         <div className="flex gap-8">
           <a href="#" className="hover:text-accent transition-colors duration-300 cursor-none" data-cursor="true"><Mono className="text-[10px]">LINKEDIN</Mono></a>
           <a href="#" className="hover:text-accent transition-colors duration-300 cursor-none" data-cursor="true"><Mono className="text-[10px]">GITHUB</Mono></a>
           <a href="#" className="hover:text-accent transition-colors duration-300 cursor-none" data-cursor="true"><Mono className="text-[10px]">RESUME</Mono></a>
         </div>
       </motion.div>
    </section>
  );
};
