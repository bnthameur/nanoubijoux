-- ============================================================
-- Migration 007: Fix user_profiles infinite recursion RLS
-- ============================================================
-- The "Admins can read all profiles" policy causes infinite recursion
-- because it queries user_profiles to check if user is admin.
-- We already have "Allow read all user_profiles" which is simpler.

DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;

-- Ensure the open read policy exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_profiles'
    AND policyname = 'Allow read all user_profiles'
  ) THEN
    CREATE POLICY "Allow read all user_profiles" ON user_profiles FOR SELECT USING (true);
  END IF;
END $$;

-- ============================================================
-- Make AR/EN columns nullable for French-only admin
-- ============================================================

-- Products: name_ar and name_en now optional
ALTER TABLE products ALTER COLUMN name_ar DROP NOT NULL;
ALTER TABLE products ALTER COLUMN name_ar SET DEFAULT '';
ALTER TABLE products ALTER COLUMN name_en DROP NOT NULL;
ALTER TABLE products ALTER COLUMN name_en SET DEFAULT '';
ALTER TABLE products ALTER COLUMN sku DROP NOT NULL;
ALTER TABLE products ALTER COLUMN sku SET DEFAULT '';

-- Categories: name_ar and name_en now optional
ALTER TABLE categories ALTER COLUMN name_ar DROP NOT NULL;
ALTER TABLE categories ALTER COLUMN name_ar SET DEFAULT '';
ALTER TABLE categories ALTER COLUMN name_en DROP NOT NULL;
ALTER TABLE categories ALTER COLUMN name_en SET DEFAULT '';

-- Blog posts: title_ar and title_en now optional
ALTER TABLE blog_posts ALTER COLUMN title_ar DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN title_ar SET DEFAULT '';
ALTER TABLE blog_posts ALTER COLUMN title_en DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN title_en SET DEFAULT '';
