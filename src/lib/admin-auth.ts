/**
 * admin-auth.ts — Admin authentication via Supabase Auth.
 *
 * Uses Supabase Auth for password management and JWT tokens.
 * Role and permissions are stored in auth.users.app_metadata.
 * No custom PBKDF2 or JWT signing — Supabase handles everything.
 */

import { createAdminClient } from './supabase/admin-client';

// ─── Permission Definitions ───────────────────────────────────────────────────

export type Permission =
    | 'orders:view'
    | 'orders:edit'
    | 'orders:delete'
    | 'orders:ship'
    | 'products:manage'
    | 'categories:manage'
    | 'pixels:manage'
    | 'delivery:manage'
    | 'settings:manage'
    | 'users:manage'
    | 'reports:view';

export type UserRole = 'admin' | 'agent' | 'custom';

export const ALL_PERMISSIONS: Permission[] = [
    'orders:view',
    'orders:edit',
    'orders:delete',
    'orders:ship',
    'products:manage',
    'categories:manage',
    'pixels:manage',
    'delivery:manage',
    'settings:manage',
    'users:manage',
    'reports:view',
];

export const AGENT_DEFAULT_PERMISSIONS: Permission[] = [
    'orders:view',
    'orders:edit',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppUser {
    id: string;
    username: string;
    displayName: string;
    role: UserRole;
    permissions: Permission[];
    active: boolean;
    createdAt: string;
}

export interface AdminTokenPayload {
    sub: string;          // Supabase user ID
    email: string;
    role: string;         // Supabase role (always 'authenticated')
    app_metadata: {
        admin_role?: UserRole;
        permissions?: Permission[];
        display_name?: string;
        username?: string;
    };
    exp: number;
}

// Legacy compatibility alias
export interface JWTPayload {
    userId: string;
    username: string;
    displayName: string;
    role: UserRole;
    permissions: Permission[];
    exp: number;
    iat: number;
}

export interface CreateUserData {
    username: string;
    password: string;
    displayName?: string;
    role?: UserRole;
    permissions?: Permission[];
    createdBy?: string;
}

export interface UpdateUserData {
    displayName?: string;
    role?: UserRole;
    permissions?: Permission[];
    active?: boolean;
    password?: string;
}

// ─── Email convention ────────────────────────────────────────────────────────

const EMAIL_DOMAIN = 'admin.nanobijoux.local';

export function usernameToEmail(username: string): string {
    return `${username.toLowerCase().replace(/[^a-z0-9._-]/g, '')}@${EMAIL_DOMAIN}`;
}

export function emailToUsername(email: string): string {
    return email.split('@')[0];
}

// ─── Authentication ──────────────────────────────────────────────────────────

/**
 * Sign in with username + password via Supabase Auth.
 * Returns { user, accessToken } on success.
 */
export async function signIn(username: string, password: string) {
    const supabase = createAdminClient();
    const email = usernameToEmail(username);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error('Identifiants incorrects');
    }

    const meta = data.user.app_metadata;
    const adminRole = (meta.admin_role as UserRole) || 'agent';
    const permissions = adminRole === 'admin'
        ? ALL_PERMISSIONS
        : (meta.permissions as Permission[]) || AGENT_DEFAULT_PERMISSIONS;

    return {
        user: {
            id: data.user.id,
            username: meta.username || emailToUsername(data.user.email!),
            displayName: meta.display_name || username,
            role: adminRole,
            permissions,
        },
        accessToken: data.session.access_token,
    };
}

// ─── User Management (via Supabase Auth Admin API) ───────────────────────────

function authUserToAppUser(user: { id: string; email?: string; app_metadata: Record<string, unknown>; created_at: string; banned_at?: string | null }): AppUser {
    const meta = user.app_metadata || {};
    const role = (meta.admin_role as UserRole) || 'agent';
    return {
        id: user.id,
        username: (meta.username as string) || emailToUsername(user.email || ''),
        displayName: (meta.display_name as string) || '',
        role,
        permissions: role === 'admin'
            ? ALL_PERMISSIONS
            : (meta.permissions as Permission[]) || AGENT_DEFAULT_PERMISSIONS,
        active: !user.banned_at,
        createdAt: user.created_at,
    };
}

export async function listUsers(): Promise<AppUser[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('[listUsers]', error);
        return [];
    }

    // Only show users with our admin email domain
    return data.users
        .filter(u => u.email?.endsWith(`@${EMAIL_DOMAIN}`))
        .map(u => authUserToAppUser(u as any));
}

export async function getUserById(id: string): Promise<AppUser | null> {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.getUserById(id);

    if (error || !data.user) return null;
    return authUserToAppUser(data.user as any);
}

export async function createUser(data: CreateUserData): Promise<AppUser | null> {
    const supabase = createAdminClient();

    const effectivePermissions: Permission[] =
        data.role === 'admin'
            ? ALL_PERMISSIONS
            : data.role === 'agent'
            ? AGENT_DEFAULT_PERMISSIONS
            : (data.permissions ?? []);

    const { data: result, error } = await supabase.auth.admin.createUser({
        email: usernameToEmail(data.username),
        password: data.password,
        email_confirm: true, // Auto-confirm — no email verification needed for admin
        app_metadata: {
            username: data.username,
            display_name: data.displayName || data.username,
            admin_role: data.role || 'agent',
            permissions: effectivePermissions,
            created_by: data.createdBy || null,
        },
    });

    if (error) {
        console.error('[createUser]', error);
        return null;
    }

    return authUserToAppUser(result.user as any);
}

export async function updateUser(id: string, updates: UpdateUserData): Promise<AppUser | null> {
    const supabase = createAdminClient();

    // Get current user to merge metadata
    const { data: current, error: getError } = await supabase.auth.admin.getUserById(id);
    if (getError || !current.user) return null;

    const currentMeta = current.user.app_metadata || {};
    const newMeta: Record<string, unknown> = { ...currentMeta };

    if (updates.displayName !== undefined) newMeta.display_name = updates.displayName;
    if (updates.role !== undefined) {
        newMeta.admin_role = updates.role;
        if (updates.role === 'admin') {
            newMeta.permissions = ALL_PERMISSIONS;
        } else if (updates.role === 'agent') {
            newMeta.permissions = AGENT_DEFAULT_PERMISSIONS;
        }
    }
    if (updates.permissions !== undefined && newMeta.admin_role !== 'admin') {
        newMeta.permissions = updates.permissions;
    }

    const updatePayload: Record<string, unknown> = {
        app_metadata: newMeta,
    };

    if (updates.password) {
        updatePayload.password = updates.password;
    }

    // Ban/unban for active toggle
    if (updates.active === false) {
        updatePayload.ban_duration = '876000h'; // ~100 years
    } else if (updates.active === true) {
        updatePayload.ban_duration = 'none';
    }

    const { data: result, error } = await supabase.auth.admin.updateUserById(id, updatePayload);
    if (error) {
        console.error('[updateUser]', error);
        return null;
    }

    return authUserToAppUser(result.user as any);
}

export async function deleteUser(id: string): Promise<boolean> {
    const supabase = createAdminClient();

    // Soft delete: ban the user instead of hard deleting
    const { error } = await supabase.auth.admin.updateUserById(id, {
        ban_duration: '876000h',
    });

    if (error) {
        console.error('[deleteUser]', error);
        return false;
    }
    return true;
}

/**
 * Decode a Supabase access token JWT payload (no cryptographic verification).
 * Safe because the cookie is httpOnly + secure + sameSite.
 */
export function decodeAccessToken(token: string): AdminTokenPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(
            Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
        );

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) return null;

        return payload as AdminTokenPayload;
    } catch {
        return null;
    }
}

/**
 * Extract admin JWTPayload from a Supabase access token.
 * Compatible with the old JWTPayload interface used by permissions.ts and proxy.ts.
 */
export function tokenToJWTPayload(token: string): JWTPayload | null {
    const decoded = decodeAccessToken(token);
    if (!decoded) return null;

    const meta = decoded.app_metadata || {};
    const adminRole = (meta.admin_role as UserRole) || 'agent';

    return {
        userId: decoded.sub,
        username: (meta.username as string) || emailToUsername(decoded.email || ''),
        displayName: (meta.display_name as string) || '',
        role: adminRole,
        permissions: adminRole === 'admin'
            ? ALL_PERMISSIONS
            : (meta.permissions as Permission[]) || AGENT_DEFAULT_PERMISSIONS,
        exp: decoded.exp,
        iat: decoded.exp - 3600,
    };
}
