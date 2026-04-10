'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      setMsg({ text: 'Tous les champs sont requis', ok: false });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ text: 'Le mot de passe doit contenir au moins 6 caractères', ok: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ text: 'Les mots de passe ne correspondent pas', ok: false });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg({ text: 'Mot de passe modifié avec succès', ok: true });
        setTimeout(onClose, 1500);
      } else {
        setMsg({ text: data.error || 'Erreur', ok: false });
      }
    } catch {
      setMsg({ text: 'Erreur de connexion', ok: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Changer le mot de passe</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>

        {msg && (
          <div className={cn('rounded-xl px-4 py-2.5 text-sm font-medium', msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
            {msg.text}
          </div>
        )}

        {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field, i) => {
          const labels = ['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le mot de passe'];
          const values = [currentPassword, newPassword, confirmPassword];
          const setters = [setCurrentPassword, setNewPassword, setConfirmPassword];
          return (
            <label key={field} className="block space-y-1">
              <span className="text-xs font-semibold text-slate-500">{labels[i]}</span>
              <input
                type="password"
                value={values[i]}
                onChange={e => setters[i](e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition-all focus:border-amber-400 focus:bg-white"
              />
            </label>
          );
        })}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white transition-all hover:bg-slate-700 disabled:opacity-60"
        >
          {saving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {saving ? 'En cours...' : 'Changer le mot de passe'}
        </button>
      </div>
    </div>
  );
}
