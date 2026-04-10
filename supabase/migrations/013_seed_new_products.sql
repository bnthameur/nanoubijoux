-- ============================================
-- Seed sample products for new categories
-- ============================================

-- ======================== ACCESSOIRES ACIER INOXYDABLE (category 1) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Bague Acier Inoxydable Classique', 'خاتم فولاذ مقاوم للصدأ كلاسيكي', 'Classic Stainless Steel Ring', 'Bague élégante en acier inoxydable, résistante et durable.', 'خاتم أنيق من الفولاذ المقاوم للصدأ', 'Elegant stainless steel ring, resistant and durable.', 'bague-acier-classique', 1500, 2000, 1, 'Acier inoxydable', true, true, true, 40, 'ACC-001'),
(gen_random_uuid(), 'Collier Chaîne Acier', 'قلادة سلسلة فولاذية', 'Steel Chain Necklace', 'Collier chaîne fine en acier inoxydable doré.', 'قلادة سلسلة رفيعة من الفولاذ المقاوم للصدأ', 'Fine gold-plated stainless steel chain necklace.', 'collier-chaine-acier', 1800, NULL, 1, 'Acier inoxydable', true, true, false, 35, 'ACC-002'),
(gen_random_uuid(), 'Bracelet Acier Torsadé', 'سوار فولاذ ملتوي', 'Twisted Steel Bracelet', 'Bracelet torsadé en acier inoxydable avec finition polie.', 'سوار ملتوي من الفولاذ المقاوم للصدأ', 'Twisted stainless steel bracelet with polished finish.', 'bracelet-acier-torsade', 1200, 1600, 1, 'Acier inoxydable', false, true, true, 50, 'ACC-003'),
(gen_random_uuid(), 'Boucles d''Oreilles Acier Goutte', 'أقراط فولاذية على شكل قطرة', 'Steel Drop Earrings', 'Boucles d''oreilles pendantes en acier inoxydable.', 'أقراط متدلية من الفولاذ المقاوم للصدأ', 'Dangling stainless steel drop earrings.', 'boucles-acier-goutte', 900, NULL, 1, 'Acier inoxydable', false, false, false, 60, 'ACC-004');

-- ======================== MAQUILLAGE (category 2) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Palette Fard à Paupières 12 Couleurs', 'لوحة ظلال عيون 12 لون', '12-Color Eyeshadow Palette', 'Palette de fards à paupières avec 12 teintes mates et nacrées.', 'لوحة ظلال عيون بـ12 لونًا مات ولؤلؤي', '12-shade eyeshadow palette with matte and shimmer finishes.', 'palette-fard-12-couleurs', 2500, 3000, 2, NULL, true, true, true, 30, 'MAQ-001'),
(gen_random_uuid(), 'Rouge à Lèvres Mat Longue Tenue', 'أحمر شفاه مات طويل الأمد', 'Long-Lasting Matte Lipstick', 'Rouge à lèvres mat résistant, couleur intense et durable.', 'أحمر شفاه مات مقاوم بلون مكثف', 'Long-wearing matte lipstick with intense color payoff.', 'rouge-levres-mat', 800, NULL, 2, NULL, true, false, false, 80, 'MAQ-002'),
(gen_random_uuid(), 'Mascara Volume Extrême', 'ماسكارا حجم مكثف', 'Extreme Volume Mascara', 'Mascara volumisant pour des cils spectaculaires.', 'ماسكارا مكثفة لرموش مذهلة', 'Volumizing mascara for spectacular lashes.', 'mascara-volume-extreme', 1200, 1500, 2, NULL, false, true, true, 45, 'MAQ-003');

-- ======================== COSMÉTIQUE (category 3) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Crème Hydratante Visage', 'كريم مرطب للوجه', 'Moisturizing Face Cream', 'Crème hydratante légère pour tous types de peau.', 'كريم مرطب خفيف لجميع أنواع البشرة', 'Lightweight moisturizing cream for all skin types.', 'creme-hydratante-visage', 1800, NULL, 3, NULL, true, true, false, 40, 'COS-001'),
(gen_random_uuid(), 'Sérum Vitamine C', 'سيروم فيتامين سي', 'Vitamin C Serum', 'Sérum éclat à la vitamine C pour une peau lumineuse.', 'سيروم فيتامين سي لبشرة مشرقة', 'Brightening vitamin C serum for radiant skin.', 'serum-vitamine-c', 2200, 2800, 3, NULL, true, false, true, 25, 'COS-002'),
(gen_random_uuid(), 'Eau Micellaire Nettoyante', 'ماء ميسيلار منظف', 'Cleansing Micellar Water', 'Eau micellaire douce pour démaquillage et nettoyage.', 'ماء ميسيلار لطيف لإزالة المكياج والتنظيف', 'Gentle micellar water for makeup removal and cleansing.', 'eau-micellaire-nettoyante', 900, NULL, 3, NULL, false, true, false, 55, 'COS-003');

-- ======================== PARFUM (category 4) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Eau de Parfum Floral Intense', 'عطر زهور مكثف', 'Intense Floral Eau de Parfum', 'Parfum floral intense aux notes de rose et jasmin, longue tenue.', 'عطر زهري مكثف بنفحات الورد والياسمين', 'Intense floral perfume with rose and jasmine notes, long-lasting.', 'edp-floral-intense', 4500, 5500, 4, NULL, true, true, true, 20, 'PAR-001'),
(gen_random_uuid(), 'Brume Corporelle Vanille', 'رذاذ الجسم بالفانيليا', 'Vanilla Body Mist', 'Brume corporelle légère à la vanille, fraîche et douce.', 'رذاذ جسم خفيف بالفانيليا', 'Light vanilla body mist, fresh and sweet.', 'brume-vanille', 1500, NULL, 4, NULL, false, true, false, 40, 'PAR-002'),
(gen_random_uuid(), 'Parfum Musc Blanc', 'عطر المسك الأبيض', 'White Musk Perfume', 'Parfum au musc blanc élégant et subtil.', 'عطر مسك أبيض أنيق وناعم', 'Elegant and subtle white musk perfume.', 'parfum-musc-blanc', 3500, 4200, 4, NULL, true, false, true, 15, 'PAR-003');

-- ======================== SACS (category 5) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Sac à Main Cuir Élégant', 'حقيبة يد جلد أنيقة', 'Elegant Leather Handbag', 'Sac à main en simili cuir de haute qualité, spacieux et élégant.', 'حقيبة يد من الجلد الصناعي عالي الجودة', 'High-quality faux leather handbag, spacious and elegant.', 'sac-main-cuir-elegant', 5500, 7000, 5, 'Simili cuir', true, true, true, 15, 'SAC-001'),
(gen_random_uuid(), 'Sac Bandoulière Casual', 'حقيبة كتف كاجوال', 'Casual Crossbody Bag', 'Sac bandoulière pratique pour un look décontracté.', 'حقيبة كتف عملية لإطلالة عفوية', 'Practical crossbody bag for a casual look.', 'sac-bandouliere-casual', 3200, NULL, 5, 'Tissu', false, true, false, 25, 'SAC-002'),
(gen_random_uuid(), 'Sac à Dos Femme Chic', 'حقيبة ظهر نسائية شيك', 'Chic Women Backpack', 'Sac à dos féminin et élégant, idéal pour le quotidien.', 'حقيبة ظهر نسائية أنيقة للاستخدام اليومي', 'Feminine and elegant backpack, ideal for everyday use.', 'sac-dos-femme-chic', 4000, 4800, 5, 'Simili cuir', true, false, true, 20, 'SAC-003');

-- ======================== POCHETTE (category 6) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Pochette Soirée Dorée', 'حقيبة سهرة ذهبية', 'Gold Evening Clutch', 'Pochette de soirée dorée avec chaîne amovible.', 'حقيبة سهرة ذهبية مع سلسلة قابلة للإزالة', 'Gold evening clutch with removable chain strap.', 'pochette-soiree-doree', 2800, 3500, 6, NULL, true, true, true, 20, 'POC-001'),
(gen_random_uuid(), 'Pochette Matelassée Noire', 'حقيبة يد صغيرة مبطنة سوداء', 'Black Quilted Clutch', 'Pochette matelassée noire classique et intemporelle.', 'حقيبة يد صغيرة مبطنة سوداء كلاسيكية', 'Classic timeless black quilted clutch bag.', 'pochette-matelassee-noire', 2200, NULL, 6, 'Simili cuir', true, false, false, 30, 'POC-002'),
(gen_random_uuid(), 'Pochette Transparente Été', 'حقيبة يد شفافة صيفية', 'Summer Transparent Clutch', 'Pochette transparente tendance pour l''été.', 'حقيبة يد شفافة عصرية للصيف', 'Trendy transparent clutch bag for summer.', 'pochette-transparente-ete', 1500, 1800, 6, NULL, false, true, true, 35, 'POC-003');

-- ======================== PYJAMAS (category 7) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Pyjama Satin Femme', 'بيجامة ساتان نسائية', 'Women Satin Pajama Set', 'Pyjama en satin doux et confortable, 2 pièces.', 'بيجامة من الساتان الناعم والمريح، قطعتين', 'Soft and comfortable 2-piece satin pajama set.', 'pyjama-satin-femme', 3500, 4200, 7, 'Satin', true, true, true, 25, 'PYJ-001'),
(gen_random_uuid(), 'Pyjama Coton Fleuri', 'بيجامة قطن بالزهور', 'Floral Cotton Pajamas', 'Pyjama en coton imprimé floral, léger et respirant.', 'بيجامة قطنية بطبعة زهور خفيفة ومريحة', 'Floral print cotton pajamas, light and breathable.', 'pyjama-coton-fleuri', 2800, NULL, 7, 'Coton', false, true, false, 30, 'PYJ-002'),
(gen_random_uuid(), 'Nuisette Dentelle Élégante', 'قميص نوم دانتيل أنيق', 'Elegant Lace Nightgown', 'Nuisette en dentelle avec bretelles fines, élégante et féminine.', 'قميص نوم من الدانتيل بحمالات رفيعة', 'Lace nightgown with thin straps, elegant and feminine.', 'nuisette-dentelle-elegante', 2500, 3000, 7, 'Dentelle', true, false, true, 20, 'PYJ-003');

-- ======================== ACCESSOIRES FEMME (category 8) ========================

INSERT INTO products (id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, slug, price, compare_at_price, category_id, material, is_featured, is_new, is_on_sale, stock_quantity, sku) VALUES
(gen_random_uuid(), 'Lunettes de Soleil Oversized', 'نظارات شمسية كبيرة', 'Oversized Sunglasses', 'Lunettes de soleil oversize avec protection UV400.', 'نظارات شمسية كبيرة مع حماية UV400', 'Oversized sunglasses with UV400 protection.', 'lunettes-soleil-oversized', 2000, 2500, 8, NULL, true, true, true, 40, 'AFE-001'),
(gen_random_uuid(), 'Écharpe Soie Imprimée', 'وشاح حرير مطبوع', 'Printed Silk Scarf', 'Écharpe en soie légère avec motifs floraux.', 'وشاح من الحرير الخفيف بنقوش زهرية', 'Lightweight silk scarf with floral patterns.', 'echarpe-soie-imprimee', 1800, NULL, 8, 'Soie', true, false, false, 35, 'AFE-002'),
(gen_random_uuid(), 'Ceinture Large Femme', 'حزام عريض نسائي', 'Wide Women Belt', 'Ceinture large en simili cuir avec boucle dorée.', 'حزام عريض من الجلد الصناعي بإبزيم ذهبي', 'Wide faux leather belt with gold buckle.', 'ceinture-large-femme', 1200, 1500, 8, 'Simili cuir', false, true, true, 50, 'AFE-003'),
(gen_random_uuid(), 'Chapeau de Plage Paille', 'قبعة شاطئ من القش', 'Straw Beach Hat', 'Chapeau de plage en paille naturelle, parfait pour l''été.', 'قبعة شاطئ من القش الطبيعي مثالية للصيف', 'Natural straw beach hat, perfect for summer.', 'chapeau-plage-paille', 1500, NULL, 8, 'Paille', false, true, false, 30, 'AFE-004');
