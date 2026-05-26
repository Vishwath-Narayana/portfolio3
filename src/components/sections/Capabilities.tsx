import { motion } from 'framer-motion';
import { Heading, Mono } from '../ui/Typography';

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
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-primary-900 border-t border-primary-800">
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
              <Mono className="text-accent">{group.title}</Mono>
              <ul className="flex flex-col gap-0">
                {group.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-text-light/80 font-light text-sm md:text-base border-t border-primary-800 py-4 group hover:text-white transition-colors duration-300">
                    <span>{item}</span>
                    <Mono className="text-[9px] text-primary-700 transition-colors duration-300 group-hover:text-primary-500">SYS_{String(idx + 1).padStart(2, '0')}</Mono>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
