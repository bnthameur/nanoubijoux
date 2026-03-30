import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin-client';

export interface AggregatedClient {
  phone: string;
  name: string;
  wilaya: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

// GET /api/admin/clients — Aggregate customers from orders table
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  try {
    const supabase = createAdminClient();

    // Fetch all orders with wilaya name
    const { data: orders, error } = await supabase
      .from('orders')
      .select('full_name, phone, total, status, created_at, wilayas(name_fr)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/admin/clients]', error.message);
      return NextResponse.json({ customers: [], total: 0, error: error.message }, { status: 200 });
    }

    // Aggregate by phone number
    const map = new Map<string, AggregatedClient>();

    for (const order of orders ?? []) {
      const phone = (order.phone ?? '').trim();
      const key = phone || `nophone_${order.full_name}`;

      const wilaya = (order as any).wilayas?.name_fr ?? '';

      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.orderCount += 1;
        existing.totalSpent += Number(order.total) || 0;
        // lastOrderDate is already the most recent because orders are sorted desc
      } else {
        map.set(key, {
          phone,
          name: order.full_name ?? '',
          wilaya,
          orderCount: 1,
          totalSpent: Number(order.total) || 0,
          lastOrderDate: order.created_at ?? null,
        });
      }
    }

    let customers = Array.from(map.values());

    // Sort by order count descending
    customers.sort((a, b) => b.orderCount - a.orderCount);

    // Apply search filter (name, phone, or wilaya)
    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.wilaya.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ customers, total: customers.length });
  } catch (err) {
    console.error('[GET /api/admin/clients]', err);
    return NextResponse.json({ customers: [], total: 0 }, { status: 200 });
  }
}
