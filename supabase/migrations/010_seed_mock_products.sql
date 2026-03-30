-- =========================================================================
-- 010_seed_mock_products.sql
-- Seed categories + mock products with Unsplash images
-- =========================================================================

-- 1) Clean existing product data
DELETE FROM product_images;
DELETE FROM product_variants;
DELETE FROM order_items;
DELETE FROM products;
DELETE FROM categories;

-- 2) Insert categories
INSERT INTO categories (id, name_fr, name_ar, name_en, slug, sort_order) VALUES
(1,  'Bagues',           'خواتم',        'Rings',        'bagues',           1),
(2,  'Colliers',         'قلائد',        'Necklaces',    'colliers',         2),
(3,  'Bracelets',        'أساور',        'Bracelets',    'bracelets',        3),
(4,  'Boucles d''oreilles','أقراط',      'Earrings',     'boucles-oreilles', 4),
(5,  'Parures',          'أطقم',         'Sets',         'parures',          5),
(6,  'Gourmettes',       'أساور محفورة', 'ID Bracelets', 'gourmettes',       6),
(7,  'Montres',          'ساعات',        'Watches',      'montres',          7),
(8,  'Chaînes de cheville','خلاخل',      'Anklets',      'chaines-cheville', 8),
(9,  'Accessoires',      'إكسسوارات',   'Accessories',  'accessoires',      9);

-- Reset sequence
SELECT setval('categories_id_seq', 10, false);

-- 3) Insert products
-- Using gen_random_uuid() for IDs

-- ======================== BAGUES (category 1) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Bague Solitaire Élégance', 'خاتم سوليتير أناقة', 'Solitaire Elegance Ring', 'Bague solitaire en acier inoxydable avec pierre zircon brillante. Design classique et intemporel.', 'خاتم سوليتير من الفولاذ المقاوم للصدأ مع حجر زركون لامع', 'Stainless steel solitaire ring with brilliant zircon stone.', 'bague-solitaire-elegance', 2500, 3200, 1, 'Acier inoxydable', true, true, true, 50, 'BAG-001'),
(gen_random_uuid(), 'Bague Torsadée Or Rose', 'خاتم ملتوي ذهبي وردي', 'Rose Gold Twisted Ring', 'Bague torsadée plaquée or rose. Finition miroir et confort absolu.', 'خاتم ملتوي مطلي بالذهب الوردي بتشطيب مرآة', 'Rose gold plated twisted ring with mirror finish.', 'bague-torsadee-or-rose', 1800, NULL, 1, 'Acier inoxydable plaqué or rose', false, true, false, 35, 'BAG-002'),
(gen_random_uuid(), 'Bague Bvlgari Style', 'خاتم ستايل بلغاري', 'Bvlgari Style Ring', 'Bague inspirée du style Bvlgari en acier inoxydable. Gravure romaine élégante.', 'خاتم مستوحى من ستايل بلغاري من الفولاذ المقاوم للصدأ', 'Bvlgari-inspired stainless steel ring with Roman engraving.', 'bague-bvlgari-style', 3500, 4500, 1, 'Acier inoxydable', true, false, true, 25, 'BAG-003');

-- ======================== COLLIERS (category 2) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Collier Chaîne Maille Or', 'قلادة سلسلة ذهبية', 'Gold Chain Necklace', 'Collier chaîne maille fine plaqué or 18K. Longueur 45cm ajustable.', 'قلادة سلسلة ناعمة مطلية بالذهب عيار 18', 'Fine mesh gold plated 18K chain necklace. Adjustable 45cm.', 'collier-chaine-maille-or', 2800, 3500, 2, 'Acier inoxydable plaqué or', true, true, true, 40, 'COL-001'),
(gen_random_uuid(), 'Collier Pendentif Cœur', 'قلادة قلب معلق', 'Heart Pendant Necklace', 'Collier avec pendentif cœur en acier inoxydable. Idéal pour un cadeau romantique.', 'قلادة مع قلب معلق من الفولاذ المقاوم للصدأ', 'Heart pendant stainless steel necklace. Perfect romantic gift.', 'collier-pendentif-coeur', 2200, NULL, 2, 'Acier inoxydable', false, true, false, 30, 'COL-002'),
(gen_random_uuid(), 'Collier Ras de Cou Perles', 'قلادة لؤلؤ قصيرة', 'Pearl Choker Necklace', 'Collier ras de cou orné de perles synthétiques. Style sophistiqué et moderne.', 'قلادة قصيرة مزينة باللؤلؤ الصناعي بأسلوب عصري', 'Pearl-adorned choker necklace. Sophisticated modern style.', 'collier-ras-de-cou-perles', 3200, 4000, 2, 'Acier inoxydable et perles', true, false, true, 20, 'COL-003');

-- ======================== BRACELETS (category 3) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Bracelet Jonc Or Rose', 'سوار جونك ذهبي وردي', 'Rose Gold Bangle', 'Bracelet jonc fin plaqué or rose. Fermoir sécurisé et ajustable.', 'سوار جونك ناعم مطلي بالذهب الوردي مع قفل آمن', 'Slim rose gold plated bangle with secure adjustable clasp.', 'bracelet-jonc-or-rose', 2000, NULL, 3, 'Acier inoxydable plaqué or rose', true, true, false, 45, 'BRA-001'),
(gen_random_uuid(), 'Bracelet Tiffany Acier', 'سوار تيفاني فولاذ', 'Tiffany Steel Bracelet', 'Bracelet chaîne style Tiffany en acier inoxydable. Fermoir toggle.', 'سوار سلسلة ستايل تيفاني من الفولاذ المقاوم للصدأ', 'Tiffany-style stainless steel chain bracelet with toggle clasp.', 'bracelet-tiffany-acier', 2500, 3000, 3, 'Acier inoxydable', true, false, true, 30, 'BRA-002'),
(gen_random_uuid(), 'Bracelet Manchette Gravé', 'سوار كاف محفور', 'Engraved Cuff Bracelet', 'Bracelet manchette large avec motifs gravés. Style bohème chic.', 'سوار كاف عريض مع نقوش محفورة بأسلوب بوهيمي شيك', 'Wide engraved cuff bracelet. Bohemian chic style.', 'bracelet-manchette-grave', 1800, NULL, 3, 'Acier inoxydable', false, true, false, 25, 'BRA-003');

-- ======================== BOUCLES D'OREILLES (category 4) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Boucles Créoles Dorées', 'أقراط حلقية ذهبية', 'Gold Hoop Earrings', 'Boucles d''oreilles créoles dorées en acier inoxydable. Diamètre 3cm.', 'أقراط حلقية ذهبية من الفولاذ المقاوم للصدأ قطر 3سم', 'Gold stainless steel hoop earrings. 3cm diameter.', 'boucles-creoles-dorees', 1500, NULL, 4, 'Acier inoxydable plaqué or', true, true, false, 60, 'BOU-001'),
(gen_random_uuid(), 'Boucles Pendantes Cristal', 'أقراط متدلية كريستال', 'Crystal Drop Earrings', 'Boucles d''oreilles pendantes avec cristaux. Brillance exceptionnelle.', 'أقراط متدلية مع كريستال لمعان استثنائي', 'Crystal drop earrings with exceptional brilliance.', 'boucles-pendantes-cristal', 2200, 2800, 4, 'Acier inoxydable et cristal', true, false, true, 35, 'BOU-002'),
(gen_random_uuid(), 'Boucles Puces Étoile', 'أقراط نجمة صغيرة', 'Star Stud Earrings', 'Boucles d''oreilles puces en forme d''étoile. Discrètes et raffinées.', 'أقراط صغيرة على شكل نجمة أنيقة ورقيقة', 'Star-shaped stud earrings. Discreet and refined.', 'boucles-puces-etoile', 1200, NULL, 4, 'Acier inoxydable', false, true, false, 50, 'BOU-003');

-- ======================== PARURES (category 5) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Parure Missika 4 Pièces', 'طقم ميسيكا 4 قطع', 'Missika 4-Piece Set', 'Parure complète: collier, bracelet, bague et boucles d''oreilles. Acier inoxydable finition miroir.', 'طقم كامل: قلادة سوار خاتم وأقراط من الفولاذ المقاوم للصدأ', 'Complete set: necklace, bracelet, ring and earrings. Mirror finish steel.', 'parure-missika-4-pieces', 6500, 8500, 5, 'Acier inoxydable', true, true, true, 15, 'PAR-001'),
(gen_random_uuid(), 'Parure Perle Classique', 'طقم لؤلؤ كلاسيكي', 'Classic Pearl Set', 'Parure collier et boucles d''oreilles en perles synthétiques sur acier.', 'طقم قلادة وأقراط من اللؤلؤ الصناعي على الفولاذ', 'Pearl necklace and earring set on stainless steel.', 'parure-perle-classique', 4800, 5500, 5, 'Acier inoxydable et perles', true, false, true, 20, 'PAR-002'),
(gen_random_uuid(), 'Parure Papillon Doré', 'طقم فراشة ذهبي', 'Golden Butterfly Set', 'Parure 3 pièces motif papillon plaqué or: collier, boucles et bracelet.', 'طقم 3 قطع بنقش فراشة مطلي بالذهب', 'Gold plated 3-piece butterfly set: necklace, earrings and bracelet.', 'parure-papillon-dore', 5200, NULL, 5, 'Acier inoxydable plaqué or', false, true, false, 18, 'PAR-003');

-- ======================== GOURMETTES (category 6) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Gourmette Classique Gravée', 'سوار محفور كلاسيكي', 'Classic Engraved ID Bracelet', 'Gourmette classique en acier inoxydable. Possibilité de gravure personnalisée.', 'سوار محفور كلاسيكي من الفولاذ المقاوم للصدأ مع إمكانية النقش', 'Classic stainless steel ID bracelet. Custom engraving available.', 'gourmette-classique-gravee', 2800, NULL, 6, 'Acier inoxydable', true, false, false, 30, 'GOU-001'),
(gen_random_uuid(), 'Gourmette Maille Cubaine', 'سوار كوبي', 'Cuban Link ID Bracelet', 'Gourmette maille cubaine épaisse plaquée or. Style urbain et tendance.', 'سوار حلقات كوبية سميكة مطلية بالذهب بأسلوب عصري', 'Thick Cuban link gold plated ID bracelet. Urban trendy style.', 'gourmette-maille-cubaine', 3500, 4200, 6, 'Acier inoxydable plaqué or', true, true, true, 20, 'GOU-002'),
(gen_random_uuid(), 'Gourmette Fine Argent', 'سوار فضي ناعم', 'Slim Silver ID Bracelet', 'Gourmette fine en acier couleur argent. Élégante et discrète.', 'سوار ناعم من الفولاذ بلون فضي أنيق ورقيق', 'Slim silver-tone steel ID bracelet. Elegant and discreet.', 'gourmette-fine-argent', 1500, NULL, 6, 'Acier inoxydable', false, true, false, 40, 'GOU-003');

-- ======================== MONTRES (category 7) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Montre Classique Dorée', 'ساعة كلاسيكية ذهبية', 'Classic Gold Watch', 'Montre femme cadran rond doré avec bracelet maille milanaise. Mouvement quartz.', 'ساعة نسائية بمينا ذهبي مستدير وسوار ميلانيزي', 'Women''s gold round dial watch with Milanese mesh strap. Quartz.', 'montre-classique-doree', 4500, 5500, 7, 'Acier inoxydable plaqué or', true, true, true, 15, 'MON-001'),
(gen_random_uuid(), 'Montre Minimaliste Argent', 'ساعة بسيطة فضية', 'Minimalist Silver Watch', 'Montre minimaliste cadran blanc sur bracelet acier argent. Style scandinave.', 'ساعة بسيطة بمينا أبيض على سوار فولاذ فضي', 'Minimalist white dial silver steel watch. Scandinavian style.', 'montre-minimaliste-argent', 3800, NULL, 7, 'Acier inoxydable', true, false, false, 20, 'MON-002'),
(gen_random_uuid(), 'Montre Strass Or Rose', 'ساعة مرصعة ذهبية وردية', 'Rose Gold Rhinestone Watch', 'Montre or rose sertie de strass sur le cadran. Bracelet ajustable.', 'ساعة ذهبية وردية مرصعة على المينا مع سوار قابل للتعديل', 'Rose gold rhinestone-set dial watch with adjustable strap.', 'montre-strass-or-rose', 5200, 6500, 7, 'Acier inoxydable plaqué or rose', true, true, true, 12, 'MON-003');

-- ======================== CHAÎNES DE CHEVILLE (category 8) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Chaîne Cheville Double Rang', 'خلخال صفين', 'Double Strand Anklet', 'Chaîne de cheville double rang avec breloques en acier inoxydable.', 'خلخال بصفين مع تعليقات من الفولاذ المقاوم للصدأ', 'Double strand anklet with stainless steel charms.', 'chaine-cheville-double-rang', 1500, NULL, 8, 'Acier inoxydable', true, true, false, 40, 'CHE-001'),
(gen_random_uuid(), 'Chaîne Cheville Papillon Or', 'خلخال فراشة ذهبي', 'Gold Butterfly Anklet', 'Chaîne de cheville avec pendentif papillon plaqué or.', 'خلخال مع تعليق فراشة مطلي بالذهب', 'Gold plated butterfly pendant anklet.', 'chaine-cheville-papillon-or', 1800, 2200, 8, 'Acier inoxydable plaqué or', false, true, true, 30, 'CHE-002'),
(gen_random_uuid(), 'Chaîne Cheville Perle Fine', 'خلخال لؤلؤ ناعم', 'Fine Pearl Anklet', 'Chaîne de cheville fine ornée de mini perles. Style romantique.', 'خلخال ناعم مزين بلؤلؤ صغير بأسلوب رومانسي', 'Fine anklet adorned with mini pearls. Romantic style.', 'chaine-cheville-perle-fine', 1200, NULL, 8, 'Acier inoxydable et perles', false, false, false, 35, 'CHE-003');

-- ======================== ACCESSOIRES (category 9) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Broche Fleur Cristal', 'بروش وردة كريستال', 'Crystal Flower Brooch', 'Broche fleur ornée de cristaux. Accessoire parfait pour veste ou hijab.', 'بروش وردة مزينة بالكريستال مثالي للسترة أو الحجاب', 'Crystal flower brooch. Perfect for jacket or hijab.', 'broche-fleur-cristal', 1500, 1800, 9, 'Alliage et cristal', true, true, true, 50, 'ACC-001'),
(gen_random_uuid(), 'Pince Cheveux Perle', 'مشبك شعر لؤلؤ', 'Pearl Hair Clip', 'Pince à cheveux décorée de perles synthétiques. Élégante et pratique.', 'مشبك شعر مزين باللؤلؤ الصناعي أنيق وعملي', 'Pearl-decorated hair clip. Elegant and practical.', 'pince-cheveux-perle', 800, NULL, 9, 'Métal et perles', false, true, false, 60, 'ACC-002'),
(gen_random_uuid(), 'Porte-Clés Cœur Acier', 'حامل مفاتيح قلب فولاذ', 'Steel Heart Keychain', 'Porte-clés cœur en acier inoxydable. Cadeau idéal.', 'حامل مفاتيح على شكل قلب من الفولاذ المقاوم للصدأ', 'Stainless steel heart keychain. Ideal gift.', 'porte-cles-coeur-acier', 600, NULL, 9, 'Acier inoxydable', false, false, false, 80, 'ACC-003');


-- =========================================================================
-- 4) Insert product images (3+ per product)
-- We need to reference the products we just created by slug
-- =========================================================================

-- BAGUES images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'Bague solitaire vue face', true, 0
FROM products p WHERE p.slug = 'bague-solitaire-elegance';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
  'Bague solitaire vue côté', false, 1
FROM products p WHERE p.slug = 'bague-solitaire-elegance';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  'Bague solitaire portée', false, 2
FROM products p WHERE p.slug = 'bague-solitaire-elegance';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&h=800&fit=crop',
  'Bague solitaire détail', false, 3
FROM products p WHERE p.slug = 'bague-solitaire-elegance';

-- Bague Torsadée
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  'Bague torsadée or rose', true, 0
FROM products p WHERE p.slug = 'bague-torsadee-or-rose';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
  'Bague torsadée détail', false, 1
FROM products p WHERE p.slug = 'bague-torsadee-or-rose';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  'Bague torsadée portée', false, 2
FROM products p WHERE p.slug = 'bague-torsadee-or-rose';

-- Bague Bvlgari
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
  'Bague Bvlgari style face', true, 0
FROM products p WHERE p.slug = 'bague-bvlgari-style';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
  'Bague Bvlgari style côté', false, 1
FROM products p WHERE p.slug = 'bague-bvlgari-style';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  'Bague Bvlgari portée', false, 2
FROM products p WHERE p.slug = 'bague-bvlgari-style';

-- COLLIERS images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
  'Collier chaîne or vue face', true, 0
FROM products p WHERE p.slug = 'collier-chaine-maille-or';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
  'Collier chaîne or porté', false, 1
FROM products p WHERE p.slug = 'collier-chaine-maille-or';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
  'Collier chaîne or détail', false, 2
FROM products p WHERE p.slug = 'collier-chaine-maille-or';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
  'Collier pendentif cœur', true, 0
FROM products p WHERE p.slug = 'collier-pendentif-coeur';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  'Collier pendentif porté', false, 1
FROM products p WHERE p.slug = 'collier-pendentif-coeur';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  'Collier pendentif détail', false, 2
FROM products p WHERE p.slug = 'collier-pendentif-coeur';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  'Collier ras de cou perles', true, 0
FROM products p WHERE p.slug = 'collier-ras-de-cou-perles';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
  'Collier ras de cou porté', false, 1
FROM products p WHERE p.slug = 'collier-ras-de-cou-perles';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'Collier ras de cou détail', false, 2
FROM products p WHERE p.slug = 'collier-ras-de-cou-perles';

-- BRACELETS images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
  'Bracelet jonc or rose', true, 0
FROM products p WHERE p.slug = 'bracelet-jonc-or-rose';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  'Bracelet jonc porté', false, 1
FROM products p WHERE p.slug = 'bracelet-jonc-or-rose';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
  'Bracelet jonc détail', false, 2
FROM products p WHERE p.slug = 'bracelet-jonc-or-rose';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
  'Bracelet Tiffany acier', true, 0
FROM products p WHERE p.slug = 'bracelet-tiffany-acier';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
  'Bracelet Tiffany porté', false, 1
FROM products p WHERE p.slug = 'bracelet-tiffany-acier';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
  'Bracelet Tiffany détail', false, 2
FROM products p WHERE p.slug = 'bracelet-tiffany-acier';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  'Bracelet manchette gravé', true, 0
FROM products p WHERE p.slug = 'bracelet-manchette-grave';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'Bracelet manchette détail', false, 1
FROM products p WHERE p.slug = 'bracelet-manchette-grave';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  'Bracelet manchette porté', false, 2
FROM products p WHERE p.slug = 'bracelet-manchette-grave';

-- BOUCLES D'OREILLES images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
  'Créoles dorées face', true, 0
FROM products p WHERE p.slug = 'boucles-creoles-dorees';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  'Créoles dorées portées', false, 1
FROM products p WHERE p.slug = 'boucles-creoles-dorees';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  'Créoles dorées détail', false, 2
FROM products p WHERE p.slug = 'boucles-creoles-dorees';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
  'Pendantes cristal face', true, 0
FROM products p WHERE p.slug = 'boucles-pendantes-cristal';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
  'Pendantes cristal portées', false, 1
FROM products p WHERE p.slug = 'boucles-pendantes-cristal';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'Pendantes cristal détail', false, 2
FROM products p WHERE p.slug = 'boucles-pendantes-cristal';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
  'Puces étoile face', true, 0
FROM products p WHERE p.slug = 'boucles-puces-etoile';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
  'Puces étoile portées', false, 1
FROM products p WHERE p.slug = 'boucles-puces-etoile';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
  'Puces étoile détail', false, 2
FROM products p WHERE p.slug = 'boucles-puces-etoile';

-- PARURES images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  'Parure Missika complète', true, 0
FROM products p WHERE p.slug = 'parure-missika-4-pieces';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
  'Parure Missika collier', false, 1
FROM products p WHERE p.slug = 'parure-missika-4-pieces';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
  'Parure Missika bracelet', false, 2
FROM products p WHERE p.slug = 'parure-missika-4-pieces';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  'Parure Missika bague', false, 3
FROM products p WHERE p.slug = 'parure-missika-4-pieces';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  'Parure perle classique', true, 0
FROM products p WHERE p.slug = 'parure-perle-classique';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'Parure perle collier', false, 1
FROM products p WHERE p.slug = 'parure-perle-classique';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
  'Parure perle boucles', false, 2
FROM products p WHERE p.slug = 'parure-perle-classique';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
  'Parure papillon doré', true, 0
FROM products p WHERE p.slug = 'parure-papillon-dore';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
  'Parure papillon collier', false, 1
FROM products p WHERE p.slug = 'parure-papillon-dore';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
  'Parure papillon bracelet', false, 2
FROM products p WHERE p.slug = 'parure-papillon-dore';

-- GOURMETTES images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
  'Gourmette classique', true, 0
FROM products p WHERE p.slug = 'gourmette-classique-gravee';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  'Gourmette classique détail', false, 1
FROM products p WHERE p.slug = 'gourmette-classique-gravee';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
  'Gourmette classique portée', false, 2
FROM products p WHERE p.slug = 'gourmette-classique-gravee';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  'Gourmette cubaine face', true, 0
FROM products p WHERE p.slug = 'gourmette-maille-cubaine';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'Gourmette cubaine détail', false, 1
FROM products p WHERE p.slug = 'gourmette-maille-cubaine';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  'Gourmette cubaine portée', false, 2
FROM products p WHERE p.slug = 'gourmette-maille-cubaine';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
  'Gourmette fine argent', true, 0
FROM products p WHERE p.slug = 'gourmette-fine-argent';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
  'Gourmette fine détail', false, 1
FROM products p WHERE p.slug = 'gourmette-fine-argent';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
  'Gourmette fine portée', false, 2
FROM products p WHERE p.slug = 'gourmette-fine-argent';

-- MONTRES images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
  'Montre classique dorée', true, 0
FROM products p WHERE p.slug = 'montre-classique-doree';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop',
  'Montre dorée cadran', false, 1
FROM products p WHERE p.slug = 'montre-classique-doree';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=800&fit=crop',
  'Montre dorée portée', false, 2
FROM products p WHERE p.slug = 'montre-classique-doree';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
  'Montre minimaliste argent', true, 0
FROM products p WHERE p.slug = 'montre-minimaliste-argent';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
  'Montre argent cadran', false, 1
FROM products p WHERE p.slug = 'montre-minimaliste-argent';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=800&fit=crop',
  'Montre argent portée', false, 2
FROM products p WHERE p.slug = 'montre-minimaliste-argent';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=800&fit=crop',
  'Montre strass or rose', true, 0
FROM products p WHERE p.slug = 'montre-strass-or-rose';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop',
  'Montre strass cadran', false, 1
FROM products p WHERE p.slug = 'montre-strass-or-rose';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
  'Montre strass portée', false, 2
FROM products p WHERE p.slug = 'montre-strass-or-rose';

-- CHAÎNES DE CHEVILLE images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
  'Chaîne cheville double rang', true, 0
FROM products p WHERE p.slug = 'chaine-cheville-double-rang';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
  'Chaîne cheville double détail', false, 1
FROM products p WHERE p.slug = 'chaine-cheville-double-rang';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  'Chaîne cheville double portée', false, 2
FROM products p WHERE p.slug = 'chaine-cheville-double-rang';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
  'Chaîne cheville papillon', true, 0
FROM products p WHERE p.slug = 'chaine-cheville-papillon-or';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  'Chaîne cheville papillon détail', false, 1
FROM products p WHERE p.slug = 'chaine-cheville-papillon-or';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
  'Chaîne cheville papillon portée', false, 2
FROM products p WHERE p.slug = 'chaine-cheville-papillon-or';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'Chaîne cheville perle', true, 0
FROM products p WHERE p.slug = 'chaine-cheville-perle-fine';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  'Chaîne cheville perle détail', false, 1
FROM products p WHERE p.slug = 'chaine-cheville-perle-fine';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop',
  'Chaîne cheville perle portée', false, 2
FROM products p WHERE p.slug = 'chaine-cheville-perle-fine';

-- ACCESSOIRES images
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
  'Broche fleur cristal', true, 0
FROM products p WHERE p.slug = 'broche-fleur-cristal';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
  'Broche fleur détail', false, 1
FROM products p WHERE p.slug = 'broche-fleur-cristal';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop',
  'Broche fleur portée', false, 2
FROM products p WHERE p.slug = 'broche-fleur-cristal';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
  'Pince cheveux perle', true, 0
FROM products p WHERE p.slug = 'pince-cheveux-perle';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
  'Pince cheveux détail', false, 1
FROM products p WHERE p.slug = 'pince-cheveux-perle';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
  'Pince cheveux portée', false, 2
FROM products p WHERE p.slug = 'pince-cheveux-perle';

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
  'Porte-clés cœur', true, 0
FROM products p WHERE p.slug = 'porte-cles-coeur-acier';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&h=800&fit=crop',
  'Porte-clés cœur détail', false, 1
FROM products p WHERE p.slug = 'porte-cles-coeur-acier';
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
SELECT gen_random_uuid(), p.id,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
  'Porte-clés cœur emballé', false, 2
FROM products p WHERE p.slug = 'porte-cles-coeur-acier';
