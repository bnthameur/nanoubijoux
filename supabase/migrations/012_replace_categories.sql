-- ============================================
-- Replace old jewelry categories with new ones
-- ============================================

-- 1) Remove all mock products and related data
DELETE FROM product_images;
DELETE FROM product_variants;
DELETE FROM products;

-- 2) Remove old categories
DELETE FROM categories;

-- 3) Insert new categories
INSERT INTO categories (id, name_fr, name_ar, name_en, slug, sort_order) VALUES
(1,  'Accessoires Acier inoxydable', 'إكسسوارات الفولاذ المقاوم للصدأ', 'Stainless Steel Accessories', 'accessoires-acier-inoxydable', 1),
(2,  'Maquillage',                   'مكياج',                            'Makeup',                      'maquillage',                   2),
(3,  'Cosmétique',                   'مستحضرات التجميل',                 'Cosmetics',                   'cosmetique',                   3),
(4,  'Parfum',                       'عطور',                             'Perfume',                     'parfum',                       4),
(5,  'Sacs',                         'حقائب',                            'Bags',                        'sacs',                         5),
(6,  'Pochette',                     'حقيبة يد صغيرة',                   'Clutch Bag',                  'pochette',                     6),
(7,  'Pyjamas',                      'بيجامات',                          'Pajamas',                     'pyjamas',                      7),
(8,  'Accessoires femme',            'إكسسوارات نسائية',                 'Women Accessories',           'accessoires-femme',            8);

-- 4) Reset sequence
SELECT setval('categories_id_seq', 9, false);
