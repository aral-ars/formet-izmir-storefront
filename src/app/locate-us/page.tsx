"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import { Store, ArrowUpRight } from "lucide-react";
import { useContact } from "@/components/SiteSettingsProvider";
import { telHref } from "@/data";

export default function LocateUs() {
  const contact = useContact();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. Line draws from top (0) down to the center (0 to 0.4 progress)
  const lineHeight = useTransform(scrollYProgress, [0, 0.4, 1], ["0%", "50%", "50%"]);
  
  // 2. Map expands from the center via a split/clip reveal and subtle scale (0.4 to 0.6)
  // Explicitly mapping 0-1 range ensures the browser never extrapolates and breaks the clip path
  const mapClipPath = useTransform(
    scrollYProgress, 
    [0, 0.4, 0.6, 1], 
    ["inset(50% round 16px)", "inset(50% round 16px)", "inset(0% round 16px)", "inset(0% round 16px)"]
  );
  const mapScale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.95, 0.95, 1, 1]);
  
  // 3. Info fades in and floats up slightly (0.6 to 0.8)
  const infoOpacity = useTransform(scrollYProgress, [0, 0.6, 0.8, 1], [0, 0, 1, 1]);
  const infoY = useTransform(scrollYProgress, [0, 0.6, 0.8, 1], [30, 30, 0, 0]);

  return (
    <div className="bg-sand-light min-h-screen text-earth-dark">
      <Navbar forceDarkText />
      
      {/* Scroll track: high enough to allow the sequence to play out */}
      <div ref={containerRef} className="h-[250vh] relative">
        
        {/* Sticky stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
          
          {/* Animated vertical line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="w-px bg-earth-dark/30 absolute top-0 left-1/2 -translate-x-1/2 z-0"
          />

          {/* Map Square */}
          {/* We position it absolutely at exactly 50% from the top so its center is at the line's end */}
          <motion.div
            style={{ 
              clipPath: mapClipPath,
              scale: mapScale, 
              top: '50%',
              y: '-50%'
            }}
            className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[424px] md:h-[424px] bg-white p-1.5 md:p-2 border border-earth/10 rounded-2xl shadow-2xl flex items-center justify-center z-10"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Map
                 center={[26.868203, 38.374036]}
                 zoom={14}
                 pitch={0}
                 theme="light"
                 styles={{
                   light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                   dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                 }}
               >
                 <MapControls position="top-right" showZoom />
                 <MapMarker longitude={26.868203} latitude={38.374036}>
                   <MarkerContent>
                     <a
                       href={contact.mapUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="relative flex items-center justify-center group cursor-pointer"
                     >
                       {/* Tooltip on hover */}
                       <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-400 ease-out pointer-events-none whitespace-nowrap bg-white/95 backdrop-blur-md text-earth-dark text-[13px] px-4 py-2 rounded-full shadow-lg border border-white z-20 flex flex-col items-center font-medium">
                         <span className="flex items-center gap-1.5">
                           Yol tarifi al
                           <ArrowUpRight size={14} className="opacity-70 stroke-[2.5]" />
                         </span>
                         <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white"></div>
                       </div>

                       {/* Ping Ring */}
                       <div 
                         className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                         style={{ animationDuration: '3s' }}
                       />
                       
                       {/* Main Pin */}
                       <div className="relative bg-blue-500 p-2.5 rounded-full shadow-lg border-2 border-white transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-600 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:border-blue-100">
                         <Store size={15} className="text-white" />
                       </div>
                     </a>
                   </MarkerContent>
                 </MapMarker>
               </Map>
            </div>
          </motion.div>

          {/* Info Text below the map */}
          {/* Since map is centered at 50%, its bottom edge is at 50% + 160px. We'll place text below that. */}
          <motion.div
            style={{ 
              opacity: infoOpacity, 
              y: infoY,
              top: 'calc(50% + 230px)' 
            }}
            className="absolute w-full px-6 flex flex-col items-center text-center z-10 pt-4 md:pt-0"
          >
            <h1 className="font-display font-medium text-3xl md:text-4xl tracking-tight text-earth-dark mb-4">
              Zarafeti deneyimleyin.
            </h1>
            <p className="font-light text-earth/70 max-w-sm mb-8 text-sm md:text-base">
              İzmir mağazamızı ziyaret ederek koleksiyonlarımızı yakından inceleyin.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-sm items-center">
              <div className="flex flex-col items-center">
                <span className="uppercase tracking-widest text-[10px] font-medium text-earth/50 mb-1.5">Konum</span>
                <span className="font-light text-earth-dark">
                  {contact.addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < contact.addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
              <div className="w-12 h-px sm:w-px sm:h-8 bg-earth/20"></div>
              <div className="flex flex-col items-center">
                <span className="uppercase tracking-widest text-[10px] font-medium text-earth/50 mb-1.5">İletişim</span>
                <a href={telHref(contact.phone)} className="font-light text-earth-dark hover:text-earth transition-colors">{contact.phone}</a>
                <a href={`mailto:${contact.email}`} className="font-light text-earth-dark hover:text-earth transition-colors mt-0.5">{contact.email}</a>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
