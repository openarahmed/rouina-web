// File: app/api/ipn/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // SSLCommerz sends data as x-www-form-urlencoded
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());

        console.log("Received IPN from SSLCommerz:", data);
        
        // =================================================================
        // IMPORTANT: PAYMENT VALIDATION LOGIC WILL GO HERE IN THE NEXT STEP
        // For now, we are just logging the data to see if we receive it.
        // =================================================================


        // Respond to SSLCommerz that we have received the IPN
        return NextResponse.json({ message: 'IPN Received' }, { status: 200 });

    } catch (error) {
        console.error("Error handling IPN:", error);
        return NextResponse.json({ message: 'Error processing IPN' }, { status: 500 });
    }
}