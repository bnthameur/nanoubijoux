import { NextResponse } from 'next/server';
import { adminSupabase as supabase } from '@/lib/admin-supabase';

// GET /api/admin/stats — Dashboard statistics
export async function GET() {
    try {
        const [ordersRes, productsRes, customersRes] = await Promise.all([
            supabase.from('orders').select('id, status, total, created_at, full_name, phone, wilaya_id'),
            supabase.from('products').select('id', { count: 'exact', head: true }),
            supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        ]);

        const orders = ordersRes.data ?? [];
        const now = new Date();
        const todayStr = now.toDateString();

        const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === todayStr);

        const count = (status: string) => orders.filter(o => o.status === status).length;

        const delivered = orders.filter(o => o.status === 'delivered');
        const revenue = delivered.reduce((s, o) => s + (Number(o.total) || 0), 0);

        // Recent 10 orders with wilaya names
        const { data: recentOrders } = await supabase
            .from('orders')
            .select('id, full_name, phone, wilaya_id, total, status, created_at, wilayas(name_fr)')
            .order('created_at', { ascending: false })
            .limit(10);

        return NextResponse.json({
            totalOrders: orders.length,
            todayOrders: todayOrders.length,
            totalProducts: productsRes.count ?? 0,
            totalCustomers: customersRes.count ?? 0,
            pending: count('pending'),
            confirmed: count('confirmed'),
            ready: count('ready'),
            shipped: count('shipped'),
            shipping: count('shipping'),
            delivered: count('delivered'),
            cancelled: count('cancelled'),
            returned: count('returned'),
            no_response: count('no_response'),
            revenue,
            recentOrders: (recentOrders ?? []).map(o => ({
                id: o.id,
                name: o.full_name,
                phone: o.phone,
                wilaya: (o as any).wilayas?.name_fr ?? '',
                total: o.total,
                status: o.status,
                createdAt: o.created_at,
            })),
        });
    } catch (err) {
        console.error('[GET /api/admin/stats]', err);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
