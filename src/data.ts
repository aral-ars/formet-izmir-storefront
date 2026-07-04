export const ASSETS = {
  formetWordmark: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/formet-wordmark.png',
  formetWordmarkBlack: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/formet-wordmark-black.png',
  formetWordmarkWhite: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/formet-wordmark-white.png',
  pisaLifestyle: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/pisa-lifestyle.png',
  pisaSofa: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/pisa-sofa.png',
  pisaTable: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/pisa-table.png',
  santanaChair: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/santana-chair.png',
  santanaDetail: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/santana-detail.png',
  santanaLifestyle: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/santana-lifestyle.png',
  santanaSofa: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/santana-sofa.png',
  santanaTable: 'https://raw.githubusercontent.com/aral-ars/formet-izmir-storefront/main/public/assets/santana-table.png',
};

export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  images: string[];
  tag: string;
  category: string;
  description: string;
  specs: { label: string; value: string }[];
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pisa Modular Sofa',
    price: '$2,499',
    priceValue: 2499,
    image: ASSETS.pisaSofa,
    images: [ASSETS.pisaSofa, ASSETS.pisaLifestyle, ASSETS.pisaTable],
    tag: 'New Arrival',
    category: 'lounge',
    description: 'The Pisa Modular Sofa offers unparalleled flexibility and comfort. Designed with a sleek aluminum frame and plush, weather-resistant cushions, it perfectly adapts to any outdoor living space.',
    specs: [
      { label: 'Materials', value: 'Powder-coated aluminum, Quick-dry foam' },
      { label: 'Dimensions', value: '110"W x 35"D x 28"H' },
      { label: 'Weight', value: '145 lbs' },
      { label: 'Care', value: 'Machine washable cushion covers' }
    ]
  },
  {
    id: 2,
    name: 'Santana Lounge Chair',
    price: '$899',
    priceValue: 899,
    image: ASSETS.santanaChair,
    images: [ASSETS.santanaChair, ASSETS.santanaDetail, ASSETS.santanaLifestyle],
    tag: 'Bestseller',
    category: 'lounge',
    description: 'A masterpiece of ergonomic design. The Santana Lounge Chair combines sustainable teak wood with high-tensile outdoor rope for a seating experience that is both supportive and visually striking.',
    specs: [
      { label: 'Materials', value: 'Grade-A Teak, Marine-grade rope' },
      { label: 'Dimensions', value: '32"W x 34"D x 30"H' },
      { label: 'Weight', value: '35 lbs' },
      { label: 'Care', value: 'Apply teak oil annually' }
    ]
  },
  {
    id: 3,
    name: 'Santana Dining Table',
    price: '$1,299',
    priceValue: 1299,
    image: ASSETS.santanaTable,
    images: [ASSETS.santanaTable, ASSETS.santanaLifestyle, ASSETS.santanaChair],
    tag: 'Premium Wood',
    category: 'dining',
    description: 'Gather around the Santana Dining Table. Crafted from a solid piece of weather-treated hardwood, this table acts as the perfect centerpiece for your outdoor culinary moments.',
    specs: [
      { label: 'Materials', value: 'Solid Hardwood, Aluminum base' },
      { label: 'Dimensions', value: '84"L x 40"W x 30"H' },
      { label: 'Weight', value: '120 lbs' },
      { label: 'Seating', value: 'Comfortably seats 8' }
    ]
  },
  {
    id: 4,
    name: 'Pisa Coffee Table',
    price: '$749',
    priceValue: 749,
    image: ASSETS.pisaTable,
    images: [ASSETS.pisaTable, ASSETS.pisaLifestyle, ASSETS.pisaSofa],
    tag: 'Matching Set',
    category: 'dining',
    description: 'The perfect complement to the Pisa Modular Sofa. This low-profile coffee table features a heat-resistant stone top paired with a minimalist aluminum frame.',
    specs: [
      { label: 'Materials', value: 'Natural stone top, Aluminum frame' },
      { label: 'Dimensions', value: '48"L x 24"W x 16"H' },
      { label: 'Weight', value: '65 lbs' },
      { label: 'Care', value: 'Wipe clean with damp cloth' }
    ]
  },
  {
    id: 5,
    name: 'Santana Day Sofa',
    price: '$1,899',
    priceValue: 1899,
    image: ASSETS.santanaSofa,
    images: [ASSETS.santanaSofa, ASSETS.santanaDetail, ASSETS.santanaLifestyle],
    tag: 'New Arrival',
    category: 'lounge',
    description: 'The Santana Day Sofa redefines outdoor relaxation. With a deep-seated profile and hand-woven rope detailing, it invites you to linger longer under the open sky.',
    specs: [
      { label: 'Materials', value: 'Grade-A Teak, Outdoor rope weave' },
      { label: 'Dimensions', value: '78"W x 38"D x 28"H' },
      { label: 'Weight', value: '95 lbs' },
      { label: 'Care', value: 'Apply teak oil annually' }
    ]
  },
  {
    id: 6,
    name: 'Santana Side Table',
    price: '$449',
    priceValue: 449,
    image: ASSETS.santanaDetail,
    images: [ASSETS.santanaDetail, ASSETS.santanaLifestyle, ASSETS.santanaChair],
    tag: 'Essential',
    category: 'details',
    description: 'A versatile companion piece, the Santana Side Table features a sculptural teak base with a polished concrete top. Perfect for holding drinks, books, or a small planter.',
    specs: [
      { label: 'Materials', value: 'Teak wood, Polished concrete' },
      { label: 'Dimensions', value: '18"Ø x 22"H' },
      { label: 'Weight', value: '28 lbs' },
      { label: 'Care', value: 'Seal concrete annually' }
    ]
  },
  {
    id: 7,
    name: 'Pisa Dining Set',
    price: '$3,899',
    priceValue: 3899,
    image: ASSETS.pisaLifestyle,
    images: [ASSETS.pisaLifestyle, ASSETS.pisaTable, ASSETS.pisaSofa],
    tag: 'Best Value',
    category: 'dining',
    description: 'The complete Pisa Dining experience. This curated set includes the Pisa Dining Table and six matching chairs, all sharing the same architectural aluminum aesthetic.',
    specs: [
      { label: 'Materials', value: 'Powder-coated aluminum, Quick-dry foam' },
      { label: 'Dimensions', value: 'Table: 72"L x 36"W x 30"H' },
      { label: 'Weight', value: '210 lbs (total)' },
      { label: 'Includes', value: '1 Table + 6 Chairs' }
    ]
  },
  {
    id: 8,
    name: 'Santana Rocking Chair',
    price: '$1,099',
    priceValue: 1099,
    image: ASSETS.santanaChair,
    images: [ASSETS.santanaChair, ASSETS.santanaDetail, ASSETS.santanaLifestyle],
    tag: 'Artisan',
    category: 'lounge',
    description: 'Handcrafted from a single piece of sustainably sourced teak, the Santana Rocking Chair brings a meditative rhythm to your outdoor moments. The gentle arc of the runners is precision-engineered for an effortlessly smooth rock.',
    specs: [
      { label: 'Materials', value: 'Solid Grade-A Teak' },
      { label: 'Dimensions', value: '28"W x 36"D x 34"H' },
      { label: 'Weight', value: '42 lbs' },
      { label: 'Care', value: 'Apply teak oil seasonally' }
    ]
  },
  {
    id: 9,
    name: 'Pisa Outdoor Cushion Set',
    price: '$349',
    priceValue: 349,
    image: ASSETS.pisaSofa,
    images: [ASSETS.pisaSofa, ASSETS.pisaLifestyle, ASSETS.pisaTable],
    tag: 'Accessory',
    category: 'details',
    description: 'Premium replacement cushions designed exclusively for the Pisa collection. Featuring Sunbrella® performance fabric and quick-dry foam core, these cushions resist fading, mildew, and stains.',
    specs: [
      { label: 'Materials', value: 'Sunbrella® fabric, Quick-dry foam' },
      { label: 'Colors', value: 'Sand, Charcoal, Olive, Ivory' },
      { label: 'Weight', value: '12 lbs (set)' },
      { label: 'Care', value: 'Machine washable covers' }
    ]
  },
];

export const CATEGORIES = [
  {
    id: 'lounge',
    name: 'Lounge Sets',
    image: ASSETS.santanaLifestyle,
    description: 'Transform your patio into a living room.',
  },
  {
    id: 'dining',
    name: 'Dining Collections',
    image: ASSETS.pisaLifestyle,
    description: 'Dine al fresco with modern elegance.',
  },
  {
    id: 'bbq',
    name: 'BBQ & Accessories',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    description: 'Premium outdoor cooking stations.',
  },
  {
    id: 'swings',
    name: 'Swings & Hammocks',
    image: 'https://images.unsplash.com/photo-1596431252998-356de6522fcb?auto=format&fit=crop&q=80&w=800',
    description: 'Relaxation suspended in nature.',
  },
  {
    id: 'shoe-cabinets',
    name: 'Shoe Cabinets',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant storage for outdoor spaces.',
  },
  {
    id: 'details',
    name: 'Finishing Details',
    image: ASSETS.santanaDetail,
    description: 'The finishing touches for your outdoor space.',
  },
];

export const REVIEWS = [
  {
    authorName: 'Elena Rodriguez',
    authorInitial: 'E',
    rating: 5,
    text: 'Absolutely stunning furniture. The Santana lounge set completely transformed our backyard. The quality of the teak wood is exceptional, and it has held up beautifully through the seasons.',
  },
  {
    authorName: 'Markus Chen',
    authorInitial: 'M',
    rating: 5,
    text: 'Visited the Izmir showroom and was blown away by the craftsmanship. The Pisa modular sofa is not only sleek but incredibly comfortable. Delivery was prompt and professional.',
  },
  {
    authorName: 'Sarah Jenkins',
    authorInitial: 'S',
    rating: 5,
    text: 'I was looking for a modern dining table that could withstand harsh weather without looking like typical patio furniture. Formet delivered exactly what I needed. Highly recommend!',
  },
];

export const FAQS = [
  {
    question: 'What materials are used in your furniture?',
    answer: 'We use high-grade, weather-resistant materials including powder-coated aluminum, sustainably sourced teak, and UV-resistant outdoor fabrics designed to withstand the elements.',
  },
  {
    question: 'Do you offer delivery and assembly?',
    answer: 'Yes, we offer white-glove delivery and assembly services for all orders within our local service area. Our team will place the furniture exactly where you want it.',
  },
  {
    question: 'How should I care for my outdoor furniture?',
    answer: 'Most of our pieces simply require mild soap and water for cleaning. We recommend covering your furniture during extreme weather or when not in use for extended periods.',
  },
  {
    question: 'Is there a warranty on the products?',
    answer: 'All our products come with a 5-year structural warranty and a 2-year warranty on fabrics and finishes.',
  },
];
