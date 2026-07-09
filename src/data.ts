export const ASSETS = {
  formetWordmarkBlack: '/assets/formet-wordmark-black.png',
  formetWordmarkWhite: '/assets/formet-wordmark-white.png',
  pisaLifestyle: '/assets/pisa-lifestyle.png',
  pisaSofa: '/assets/pisa-sofa.png',
  pisaTable: '/assets/pisa-table.png',
  santanaChair: '/assets/santana-chair.png',
  santanaDetail: '/assets/santana-detail.png',
  santanaLifestyle: '/assets/santana-lifestyle.png',
  santanaSofa: '/assets/santana-sofa.png',
  santanaTable: '/assets/santana-table.png',
};

// ── Contact / showroom details ───────────────────────────────────────────
// Single source of truth for the local (Sanity-unconfigured) build, and the
// seed source for the `siteSettings` singleton. NOTE: phone / whatsapp / email
// / mapUrl are placeholders consolidated from the old inline values — confirm
// the real ones (or set them in Studio once Sanity is connected).
export interface HoursRow {
  /** Day range label, e.g. "Pzt - Cmt". */
  days: string;
  /** Hours or status, e.g. "10:00 - 19:00" or "Kapalı". */
  value: string;
}

export interface Contact {
  /** Display phone, e.g. "+90 (232) 555 0123". */
  phone: string;
  /** WhatsApp number for wa.me links — country code, digits only. */
  whatsapp: string;
  email: string;
  /** Address, one entry per rendered line. */
  addressLines: string[];
  /** Google Maps "get directions" link. */
  mapUrl: string;
  hours: HoursRow[];
}

export const CONTACT: Contact = {
  phone: '+90 (232) 555 0123',
  whatsapp: '905324567890',
  email: 'hello@formet-outdoor.com',
  addressLines: ['Mithatpaşa Caddesi No:651', 'Siteler Mahallesi, İzmir'],
  mapUrl: 'https://maps.app.goo.gl/cN8DDk2KxbBAzgrk6',
  hours: [
    { days: 'Pzt - Cmt', value: '10:00 - 19:00' },
    { days: 'Pazar', value: 'Kapalı' },
  ],
};

/** Build a `tel:` href from a display phone number. */
export function telHref(phone: string): string {
  return 'tel:' + phone.replace(/[^\d+]/g, '');
}

// A selectable finish/fabric option: display name + swatch color.
export interface ColorOption {
  name: string;
  hex: string;
}

// One selectable value on an option axis. `hex` → a colour dot, `swatch` → a
// texture thumbnail, neither → a plain text pill.
export interface OptionValue {
  label: string;
  hex?: string;
  swatch?: string;
}

// An independent axis of choice (e.g. "Renk", "Materyal"). A product can carry
// several at once, so colour and material are picked separately.
export interface OptionGroup {
  title: string;
  values: OptionValue[];
}

// Product availability status (orders go via WhatsApp — this is a status, not a
// stock count).
export type Availability = 'in-stock' | 'made-to-order' | 'sold-out' | 'coming-soon';

export interface Product {
  // Local fixtures use a numeric id; Sanity supplies its string _id.
  id: number | string;
  // URL-safe identifier used for /products/[slug] routing.
  slug: string;
  name: string;
  // Price in Turkish Lira, formatted for display via priceLabel()/formatPrice().
  price: number;
  // When true (or price is 0), show "Fiyat için sorun" instead of a number.
  priceOnRequest?: boolean;
  availability?: Availability;
  image: string;
  // Authored alt for the primary image; falls back to the product name.
  imageAlt?: string;
  images: string[];
  tag: string;
  category: string;
  // Marketing series grouping (Rattan Koleksiyonu, …) — slug + display name.
  collection?: string;
  collectionName?: string;
  // Model family (e.g. "Eyfel") shared across separate product docs.
  series?: string;
  description: string;
  // Promoted out of freeform specs so the detail page can render them in their
  // own sections without brittle label matching.
  material?: string;
  care?: string;
  specs: { label: string; value: string }[];
  // Multi-axis options (colour + material). Preferred over `colors`.
  options?: OptionGroup[];
  // Legacy single-axis colour list, kept for the local fixtures + old Sanity docs.
  colors?: ColorOption[];
  // Slugs of editorially-picked related products.
  relatedSlugs?: string[];
}

// Human labels for availability statuses.
export const AVAILABILITY_LABEL: Record<Availability, string> = {
  'in-stock': 'Stokta',
  'made-to-order': 'Siparişe özel',
  'sold-out': 'Tükendi',
  'coming-soon': 'Yakında',
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'pisa-moduler-kanepe',
    name: 'Pisa Modüler Kanepe',
    price: 2499,
    image: ASSETS.pisaSofa,
    images: [ASSETS.pisaSofa, ASSETS.pisaLifestyle, ASSETS.pisaTable],
    tag: 'Yeni Ürün',
    category: 'lounge',
    description: 'Pisa Modüler Kanepe, benzersiz bir esneklik ve konfor sunar. Şık bir alüminyum çerçeve ve hava koşullarına dayanıklı pelüş minderlerle tasarlanmış olup, her türlü açık hava yaşam alanına mükemmel uyum sağlar.',
    specs: [
      { label: 'Materyal', value: 'Toz boya kaplı alüminyum, Hızlı kuruyan sünger' },
      { label: 'Boyutlar', value: '280cm G x 89cm D x 71cm Y' },
      { label: 'Ağırlık', value: '65 kg' },
      { label: 'Bakım', value: 'Makinede yıkanabilir minder kılıfları' }
    ],
    colors: [
      { name: 'Kum', hex: '#D9CBB2' },
      { name: 'Antrasit', hex: '#3C3A36' },
      { name: 'Zeytin Yeşili', hex: '#6E7253' },
      { name: 'Fildişi', hex: '#F1EBDD' }
    ]
  },
  {
    id: 2,
    slug: 'santana-dinlenme-koltugu',
    name: 'Santana Dinlenme Koltuğu',
    price: 899,
    image: ASSETS.santanaChair,
    images: [ASSETS.santanaChair, ASSETS.santanaDetail, ASSETS.santanaLifestyle],
    tag: 'En Çok Satan',
    category: 'lounge',
    description: 'Ergonomik tasarımın bir şaheseri. Santana Dinlenme Koltuğu, sürdürülebilir tik ağacını yüksek mukavemetli dış mekan ipi ile birleştirerek hem destekleyici hem de görsel olarak çarpıcı bir oturma deneyimi sunar.',
    specs: [
      { label: 'Materyal', value: 'A Sınıfı Tik Ağacı, Marin tipi ip' },
      { label: 'Boyutlar', value: '81cm G x 86cm D x 76cm Y' },
      { label: 'Ağırlık', value: '16 kg' },
      { label: 'Bakım', value: 'Yılda bir kez tik yağı uygulayın' }
    ],
    colors: [
      { name: 'Doğal', hex: '#C9B79C' },
      { name: 'Kum', hex: '#D9CBB2' },
      { name: 'Antrasit', hex: '#3C3A36' }
    ]
  },
  {
    id: 3,
    slug: 'santana-yemek-masasi',
    name: 'Santana Yemek Masası',
    price: 1299,
    image: ASSETS.santanaTable,
    images: [ASSETS.santanaTable, ASSETS.santanaLifestyle, ASSETS.santanaChair],
    tag: 'Premium Ahşap',
    category: 'dining',
    description: 'Santana Yemek Masası etrafında toplanın. Tek parça hava koşullarına dayanıklı sert ağaçtan üretilen bu masa, açık havadaki mutfak anlarınız için mükemmel bir merkez parçası görevi görür.',
    specs: [
      { label: 'Materyal', value: 'Masif Sert Ahşap, Alüminyum taban' },
      { label: 'Boyutlar', value: '213cm U x 101cm G x 76cm Y' },
      { label: 'Ağırlık', value: '54 kg' },
      { label: 'Oturma', value: '8 kişi rahatça oturabilir' }
    ]
  },
  {
    id: 4,
    slug: 'pisa-sehpa',
    name: 'Pisa Sehpa',
    price: 749,
    image: ASSETS.pisaTable,
    images: [ASSETS.pisaTable, ASSETS.pisaLifestyle, ASSETS.pisaSofa],
    tag: 'Takım',
    category: 'dining',
    description: 'Pisa Modüler Kanepe için mükemmel bir tamamlayıcı. Bu düşük profilli sehpa, minimalist alüminyum çerçeve ile eşleştirilmiş ısıya dayanıklı taş bir yüzeye sahiptir.',
    specs: [
      { label: 'Materyal', value: 'Doğal taş yüzey, Alüminyum çerçeve' },
      { label: 'Boyutlar', value: '122cm U x 61cm G x 40cm Y' },
      { label: 'Ağırlık', value: '29 kg' },
      { label: 'Bakım', value: 'Nemli bir bezle silin' }
    ]
  },
  {
    id: 5,
    slug: 'santana-gunduz-kanepesi',
    name: 'Santana Gündüz Kanepesi',
    price: 1899,
    image: ASSETS.santanaSofa,
    images: [ASSETS.santanaSofa, ASSETS.santanaDetail, ASSETS.santanaLifestyle],
    tag: 'Yeni Ürün',
    category: 'lounge',
    description: 'Santana Gündüz Kanepesi açık havada dinlenmeyi yeniden tanımlıyor. Derin oturma profili ve el dokuması ip detayları ile sizi açık gökyüzü altında daha uzun süre kalmaya davet ediyor.',
    specs: [
      { label: 'Materyal', value: 'A Sınıfı Tik Ağacı, Dış mekan ip dokuma' },
      { label: 'Boyutlar', value: '198cm G x 96cm D x 71cm Y' },
      { label: 'Ağırlık', value: '43 kg' },
      { label: 'Bakım', value: 'Yılda bir kez tik yağı uygulayın' }
    ],
    colors: [
      { name: 'Doğal', hex: '#C9B79C' },
      { name: 'Antrasit', hex: '#3C3A36' },
      { name: 'Taş', hex: '#B9B4AC' }
    ]
  },
  {
    id: 6,
    slug: 'santana-yan-sehpa',
    name: 'Santana Yan Sehpa',
    price: 449,
    image: ASSETS.santanaDetail,
    images: [ASSETS.santanaDetail, ASSETS.santanaLifestyle, ASSETS.santanaChair],
    tag: 'Temel Parça',
    category: 'details',
    description: 'Çok yönlü bir tamamlayıcı olan Santana Yan Sehpa, cilalı beton yüzeyli heykelsi bir tik tabana sahiptir. İçecekleri, kitapları veya küçük bir saksıyı koymak için mükemmeldir.',
    specs: [
      { label: 'Materyal', value: 'Tik ağacı, Cilalı beton' },
      { label: 'Boyutlar', value: '45cm Çap x 56cm Y' },
      { label: 'Ağırlık', value: '12 kg' },
      { label: 'Bakım', value: 'Betonu yılda bir kez cilalayın' }
    ]
  },
  {
    id: 7,
    slug: 'pisa-yemek-takimi',
    name: 'Pisa Yemek Takımı',
    price: 3899,
    image: ASSETS.pisaLifestyle,
    images: [ASSETS.pisaLifestyle, ASSETS.pisaTable, ASSETS.pisaSofa],
    tag: 'En İyi Fiyat',
    category: 'dining',
    description: 'Eksiksiz Pisa Yemek deneyimi. Bu özenle seçilmiş set, tamamı aynı mimari alüminyum estetiği paylaşan Pisa Yemek Masası ve uyumlu altı sandalye içerir.',
    specs: [
      { label: 'Materyal', value: 'Toz boya kaplı alüminyum, Hızlı kuruyan sünger' },
      { label: 'Boyutlar', value: 'Masa: 183cm U x 91cm G x 76cm Y' },
      { label: 'Ağırlık', value: '95 kg (toplam)' },
      { label: 'İçindekiler', value: '1 Masa + 6 Sandalye' }
    ]
  },
  {
    id: 8,
    slug: 'santana-sallanan-sandalye',
    name: 'Santana Sallanan Sandalye',
    price: 1099,
    image: ASSETS.santanaChair,
    images: [ASSETS.santanaChair, ASSETS.santanaDetail, ASSETS.santanaLifestyle],
    tag: 'El Yapımı',
    category: 'lounge',
    description: 'Sürdürülebilir kaynaklı tek parça tik ağacından el yapımı üretilen Santana Sallanan Sandalye, açık hava anlarınıza meditatif bir ritim getiriyor. Ayakların hafif kavisli yapısı, zahmetsiz ve pürüzsüz bir sallanma için hassas mühendislikle tasarlanmıştır.',
    specs: [
      { label: 'Materyal', value: 'Masif A Sınıfı Tik Ağacı' },
      { label: 'Boyutlar', value: '71cm G x 91cm D x 86cm Y' },
      { label: 'Ağırlık', value: '19 kg' },
      { label: 'Bakım', value: 'Sezonluk olarak tik yağı uygulayın' }
    ]
  },
  {
    id: 9,
    slug: 'pisa-dis-mekan-minder-seti',
    name: 'Pisa Dış Mekan Minder Seti',
    price: 349,
    image: ASSETS.pisaSofa,
    images: [ASSETS.pisaSofa, ASSETS.pisaLifestyle, ASSETS.pisaTable],
    tag: 'Aksesuar',
    category: 'details',
    description: 'Pisa koleksiyonu için özel olarak tasarlanmış premium yedek minderler. Sunbrella® performans kumaşı ve hızlı kuruyan sünger çekirdeğine sahip olan bu minderler solmaya, küfe ve lekelere karşı dayanıklıdır.',
    specs: [
      { label: 'Materyal', value: 'Sunbrella® kumaş, Hızlı kuruyan sünger' },
      { label: 'Ağırlık', value: '5.5 kg (set)' },
      { label: 'Bakım', value: 'Makinede yıkanabilir kılıflar' }
    ],
    colors: [
      { name: 'Kum', hex: '#D9CBB2' },
      { name: 'Antrasit', hex: '#3C3A36' },
      { name: 'Zeytin Yeşili', hex: '#6E7253' },
      { name: 'Fildişi', hex: '#F1EBDD' }
    ]
  },
];

// Format a Lira amount for display, e.g. formatPrice(2499) → "₺2.499".
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

// What to show for a product's price: a formatted amount, or a call-to-inquire
// label when the piece is price-on-request or has no real price yet (₺0).
export function priceLabel(product: Pick<Product, 'price' | 'priceOnRequest'>): string {
  if (product.priceOnRequest || !product.price || product.price <= 0) {
    return 'Fiyat için sorun';
  }
  return formatPrice(product.price);
}

// Normalise a product's selectable options to the multi-axis shape, falling back
// to the legacy single `colors` list so old data and local fixtures still render.
export function getOptionGroups(product: Product): OptionGroup[] {
  if (product.options?.length) return product.options;
  if (product.colors?.length) {
    return [{ title: 'Renk', values: product.colors.map((c) => ({ label: c.name, hex: c.hex })) }];
  }
  return [];
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const CATEGORIES = [
  {
    id: 'lounge',
    name: 'Oturma Grupları',
    image: ASSETS.santanaLifestyle,
    description: 'Verandanızı bir oturma odasına dönüştürün.',
  },
  {
    id: 'dining',
    name: 'Yemek Grupları',
    image: ASSETS.pisaLifestyle,
    description: 'Modern bir zarafetle açık havada yemek yiyin.',
  },
  {
    id: 'bbq',
    name: 'Barbekü ve Aksesuarlar',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    description: 'Premium açık hava pişirme istasyonları.',
  },
  {
    id: 'swings',
    name: 'Salıncak ve Hamaklar',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800',
    description: 'Doğanın içinde asılı rahatlık.',
  },
  {
    id: 'shoe-cabinets',
    name: 'Ayakkabılıklar',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    description: 'Dış mekanlar için şık depolama çözümleri.',
  },
  {
    id: 'details',
    name: 'Tamamlayıcı Detaylar',
    image: ASSETS.santanaDetail,
    description: 'Açık alanınız için son dokunuşlar.',
  },
];

export const REVIEWS = [
  {
    authorName: 'Elena Rodriguez',
    authorInitial: 'E',
    rating: 5,
    date: '12 Mayıs 2026',
    text: 'Kesinlikle çarpıcı mobilyalar. Santana oturma grubu arka bahçemizi tamamen dönüştürdü. Tik ağacının kalitesi olağanüstü ve mevsimler boyunca güzelliğini korudu.',
    image: ASSETS.santanaLifestyle,
  },
  {
    authorName: 'Markus Chen',
    authorInitial: 'M',
    rating: 5,
    date: '28 Nisan 2026',
    text: 'İzmir mağazasını ziyaret ettim ve işçiliğe hayran kaldım. Pisa modüler kanepe sadece şık olmakla kalmıyor, aynı zamanda inanılmaz derecede rahat. Teslimat hızlı ve profesyoneldi.',
    image: ASSETS.pisaSofa,
  },
  {
    authorName: 'Sarah Jenkins',
    authorInitial: 'S',
    rating: 5,
    date: '15 Mart 2026',
    text: 'Sıradan veranda mobilyaları gibi görünmeden sert hava koşullarına dayanabilecek modern bir yemek masası arıyordum. Formet tam ihtiyacım olanı sundu. Şiddetle tavsiye ederim!',
    image: ASSETS.santanaTable,
  },
  {
    authorName: 'David Wright',
    authorInitial: 'D',
    rating: 5,
    date: '3 Şubat 2026',
    text: 'Koleksiyonlar tam anlamıyla büyüleyici. Yeni Santana gündüz kanepesi, bahçemizdeki en favori dinlenme köşesi oldu. Malzeme kalitesi beklediğimin çok ötesinde.',
    image: ASSETS.santanaSofa,
  },
  {
    authorName: 'Cathy Lee',
    authorInitial: 'C',
    rating: 4,
    date: '20 Ocak 2026',
    text: 'Harika tasarım ve mükemmel müşteri hizmetleri. İlk başta renk seçimi konusunda kararsızdım ancak sağladıkları danışmanlık çok yardımcı oldu. Çok memnun kaldık.',
    image: ASSETS.pisaTable,
  },
];

export const FAQS = [
  {
    question: 'Mobilyalarınızda hangi malzemeler kullanılıyor?',
    answer: 'Elementlere dayanacak şekilde tasarlanmış toz boya kaplı alüminyum, sürdürülebilir kaynaklı tik ağacı ve UV ışınlarına dayanıklı dış mekan kumaşları dahil olmak üzere yüksek kaliteli, hava koşullarına dayanıklı malzemeler kullanıyoruz.',
  },
  {
    question: 'Teslimat ve montaj hizmeti sunuyor musunuz?',
    answer: 'Evet, yerel hizmet bölgemizdeki tüm siparişler için beyaz eldiven (white-glove) teslimat ve montaj hizmeti sunuyoruz. Ekibimiz mobilyaları tam istediğiniz yere yerleştirecektir.',
  },
  {
    question: 'Dış mekan mobilyalarımın bakımını nasıl yapmalıyım?',
    answer: 'Ürünlerimizin çoğu temizlik için sadece hafif sabun ve su gerektirir. Mobilyalarınızı aşırı hava koşullarında veya uzun süre kullanılmadığında örtmenizi öneririz.',
  },
  {
    question: 'Ürünlerde garanti var mı?',
    answer: 'Tüm ürünlerimiz 5 yıl yapısal garanti ile, kumaşlar ve kaplamalar ise 2 yıl garanti ile sunulmaktadır.',
  },
];
