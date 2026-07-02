export type ProductCategory =
  | "oturma"
  | "takim"
  | "sezlong"
  | "salincak"
  | "ayakkabilik"
  | "barbeku";

export type GalleryImage = {
  label: string;
  img: string;
};

export type Product = {
  slug: string;
  name: string;
  collection?: "Santana" | "Isabel" | "Pisa";
  category: ProductCategory;
  sub: string;
  price: number;
  compareAtPrice?: number;
  img?: string;
  gallery?: GalleryImage[];
  badge?: "Çok satan" | "Yeni";
  isNew?: boolean;
  rating?: { value: number; count: number };
  description?: string[];
  specs?: { label: string; value: string }[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
};

export const categoryList: { id: "all" | ProductCategory; label: string }[] =
  [
    { id: "all", label: "Tümü" },
    { id: "oturma", label: "Bahçe Oturma Grubu" },
    { id: "takim", label: "Masa & Sandalye Takımı" },
    { id: "sezlong", label: "Şezlong" },
    { id: "salincak", label: "Bahçe Salıncağı" },
    { id: "ayakkabilik", label: "Metal Ayakkabılık" },
    { id: "barbeku", label: "Barbekü & Aksesuar" },
  ];

export const categoryShortLabel: Record<ProductCategory, string> = {
  oturma: "Oturma Grubu",
  takim: "Masa & Sandalye",
  sezlong: "Şezlong",
  salincak: "Salıncak",
  ayakkabilik: "Ayakkabılık",
  barbeku: "Barbekü",
};

const santanaColors = [
  { name: "Antrasit", hex: "#3a3f45" },
  { name: "Açık Gri", hex: "#B8BDC2" },
  { name: "Kum Beji", hex: "#C9B79C" },
];

export const products: Product[] = [
  {
    slug: "santana-3lu-kanepe",
    name: "Santana 3'lü Kanepe",
    collection: "Santana",
    category: "oturma",
    sub: "Örme halat · alüminyum",
    price: 18900,
    compareAtPrice: 22800,
    img: "/assets/santana-sofa.png",
    gallery: [
      { label: "Santana 3'lü kanepe", img: "/assets/santana-sofa.png" },
      { label: "Santana tekli koltuk", img: "/assets/santana-chair.png" },
      { label: "ortam · teras", img: "/assets/santana-lifestyle.png" },
      { label: "halat dokusu detayı", img: "/assets/santana-detail.png" },
      { label: "Santana sehpa", img: "/assets/santana-table.png" },
    ],
    badge: "Çok satan",
    rating: { value: 4.8, count: 124 },
    description: [
      "Santana 3'lü Kanepe, İstanbul'daki atölyemizde el işçiliğiyle örülür. UV dayanımlı halat, pudralı alüminyum iskelet çevresine tek tek dokunur; çizilmeye, tuzlu havaya ve solmaya karşı dayanıklıdır.",
      "Minderler hızlı kuruyan sünger ve su geçirmez akrilik kılıf içerir; kılıflar çıkarılıp yıkanabilir. Kanepe montaj gerektirmez ve kış boyunca dışarıda kalabilir.",
    ],
    specs: [
      { label: "Malzeme", value: "El örmesi halat · alüminyum" },
      { label: "Ölçüler", value: "210 × 88 × 72 cm" },
      { label: "Ağırlık", value: "28 kg" },
      { label: "Minder", value: "Su geçirmez akrilik" },
      { label: "Kapasite", value: "3 kişi" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
    colors: santanaColors,
    sizes: ["2'li", "3'lü", "Köşe"],
  },
  {
    slug: "santana-koltuk",
    name: "Santana Koltuk",
    collection: "Santana",
    category: "oturma",
    sub: "Tekli · yastıklı",
    price: 7400,
    img: "/assets/santana-chair.png",
    gallery: [
      { label: "Santana koltuk", img: "/assets/santana-chair.png" },
      { label: "Santana 3'lü kanepe", img: "/assets/santana-sofa.png" },
      { label: "ortam · teras", img: "/assets/santana-lifestyle.png" },
      { label: "halat dokusu detayı", img: "/assets/santana-detail.png" },
    ],
    rating: { value: 4.7, count: 68 },
    description: [
      "Santana Koltuk, aynı el örmesi halat dokusunu tekli bir oturak halinde sunar. Pudralı alüminyum iskeleti çizilmeye ve pasa karşı test edilmiştir, dört mevsim dışarıda kalabilir.",
      "Geniş, yastıklı oturumu ile tek başına ya da Santana takımının bir parçası olarak kullanılabilir.",
    ],
    specs: [
      { label: "Malzeme", value: "El örmesi halat · alüminyum" },
      { label: "Ölçüler", value: "84 × 88 × 72 cm" },
      { label: "Ağırlık", value: "12 kg" },
      { label: "Minder", value: "Su geçirmez akrilik" },
      { label: "Kapasite", value: "1 kişi" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
    colors: santanaColors,
  },
  {
    slug: "santana-yemek-masasi",
    name: "Santana Yemek Masası",
    collection: "Santana",
    category: "takim",
    sub: "Seramik mermer tabla",
    price: 12900,
    img: "/assets/santana-table.png",
    gallery: [
      { label: "Santana yemek masası", img: "/assets/santana-table.png" },
      { label: "Santana 3'lü kanepe", img: "/assets/santana-sofa.png" },
      { label: "halat dokusu detayı", img: "/assets/santana-detail.png" },
    ],
    rating: { value: 4.9, count: 41 },
    description: [
      "Seramik mermer görünümlü tabla ve pudralı alüminyum ayaklarla üretilen Santana Yemek Masası, güneşe ve neme karşı renk ve doku kaybetmez.",
      "Tablo yüzeyi çiziğe ve lekeye dayanıklıdır; günlük kullanım için nemli bezle silmek yeterlidir.",
    ],
    specs: [
      { label: "Malzeme", value: "Seramik mermer · alüminyum" },
      { label: "Ölçüler", value: "160 × 90 × 74 cm" },
      { label: "Ağırlık", value: "34 kg" },
      { label: "Kapasite", value: "6 kişi" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
  },
  {
    slug: "isabel-daybed",
    name: "Isabel Daybed",
    collection: "Isabel",
    category: "oturma",
    sub: "El örmesi rattan",
    price: 22500,
    img: "/assets/isabel-daybed.png",
    gallery: [
      { label: "Isabel daybed", img: "/assets/isabel-daybed.png" },
      { label: "Isabel oturma grubu", img: "/assets/isabel-set.png" },
      { label: "ortam · teras", img: "/assets/isabel-lifestyle.png" },
    ],
    badge: "Yeni",
    isNew: true,
    rating: { value: 4.9, count: 37 },
    description: [
      "Isabel Daybed, el örmesi sentetik rattan ve toz boyalı çelik iskeletle üretilir. Geniş yatay yüzeyi güneşlenmek ya da uzanarak dinlenmek için tasarlandı.",
      "Kalın, su geçirmez minderi hızlı kurur; kılıfı çıkarılıp yıkanabilir. Kış boyunca dışarıda bırakılabilir.",
    ],
    specs: [
      { label: "Malzeme", value: "El örmesi rattan · çelik" },
      { label: "Ölçüler", value: "195 × 120 × 65 cm" },
      { label: "Ağırlık", value: "32 kg" },
      { label: "Minder", value: "Su geçirmez akrilik" },
      { label: "Kapasite", value: "2 kişi" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
    colors: [
      { name: "Kum Beji", hex: "#C9B79C" },
      { name: "Antrasit", hex: "#3a3f45" },
    ],
  },
  {
    slug: "isabel-oturma-grubu",
    name: "Isabel Oturma Grubu",
    collection: "Isabel",
    category: "oturma",
    sub: "3+2+1 · minderli",
    price: 34900,
    img: "/assets/isabel-set.png",
    gallery: [
      { label: "Isabel oturma grubu", img: "/assets/isabel-set.png" },
      { label: "Isabel daybed", img: "/assets/isabel-daybed.png" },
      { label: "ortam · teras", img: "/assets/isabel-lifestyle.png" },
    ],
    rating: { value: 4.8, count: 52 },
    description: [
      "3+2+1 oturma grubu, geniş teraslar ve bahçeler için tam bir davetkâr köşe kurar. El örmesi rattan dokusu ve derin minderleriyle uzun sohbetlere uygundur.",
      "Modüler parçalar ayrı ayrı da kullanılabilir; ihtiyaca göre yerleşim değiştirilebilir.",
    ],
    specs: [
      { label: "Malzeme", value: "El örmesi rattan · çelik" },
      { label: "Ölçüler", value: "3+2+1 takım" },
      { label: "Minder", value: "Su geçirmez akrilik" },
      { label: "Kapasite", value: "6 kişi" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
    colors: [
      { name: "Kum Beji", hex: "#C9B79C" },
      { name: "Antrasit", hex: "#3a3f45" },
    ],
  },
  {
    slug: "pisa-kanepe",
    name: "Pisa Kanepe",
    collection: "Pisa",
    category: "oturma",
    sub: "Doğal halat · ahşap ayak",
    price: 14200,
    img: "/assets/pisa-sofa.png",
    gallery: [
      { label: "Pisa kanepe", img: "/assets/pisa-sofa.png" },
      { label: "Pisa sandalye", img: "/assets/pisa-chair.png" },
      { label: "ortam · teras", img: "/assets/pisa-lifestyle.png" },
      { label: "Pisa sehpa", img: "/assets/pisa-table.png" },
    ],
    rating: { value: 4.6, count: 59 },
    description: [
      "Pisa Kanepe, doğal görünümlü halat örgüsü ve sıcak ahşap ayaklarıyla daha yumuşak, ev sıcaklığında bir dış mekan estetiği sunar.",
      "Halat, UV ve neme karşı özel işlem görür; ahşap ayaklar dış mekana dayanıklı olacak şekilde kaplanır.",
    ],
    specs: [
      { label: "Malzeme", value: "Doğal halat · ahşap" },
      { label: "Ölçüler", value: "200 × 85 × 70 cm" },
      { label: "Ağırlık", value: "24 kg" },
      { label: "Minder", value: "Su geçirmez akrilik" },
      { label: "Kapasite", value: "3 kişi" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
    colors: [
      { name: "Doğal", hex: "#C9B79C" },
      { name: "Antrasit", hex: "#3a3f45" },
    ],
  },
  {
    slug: "pisa-sandalye",
    name: "Pisa Sandalye",
    collection: "Pisa",
    category: "oturma",
    sub: "İstiflenebilir · halat",
    price: 4900,
    img: "/assets/pisa-chair.png",
    gallery: [
      { label: "Pisa sandalye", img: "/assets/pisa-chair.png" },
      { label: "Pisa kanepe", img: "/assets/pisa-sofa.png" },
      { label: "ortam · teras", img: "/assets/pisa-lifestyle.png" },
    ],
    rating: { value: 4.5, count: 30 },
    description: [
      "İstiflenebilir tasarımıyla Pisa Sandalye, sezon dışında kolayca saklanabilir. Doğal halat dokusu ve ahşap ayaklarıyla yemek masası takımlarıyla uyumludur.",
    ],
    specs: [
      { label: "Malzeme", value: "Doğal halat · ahşap" },
      { label: "Ölçüler", value: "56 × 60 × 82 cm" },
      { label: "Ağırlık", value: "6 kg" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
  },
  {
    slug: "pisa-sehpa-sandalye",
    name: "Pisa Sehpa & Sandalye",
    collection: "Pisa",
    category: "takim",
    sub: "Mermer tabla · çelik ayak",
    price: 9800,
    img: "/assets/pisa-table.png",
    gallery: [
      { label: "Pisa sehpa & sandalye", img: "/assets/pisa-table.png" },
      { label: "Pisa sandalye", img: "/assets/pisa-chair.png" },
      { label: "ortam · teras", img: "/assets/pisa-lifestyle.png" },
    ],
    rating: { value: 4.7, count: 22 },
    description: [
      "Mermer görünümlü tabla ve toz boyalı çelik ayaklardan oluşan Pisa takımı, kahvaltı köşeleri ve dar balkonlar için ölçülendirildi.",
    ],
    specs: [
      { label: "Malzeme", value: "Mermer tabla · çelik" },
      { label: "Ölçüler", value: "Sehpa Ø70 × 74 cm" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
  },
  {
    slug: "marina-sezlong",
    name: "Marina Şezlong",
    category: "sezlong",
    sub: "Alüminyum · ayarlanabilir",
    price: 5600,
    badge: "Yeni",
    isNew: true,
    rating: { value: 4.6, count: 19 },
    description: [
      "Marina Şezlong, çok kademeli ayarlanabilir sırt desteği ve tekerlekli ön ayaklarıyla teras ve havuz kenarında kolay kullanım sağlar.",
    ],
    specs: [
      { label: "Malzeme", value: "Alüminyum · tekstilen" },
      { label: "Ölçüler", value: "196 × 65 × 32 cm" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
  },
  {
    slug: "marina-katlanir-sezlong",
    name: "Marina Katlanır Şezlong",
    category: "sezlong",
    sub: "Katlanır · tekstilen",
    price: 4200,
    rating: { value: 4.4, count: 12 },
    description: [
      "Katlanır iskeletiyle Marina Katlanır Şezlong, kullanılmadığı zaman dar bir alanda saklanabilir; nefes alan tekstilen kumaşı hızlı kurur.",
    ],
    specs: [
      { label: "Malzeme", value: "Alüminyum · tekstilen" },
      { label: "Ölçüler", value: "190 × 60 × 28 cm (katlı: 96 × 60 × 12 cm)" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
  },
  {
    slug: "verona-bahce-salincagi",
    name: "Verona Bahçe Salıncağı",
    category: "salincak",
    sub: "2 kişilik · gölgelikli",
    price: 12800,
    badge: "Çok satan",
    rating: { value: 4.8, count: 45 },
    description: [
      "Verona Bahçe Salıncağı, ayarlanabilir gölgeliği ve kalın minderleriyle iki kişilik uzun akşam sohbetlerine uygundur. Toz boyalı çelik iskeleti dış mekana dayanıklıdır.",
    ],
    specs: [
      { label: "Malzeme", value: "Toz boyalı çelik · tekstilen" },
      { label: "Ölçüler", value: "150 × 130 × 170 cm" },
      { label: "Kapasite", value: "2 kişi" },
      { label: "Garanti", value: "10 yıl iskelet garantisi" },
    ],
  },
  {
    slug: "loft-metal-ayakkabilik",
    name: "Loft Metal Ayakkabılık",
    category: "ayakkabilik",
    sub: "4 raflı · toz boyalı",
    price: 2400,
    rating: { value: 4.5, count: 27 },
    description: [
      "Loft Metal Ayakkabılık, dört raflı düzeniyle giriş ve balkonlarda düzenli bir ayakkabı deposu sağlar. Toz boyalı yüzeyi paslanmaya karşı dayanıklıdır.",
    ],
    specs: [
      { label: "Malzeme", value: "Toz boyalı çelik" },
      { label: "Ölçüler", value: "80 × 28 × 62 cm" },
      { label: "Kapasite", value: "12–16 çift" },
      { label: "Garanti", value: "10 yıl paslanma garantisi" },
    ],
  },
  {
    slug: "loft-genis-ayakkabilik",
    name: "Loft Geniş Ayakkabılık",
    category: "ayakkabilik",
    sub: "6 raflı · antrasit",
    price: 3100,
    badge: "Yeni",
    isNew: true,
    rating: { value: 4.7, count: 9 },
    description: [
      "Loft Geniş Ayakkabılık, altı raflı geniş gövdesiyle kalabalık haneler için daha fazla kapasite sunar; antrasit kaplaması her dış cepheyle uyumludur.",
    ],
    specs: [
      { label: "Malzeme", value: "Toz boyalı çelik" },
      { label: "Ölçüler", value: "100 × 28 × 88 cm" },
      { label: "Kapasite", value: "20–24 çift" },
      { label: "Garanti", value: "10 yıl paslanma garantisi" },
    ],
  },
  {
    slug: "ember-mangal",
    name: "Ember Mangal",
    category: "barbeku",
    sub: "Döküm · taşınabilir",
    price: 3900,
    rating: { value: 4.6, count: 33 },
    description: [
      "Ember Mangal, döküm gövdesi ve taşıma sapıyla piknik ve teras kullanımına uygun, kolayca depolanabilen bir mangaldır.",
    ],
    specs: [
      { label: "Malzeme", value: "Döküm demir" },
      { label: "Ölçüler", value: "48 × 32 × 28 cm" },
      { label: "Garanti", value: "2 yıl üretim garantisi" },
    ],
  },
  {
    slug: "ember-barbeku-istasyonu",
    name: "Ember Barbekü İstasyonu",
    category: "barbeku",
    sub: "Tezgahlı · dolaplı",
    price: 7200,
    badge: "Yeni",
    isNew: true,
    rating: { value: 4.9, count: 14 },
    description: [
      "Ember Barbekü İstasyonu, yan tezgahı ve kapalı dolap alanıyla mangal keyfini tam bir hazırlık köşesine dönüştürür.",
    ],
    specs: [
      { label: "Malzeme", value: "Döküm demir · toz boyalı çelik" },
      { label: "Ölçüler", value: "140 × 55 × 95 cm" },
      { label: "Garanti", value: "2 yıl üretim garantisi" },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(value: number): string {
  return "₺" + value.toLocaleString("tr-TR");
}

export const featuredSlugs = [
  "santana-3lu-kanepe",
  "santana-koltuk",
  "santana-yemek-masasi",
  "isabel-daybed",
  "pisa-kanepe",
  "pisa-sehpa-sandalye",
];

export const reviews = [
  {
    text: '"Balkonumuz artık bir kaçış noktası. Santana koltuk hem çok şık hem çok rahat."',
    name: "Elif Y.",
    city: "İzmir",
    initial: "E",
  },
  {
    text: '"İki kışı dışarıda geçirdi, hâlâ ilk günkü gibi. Metal işçiliği gerçekten kaliteli."',
    name: "Mehmet A.",
    city: "İstanbul",
    initial: "M",
  },
  {
    text: '"Daybed geldiği gün kurduk. Komşular sürekli nereden aldığımızı soruyor."',
    name: "Zeynep K.",
    city: "Ankara",
    initial: "Z",
  },
];

export const stores = [
  { city: "İstanbul", name: "Bağcılar Showroom" },
  { city: "İzmir", name: "Bornova Showroom" },
  { city: "Ankara", name: "Çankaya Showroom" },
];

export const faqs = [
  {
    q: "Teslimat ne kadar sürer?",
    a: "Siparişleriniz 2–5 iş günü içinde Türkiye'nin 81 iline ücretsiz olarak teslim edilir. Kargo takip numaranız e-posta ile paylaşılır.",
  },
  {
    q: "Ürünler dış mekana dayanıklı mı?",
    a: "Tüm koleksiyon toz boyalı çelik ve UV korumalı kumaşlarla üretilir; güneşe, yağmura ve tuzlu havaya karşı test edilmiştir, kış boyunca dışarıda kalabilir.",
  },
  {
    q: "Kapıda montaj hizmeti var mı?",
    a: "Evet. Büyük ürünlerde kapıda montaj hizmeti ücretsizdir; ekibimiz kurulumu siz beklerken dakikalar içinde tamamlar.",
  },
  {
    q: "İade ve değişim koşulları nelerdir?",
    a: "Teslimat tarihinden itibaren 14 gün içinde kullanılmamış ürünleri koşulsuz iade edebilir veya farklı bir modelle değiştirebilirsiniz.",
  },
  {
    q: "Ürünler garantili mi?",
    a: "Metal iskeletlerde 10 yıl pas garantisi, kumaş ve mekanizmalarda 2 yıl üretim garantisi sunuyoruz.",
  },
];
