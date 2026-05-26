import { cn } from '../../lib/utils';

interface GridLinesProps {
  className?: string;
}

export const GridLines = ({ className }: GridLinesProps) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden z-0", className)}>
      <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
    </div>
  );
};
