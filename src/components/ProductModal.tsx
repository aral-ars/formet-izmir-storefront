import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle } from 'lucide-react';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi, I'm interested in the ${product.name}. Could you provide more info?`);
    window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl flex flex-col lg:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-3 bg-white/50 hover:bg-white backdrop-blur-md rounded-full transition-colors text-earth-dark"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Gallery */}
            <div className="w-full lg:w-1/2 h-64 lg:h-auto overflow-y-auto no-scrollbar bg-sand/30 p-4">
              <div className="flex flex-col gap-4">
                {product.images?.map((img: string, idx: number) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`${product.name} detail ${idx + 1}`} 
                    className="w-full rounded-[1.5rem] object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 overflow-y-auto no-scrollbar flex flex-col bg-white/50">
              <div className="inline-block px-4 py-1.5 bg-white rounded-full text-xs font-semibold mb-6 self-start shadow-sm text-earth-dark">
                {product.tag}
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-display font-semibold mb-3 text-earth-dark">{product.name}</h2>
              <p className="text-2xl text-earth/70 font-medium mb-8">{product.price}</p>
              
              <div className="mb-10">
                <p className="text-earth/80 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
              
              <div className="mb-12">
                <h3 className="font-display font-medium text-xl mb-6 text-earth-dark">Specifications</h3>
                <div className="space-y-4">
                  {product.specs?.map((spec: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-4 border-b border-earth/10 last:border-0">
                      <span className="text-earth/60 font-medium">{spec.label}</span>
                      <span className="font-medium text-right max-w-[60%] text-earth-dark">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto pt-8">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-5 rounded-full font-medium flex items-center justify-center space-x-3 transition-colors cursor-pointer shadow-lg shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg">Inquire via WhatsApp</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
