import { motion, useScroll, useTransform } from 'framer-motion';
import { Mono } from '../ui/Typography';
import { useRef, useEffect, useState } from 'react';

// Decrypting Signal focus lock text animation
const SignalFocusText = ({ text, scrollYProgress }: { text: string; scrollYProgress: any }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    return scrollYProgress.on("change", (latest: number) => {
      // Calculate decryption progress (scrambled at bottom entry -> fully decoded at bottom exit)
      const decryptProgress = Math.max(0, Math.min(1, (latest - 0.3) / 0.65));
      const charsToDecrypt = Math.floor(decryptProgress * text.length);

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%@$";
      const result = text.split("").map((char, index) => {
        if (char === " " || char === "\n") return char;
        if (index < charsToDecrypt) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      
      setDisplayText(result);
    });
  }, [text, scrollYProgress]);

  return <span>{displayText}</span>;
};

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

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-[#050505] flex flex-col items-center justify-center min-h-screen relative overflow-hidden select-none">
       {/* Radial shutdown gradient */}
       <motion.div 
         className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-[#050505] to-[#050505]"
         style={{ opacity: bgOpacity }}
       />

       <motion.div 
          style={isMobile ? {} : { scale, opacity }}
          className="text-center flex flex-col items-center gap-12 z-10 w-full max-w-[1600px] mt-16 flex-1 justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
             <Mono className="text-accent uppercase tracking-widest text-[9px] border border-accent/25 px-4 py-2 rounded-full backdrop-blur-sm bg-primary-900/40 shadow-[0_0_15px_rgba(255,90,54,0.08)]">
               System Offline. Terminals Suspended.
             </Mono>
          </motion.div>
          
          <a 
            href="mailto:hello@example.com" 
            className="group relative inline-block mx-auto cursor-none w-full"
            data-cursor="true"
            data-cursor-text="CONNECT"
          >
            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold tracking-tighter leading-[0.85] text-text-light group-hover:text-white transition-colors duration-1000 inline-block text-center w-full pb-8 font-sans">
              <span className="text-primary-600 group-hover:text-primary-300 transition-colors duration-1000">
                <SignalFocusText text="BUILDING" scrollYProgress={scrollYProgress} />
              </span><br/>
              <SignalFocusText text="SYSTEMS" scrollYProgress={scrollYProgress} /><br/>
              <span className="text-primary-600 group-hover:text-primary-300 transition-colors duration-1000">
                <SignalFocusText text="THAT FEEL" scrollYProgress={scrollYProgress} />
              </span><br/>
              <SignalFocusText text="ALIVE." scrollYProgress={scrollYProgress} />
            </h2>
          </a>
       </motion.div>

       {/* Narrative Footer: System Shutdown Diagnostics */}
       <div className="w-full max-w-[1600px] border-t border-primary-800/60 pt-12 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-[9px] text-primary-500 uppercase tracking-widest relative z-20 select-none">
         {/* Column 1: Memory dump */}
         <div className="flex flex-col gap-1.5 opacity-55">
           <span>[SYS_SHUTDOWN_SEQUENCE]</span>
           <span>MEM_DUMP: 0x00FF8C20 -&gt; 0x00FFA410</span>
           <span>DUMP_SIZE: 65,536 BYTES</span>
           <span>LATTICE_INTEGRITY: 100% OK</span>
           <span>PROCESS_EXIT_CODE: 0 (SUCCESS)</span>
         </div>
         
         {/* Column 2: Compiles & Host */}
         <div className="flex flex-col gap-1.5 justify-center items-center md:items-start opacity-55">
           <span>BUILD_ID: V3.0-STABLE</span>
           <span>COMPILED_BY: ANTIGRAVITY_AI</span>
           <span>HOST: VISHWATHNARAYANA.IN</span>
           <span>DAEMONS_SUSPENDED: TRUE</span>
         </div>

         {/* Column 3: Links and copyright */}
         <div className="flex flex-col gap-3 md:items-end justify-between">
           <div className="flex gap-6">
             <a href="#" className="hover:text-accent transition-colors duration-300 cursor-none" data-cursor="true">LINKEDIN</a>
             <a href="#" className="hover:text-accent transition-colors duration-300 cursor-none" data-cursor="true">GITHUB</a>
             <a href="#" className="hover:text-accent transition-colors duration-300 cursor-none" data-cursor="true">RESUME</a>
           </div>
           <span className="text-[9px] text-primary-600">&copy; 2026 VISHWATH. ALL RIGHTS SECURED.</span>
         </div>
       </div>
    </section>
  );
};
