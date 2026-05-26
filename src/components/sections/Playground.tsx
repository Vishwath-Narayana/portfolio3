import { motion } from 'framer-motion';
import { Heading, Mono } from '../ui/Typography';
import { useState, useEffect, useRef } from 'react';

export const Playground = () => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  // Modulator parameters
  const [frequency, setFrequency] = useState(1.5);
  const [velocity, setVelocity] = useState(2.0);
  const [elasticity, setElasticity] = useState(0.8);
  
  // Phase for continuous wave propagation animation
  const [phase, setPhase] = useState(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      setPhase(prev => prev + (velocity * 0.05));
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [velocity]);

  const cols = 20;
  const rows = 10;
  const nodes = Array.from({ length: cols * rows }).map((_, i) => i);

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-primary-800 relative overflow-hidden flex flex-col justify-center border-t border-primary-700/50">
      <div className="max-w-[1600px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Modulator Panel Controls */}
        <motion.div 
          className="lg:col-span-4 flex flex-col gap-8 bg-primary-900 border border-primary-700/80 p-6 md:p-8 rounded-md shadow-2xl relative select-none"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-between items-center border-b border-primary-800 pb-3 mb-2">
            <Mono className="text-accent">Load Balancer Tuning</Mono>
            <span className="font-mono text-[8px] text-primary-500">[TRAFFIC_MODULATOR_V3]</span>
          </div>
          
          <div className="flex flex-col gap-6 font-mono text-[10px] text-primary-300">
            {/* Control 1: Frequency */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>WAVE_FREQUENCY</span>
                <span className="text-accent">{frequency.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="4.0" 
                step="0.1" 
                value={frequency} 
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full accent-accent h-1 bg-primary-800 rounded-lg cursor-pointer border-none outline-none appearance-none"
              />
            </div>

            {/* Control 2: Velocity */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>PROPAGATION_VELOCITY</span>
                <span className="text-accent">{velocity.toFixed(1)}X</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="5.0" 
                step="0.2" 
                value={velocity} 
                onChange={(e) => setVelocity(parseFloat(e.target.value))}
                className="w-full accent-accent h-1 bg-primary-800 rounded-lg cursor-pointer border-none outline-none appearance-none"
              />
            </div>

            {/* Control 3: Elasticity */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>GRID_ELASTICITY</span>
                <span className="text-accent">{(elasticity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="1.5" 
                step="0.1" 
                value={elasticity} 
                onChange={(e) => setElasticity(parseFloat(e.target.value))}
                className="w-full accent-accent h-1 bg-primary-800 rounded-lg cursor-pointer border-none outline-none appearance-none"
              />
            </div>
          </div>

          <div className="border-t border-primary-800 pt-4 flex flex-col gap-2 font-mono text-[8px] text-primary-500">
            <span>POOL_STATUS: HEALTHY</span>
            <span>REQUEST_PHASE: {phase.toFixed(2)}</span>
            <span>ROUTING_ALGO: LEAST_CONNECTIONS</span>
          </div>
        </motion.div>

        {/* Sandbox Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-2 select-none">
            <Mono className="text-accent">04 — Edge Node Sandbox</Mono>
            <Heading className="tracking-tighter">Traffic Distribution Matrix</Heading>
          </div>
          
          <motion.div 
            className="w-full aspect-[2/1] border border-primary-700/50 bg-primary-900 rounded-sm relative overflow-hidden flex items-center justify-center p-6 cursor-none shadow-2xl"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            data-cursor="true"
            data-cursor-text="DISTORT"
          >
            <div className="grid gap-1.5 w-full h-full p-2 relative z-10" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
              {nodes.map((node) => {
                const x = node % cols;
                const y = Math.floor(node / cols);
                const hX = hoveredNode !== null ? hoveredNode % cols : -1;
                const hY = hoveredNode !== null ? Math.floor(hoveredNode / cols) : -1;
                
                const distance = hoveredNode !== null ? Math.sqrt(Math.pow(x - hX, 2) + Math.pow(y - hY, 2)) : 100;
                
                // Physics-based wave ripple propagation logic
                let intensity = 0;
                let scaleVal = 1;
                let borderRadius = '50%';
                
                if (hoveredNode !== null) {
                  const maxDist = 8;
                  if (distance < maxDist) {
                    const waveVal = Math.sin(distance * frequency - phase) * (1 - distance / maxDist);
                    intensity = Math.max(0, waveVal);
                    scaleVal = 1 + waveVal * elasticity * 1.5;
                    borderRadius = waveVal > 0.3 ? '15%' : '50%';
                  }
                }

                return (
                  <div 
                    key={node}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="w-full h-full transition-all duration-300 ease-out flex items-center justify-center cursor-pointer select-none"
                    style={{
                      backgroundColor: intensity > 0.02
                        ? `rgba(255, 90, 54, ${intensity * 0.95})` 
                        : 'rgba(255, 255, 255, 0.035)',
                      transform: `scale(${scaleVal})`,
                      borderRadius: borderRadius,
                      boxShadow: intensity > 0.4 ? `0 0 ${intensity * 15}px rgba(255,90,54,0.4)` : 'none'
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
