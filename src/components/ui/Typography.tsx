import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export const Display = ({ children, className, as: Component = 'h1', ...props }: TypographyProps) => {
  return (
    <Component className={cn("text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.9]", className)} {...props}>
      {children}
    </Component>
  );
};

export const Heading = ({ children, className, as: Component = 'h2', ...props }: TypographyProps) => {
  return (
    <Component className={cn("text-3xl md:text-5xl font-semibold tracking-tight leading-tight", className)} {...props}>
      {children}
    </Component>
  );
};

export const Body = ({ children, className, as: Component = 'p', ...props }: TypographyProps) => {
  return (
    <Component className={cn("text-lg md:text-xl text-text-muted font-light leading-relaxed max-w-2xl", className)} {...props}>
      {children}
    </Component>
  );
};

export const Mono = ({ children, className, as: Component = 'span', ...props }: TypographyProps) => {
  return (
    <Component className={cn("font-mono text-xs md:text-sm uppercase tracking-widest text-text-muted", className)} {...props}>
      {children}
    </Component>
  );
};

export const OversizedNumeric = ({ children, className, as: Component = 'span', ...props }: TypographyProps) => {
  return (
    <Component className={cn("font-mono text-6xl md:text-9xl tracking-tighter opacity-10 leading-none", className)} {...props}>
      {children}
    </Component>
  );
};

export const ThinText = ({ children, className, as: Component = 'span', ...props }: TypographyProps) => {
  return (
    <Component className={cn("font-thin tracking-wide", className)} {...props}>
      {children}
    </Component>
  );
};

const RevealWord = ({ word, index }: { word: string, index: number }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.transform = 'translateY(0)';
        observer.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '-10%' });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span className="overflow-hidden inline-flex">
      <span
        ref={ref}
        className="inline-block mr-[0.25em] translate-y-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transitionDelay: `${index * 50}ms` }}
      >
        {word}
      </span>
    </span>
  );
};

export const StaggeredReveal = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {words.map((word, i) => (
        <RevealWord key={i} word={word} index={i} />
      ))}
    </span>
  );
};

export const VerticalText = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("writing-vertical-rl rotate-180", className)}>
      {children}
    </div>
  );
};
