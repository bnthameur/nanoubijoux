import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    bootstrapAdminIfNeeded,
    createSession,
    getUserByUsername,
    validateSession,
    verifyPassword,
} from '@/lib/admin-auth';

// POST /api/admin/auth — Login
export async function POST(req: Request) {
    let username: string;
    let password: string;

    try {
        const body = await req.json();
        username = body.username;
        password = body.password;
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!username || !password) {
        return NextResponse.json({ error: 'Nom d\'utilisateur et mot de passe requis' }, { status: 400 });
    }

    try {
        // Ensure first admin is bootstrapped from env vars if no users exist
        await bootstrapAdminIfNeeded();

        // Authenticate against database only — no hardcoded fallback
        const user = await getUserByUsername(username);
        if (!user) {
            return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
        }

        const passwordValid = await verifyPassword(password, user.passwordHash);
        if (!passwordValid) {
            return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
        }

        const token = await createSession(user);
        const userInfo = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            role: user.role,
            permissions: user.permissions,
        };

        const cookieStore = await cookies();
        cookieStore.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
        });

        return NextResponse.json({ ok: true, user: userInfo });
    } catch (err) {
        console.error('[POST /api/admin/auth]', err);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

// DELETE /api/admin/auth — Logout
export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('admin_session');
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[DELETE /api/admin/auth]', err);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

// GET /api/admin/auth — Current user info
export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie') ?? '';
        let token: string | null = null;
        for (const part of cookieHeader.split(';')) {
            const [key, ...rest] = part.trim().split('=');
            if (key.trim() === 'admin_session') {
                token = decodeURIComponent(rest.join('='));
                break;
            }
        }

        if (!token) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const payload = await validateSession(token);
        if (!payload) {
            return NextResponse.json({ error: 'Session expirée' }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: payload.userId,
                username: payload.username,
                displayName: payload.displayName,
                role: payload.role,
                permissions: payload.permissions,
            },
        });
    } catch (err) {
        console.error('[GET /api/admin/auth]', err);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
