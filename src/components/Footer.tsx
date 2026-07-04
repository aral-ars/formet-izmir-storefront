import { ASSETS } from '../data';

export function Footer() {
  return (
    <footer className="bg-earth-dark text-sand-light py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
        <div className="md:col-span-1">
          <div className="font-display font-bold text-2xl tracking-tight mb-6">FORMET</div>
          <p className="text-sand-light/60 text-sm max-w-xs">
            Precision-crafted outdoor furniture. Form meets function in the open air.
          </p>
        </div>
        
        <div>
          <h4 className="font-display font-medium text-lg mb-6">Collections</h4>
          <ul className="space-y-4 text-sand-light/60 text-sm">
            <li><a href="#" className="hover:text-sand-light transition-colors">Pisa Modular</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Santana Lounge</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Dining Series</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Accessories</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-medium text-lg mb-6">Support</h4>
          <ul className="space-y-4 text-sand-light/60 text-sm">
            <li><a href="#faq" className="hover:text-sand-light transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Care Guide</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Warranty</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Returns</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-medium text-lg mb-6">Stay Inspired</h4>
          <p className="text-sand-light/60 text-sm mb-4">Subscribe for new arrivals and styling tips.</p>
          <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent border-none outline-none px-4 text-sm text-sand-light w-full placeholder:text-sand-light/40"
            />
            <button className="bg-sand-light text-earth-dark px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-sand-light/40">
        <p>&copy; {new Date().getFullYear()} Formet Outdoor Furniture. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-sand-light transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-sand-light transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
