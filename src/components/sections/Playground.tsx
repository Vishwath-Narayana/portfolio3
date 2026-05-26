import { motion } from 'framer-motion';
import { Heading, Mono } from '../ui/Typography';
import { useState, useEffect, useRef } from 'react';

export const Playground = () => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  // Simulation parameters
  const [throughput, setThroughput] = useState(2.0); // Packets per interval
  const [latency, setLatency] = useState(1.0); // Base processing time
  const [capacity, setCapacity] = useState(0.8); // Saturation threshold
  
  // Node traffic state: array of load values
  const cols = 20;
  const rows = 10;
  const totalNodes = cols * rows;
  const [nodeLoads, setNodeLoads] = useState<number[]>(new Array(totalNodes).fill(0));
  
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      
      // Update loads roughly every 50ms
      if (deltaTime > 50) {
        setNodeLoads(prev => {
          const next = [...prev];
          
          // 1. Decay all loads (simulating request processing)
          for (let i = 0; i < next.length; i++) {
            next[i] = Math.max(0, next[i] - (0.05 * (2 - latency)));
          }
          
          // 2. Distribute new traffic
          const trafficSpike = Math.floor(Math.random() * throughput * 3);
          for (let t = 0; t < trafficSpike; t++) {
            // Favor the hovered node area if present
            let targetNode = Math.floor(Math.random() * totalNodes);
            if (hoveredNode !== null && Math.random() > 0.4) {
               // cluster traffic around hovered node
               const hX = hoveredNode % cols;
               const hY = Math.floor(hoveredNode / cols);
               const dx = Math.floor(Math.random() * 5) - 2;
               const dy = Math.floor(Math.random() * 5) - 2;
               const tx = Math.max(0, Math.min(cols - 1, hX + dx));
               const ty = Math.max(0, Math.min(rows - 1, hY + dy));
               targetNode = ty * cols + tx;
            }
            
            // Add load
            next[targetNode] = Math.min(1.5, next[targetNode] + 0.2);
          }
          
          return next;
        });
        lastTimeRef.current = time;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [throughput, latency, hoveredNode]);

  const nodes = Array.from({ length: totalNodes }).map((_, i) => i);
  
  // Calculate aggregate stats
  const totalLoad = nodeLoads.reduce((a,b) => a+b, 0);
  const avgLoad = totalLoad / totalNodes;
  const isHealthy = avgLoad < capacity;

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
            {/* Control 1: Throughput */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>REQUEST_THROUGHPUT</span>
                <span className="text-accent">{(throughput * 1000).toFixed(0)} REQ/S</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="4.0" 
                step="0.1" 
                value={throughput} 
                onChange={(e) => setThroughput(parseFloat(e.target.value))}
                className="w-full accent-accent h-1 bg-primary-800 rounded-lg cursor-pointer border-none outline-none appearance-none"
              />
            </div>

            {/* Control 2: Latency */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>PROCESSING_LATENCY</span>
                <span className="text-accent">{(latency * 15).toFixed(1)} MS</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="1.5" 
                step="0.1" 
                value={latency} 
                onChange={(e) => setLatency(parseFloat(e.target.value))}
                className="w-full accent-accent h-1 bg-primary-800 rounded-lg cursor-pointer border-none outline-none appearance-none"
              />
            </div>

            {/* Control 3: Capacity */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>NODE_CAPACITY_LIMIT</span>
                <span className="text-accent">{(capacity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.4" 
                max="1.2" 
                step="0.1" 
                value={capacity} 
                onChange={(e) => setCapacity(parseFloat(e.target.value))}
                className="w-full accent-accent h-1 bg-primary-800 rounded-lg cursor-pointer border-none outline-none appearance-none"
              />
            </div>
          </div>

          <div className="border-t border-primary-800 pt-4 flex flex-col gap-2 font-mono text-[8px] text-primary-500">
            <span className={isHealthy ? 'text-green-500' : 'text-red-500'}>
              POOL_STATUS: {isHealthy ? 'HEALTHY' : 'SATURATED'}
            </span>
            <span>AVG_NODE_LOAD: {(avgLoad * 100).toFixed(1)}%</span>
            <span>ACTIVE_CONNECTIONS: {Math.floor(totalLoad * 50)}</span>
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
                const load = nodeLoads[node] || 0;
                
                // Color scaling based on load vs capacity
                let bgState = 'rgba(255, 255, 255, 0.035)';
                let glow = 'none';
                
                if (load > 0.05) {
                   if (load > capacity * 1.2) {
                      // Critical (Red)
                      bgState = `rgba(239, 68, 68, ${Math.min(0.9, load)})`; // text-red-500 equivalent
                      glow = `0 0 15px rgba(239, 68, 68, 0.5)`;
                   } else if (load > capacity * 0.8) {
                      // Warning (Yellow)
                      bgState = `rgba(234, 179, 8, ${Math.min(0.8, load)})`; // text-yellow-500 equivalent
                      glow = `0 0 10px rgba(234, 179, 8, 0.3)`;
                   } else {
                      // Healthy/Active (Accent/Orange)
                      bgState = `rgba(255, 90, 54, ${Math.min(0.6, load)})`;
                      glow = `0 0 5px rgba(255, 90, 54, 0.2)`;
                   }
                }

                // Node physical reaction
                const scaleVal = 1 + Math.min(0.5, load * 0.3);

                return (
                  <div 
                    key={node}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="w-full h-full transition-all duration-300 ease-out flex items-center justify-center cursor-pointer select-none rounded-[15%]"
                    style={{
                      backgroundColor: bgState,
                      transform: `scale(${scaleVal})`,
                      boxShadow: glow
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
