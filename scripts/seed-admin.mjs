/**
 * Seed initial admin account into admin_users table.
 * Run once to bootstrap. Uses Web Crypto API (Node 20+).
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzqvvowhudeqcdjjajcn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(plain) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = bufToHex(saltBytes);
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(plain), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  const hash = bufToHex(derived);
  return `${salt}:${hash}`;
}

async function seed() {
  const username = process.env.ADMIN_USER || 'admin';
  const password = process.env.ADMIN_PASS || 'NanoBijoux2026!';

  // Check if admin already exists
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('username', username)
    .single();

  if (existing) {
    console.log(`Admin user "${username}" already exists (id: ${existing.id}). Updating password...`);
    const passwordHash = await hashPassword(password);
    const { error } = await supabase
      .from('admin_users')
      .update({ password_hash: passwordHash, active: true })
      .eq('id', existing.id);
    if (error) { console.error('Update error:', error); return; }
    console.log('Password updated successfully!');
    return;
  }

  // Create new admin
  const passwordHash = await hashPassword(password);
  const { data, error } = await supabase.from('admin_users').insert({
    username,
    password_hash: passwordHash,
    display_name: 'Administrateur',
    role: 'admin',
    permissions: [
      'orders:view', 'orders:edit', 'orders:delete', 'orders:ship',
      'products:manage', 'categories:manage', 'pixels:manage',
      'delivery:manage', 'settings:manage', 'users:manage', 'reports:view',
    ],
    active: true,
  }).select('id, username').single();

  if (error) { console.error('Create error:', error); return; }
  console.log(`Admin created: ${data.username} (id: ${data.id})`);
}

seed().catch(console.error);
