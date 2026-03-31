import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzqvvowhudeqcdjjajcn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const categoryImages = {
  1: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop', // Bagues
  2: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&h=400&fit=crop', // Colliers
  3: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop', // Bracelets
  4: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop', // Boucles d'oreilles
  5: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop', // Parures
  6: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop', // Gourmettes
  7: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', // Montres
  8: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop', // Chaînes de cheville
  9: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=400&h=400&fit=crop', // Accessoires
};

async function seed() {
  for (const [id, url] of Object.entries(categoryImages)) {
    const { error } = await supabase.from('categories').update({ image_url: url }).eq('id', Number(id));
    if (error) console.error(`Category ${id} error:`, error);
    else console.log(`Category ${id} updated`);
  }
  console.log('Done!');
}
seed();
