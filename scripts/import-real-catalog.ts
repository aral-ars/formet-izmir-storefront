/**
 * One-off migration: import Formet's real 2024 catalog (37 products) from the
 * merged product-photo folders + the extracted catalog-description JSON.
 *
 * Source data lives OUTSIDE this repo (sibling `assets/` dir), since it was
 * copied out of ~/Downloads by hand:
 *   /Users/aralars/Git/formet/assets/Product Catalog - Merged/
 *
 * Behavior (per user decisions 2026-07-08/09):
 * - Two separate taxonomies:
 *   - `category` (required, functional type): Oturma Grubu, Yemek Grubu,
 *     Salıncaklar, Localar, Barbekü (kept empty — images pending), Diğer.
 *   - `collection` (optional, marketing series from the catalog PDF): Yeni
 *     Koleksiyon, Rattan Koleksiyonu, İp Koleksiyonu, Modern Doğa
 *     Koleksiyonu, Formet Klasikleri, Divan Koleksiyonu. Products with no
 *     identifiable catalog collection (Swings family, catalog-absent items)
 *     simply have no collection ref — no "Diğer" collection stand-in.
 * - Deletes the now-obsolete category docs this replaces: the old mock
 *   lounge/dining/details/swings categories, and the 6 categories from the
 *   previous run that are now `collection` documents instead.
 * - Hides the 9 existing mock Pisa/Santana products (kept, not deleted) and
 *   repoints them at the new categories.
 * - Imports all 37 real products with price 0 and hidden:true — no pricing
 *   data exists anywhere in the source catalog, so nothing customer-facing
 *   is affected until prices are filled in and each product is unhidden.
 * - Uploads a full gallery per product: every image found anywhere under
 *   that product's source folder (including color-variant subfolders),
 *   downsized and re-encoded (see uploadImage below). The one referenced by
 *   each PRODUCTS entry's `image` field is always first/primary; a file that
 *   fails to process (e.g. a corrupt/oversized TIFF) is skipped with a
 *   warning rather than aborting the whole run.
 *
 * Run once:  node scripts/import-real-catalog.ts
 * (Not `bun run` — Bun's native-module resolution currently crashes sharp,
 * falling back to a broken sharp-wasm32 build. Plain Node works fine.)
 * Idempotent: deterministic _ids + createOrReplace.
 *
 * Images are downsized (longest edge 2400px) and re-encoded to WebP q82
 * before upload — source photos are 15-40MB camera originals; compressed
 * masters land ~1MB with no visible quality loss, which matters for the
 * free-tier asset storage quota and upload/transform speed. The storefront
 * already requests further-downsized, format-negotiated renditions off the
 * Sanity CDN per-context (see src/lib/catalog.ts's `img()` helper), so this
 * doesn't affect what browsers actually download.
 */
import { createClient } from '@sanity/client';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('\n✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID / SANITY_API_WRITE_TOKEN in .env.local\n');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-06-01', useCdn: false });

const ASSETS_ROOT = '/Users/aralars/Git/formet/assets/Product Catalog - Merged';

// ── Categories (functional type — required on every product) ──────────────
const CATEGORIES = [
  { id: 'oturma-grubu', name: 'Oturma Grubu' },
  { id: 'yemek-grubu', name: 'Yemek Grubu' },
  { id: 'salincaklar', name: 'Salıncaklar' },
  { id: 'localar', name: 'Localar' },
  { id: 'barbeku', name: 'Barbekü' }, // kept empty on purpose — images pending
  { id: 'diger', name: 'Diğer' },
] as const;

// ── Collections (marketing series — optional, from the catalog PDF) ───────
const COLLECTIONS = [
  { id: 'yeni-koleksiyon', name: 'Yeni Koleksiyon' },
  { id: 'rattan-koleksiyonu', name: 'Rattan Koleksiyonu' },
  { id: 'ip-koleksiyonu', name: 'İp Koleksiyonu' },
  { id: 'modern-doga-koleksiyonu', name: 'Modern Doğa Koleksiyonu' },
  { id: 'formet-klasikleri', name: 'Formet Klasikleri' },
  { id: 'divan-koleksiyonu', name: 'Divan Koleksiyonu' },
] as const;

// Superseded by the taxonomy above: old mock leftovers (lounge/dining/details/
// swings) and the previous run's category-flavored collections.
const CATEGORIES_TO_DELETE = [
  'category-lounge',
  'category-dining',
  'category-details',
  'category-swings',
  'category-yeni-koleksiyon',
  'category-rattan-koleksiyonu',
  'category-ip-koleksiyonu',
  'category-modern-doga-koleksiyonu',
  'category-formet-klasikleri',
  'category-divan-koleksiyonu',
];

// Mock product -> new category (old lounge/dining/details categories are being removed).
const MOCK_PRODUCT_CATEGORY: Record<string, (typeof CATEGORIES)[number]['id']> = {
  'product-pisa-moduler-kanepe': 'oturma-grubu',
  'product-santana-dinlenme-koltugu': 'oturma-grubu',
  'product-santana-gunduz-kanepesi': 'oturma-grubu',
  'product-santana-sallanan-sandalye': 'oturma-grubu',
  'product-santana-yemek-masasi': 'yemek-grubu',
  'product-pisa-sehpa': 'yemek-grubu',
  'product-pisa-yemek-takimi': 'yemek-grubu',
  'product-pisa-dis-mekan-minder-seti': 'diger',
  'product-santana-yan-sehpa': 'diger',
};

// ── Products ──────────────────────────────────────────────────────────────
// slug: ascii, URL-safe. image: path relative to ASSETS_ROOT, exactly one per product.
const GENERIC_SWINGS_DESC =
  'Çeşitli renk seçenekleri, en talepkar müşteriyi memnun eder. Örgü çerçeve tarzı, doğanın rahatlama hissini getirerek, rattandan yapılmış büyük bir yuvada oturuyormuş gibi hissettiriyor. Ek olarak, küçük açıklıklar, kullanıcıların mümkün olduğu kadar rahat olmasına yardımcı olmak için her zaman her taraftan iyi hava sirkülasyonu sağlayacak şekilde salınmasını sağlar.';

const CAPPUCCINO = { name: 'Cappuccino', hex: '#9C7A54' };
const GRI = { name: 'Gri', hex: '#9B9B93' };
const FUME = { name: 'Füme', hex: '#6B6B63' };

type CategoryId = (typeof CATEGORIES)[number]['id'];
type CollectionId = (typeof COLLECTIONS)[number]['id'];

const PRODUCTS: {
  name: string;
  slug: string;
  category: CategoryId;
  collection?: CollectionId;
  image: string;
  description?: string;
  colors?: { name: string; hex: string }[];
  specs?: { label: string; value: string }[];
}[] = [
  { name: 'Rita', slug: 'rita', category: 'oturma-grubu', collection: 'yeni-koleksiyon', image: 'Rita/RİTA (1).jpg',
    description: 'Zarif tasarımın öncüsü Rita, bahçenize şıklık ve zarafet katıyor. İnce detaylarda gizli güzellikleri keşfedin.' },
  { name: 'Eyfel', slug: 'eyfel', category: 'oturma-grubu', collection: 'yeni-koleksiyon', image: 'Eyfel/EYFEL (1).jpg',
    description: 'Eyfel Rattan Bahçe Mobilyası, zarif tasarımıyla bahçenize sofistike bir dokunuş katıyor. Aluminyum iskeleti, dayanıklı rattan örgüsü ve eşsiz Eyfel kulesi tasarımıyla bu mobilya seti, açık hava mekanlarınızı şıklıkla buluşturuyor. İster kahve içmek için bir köşe yaratın, ister dostlarınızla keyifli anlar yaşayın; Eyfel, bahçenizi yaşam alanınıza dönüştürüyor.',
    colors: [CAPPUCCINO, GRI],
    specs: [{ label: 'Masa Boyutları', value: '100 x 210 x 75 cm (G x U x Y, yaklaşık)' }] },
  { name: 'Kupa', slug: 'kupa', category: 'oturma-grubu', collection: 'yeni-koleksiyon', image: 'Kupa/KUPA-5.jpg',
    description: 'Kupa, bahçenize çağdaş bir dokunuş katıyor. Aluminyum iskeleti ile güçlendirilmiş ve dayanıklı rattan örgüsüyle tasarlanmış bu bahçe mobilya seti, modern şıklığı ve rahatlığı bir araya getiriyor. Kupa, açık hava mekanlarınız...' },
  { name: 'Herkül', slug: 'herkul', category: 'oturma-grubu', collection: 'yeni-koleksiyon', image: 'Herkül/HERKÜL (14).jpg',
    description: 'Herkül, sağlam tasarımı ile bahçenizi güçlendirecek. Dayanıklılığıyla her mevsime meydan okuyun.' },
  { name: 'İsabel', slug: 'isabel', category: 'oturma-grubu', collection: 'yeni-koleksiyon', image: 'İsabel/İSABEL-1.jpg',
    description: 'Bahçenizin zarif kraliçesi Isabel ile tanışın! Sade ve şık tasarımı, açık havanızı adeta bir saraya dönüştürecek.',
    colors: [GRI] },
  { name: 'Torino', slug: 'torino', category: 'oturma-grubu', collection: 'yeni-koleksiyon', image: 'Torino/TORİNO (1).jpg',
    description: 'Torino ile bahçenizde şıklığın ve konforun tadını çıkarın. Zarif detayları ile göz kamaştırın.' },
  { name: 'Nest', slug: 'nest', category: 'oturma-grubu', collection: 'yeni-koleksiyon', image: 'Nest/NEST.jpg',
    description: 'Bahçenizi saran huzur yuvası. Nest, rahatlığı ve doğayla uyumu bir araya getiriyor.',
    colors: [CAPPUCCINO] },
  { name: 'Sallanan Bahçe Takımı', slug: 'sallanan-bahce-takimi', category: 'oturma-grubu', collection: 'yeni-koleksiyon', image: 'Sallanan Bahçe Takımı/SALLANAN BAHÇE TAKIMI (1).jpg',
    description: 'Konfor ve tarzın buluşma noktası! Sallanan Bahçe Takımı, açık hava keyfinizi lüksle birleştiriyor.' },

  { name: 'Duma', slug: 'duma', category: 'oturma-grubu', collection: 'modern-doga-koleksiyonu', image: 'Duma/DUMA (1).jpg',
    description: 'Duma ile bahçenizde zarafetin ötesine geçin. Modern tasarımıyla şıklığı en üst düzeye çıkarın.',
    colors: [CAPPUCCINO] },

  { name: 'Loca', slug: 'loca', category: 'localar', collection: 'divan-koleksiyonu', image: 'Loca/LOCA (1).jpg',
    description: 'Şık rattan bahçe mobilya takımlarımız, açık alanınızı İlkbahar ve Yaz boyunca arkadaşlarınızı ve ailenizi eğlendirmek için ideal olan sıcak ve davetkar bir yere dönüştürmenize yardımcı olacaktır. Yeni ve devasa LOCA oturma grubumuz tüm aile bireylerini bir araya toplayacak. Bu koleksiyonun ikonik unsuru, güçlü ve sert bir malzeme olduğu bilinen rattan ile yapılmıştır. Rattan detayların yumuşak kıvrımlı silüetlerle harmanlanması ve sergilenmesi, bu koleksiyonu unutulmaz kılıyor!' },
  { name: 'Kapadokya', slug: 'kapadokya', category: 'localar', collection: 'divan-koleksiyonu', image: 'Kapadokya/KAPADOKYA-1.JPG' },
  { name: 'Kokteyl', slug: 'kokteyl', category: 'localar', collection: 'divan-koleksiyonu', image: 'Kokteyl/KOKTEYL-1.jpg' },

  { name: 'Bülbül', slug: 'bulbul', category: 'salincaklar', image: 'Bülbül/Rattan/BÜLBÜL RATTAN.jpg',
    description: GENERIC_SWINGS_DESC,
    specs: [{ label: 'Materyal Seçenekleri', value: 'Rattan veya İp (Rope) örgü' }] },
  { name: 'Fındık', slug: 'findik', category: 'salincaklar', image: 'Fındık/Rattan/FINDIK RATTAN.jpg',
    description: GENERIC_SWINGS_DESC,
    specs: [{ label: 'Materyal Seçenekleri', value: 'Rattan veya İp (Rope) örgü' }] },
  { name: 'Orbit', slug: 'orbit', category: 'salincaklar', image: 'Orbit/Cappuccino/obit cap (1).JPG',
    description: GENERIC_SWINGS_DESC,
    colors: [CAPPUCCINO, { name: 'İp Cappuccino', hex: '#9C7A54' }],
    specs: [{ label: 'Materyal', value: 'İp (Rope) örgü' }] },
  { name: 'Balina', slug: 'balina', category: 'salincaklar', image: 'Balina/BALİNA-4.jpg',
    colors: [{ name: 'İp Antrasit', hex: '#3C3A36' }] },

  { name: 'San Marino', slug: 'san-marino', category: 'oturma-grubu', collection: 'ip-koleksiyonu', image: 'San Marino/san marino (2).jpg',
    description: 'Formet\'in ip koleksiyonu eşsiz ve göz alıcı bir tasarım, kendinizi dinlenirken görebileceğiniz bir koleksiyon. Bu koleksiyon, içinde hayal kurmak isteyeceğiniz bir salon takımından oluşuyor!',
    specs: [{ label: 'Materyal', value: 'İp (Rope) seçeneği' }] },
  { name: 'Santana', slug: 'santana', category: 'oturma-grubu', collection: 'ip-koleksiyonu', image: 'Santana/Cappuccino/santana takım cappuccino (1).JPG',
    colors: [CAPPUCCINO, FUME, GRI] },

  { name: 'Bella', slug: 'bella', category: 'yemek-grubu', collection: 'rattan-koleksiyonu', image: 'Bella/BELLA-1.JPG' },
  { name: 'Safir', slug: 'safir', category: 'yemek-grubu', image: 'Safir/SAFİR (1).jpg',
    colors: [{ name: 'Rattan Cappuccino', hex: '#9C7A54' }] },

  { name: 'Doky', slug: 'doky', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Doky/DOKY-1.jpg' },
  { name: 'Dubai', slug: 'dubai', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Dubai/dubai (1).jpg' },
  { name: 'Elit', slug: 'elit', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Elit/ELİT.jpg' },
  { name: 'Family', slug: 'family', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Family/FAMİLY.jpg' },
  { name: 'Grand', slug: 'grand', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Grand/GRAND-1.jpg' },
  { name: 'Great', slug: 'great', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Great/GREAT-2.jpg' },
  { name: 'Lady', slug: 'lady', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Lady/LADY-1.jpg' },
  { name: 'Madrid', slug: 'madrid', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Madrid/MADRİD-1.jpg' },
  { name: 'Ocean', slug: 'ocean', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Ocean/OCEAN (8).jpg' },
  { name: 'Yeni Mihenk', slug: 'yeni-mihenk', category: 'oturma-grubu', collection: 'rattan-koleksiyonu', image: 'Yeni Mihenk/YENİ MİHENK-2.jpg',
    colors: [CAPPUCCINO, FUME, GRI] },

  { name: 'Tromso', slug: 'tromso', category: 'oturma-grubu', collection: 'formet-klasikleri', image: 'Tromso/TROMSO (1).jpg' },

  { name: 'Elizabeth', slug: 'elizabeth', category: 'diger', image: 'Elizabeth/ELİZABETH (1).jpg' },
  { name: 'Lupen', slug: 'lupen', category: 'diger', image: 'Lupen/lupen.jpg' },
  { name: 'Maldiv', slug: 'maldiv', category: 'diger', image: 'Maldiv/MALDİV-2.jpg' },
  { name: 'Rahat Koltuk', slug: 'rahat-koltuk', category: 'diger', image: 'Rahat Koltuk/Kırmızı/rahat koltuk kırmızı.jpg',
    colors: [
      { name: 'Kırmızı', hex: '#C0392B' },
      { name: 'Mavi', hex: '#2E5C8A' },
      { name: 'Sarı', hex: '#D4A72C' },
    ] },
  { name: 'Toscana', slug: 'toscana', category: 'diger', image: 'Toscana/TOSCANA (1).jpg' },
  { name: 'Şampanya', slug: 'sampanya', category: 'diger', image: 'Şampanya/ŞAMPANYA (1) - Kopya.jpg' },
];

async function uploadImage(relPath: string) {
  const original = await readFile(join(ASSETS_ROOT, relPath));
  const compressed = await sharp(original)
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const filename = (relPath.split('/').pop() || 'image').replace(/\.\w+$/, '.webp');
  const asset = await client.assets.upload('image', compressed, { filename });
  const kb = (n: number) => `${(n / 1000).toFixed(0)}kB`;
  console.log(`  ↑ uploaded ${filename} (${kb(original.length)} -> ${kb(compressed.length)})`);
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } };
}

const IMAGE_EXT = /\.(jpe?g|png|tiff?|webp)$/i;

// Recursively collect every image under `dir` (product folders nest color
// variants a level or two deep, e.g. Santana/Cappuccino/*.JPG).
async function walkImages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkImages(full)));
    } else if (IMAGE_EXT.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function run() {
  console.log(`\nImporting real Formet catalog into ${projectId}/${dataset}\n`);

  console.log('Categories…');
  for (const [i, cat] of CATEGORIES.entries()) {
    await client.createOrReplace({
      _id: `category-${cat.id}`,
      _type: 'category',
      name: cat.name,
      slug: { _type: 'slug', current: cat.id },
      order: i,
    });
    console.log(`  ✓ ${cat.name}`);
  }

  console.log('\nCollections…');
  for (const [i, col] of COLLECTIONS.entries()) {
    await client.createOrReplace({
      _id: `collection-${col.id}`,
      _type: 'collection',
      name: col.name,
      slug: { _type: 'slug', current: col.id },
      order: i,
    });
    console.log(`  ✓ ${col.name}`);
  }

  console.log('\nRepointing + hiding mock Pisa/Santana products…');
  const hideTx = client.transaction();
  for (const [id, categoryId] of Object.entries(MOCK_PRODUCT_CATEGORY)) {
    hideTx.patch(id, (p) =>
      p.set({ hidden: true, category: { _type: 'reference', _ref: `category-${categoryId}` } }),
    );
  }
  await hideTx.commit();
  console.log(`  ✓ repointed + hid ${Object.keys(MOCK_PRODUCT_CATEGORY).length} mock products`);

  console.log('\nProducts…');
  for (const [i, p] of PRODUCTS.entries()) {
    const image = await uploadImage(p.image); // primary — must succeed, required field

    const folder = p.image.split('/')[0];
    // macOS/APFS readdir can return Turkish letters (İ, Ü, Ğ, Ş...) NFD-decomposed
    // even when the hardcoded `image` path above is NFC — normalize before diffing.
    const primaryNfc = p.image.normalize('NFC');
    const extraRelPaths = (await walkImages(join(ASSETS_ROOT, folder)))
      .map((abs) => relative(ASSETS_ROOT, abs))
      .filter((rel) => rel.normalize('NFC') !== primaryNfc)
      .sort();

    // Dedupe by the resulting asset ref, not just source path — different
    // source files (re-exports, color-variant subfolders shot identically)
    // can compress down to pixel-identical, content-hash-deduped assets.
    const seenAssetRefs = new Set([image.asset._ref]);
    const gallery = [image];
    for (const rel of extraRelPaths) {
      try {
        const uploaded = await uploadImage(rel);
        if (seenAssetRefs.has(uploaded.asset._ref)) {
          console.log(`  ↺ duplicate content, skipping gallery entry: ${rel}`);
          continue;
        }
        seenAssetRefs.add(uploaded.asset._ref);
        gallery.push(uploaded);
      } catch (err) {
        console.warn(`  ⚠ skipped ${rel}: ${String(err).split('\n')[0]}`);
      }
    }

    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: 'product',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      price: 0,
      category: { _type: 'reference', _ref: `category-${p.category}` },
      collection: p.collection ? { _type: 'reference', _ref: `collection-${p.collection}` } : undefined,
      image,
      images: gallery.map((img) => ({ _key: randomUUID(), ...img })),
      description: p.description ?? '',
      specs: (p.specs ?? []).map((s) => ({ _key: randomUUID(), _type: 'spec', ...s })),
      colors: (p.colors ?? []).map((c) => ({ _key: randomUUID(), _type: 'colorOption', ...c })),
      order: i,
      hidden: true,
    });
    console.log(`  ✓ ${p.name} (${gallery.length} image${gallery.length === 1 ? '' : 's'})`);
  }

  console.log('\nDeleting obsolete category docs…');
  for (const id of CATEGORIES_TO_DELETE) {
    await client.delete(id);
    console.log(`  ✓ deleted ${id}`);
  }

  console.log(`\n✔ Imported ${PRODUCTS.length} products across ${CATEGORIES.length} categories and ${COLLECTIONS.length} collections.`);
  console.log('  All imported products are hidden with price ₺0 — set real prices and unhide in Studio.\n');
}

run().catch((err) => {
  console.error('\n✗ Import failed:', err);
  process.exit(1);
});
