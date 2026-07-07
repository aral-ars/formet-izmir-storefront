'use client';

import { usePathname } from 'next/navigation';
import { SmoothScroll } from './SmoothScroll';
import { PageTransitionProvider } from './PageTransition';
import { TooltipProvider } from '@/components/ui/tooltip';

// Site-wide providers. Sanity Studio (/studio) manages its own scrolling,
// routing and chrome, so we keep Lenis smooth-scroll and the view-transition
// overlay out of it — otherwise they hijack the Studio UI.
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <TooltipProvider>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </TooltipProvider>
    </SmoothScroll>
  );
}
