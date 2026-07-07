import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data';
import { TextReveal, LineReveal } from './TextReveal';

type FaqItem = { question: string; answer: string };

export function FAQ({ faqs = FAQS }: { faqs?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <TextReveal as="h2" className="text-3xl md:text-5xl font-display font-semibold mb-4">
          Sorularınız mı var?
        </TextReveal>
        <LineReveal className="text-lg text-earth/80 tracking-wide" delay={0.2}>
          Ürünlerimiz ve hizmetlerimiz hakkında bilmeniz gereken her şey.
        </LineReveal>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="bg-white rounded-3xl overflow-hidden border border-earth/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-display font-medium text-lg">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-earth/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6 text-earth/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
