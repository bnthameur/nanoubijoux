import { NextResponse } from 'next/server';
import { adminSupabase as supabase } from '@/lib/admin-supabase';
import { EcotrackService } from '@/lib/ecotrack';
import { PDFDocument } from 'pdf-lib';

// POST /api/admin/orders/bulk-labels — Download merged PDF bordereaux
export async function POST(req: Request) {
    try {
        const { orderIds } = await req.json();

        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.json({ error: 'orderIds requis' }, { status: 400 });
        }

        const { data: settings } = await supabase
            .from('settings')
            .select('ecotrack_token, ecotrack_api_url')
            .limit(1)
            .single();

        if (!settings?.ecotrack_token) {
            return NextResponse.json({ error: 'EcoTrack non configuré' }, { status: 400 });
        }

        const ecotrack = new EcotrackService(settings.ecotrack_token, settings.ecotrack_api_url);

        // Get tracking numbers for orders
        const { data: orders } = await supabase
            .from('orders')
            .select('id, ecotrack_tracking')
            .in('id', orderIds);

        const trackingNumbers = (orders ?? [])
            .filter(o => o.ecotrack_tracking)
            .map(o => o.ecotrack_tracking as string);

        if (trackingNumbers.length === 0) {
            return NextResponse.json({ error: 'Aucune commande avec numéro de suivi' }, { status: 400 });
        }

        // For single label, return directly without merging
        if (trackingNumbers.length === 1) {
            const pdfBuffer = await ecotrack.getLabel(trackingNumbers[0]);
            const timestamp = Date.now();
            return new Response(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="bordereaux-${timestamp}.pdf"`,
                },
            });
        }

        // For multiple labels, fetch each PDF and merge using pdf-lib
        const mergedPdf = await PDFDocument.create();
        let successCount = 0;

        for (const tracking of trackingNumbers) {
            try {
                const buffer = await ecotrack.getLabel(tracking);
                const labelPdf = await PDFDocument.load(buffer);
                const copiedPages = await mergedPdf.copyPages(labelPdf, labelPdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
                successCount++;
            } catch (err) {
                // Skip failed labels gracefully and continue with others
                console.error(`[bulk-labels] Failed label for tracking ${tracking}:`, err);
            }
        }

        if (successCount === 0) {
            return NextResponse.json({ error: 'Impossible de récupérer les bordereaux' }, { status: 500 });
        }

        const mergedBytes = await mergedPdf.save();
        const mergedBuffer = Buffer.from(mergedBytes);
        const timestamp = Date.now();

        return new Response(mergedBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="bordereaux-${timestamp}.pdf"`,
            },
        });
    } catch (err) {
        console.error('[POST /api/admin/orders/bulk-labels]', err);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
