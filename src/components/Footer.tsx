import { ASSETS } from '../data';

export function Footer() {
  return (
    <footer className="bg-earth-dark text-sand-light py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
        <div className="md:col-span-1">
          <div className="font-display font-bold text-2xl tracking-tight mb-6">FORMET</div>
          <p className="text-sand-light/60 text-sm max-w-xs">
            Hassasiyetle üretilmiş dış mekan mobilyaları. Açık havada form ve işlevin buluşması.
          </p>
        </div>
        
        <div>
          <h4 className="font-display font-medium text-lg mb-6">Koleksiyonlar</h4>
          <ul className="space-y-4 text-sand-light/60 text-sm">
            <li><a href="#" className="hover:text-sand-light transition-colors">Pisa Modüler</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Santana Dinlenme</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Yemek Serisi</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Aksesuarlar</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-medium text-lg mb-6">Destek</h4>
          <ul className="space-y-4 text-sand-light/60 text-sm">
            <li><a href="#faq" className="hover:text-sand-light transition-colors">SSS</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Bakım Kılavuzu</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">Garanti</a></li>
            <li><a href="#" className="hover:text-sand-light transition-colors">İadeler</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-medium text-lg mb-6">İlham Alın</h4>
          <p className="text-sand-light/60 text-sm mb-4">Yeni ürünler ve stil ipuçları için abone olun.</p>
          <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              className="bg-transparent border-none outline-none px-4 text-sm text-sand-light w-full placeholder:text-sand-light/40"
            />
            <button className="bg-sand-light text-earth-dark px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors cursor-pointer">
              Abone Ol
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-sand-light/40">
        <p>&copy; {new Date().getFullYear()} Formet Dış Mekan Mobilyaları. Tüm hakları saklıdır.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-sand-light transition-colors">Gizlilik Politikası</a>
          <a href="#" className="hover:text-sand-light transition-colors">Hizmet Şartları</a>
        </div>
      </div>
    </footer>
  );
}
