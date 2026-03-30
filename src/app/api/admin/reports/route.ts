import { NextResponse } from 'next/server';
import { adminSupabase as supabase } from '@/lib/admin-supabase';

interface OrderRow {
  status: string;
  total: number;
  created_at: string;
}

interface OrderItemRow {
  product_id: number;
  quantity: number;
  products: { name_fr: string } | null;
}

/**
 * GET /api/admin/reports
 *
 * Returns aggregated analytics:
 * - revenue, deliveredCount, cancelledCount, cancellationRate, totalOrders
 * - topProducts: top 10 products by number of order line items
 * - monthlyOrders: order counts grouped by month (keyed as "YYYY-MM")
 */
export async function GET() {
  try {
    // Fetch all orders (status + total + date) in one query
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('status, total, created_at');

    if (ordersError) {
      console.error('[GET /api/admin/reports] orders query failed:', ordersError.message);
      return NextResponse.json({ error: 'Erreur lors de la récupération des commandes' }, { status: 500 });
    }

    const allOrders: OrderRow[] = orders ?? [];
    const totalOrders = allOrders.length;

    // Revenue and status counts
    let revenue = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    const monthlyCounts: Record<string, number> = {};

    for (const order of allOrders) {
      if (order.status === 'delivered') {
        deliveredCount++;
        revenue += Number(order.total) || 0;
      }
      if (order.status === 'cancelled') {
        cancelledCount++;
      }

      // Group by month: "YYYY-MM"
      const month = order.created_at.slice(0, 7); // e.g. "2026-03"
      monthlyCounts[month] = (monthlyCounts[month] ?? 0) + 1;
    }

    const cancellationRate =
      totalOrders > 0 ? Math.round((cancelledCount / totalOrders) * 100 * 10) / 10 : 0;

    // Monthly orders sorted chronologically
    const monthlyOrders = Object.entries(monthlyCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce<Record<string, number>>((acc, [month, count]) => {
        acc[month] = count;
        return acc;
      }, {});

    // Top products: aggregate from order_items joined with products
    const { data: itemRows, error: itemsError } = await supabase
      .from('order_items')
      .select('product_id, quantity, products(name_fr)');

    if (itemsError) {
      console.error('[GET /api/admin/reports] order_items query failed:', itemsError.message);
      return NextResponse.json({ error: 'Erreur lors de la récupération des produits' }, { status: 500 });
    }

    // Aggregate order counts per product (each row = one order line, regardless of quantity)
    const productOrderCount: Record<number, { name: string; count: number }> = {};

    for (const row of (itemRows ?? []) as unknown as OrderItemRow[]) {
      const productId = row.product_id;
      const name = row.products?.name_fr ?? `Produit #${productId}`;

      if (!productOrderCount[productId]) {
        productOrderCount[productId] = { name, count: 0 };
      }
      productOrderCount[productId].count++;
    }

    const topProducts = Object.entries(productOrderCount)
      .map(([id, { name, count }]) => ({ productId: Number(id), name, orderCount: count }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 10);

    return NextResponse.json({
      revenue,
      deliveredCount,
      cancelledCount,
      cancellationRate,
      totalOrders,
      topProducts,
      monthlyOrders,
    });
  } catch (err) {
    console.error('[GET /api/admin/reports] unexpected error:', err);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
