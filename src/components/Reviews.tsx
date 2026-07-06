import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { REVIEWS } from '../data';
import { TextReveal, LineReveal } from './TextReveal';

export function Reviews() {
  return (
    <section id="reviews" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-earth/5">
      <div className="text-center mb-16">
        <TextReveal as="h2" className="text-3xl md:text-5xl font-display font-semibold mb-4" accentWords={['Deneyimleri']}>
          Müşteri Deneyimleri
        </TextReveal>
        <LineReveal className="text-lg text-earth/80 max-w-2xl mx-auto tracking-wide" delay={0.2}>
          Müşterilerimizin dış mekan mobilya koleksiyonlarımız hakkında neler söylediğini dinleyin.
        </LineReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {REVIEWS.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="bg-sand-light rounded-3xl p-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-earth/10 flex-shrink-0 flex items-center justify-center text-earth-dark font-medium text-lg">
                {review.authorInitial}
              </div>
              <div>
                <h4 className="font-medium text-earth-dark">{review.authorName}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-[#F4B400] fill-[#F4B400]' : 'text-earth/20'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-earth/80 text-sm leading-relaxed italic line-clamp-4">
              "{review.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
