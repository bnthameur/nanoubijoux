/**
 * Seed admin user via Supabase Auth Admin API.
 *
 * Usage: node scripts/seed-admin.mjs
 *
 * Creates the initial admin account using Supabase Auth.
 * Safe to run multiple times — will skip if user already exists.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EMAIL_DOMAIN = 'admin.nanobijoux.local';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'NanoBijoux2026!';
const ADMIN_EMAIL = `${ADMIN_USERNAME}@${EMAIL_DOMAIN}`;

async function main() {
  console.log(`Seeding admin user: ${ADMIN_USERNAME} (${ADMIN_EMAIL})`);

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL);

  if (existing) {
    console.log('Admin user already exists, updating metadata...');
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      app_metadata: {
        username: ADMIN_USERNAME,
        display_name: 'Administrateur',
        admin_role: 'admin',
        permissions: [
          'orders:view', 'orders:edit', 'orders:delete', 'orders:ship',
          'products:manage', 'categories:manage', 'pixels:manage',
          'delivery:manage', 'settings:manage', 'users:manage', 'reports:view',
        ],
      },
    });
    if (error) {
      console.error('Failed to update admin:', error.message);
      process.exit(1);
    }
    console.log('Admin metadata updated successfully.');
    return;
  }

  // Create new admin user
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    app_metadata: {
      username: ADMIN_USERNAME,
      display_name: 'Administrateur',
      admin_role: 'admin',
      permissions: [
        'orders:view', 'orders:edit', 'orders:delete', 'orders:ship',
        'products:manage', 'categories:manage', 'pixels:manage',
        'delivery:manage', 'settings:manage', 'users:manage', 'reports:view',
      ],
    },
  });

  if (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }

  console.log(`Admin user created successfully!`);
  console.log(`  ID: ${data.user.id}`);
  console.log(`  Email: ${data.user.email}`);
  console.log(`  Username: ${ADMIN_USERNAME}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`\nChange the password from the admin panel after first login.`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
