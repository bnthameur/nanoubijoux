import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// ─── Admin JWT Permission → Route mapping ─────────────────────────────────────

const ROUTE_PERMISSIONS: Array<{ prefix: string; permission: string }> = [
  { prefix: '/admin/settings', permission: 'settings:manage' },
  { prefix: '/admin/users', permission: 'users:manage' },
  { prefix: '/admin/pixels', permission: 'pixels:manage' },
  { prefix: '/admin/delivery', permission: 'delivery:manage' },
  { prefix: '/admin/produits', permission: 'products:manage' },
  { prefix: '/admin/categories', permission: 'categories:manage' },
  { prefix: '/api/admin/users', permission: 'users:manage' },
  { prefix: '/api/admin/settings', permission: 'settings:manage' },
  { prefix: '/api/admin/pixels', permission: 'pixels:manage' },
  { prefix: '/api/admin/delivery', permission: 'delivery:manage' },
  { prefix: '/api/admin/products', permission: 'products:manage' },
];

// ─── Permission constants (duplicated for Edge runtime) ──────────────────────

type UserRole = 'admin' | 'agent' | 'custom';

const ALL_PERMISSIONS = [
  'orders:view', 'orders:edit', 'orders:delete', 'orders:ship',
  'products:manage', 'categories:manage', 'pixels:manage',
  'delivery:manage', 'settings:manage', 'users:manage', 'reports:view',
];

const AGENT_DEFAULT_PERMISSIONS = ['orders:view', 'orders:edit'];

// ─── Edge-compatible Supabase JWT decoding ───────────────────────────────────

interface JWTPayload {
  userId: string;
  username: string;
  displayName: string;
  role: string;
  permissions: string[];
  exp: number;
  iat: number;
}

function decodeJWTEdge(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Edge-compatible base64url decode using atob
    const body = parts[1];
    const padded = body.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const base64 = padded + '='.repeat(padLen);
    const decoded = JSON.parse(atob(base64));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) return null;

    // Extract admin info from Supabase app_metadata
    const meta = decoded.app_metadata || {};
    const adminRole = (meta.admin_role as UserRole) || 'agent';

    const emailToUsername = (email: string) => email.split('@')[0];

    return {
      userId: decoded.sub,
      username: (meta.username as string) || emailToUsername(decoded.email || ''),
      displayName: (meta.display_name as string) || '',
      role: adminRole,
      permissions: adminRole === 'admin'
        ? ALL_PERMISSIONS
        : (meta.permissions as string[]) || AGENT_DEFAULT_PERMISSIONS,
      exp: decoded.exp,
      iat: decoded.iat || (decoded.exp - 3600),
    };
  } catch {
    return null;
  }
}

// ─── Proxy entry point ───────────────────────────────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin login page — no auth required
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Admin panel pages — JWT auth + permissions
  if (pathname.startsWith('/admin')) {
    return handleAdminAuth(request);
  }

  // Admin API routes — JWT auth + permissions
  if (pathname.startsWith('/api/admin')) {
    return handleAdminApiAuth(request);
  }

  // All other API routes — skip i18n, pass through directly
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Locale-prefixed API routes (e.g. /fr/api/communes → redirect to /api/communes)
  const localeApiMatch = pathname.match(/^\/(fr|ar|en)(\/api\/.*)$/);
  if (localeApiMatch) {
    return NextResponse.redirect(new URL(localeApiMatch[2], request.url));
  }

  // All other routes — handle i18n
  return intlMiddleware(request);
}

// ─── Admin page auth (redirects to /admin/login) ─────────────────────────────

function handleAdminAuth(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;

  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const payload = decodeJWTEdge(session);

  if (!payload) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_session');
    return response;
  }

  const { pathname } = request.nextUrl;

  // Check route-specific permissions
  for (const { prefix, permission } of ROUTE_PERMISSIONS) {
    if (pathname.startsWith(prefix)) {
      const isAdmin = payload.role === 'admin';
      const hasPerm = isAdmin || payload.permissions.includes(permission);
      if (!hasPerm) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      break;
    }
  }

  // Attach user info to forwarded request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-username', payload.username);
  requestHeaders.set('x-user-display-name', payload.displayName ?? '');
  requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// ─── Admin API auth (returns 401/403 JSON) ────────────────────────────────────

function handleAdminApiAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth endpoints are public
  if (pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('admin_session')?.value;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = decodeJWTEdge(session);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check route-specific permissions
  for (const { prefix, permission } of ROUTE_PERMISSIONS) {
    if (pathname.startsWith(prefix)) {
      const isAdmin = payload.role === 'admin';
      const hasPerm = isAdmin || payload.permissions.includes(permission);
      if (!hasPerm) {
        return NextResponse.json(
          { error: 'Forbidden: insufficient permissions' },
          { status: 403 },
        );
      }
      break;
    }
  }

  // Attach user info to forwarded request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-username', payload.username);
  requestHeaders.set('x-user-display-name', payload.displayName ?? '');
  requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
