/**
 * migrate-auth.mjs — Migrate admin_users to Supabase Auth.
 *
 * Prerequisites: Run this SQL in the Supabase dashboard SQL editor first:
 *   ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS auth_id uuid UNIQUE;
 *
 * Then run: SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-auth.mjs
 *
 * Or: node --env-file=.env.local scripts/migrate-auth.mjs
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzqvvowhudeqcdjjajcn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // ── Step 1: Verify auth_id column exists ───────────────────────────────────
  console.log('Step 1: Verifying auth_id column exists...');
  const { data: testData, error: colErr } = await supabase
    .from('admin_users')
    .select('id, auth_id')
    .limit(1);

  if (colErr && colErr.message?.includes('auth_id')) {
    console.error('\nERROR: auth_id column does not exist in admin_users table.');
    console.error('Please run this SQL in the Supabase dashboard SQL editor:');
    console.error('\n  ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS auth_id uuid UNIQUE;\n');
    console.error('Then re-run this script.');
    process.exit(1);
  }
  console.log('  auth_id column is present.');

  // ── Step 2: Check if auth user already exists ──────────────────────────────
  console.log('Step 2: Checking if Supabase Auth user already exists...');
  const email = 'admin@nanobijoux.dz';
  const password = 'NanoBijoux2026!';

  const { data: { users: existingUsers }, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('Failed to list auth users:', listErr.message);
    process.exit(1);
  }

  let authUserId;
  const existing = existingUsers?.find(u => u.email === email);
  if (existing) {
    console.log(`  Auth user already exists: ${existing.id}`);
    authUserId = existing.id;
  } else {
    // ── Step 3: Create Supabase Auth user ──────────────────────────────────
    console.log('Step 3: Creating Supabase Auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Failed to create auth user:', authError.message);
      process.exit(1);
    }

    authUserId = authData.user.id;
    console.log(`  Created auth user: ${authUserId}`);
  }

  // ── Step 4: Update admin_users row with auth_id ────────────────────────────
  console.log('Step 4: Linking admin_users row (username=admin) to auth user...');
  const { data: adminRow, error: fetchErr } = await supabase
    .from('admin_users')
    .select('id, username, auth_id')
    .eq('username', 'admin')
    .single();

  if (fetchErr || !adminRow) {
    console.error('Could not find admin user in admin_users table:', fetchErr?.message ?? 'not found');
    console.log('Make sure to run scripts/seed-admin.mjs first to create the initial admin row.');
    process.exit(1);
  }

  if (adminRow.auth_id) {
    console.log(`  admin_users row already has auth_id: ${adminRow.auth_id}`);
    if (adminRow.auth_id !== authUserId) {
      console.warn(`  Warning: existing auth_id ${adminRow.auth_id} differs from new auth user ${authUserId}. Skipping update.`);
    }
  } else {
    const { error: updateErr } = await supabase
      .from('admin_users')
      .update({ auth_id: authUserId })
      .eq('id', adminRow.id);

    if (updateErr) {
      console.error('Failed to update admin_users:', updateErr.message);
      process.exit(1);
    }
    console.log(`  Linked admin_users.id=${adminRow.id} -> auth_id=${authUserId}`);
  }

  console.log('\nMigration complete!');
  console.log(`  Login email: ${email}`);
  console.log(`  Password: ${password}`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
