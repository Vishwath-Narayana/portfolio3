import { motion } from 'framer-motion';
import { Heading, Mono, Body } from '../ui/Typography';

const events = [
  { year: '2025', title: 'Senior Creative Technologist', company: 'Design Systems Inc.', description: 'Architecting scalable UI systems and leading frontend infrastructure.' },
  { year: '2023', title: 'Full Stack Engineer', company: 'Fintech Core', description: 'Developed highly resilient backend systems coupled with intuitive dashboards.' },
  { year: '2021', title: 'UI/UX Designer', company: 'Creative Agency', description: 'Crafted award-winning digital experiences focusing on motion and interaction.' },
];

export const Timeline = () => {
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-warm-50 text-primary-900 selection:bg-accent selection:text-white border-t border-warm-100/50">
       <div className="max-w-[1600px] mx-auto">
         <motion.div 
          className="mb-24 flex justify-between items-end border-b border-primary-900/10 pb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading className="tracking-tighter">Journey</Heading>
          <Mono className="text-primary-900/50">06 — Timeline</Mono>
        </motion.div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group"
            >
              <div className="md:col-span-2 pt-1">
                <Mono className="text-primary-900/50 text-lg md:text-xl group-hover:text-accent transition-colors duration-300">{event.year}</Mono>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-2 text-balance">{event.title}</h3>
                <Mono className="text-primary-900/60">{event.company}</Mono>
              </div>
              <div className="md:col-span-6 md:pt-2">
                <Body className="text-primary-800/80 max-w-lg">{event.description}</Body>
              </div>
            </motion.div>
          ))}
        </div>
       </div>
    </section>
  );
};
