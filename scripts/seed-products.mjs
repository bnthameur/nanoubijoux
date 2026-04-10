import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzqvvowhudeqcdjjajcn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  // Category 1: Accessoires Acier inoxydable
  {name_fr:'Bague Acier Inoxydable Classique',name_ar:'خاتم فولاذ مقاوم للصدأ كلاسيكي',name_en:'Classic Stainless Steel Ring',description_fr:'Bague en acier inoxydable, résistante et durable.',description_ar:'خاتم أنيق من الفولاذ المقاوم للصدأ',description_en:'Elegant stainless steel ring.',slug:'bague-acier-classique',price:1500,compare_at_price:2000,category_id:1,material:'Acier inoxydable',is_featured:true,is_new:true,is_on_sale:true,stock_quantity:40,sku:'ACC-001'},
  {name_fr:'Collier Chaîne Acier',name_ar:'قلادة سلسلة فولاذية',name_en:'Steel Chain Necklace',description_fr:'Collier chaîne fine en acier inoxydable doré.',description_ar:'قلادة سلسلة رفيعة من الفولاذ',description_en:'Fine stainless steel chain necklace.',slug:'collier-chaine-acier',price:1800,compare_at_price:null,category_id:1,material:'Acier inoxydable',is_featured:true,is_new:true,is_on_sale:false,stock_quantity:35,sku:'ACC-002'},
  {name_fr:'Bracelet Acier Torsadé',name_ar:'سوار فولاذ ملتوي',name_en:'Twisted Steel Bracelet',description_fr:'Bracelet torsadé en acier inoxydable avec finition polie.',description_ar:'سوار ملتوي من الفولاذ المقاوم للصدأ',description_en:'Twisted stainless steel bracelet.',slug:'bracelet-acier-torsade',price:1200,compare_at_price:1600,category_id:1,material:'Acier inoxydable',is_featured:false,is_new:true,is_on_sale:true,stock_quantity:50,sku:'ACC-003'},
  {name_fr:"Boucles d'Oreilles Acier Goutte",name_ar:'أقراط فولاذية على شكل قطرة',name_en:'Steel Drop Earrings',description_fr:"Boucles d'oreilles pendantes en acier inoxydable.",description_ar:'أقراط متدلية من الفولاذ المقاوم للصدأ',description_en:'Dangling stainless steel drop earrings.',slug:'boucles-acier-goutte',price:900,compare_at_price:null,category_id:1,material:'Acier inoxydable',is_featured:false,is_new:false,is_on_sale:false,stock_quantity:60,sku:'ACC-004'},

  // Category 2: Maquillage
  {name_fr:'Palette Fard à Paupières 12 Couleurs',name_ar:'لوحة ظلال عيون 12 لون',name_en:'12-Color Eyeshadow Palette',description_fr:'Palette de fards à paupières avec 12 teintes mates et nacrées.',description_ar:'لوحة ظلال عيون بـ12 لونًا',description_en:'12-shade eyeshadow palette.',slug:'palette-fard-12-couleurs',price:2500,compare_at_price:3000,category_id:2,material:null,is_featured:true,is_new:true,is_on_sale:true,stock_quantity:30,sku:'MAQ-001'},
  {name_fr:'Rouge à Lèvres Mat Longue Tenue',name_ar:'أحمر شفاه مات طويل الأمد',name_en:'Long-Lasting Matte Lipstick',description_fr:'Rouge à lèvres mat résistant, couleur intense et durable.',description_ar:'أحمر شفاه مات مقاوم بلون مكثف',description_en:'Long-wearing matte lipstick.',slug:'rouge-levres-mat',price:800,compare_at_price:null,category_id:2,material:null,is_featured:true,is_new:false,is_on_sale:false,stock_quantity:80,sku:'MAQ-002'},
  {name_fr:'Mascara Volume Extrême',name_ar:'ماسكارا حجم مكثف',name_en:'Extreme Volume Mascara',description_fr:'Mascara volumisant pour des cils spectaculaires.',description_ar:'ماسكارا مكثفة لرموش مذهلة',description_en:'Volumizing mascara for spectacular lashes.',slug:'mascara-volume-extreme',price:1200,compare_at_price:1500,category_id:2,material:null,is_featured:false,is_new:true,is_on_sale:true,stock_quantity:45,sku:'MAQ-003'},

  // Category 3: Cosmétique
  {name_fr:'Crème Hydratante Visage',name_ar:'كريم مرطب للوجه',name_en:'Moisturizing Face Cream',description_fr:'Crème hydratante légère pour tous types de peau.',description_ar:'كريم مرطب لجميع أنواع البشرة',description_en:'Moisturizing cream for all skin types.',slug:'creme-hydratante-visage',price:1800,compare_at_price:null,category_id:3,material:null,is_featured:true,is_new:true,is_on_sale:false,stock_quantity:40,sku:'COS-001'},
  {name_fr:'Sérum Vitamine C',name_ar:'سيروم فيتامين سي',name_en:'Vitamin C Serum',description_fr:'Sérum éclat à la vitamine C pour une peau lumineuse.',description_ar:'سيروم فيتامين سي لبشرة مشرقة',description_en:'Brightening vitamin C serum.',slug:'serum-vitamine-c',price:2200,compare_at_price:2800,category_id:3,material:null,is_featured:true,is_new:false,is_on_sale:true,stock_quantity:25,sku:'COS-002'},
  {name_fr:'Eau Micellaire Nettoyante',name_ar:'ماء ميسيلار منظف',name_en:'Cleansing Micellar Water',description_fr:'Eau micellaire douce pour démaquillage et nettoyage.',description_ar:'ماء ميسيلار لطيف لإزالة المكياج والتنظيف',description_en:'Gentle micellar water for cleansing.',slug:'eau-micellaire-nettoyante',price:900,compare_at_price:null,category_id:3,material:null,is_featured:false,is_new:true,is_on_sale:false,stock_quantity:55,sku:'COS-003'},

  // Category 4: Parfum
  {name_fr:'Eau de Parfum Floral Intense',name_ar:'عطر زهور مكثف',name_en:'Intense Floral Eau de Parfum',description_fr:'Parfum floral intense aux notes de rose et jasmin, longue tenue.',description_ar:'عطر زهري مكثف بنفحات الورد والياسمين',description_en:'Intense floral perfume with rose and jasmine.',slug:'edp-floral-intense',price:4500,compare_at_price:5500,category_id:4,material:null,is_featured:true,is_new:true,is_on_sale:true,stock_quantity:20,sku:'PAR-001'},
  {name_fr:'Brume Corporelle Vanille',name_ar:'رذاذ الجسم بالفانيليا',name_en:'Vanilla Body Mist',description_fr:'Brume corporelle légère à la vanille, fraîche et douce.',description_ar:'رذاذ جسم خفيف بالفانيليا',description_en:'Light vanilla body mist.',slug:'brume-vanille',price:1500,compare_at_price:null,category_id:4,material:null,is_featured:false,is_new:true,is_on_sale:false,stock_quantity:40,sku:'PAR-002'},
  {name_fr:'Parfum Musc Blanc',name_ar:'عطر المسك الأبيض',name_en:'White Musk Perfume',description_fr:'Parfum au musc blanc élégant et subtil.',description_ar:'عطر مسك أبيض أنيق وناعم',description_en:'Elegant white musk perfume.',slug:'parfum-musc-blanc',price:3500,compare_at_price:4200,category_id:4,material:null,is_featured:true,is_new:false,is_on_sale:true,stock_quantity:15,sku:'PAR-003'},

  // Category 5: Sacs
  {name_fr:'Sac à Main Cuir Élégant',name_ar:'حقيبة يد جلد أنيقة',name_en:'Elegant Leather Handbag',description_fr:'Sac à main en simili cuir de haute qualité, spacieux et élégant.',description_ar:'حقيبة يد من الجلد الصناعي عالي الجودة',description_en:'High-quality faux leather handbag.',slug:'sac-main-cuir-elegant',price:5500,compare_at_price:7000,category_id:5,material:'Simili cuir',is_featured:true,is_new:true,is_on_sale:true,stock_quantity:15,sku:'SAC-001'},
  {name_fr:'Sac Bandoulière Casual',name_ar:'حقيبة كتف كاجوال',name_en:'Casual Crossbody Bag',description_fr:'Sac bandoulière pratique pour un look décontracté.',description_ar:'حقيبة كتف عملية لإطلالة عفوية',description_en:'Practical crossbody bag.',slug:'sac-bandouliere-casual',price:3200,compare_at_price:null,category_id:5,material:'Tissu',is_featured:false,is_new:true,is_on_sale:false,stock_quantity:25,sku:'SAC-002'},
  {name_fr:'Sac à Dos Femme Chic',name_ar:'حقيبة ظهر نسائية شيك',name_en:'Chic Women Backpack',description_fr:'Sac à dos féminin et élégant, idéal pour le quotidien.',description_ar:'حقيبة ظهر نسائية أنيقة للاستخدام اليومي',description_en:'Feminine elegant backpack.',slug:'sac-dos-femme-chic',price:4000,compare_at_price:4800,category_id:5,material:'Simili cuir',is_featured:true,is_new:false,is_on_sale:true,stock_quantity:20,sku:'SAC-003'},

  // Category 6: Pochette
  {name_fr:'Pochette Soirée Dorée',name_ar:'حقيبة سهرة ذهبية',name_en:'Gold Evening Clutch',description_fr:'Pochette de soirée dorée avec chaîne amovible.',description_ar:'حقيبة سهرة ذهبية مع سلسلة قابلة للإزالة',description_en:'Gold evening clutch with removable chain.',slug:'pochette-soiree-doree',price:2800,compare_at_price:3500,category_id:6,material:null,is_featured:true,is_new:true,is_on_sale:true,stock_quantity:20,sku:'POC-001'},
  {name_fr:'Pochette Matelassée Noire',name_ar:'حقيبة يد صغيرة مبطنة سوداء',name_en:'Black Quilted Clutch',description_fr:'Pochette matelassée noire classique et intemporelle.',description_ar:'حقيبة يد صغيرة مبطنة سوداء كلاسيكية',description_en:'Classic black quilted clutch.',slug:'pochette-matelassee-noire',price:2200,compare_at_price:null,category_id:6,material:'Simili cuir',is_featured:true,is_new:false,is_on_sale:false,stock_quantity:30,sku:'POC-002'},
  {name_fr:'Pochette Transparente Été',name_ar:'حقيبة يد شفافة صيفية',name_en:'Summer Transparent Clutch',description_fr:"Pochette transparente tendance pour l'été.",description_ar:'حقيبة يد شفافة عصرية للصيف',description_en:'Trendy transparent clutch for summer.',slug:'pochette-transparente-ete',price:1500,compare_at_price:1800,category_id:6,material:null,is_featured:false,is_new:true,is_on_sale:true,stock_quantity:35,sku:'POC-003'},

  // Category 7: Pyjamas
  {name_fr:'Pyjama Satin Femme',name_ar:'بيجامة ساتان نسائية',name_en:'Women Satin Pajama Set',description_fr:'Pyjama en satin doux et confortable, 2 pièces.',description_ar:'بيجامة من الساتان الناعم والمريح، قطعتين',description_en:'Soft 2-piece satin pajama set.',slug:'pyjama-satin-femme',price:3500,compare_at_price:4200,category_id:7,material:'Satin',is_featured:true,is_new:true,is_on_sale:true,stock_quantity:25,sku:'PYJ-001'},
  {name_fr:'Pyjama Coton Fleuri',name_ar:'بيجامة قطن بالزهور',name_en:'Floral Cotton Pajamas',description_fr:'Pyjama en coton imprimé floral, léger et respirant.',description_ar:'بيجامة قطنية بطبعة زهور خفيفة ومريحة',description_en:'Floral print cotton pajamas.',slug:'pyjama-coton-fleuri',price:2800,compare_at_price:null,category_id:7,material:'Coton',is_featured:false,is_new:true,is_on_sale:false,stock_quantity:30,sku:'PYJ-002'},
  {name_fr:'Nuisette Dentelle Élégante',name_ar:'قميص نوم دانتيل أنيق',name_en:'Elegant Lace Nightgown',description_fr:'Nuisette en dentelle avec bretelles fines, élégante et féminine.',description_ar:'قميص نوم من الدانتيل بحمالات رفيعة',description_en:'Lace nightgown with thin straps.',slug:'nuisette-dentelle-elegante',price:2500,compare_at_price:3000,category_id:7,material:'Dentelle',is_featured:true,is_new:false,is_on_sale:true,stock_quantity:20,sku:'PYJ-003'},

  // Category 8: Accessoires femme
  {name_fr:'Lunettes de Soleil Oversized',name_ar:'نظارات شمسية كبيرة',name_en:'Oversized Sunglasses',description_fr:'Lunettes de soleil oversize avec protection UV400.',description_ar:'نظارات شمسية كبيرة مع حماية UV400',description_en:'Oversized sunglasses with UV400 protection.',slug:'lunettes-soleil-oversized',price:2000,compare_at_price:2500,category_id:8,material:null,is_featured:true,is_new:true,is_on_sale:true,stock_quantity:40,sku:'AFE-001'},
  {name_fr:'Écharpe Soie Imprimée',name_ar:'وشاح حرير مطبوع',name_en:'Printed Silk Scarf',description_fr:'Écharpe en soie légère avec motifs floraux.',description_ar:'وشاح من الحرير الخفيف بنقوش زهرية',description_en:'Lightweight silk scarf with floral patterns.',slug:'echarpe-soie-imprimee',price:1800,compare_at_price:null,category_id:8,material:'Soie',is_featured:true,is_new:false,is_on_sale:false,stock_quantity:35,sku:'AFE-002'},
  {name_fr:'Ceinture Large Femme',name_ar:'حزام عريض نسائي',name_en:'Wide Women Belt',description_fr:'Ceinture large en simili cuir avec boucle dorée.',description_ar:'حزام عريض من الجلد الصناعي بإبزيم ذهبي',description_en:'Wide faux leather belt with gold buckle.',slug:'ceinture-large-femme',price:1200,compare_at_price:1500,category_id:8,material:'Simili cuir',is_featured:false,is_new:true,is_on_sale:true,stock_quantity:50,sku:'AFE-003'},
  {name_fr:'Chapeau de Plage Paille',name_ar:'قبعة شاطئ من القش',name_en:'Straw Beach Hat',description_fr:"Chapeau de plage en paille naturelle, parfait pour l'été.",description_ar:'قبعة شاطئ من القش الطبيعي مثالية للصيف',description_en:'Natural straw beach hat.',slug:'chapeau-plage-paille',price:1500,compare_at_price:null,category_id:8,material:'Paille',is_featured:false,is_new:true,is_on_sale:false,stock_quantity:30,sku:'AFE-004'},
];

async function seed() {
  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select('slug');

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log(`Inserted ${data.length} products successfully`);
}

seed();
