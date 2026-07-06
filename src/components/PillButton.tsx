import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { TransitionLink } from './TransitionLink';
import { HTMLMotionProps, motion } from 'motion/react';

interface PillButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children: ReactNode;
  href?: string;
  className?: string;
}

export function PillButton({ children, href, className = '', ...props }: PillButtonProps) {
  const baseClasses = `group flex items-center bg-earth-dark text-white rounded-full pl-6 pr-2 py-2 hover:bg-earth transition-colors shadow-lg shadow-earth-dark/20 ${className}`;
  
  const content = (
    <>
      <span className="text-sm font-medium mr-4">{children}</span>
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-earth-dark flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
      </div>
    </>
  );

  if (href) {
    return (
      <motion.div {...(props as any)}>
        <TransitionLink href={href} className={baseClasses}>
          {content}
        </TransitionLink>
      </motion.div>
    );
  }

  return (
    <motion.button className={baseClasses} {...props}>
      {content}
    </motion.button>
  );
}
