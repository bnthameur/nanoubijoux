import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/permissions';
import { createAdminClient } from '@/lib/supabase/admin-client';
import { signIn } from '@/lib/admin-auth';

// PATCH /api/admin/auth/password — Change own password
export async function PATCH(req: Request) {
    const user = await getUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    let currentPassword: string;
    let newPassword: string;

    try {
        const body = await req.json();
        currentPassword = body.currentPassword;
        newPassword = body.newPassword;
    } catch {
        return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Mot de passe actuel et nouveau requis' }, { status: 400 });
    }

    if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    try {
        // Verify current password by attempting sign-in
        await signIn(user.username, currentPassword);

        // Update password via Supabase Auth Admin API
        const supabase = createAdminClient();
        const { error } = await supabase.auth.admin.updateUserById(user.userId, {
            password: newPassword,
        });

        if (error) {
            console.error('[PATCH /api/admin/auth/password]', error);
            return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 401 });
    }
}
