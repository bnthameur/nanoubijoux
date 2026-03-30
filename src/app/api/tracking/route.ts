import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { adminSupabase as supabase } from '@/lib/admin-supabase';

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const phoneSchema = z
  .string()
  .regex(/^0[5-7]\d{8}$/, 'Numéro de téléphone invalide (format: 05XXXXXXXX)');

const idSchema = z.string().uuid('Identifiant de commande invalide');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string | null;
  product_image: string | null;
  product_sku: string | null;
}

interface TrackingOrder {
  id: string;
  status: string;
  full_name: string;
  phone: string;
  total: number;
  created_at: string;
  tracking_number: string | null;
  ecotrack_tracking: string | null;
  wilaya_id: number | null;
  wilaya_name_fr: string | null;
  commune: string | null;
  items: OrderItem[];
}

// ---------------------------------------------------------------------------
// Helper: select clause & transform
// ---------------------------------------------------------------------------

const ORDER_SELECT = `
  id,
  status,
  full_name,
  phone,
  total,
  created_at,
  tracking_number,
  ecotrack_tracking,
  wilaya_id,
  commune,
  items:order_items (
    id,
    product_id,
    variant_id,
    quantity,
    unit_price,
    total_price,
    product_name,
    product_image,
    product_sku
  ),
  wilaya:wilayas (
    name_fr
  )
`.trim();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformOrder(raw: any): TrackingOrder {
  return {
    id: raw.id,
    status: raw.status,
    full_name: raw.full_name ?? '',
    phone: raw.phone ?? '',
    total: Number(raw.total) || 0,
    created_at: raw.created_at,
    tracking_number: raw.tracking_number ?? null,
    ecotrack_tracking: raw.ecotrack_tracking ?? null,
    wilaya_id: raw.wilaya_id ?? null,
    wilaya_name_fr: raw.wilaya?.name_fr ?? null,
    commune: raw.commune ?? null,
    items: (raw.items ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any): OrderItem => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id ?? null,
        quantity: item.quantity,
        unit_price: Number(item.unit_price) || 0,
        total_price: Number(item.total_price) || 0,
        product_name: item.product_name ?? null,
        product_image: item.product_image ?? null,
        product_sku: item.product_sku ?? null,
      })
    ),
  };
}

// ---------------------------------------------------------------------------
// GET /api/tracking?phone=XXXXX  or  ?id=ORDER_UUID
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const phone = searchParams.get('phone');
  const id = searchParams.get('id');

  if (!phone && !id) {
    return NextResponse.json(
      { error: 'Paramètre requis: phone ou id' },
      { status: 400 }
    );
  }

  try {
    // -------------------------------------------------------------------------
    // Lookup by phone number
    // -------------------------------------------------------------------------
    if (phone) {
      const phoneResult = phoneSchema.safeParse(phone.trim());
      if (!phoneResult.success) {
        return NextResponse.json(
          { error: phoneResult.error.issues[0]?.message ?? 'Numéro invalide' },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT)
        .eq('phone', phoneResult.data)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('[GET /api/tracking] phone lookup error:', error);
        return NextResponse.json({ error: 'Erreur lors de la recherche' }, { status: 500 });
      }

      const orders = (data ?? []).map(transformOrder);
      return NextResponse.json({ orders });
    }

    // -------------------------------------------------------------------------
    // Lookup by order ID
    // -------------------------------------------------------------------------
    const idResult = idSchema.safeParse(id!.trim());
    if (!idResult.success) {
      return NextResponse.json(
        { error: idResult.error.issues[0]?.message ?? 'Identifiant invalide' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('id', idResult.data)
      .maybeSingle();

    if (error) {
      console.error('[GET /api/tracking] id lookup error:', error);
      return NextResponse.json({ error: 'Erreur lors de la recherche' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    return NextResponse.json({ order: transformOrder(data) });
  } catch (err) {
    console.error('[GET /api/tracking] unexpected error:', err);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
