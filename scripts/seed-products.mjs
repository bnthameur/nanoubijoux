import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzqvvowhudeqcdjjajcn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Cleaning existing data...');

  // Delete in order (foreign keys)
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('categories').delete().neq('id', 0);

  console.log('Inserting categories...');
  const { error: catErr } = await supabase.from('categories').insert([
    { id: 1, name_fr: 'Bagues', name_ar: 'خواتم', name_en: 'Rings', slug: 'bagues', sort_order: 1 },
    { id: 2, name_fr: 'Colliers', name_ar: 'قلائد', name_en: 'Necklaces', slug: 'colliers', sort_order: 2 },
    { id: 3, name_fr: 'Bracelets', name_ar: 'أساور', name_en: 'Bracelets', slug: 'bracelets', sort_order: 3 },
    { id: 4, name_fr: "Boucles d'oreilles", name_ar: 'أقراط', name_en: 'Earrings', slug: 'boucles-oreilles', sort_order: 4 },
    { id: 5, name_fr: 'Parures', name_ar: 'أطقم', name_en: 'Sets', slug: 'parures', sort_order: 5 },
    { id: 6, name_fr: 'Gourmettes', name_ar: 'أساور محفورة', name_en: 'ID Bracelets', slug: 'gourmettes', sort_order: 6 },
    { id: 7, name_fr: 'Montres', name_ar: 'ساعات', name_en: 'Watches', slug: 'montres', sort_order: 7 },
    { id: 8, name_fr: 'Chaînes de cheville', name_ar: 'خلاخل', name_en: 'Anklets', slug: 'chaines-cheville', sort_order: 8 },
    { id: 9, name_fr: 'Accessoires', name_ar: 'إكسسوارات', name_en: 'Accessories', slug: 'accessoires', sort_order: 9 },
  ]);
  if (catErr) { console.error('Categories error:', catErr); return; }
  console.log('Categories inserted!');

  // Products data
  const products = [
    // BAGUES
    { name_fr: 'Bague Solitaire Élégance', name_ar: 'خاتم سوليتير أناقة', name_en: 'Solitaire Elegance Ring', description_fr: 'Bague solitaire en acier inoxydable avec pierre zircon brillante. Design classique et intemporel.', description_ar: 'خاتم سوليتير من الفولاذ المقاوم للصدأ مع حجر زركون لامع', description_en: 'Stainless steel solitaire ring with brilliant zircon stone.', slug: 'bague-solitaire-elegance', price: 2500, compare_at_price: 3200, category_id: 1, material: 'Acier inoxydable', is_featured: true, is_new: true, is_on_sale: true, stock_quantity: 50, sku: 'BAG-001' },
    { name_fr: 'Bague Torsadée Or Rose', name_ar: 'خاتم ملتوي ذهبي وردي', name_en: 'Rose Gold Twisted Ring', description_fr: 'Bague torsadée plaquée or rose. Finition miroir et confort absolu.', description_ar: 'خاتم ملتوي مطلي بالذهب الوردي بتشطيب مرآة', description_en: 'Rose gold plated twisted ring with mirror finish.', slug: 'bague-torsadee-or-rose', price: 1800, compare_at_price: null, category_id: 1, material: 'Acier inoxydable plaqué or rose', is_featured: false, is_new: true, is_on_sale: false, stock_quantity: 35, sku: 'BAG-002' },
    { name_fr: 'Bague Bvlgari Style', name_ar: 'خاتم ستايل بلغاري', name_en: 'Bvlgari Style Ring', description_fr: 'Bague inspirée du style Bvlgari en acier inoxydable. Gravure romaine élégante.', description_ar: 'خاتم مستوحى من ستايل بلغاري من الفولاذ المقاوم للصدأ', description_en: 'Bvlgari-inspired stainless steel ring with Roman engraving.', slug: 'bague-bvlgari-style', price: 3500, compare_at_price: 4500, category_id: 1, material: 'Acier inoxydable', is_featured: true, is_new: false, is_on_sale: true, stock_quantity: 25, sku: 'BAG-003' },
    // COLLIERS
    { name_fr: 'Collier Chaîne Maille Or', name_ar: 'قلادة سلسلة ذهبية', name_en: 'Gold Chain Necklace', description_fr: 'Collier chaîne maille fine plaqué or 18K. Longueur 45cm ajustable.', description_ar: 'قلادة سلسلة ناعمة مطلية بالذهب عيار 18', description_en: 'Fine mesh gold plated 18K chain necklace. Adjustable 45cm.', slug: 'collier-chaine-maille-or', price: 2800, compare_at_price: 3500, category_id: 2, material: 'Acier inoxydable plaqué or', is_featured: true, is_new: true, is_on_sale: true, stock_quantity: 40, sku: 'COL-001' },
    { name_fr: 'Collier Pendentif Cœur', name_ar: 'قلادة قلب معلق', name_en: 'Heart Pendant Necklace', description_fr: 'Collier avec pendentif cœur en acier inoxydable. Idéal pour un cadeau romantique.', description_ar: 'قلادة مع قلب معلق من الفولاذ المقاوم للصدأ', description_en: 'Heart pendant stainless steel necklace. Perfect romantic gift.', slug: 'collier-pendentif-coeur', price: 2200, compare_at_price: null, category_id: 2, material: 'Acier inoxydable', is_featured: false, is_new: true, is_on_sale: false, stock_quantity: 30, sku: 'COL-002' },
    { name_fr: 'Collier Ras de Cou Perles', name_ar: 'قلادة لؤلؤ قصيرة', name_en: 'Pearl Choker Necklace', description_fr: 'Collier ras de cou orné de perles synthétiques. Style sophistiqué et moderne.', description_ar: 'قلادة قصيرة مزينة باللؤلؤ الصناعي بأسلوب عصري', description_en: 'Pearl-adorned choker necklace. Sophisticated modern style.', slug: 'collier-ras-de-cou-perles', price: 3200, compare_at_price: 4000, category_id: 2, material: 'Acier inoxydable et perles', is_featured: true, is_new: false, is_on_sale: true, stock_quantity: 20, sku: 'COL-003' },
    // BRACELETS
    { name_fr: 'Bracelet Jonc Or Rose', name_ar: 'سوار جونك ذهبي وردي', name_en: 'Rose Gold Bangle', description_fr: 'Bracelet jonc fin plaqué or rose. Fermoir sécurisé et ajustable.', description_ar: 'سوار جونك ناعم مطلي بالذهب الوردي مع قفل آمن', description_en: 'Slim rose gold plated bangle with secure adjustable clasp.', slug: 'bracelet-jonc-or-rose', price: 2000, compare_at_price: null, category_id: 3, material: 'Acier inoxydable plaqué or rose', is_featured: true, is_new: true, is_on_sale: false, stock_quantity: 45, sku: 'BRA-001' },
    { name_fr: 'Bracelet Tiffany Acier', name_ar: 'سوار تيفاني فولاذ', name_en: 'Tiffany Steel Bracelet', description_fr: 'Bracelet chaîne style Tiffany en acier inoxydable. Fermoir toggle.', description_ar: 'سوار سلسلة ستايل تيفاني من الفولاذ المقاوم للصدأ', description_en: 'Tiffany-style stainless steel chain bracelet with toggle clasp.', slug: 'bracelet-tiffany-acier', price: 2500, compare_at_price: 3000, category_id: 3, material: 'Acier inoxydable', is_featured: true, is_new: false, is_on_sale: true, stock_quantity: 30, sku: 'BRA-002' },
    { name_fr: 'Bracelet Manchette Gravé', name_ar: 'سوار كاف محفور', name_en: 'Engraved Cuff Bracelet', description_fr: 'Bracelet manchette large avec motifs gravés. Style bohème chic.', description_ar: 'سوار كاف عريض مع نقوش محفورة بأسلوب بوهيمي شيك', description_en: 'Wide engraved cuff bracelet. Bohemian chic style.', slug: 'bracelet-manchette-grave', price: 1800, compare_at_price: null, category_id: 3, material: 'Acier inoxydable', is_featured: false, is_new: true, is_on_sale: false, stock_quantity: 25, sku: 'BRA-003' },
    // BOUCLES D'OREILLES
    { name_fr: 'Boucles Créoles Dorées', name_ar: 'أقراط حلقية ذهبية', name_en: 'Gold Hoop Earrings', description_fr: "Boucles d'oreilles créoles dorées en acier inoxydable. Diamètre 3cm.", description_ar: 'أقراط حلقية ذهبية من الفولاذ المقاوم للصدأ قطر 3سم', description_en: 'Gold stainless steel hoop earrings. 3cm diameter.', slug: 'boucles-creoles-dorees', price: 1500, compare_at_price: null, category_id: 4, material: 'Acier inoxydable plaqué or', is_featured: true, is_new: true, is_on_sale: false, stock_quantity: 60, sku: 'BOU-001' },
    { name_fr: 'Boucles Pendantes Cristal', name_ar: 'أقراط متدلية كريستال', name_en: 'Crystal Drop Earrings', description_fr: "Boucles d'oreilles pendantes avec cristaux. Brillance exceptionnelle.", description_ar: 'أقراط متدلية مع كريستال لمعان استثنائي', description_en: 'Crystal drop earrings with exceptional brilliance.', slug: 'boucles-pendantes-cristal', price: 2200, compare_at_price: 2800, category_id: 4, material: 'Acier inoxydable et cristal', is_featured: true, is_new: false, is_on_sale: true, stock_quantity: 35, sku: 'BOU-002' },
    { name_fr: 'Boucles Puces Étoile', name_ar: 'أقراط نجمة صغيرة', name_en: 'Star Stud Earrings', description_fr: "Boucles d'oreilles puces en forme d'étoile. Discrètes et raffinées.", description_ar: 'أقراط صغيرة على شكل نجمة أنيقة ورقيقة', description_en: 'Star-shaped stud earrings. Discreet and refined.', slug: 'boucles-puces-etoile', price: 1200, compare_at_price: null, category_id: 4, material: 'Acier inoxydable', is_featured: false, is_new: true, is_on_sale: false, stock_quantity: 50, sku: 'BOU-003' },
    // PARURES
    { name_fr: 'Parure Missika 4 Pièces', name_ar: 'طقم ميسيكا 4 قطع', name_en: 'Missika 4-Piece Set', description_fr: "Parure complète: collier, bracelet, bague et boucles d'oreilles. Acier inoxydable finition miroir.", description_ar: 'طقم كامل: قلادة سوار خاتم وأقراط من الفولاذ المقاوم للصدأ', description_en: 'Complete set: necklace, bracelet, ring and earrings. Mirror finish steel.', slug: 'parure-missika-4-pieces', price: 6500, compare_at_price: 8500, category_id: 5, material: 'Acier inoxydable', is_featured: true, is_new: true, is_on_sale: true, stock_quantity: 15, sku: 'PAR-001' },
    { name_fr: 'Parure Perle Classique', name_ar: 'طقم لؤلؤ كلاسيكي', name_en: 'Classic Pearl Set', description_fr: "Parure collier et boucles d'oreilles en perles synthétiques sur acier.", description_ar: 'طقم قلادة وأقراط من اللؤلؤ الصناعي على الفولاذ', description_en: 'Pearl necklace and earring set on stainless steel.', slug: 'parure-perle-classique', price: 4800, compare_at_price: 5500, category_id: 5, material: 'Acier inoxydable et perles', is_featured: true, is_new: false, is_on_sale: true, stock_quantity: 20, sku: 'PAR-002' },
    { name_fr: 'Parure Papillon Doré', name_ar: 'طقم فراشة ذهبي', name_en: 'Golden Butterfly Set', description_fr: 'Parure 3 pièces motif papillon plaqué or: collier, boucles et bracelet.', description_ar: 'طقم 3 قطع بنقش فراشة مطلي بالذهب', description_en: 'Gold plated 3-piece butterfly set: necklace, earrings and bracelet.', slug: 'parure-papillon-dore', price: 5200, compare_at_price: null, category_id: 5, material: 'Acier inoxydable plaqué or', is_featured: false, is_new: true, is_on_sale: false, stock_quantity: 18, sku: 'PAR-003' },
    // GOURMETTES
    { name_fr: 'Gourmette Classique Gravée', name_ar: 'سوار محفور كلاسيكي', name_en: 'Classic Engraved ID Bracelet', description_fr: 'Gourmette classique en acier inoxydable. Possibilité de gravure personnalisée.', description_ar: 'سوار محفور كلاسيكي من الفولاذ المقاوم للصدأ مع إمكانية النقش', description_en: 'Classic stainless steel ID bracelet. Custom engraving available.', slug: 'gourmette-classique-gravee', price: 2800, compare_at_price: null, category_id: 6, material: 'Acier inoxydable', is_featured: true, is_new: false, is_on_sale: false, stock_quantity: 30, sku: 'GOU-001' },
    { name_fr: 'Gourmette Maille Cubaine', name_ar: 'سوار كوبي', name_en: 'Cuban Link ID Bracelet', description_fr: 'Gourmette maille cubaine épaisse plaquée or. Style urbain et tendance.', description_ar: 'سوار حلقات كوبية سميكة مطلية بالذهب بأسلوب عصري', description_en: 'Thick Cuban link gold plated ID bracelet. Urban trendy style.', slug: 'gourmette-maille-cubaine', price: 3500, compare_at_price: 4200, category_id: 6, material: 'Acier inoxydable plaqué or', is_featured: true, is_new: true, is_on_sale: true, stock_quantity: 20, sku: 'GOU-002' },
    { name_fr: 'Gourmette Fine Argent', name_ar: 'سوار فضي ناعم', name_en: 'Slim Silver ID Bracelet', description_fr: 'Gourmette fine en acier couleur argent. Élégante et discrète.', description_ar: 'سوار ناعم من الفولاذ بلون فضي أنيق ورقيق', description_en: 'Slim silver-tone steel ID bracelet. Elegant and discreet.', slug: 'gourmette-fine-argent', price: 1500, compare_at_price: null, category_id: 6, material: 'Acier inoxydable', is_featured: false, is_new: true, is_on_sale: false, stock_quantity: 40, sku: 'GOU-003' },
    // MONTRES
    { name_fr: 'Montre Classique Dorée', name_ar: 'ساعة كلاسيكية ذهبية', name_en: 'Classic Gold Watch', description_fr: 'Montre femme cadran rond doré avec bracelet maille milanaise. Mouvement quartz.', description_ar: 'ساعة نسائية بمينا ذهبي مستدير وسوار ميلانيزي', description_en: "Women's gold round dial watch with Milanese mesh strap. Quartz.", slug: 'montre-classique-doree', price: 4500, compare_at_price: 5500, category_id: 7, material: 'Acier inoxydable plaqué or', is_featured: true, is_new: true, is_on_sale: true, stock_quantity: 15, sku: 'MON-001' },
    { name_fr: 'Montre Minimaliste Argent', name_ar: 'ساعة بسيطة فضية', name_en: 'Minimalist Silver Watch', description_fr: 'Montre minimaliste cadran blanc sur bracelet acier argent. Style scandinave.', description_ar: 'ساعة بسيطة بمينا أبيض على سوار فولاذ فضي', description_en: 'Minimalist white dial silver steel watch. Scandinavian style.', slug: 'montre-minimaliste-argent', price: 3800, compare_at_price: null, category_id: 7, material: 'Acier inoxydable', is_featured: true, is_new: false, is_on_sale: false, stock_quantity: 20, sku: 'MON-002' },
    { name_fr: 'Montre Strass Or Rose', name_ar: 'ساعة مرصعة ذهبية وردية', name_en: 'Rose Gold Rhinestone Watch', description_fr: 'Montre or rose sertie de strass sur le cadran. Bracelet ajustable.', description_ar: 'ساعة ذهبية وردية مرصعة على المينا مع سوار قابل للتعديل', description_en: 'Rose gold rhinestone-set dial watch with adjustable strap.', slug: 'montre-strass-or-rose', price: 5200, compare_at_price: 6500, category_id: 7, material: 'Acier inoxydable plaqué or rose', is_featured: true, is_new: true, is_on_sale: true, stock_quantity: 12, sku: 'MON-003' },
    // CHAÎNES DE CHEVILLE
    { name_fr: 'Chaîne Cheville Double Rang', name_ar: 'خلخال صفين', name_en: 'Double Strand Anklet', description_fr: 'Chaîne de cheville double rang avec breloques en acier inoxydable.', description_ar: 'خلخال بصفين مع تعليقات من الفولاذ المقاوم للصدأ', description_en: 'Double strand anklet with stainless steel charms.', slug: 'chaine-cheville-double-rang', price: 1500, compare_at_price: null, category_id: 8, material: 'Acier inoxydable', is_featured: true, is_new: true, is_on_sale: false, stock_quantity: 40, sku: 'CHE-001' },
    { name_fr: 'Chaîne Cheville Papillon Or', name_ar: 'خلخال فراشة ذهبي', name_en: 'Gold Butterfly Anklet', description_fr: 'Chaîne de cheville avec pendentif papillon plaqué or.', description_ar: 'خلخال مع تعليق فراشة مطلي بالذهب', description_en: 'Gold plated butterfly pendant anklet.', slug: 'chaine-cheville-papillon-or', price: 1800, compare_at_price: 2200, category_id: 8, material: 'Acier inoxydable plaqué or', is_featured: false, is_new: true, is_on_sale: true, stock_quantity: 30, sku: 'CHE-002' },
    { name_fr: 'Chaîne Cheville Perle Fine', name_ar: 'خلخال لؤلؤ ناعم', name_en: 'Fine Pearl Anklet', description_fr: 'Chaîne de cheville fine ornée de mini perles. Style romantique.', description_ar: 'خلخال ناعم مزين بلؤلؤ صغير بأسلوب رومانسي', description_en: 'Fine anklet adorned with mini pearls. Romantic style.', slug: 'chaine-cheville-perle-fine', price: 1200, compare_at_price: null, category_id: 8, material: 'Acier inoxydable et perles', is_featured: false, is_new: false, is_on_sale: false, stock_quantity: 35, sku: 'CHE-003' },
    // ACCESSOIRES
    { name_fr: 'Broche Fleur Cristal', name_ar: 'بروش وردة كريستال', name_en: 'Crystal Flower Brooch', description_fr: 'Broche fleur ornée de cristaux. Accessoire parfait pour veste ou hijab.', description_ar: 'بروش وردة مزينة بالكريستال مثالي للسترة أو الحجاب', description_en: 'Crystal flower brooch. Perfect for jacket or hijab.', slug: 'broche-fleur-cristal', price: 1500, compare_at_price: 1800, category_id: 9, material: 'Alliage et cristal', is_featured: true, is_new: true, is_on_sale: true, stock_quantity: 50, sku: 'ACC-001' },
    { name_fr: 'Pince Cheveux Perle', name_ar: 'مشبك شعر لؤلؤ', name_en: 'Pearl Hair Clip', description_fr: 'Pince à cheveux décorée de perles synthétiques. Élégante et pratique.', description_ar: 'مشبك شعر مزين باللؤلؤ الصناعي أنيق وعملي', description_en: 'Pearl-decorated hair clip. Elegant and practical.', slug: 'pince-cheveux-perle', price: 800, compare_at_price: null, category_id: 9, material: 'Métal et perles', is_featured: false, is_new: true, is_on_sale: false, stock_quantity: 60, sku: 'ACC-002' },
    { name_fr: 'Porte-Clés Cœur Acier', name_ar: 'حامل مفاتيح قلب فولاذ', name_en: 'Steel Heart Keychain', description_fr: 'Porte-clés cœur en acier inoxydable. Cadeau idéal.', description_ar: 'حامل مفاتيح على شكل قلب من الفولاذ المقاوم للصدأ', description_en: 'Stainless steel heart keychain. Ideal gift.', slug: 'porte-cles-coeur-acier', price: 600, compare_at_price: null, category_id: 9, material: 'Acier inoxydable', is_featured: false, is_new: false, is_on_sale: false, stock_quantity: 80, sku: 'ACC-003' },
  ];

  console.log(`Inserting ${products.length} products...`);
  const { data: insertedProducts, error: prodErr } = await supabase
    .from('products')
    .insert(products)
    .select('id, slug');

  if (prodErr) { console.error('Products error:', prodErr); return; }
  console.log('Products inserted!');

  // Build slug->id map
  const slugToId = {};
  for (const p of insertedProducts) {
    slugToId[p.slug] = p.id;
  }

  // Images per product (3-4 per product)
  const imagesBySlug = {
    'bague-solitaire-elegance': [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&h=800&fit=crop',
    ],
    'bague-torsadee-or-rose': [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
    ],
    'bague-bvlgari-style': [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
    ],
    'collier-chaine-maille-or': [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
    ],
    'collier-pendentif-coeur': [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
    ],
    'collier-ras-de-cou-perles': [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
    ],
    'bracelet-jonc-or-rose': [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
    ],
    'bracelet-tiffany-acier': [
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
    ],
    'bracelet-manchette-grave': [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
    ],
    'boucles-creoles-dorees': [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
    ],
    'boucles-pendantes-cristal': [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
    ],
    'boucles-puces-etoile': [
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
    ],
    'parure-missika-4-pieces': [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
    ],
    'parure-perle-classique': [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
    ],
    'parure-papillon-dore': [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
    ],
    'gourmette-classique-gravee': [
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
    ],
    'gourmette-maille-cubaine': [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
    ],
    'gourmette-fine-argent': [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
    ],
    'montre-classique-doree': [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=800&fit=crop',
    ],
    'montre-minimaliste-argent': [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=800&fit=crop',
    ],
    'montre-strass-or-rose': [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
    ],
    'chaine-cheville-double-rang': [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
    ],
    'chaine-cheville-papillon-or': [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
    ],
    'chaine-cheville-perle-fine': [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
    ],
    'broche-fleur-cristal': [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
    ],
    'pince-cheveux-perle': [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
    ],
    'porte-cles-coeur-acier': [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
    ],
  };

  // Build all image records
  const allImages = [];
  for (const [slug, urls] of Object.entries(imagesBySlug)) {
    const productId = slugToId[slug];
    if (!productId) { console.warn(`No product found for slug: ${slug}`); continue; }
    urls.forEach((url, i) => {
      allImages.push({
        product_id: productId,
        url,
        alt_text: `${slug} image ${i + 1}`,
        is_primary: i === 0,
        sort_order: i,
      });
    });
  }

  console.log(`Inserting ${allImages.length} product images...`);
  const { error: imgErr } = await supabase.from('product_images').insert(allImages);
  if (imgErr) { console.error('Images error:', imgErr); return; }

  console.log('All done! Seeded successfully.');
  console.log(`  - 9 categories`);
  console.log(`  - ${products.length} products`);
  console.log(`  - ${allImages.length} product images`);
}

seed().catch(console.error);
