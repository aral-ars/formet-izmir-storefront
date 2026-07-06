'use client';

import { usePageTransition } from './PageTransition';

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const { startTransition } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow cmd/ctrl+click for new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    
    onClick?.(e);
    if (e.defaultPrevented) return;
    
    e.preventDefault();
    startTransition(href);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
