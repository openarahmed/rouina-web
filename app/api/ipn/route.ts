// File: app/api/ipn/route.ts

import { NextResponse } from 'next/server';
import { dbAdmin } from '../../lib/firebaseAdmin'; // Importing our Firebase Admin instance
import SSLCommerzPayment from 'sslcommerz-lts';

export async function POST(req: Request) {
    try {
        const store_id = process.env.SSLCOMMERZ_STORE_ID;
        const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
        const is_live = false; // Keep it false for sandbox testing

        // SSLCommerz sends data as x-www-form-urlencoded
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());

        console.log("Received IPN. Starting validation...", data);

        // --- Step 1: Initial Status Check ---
        // First, check if the status in the received data is 'VALID'.
        if (data.status !== 'VALID') {
            console.error("IPN received with non-VALID status:", data.status);
            return NextResponse.json({ message: "IPN status is not VALID" }, { status: 400 });
        }

        // --- Step 2: Server-to-Server Validation (Crucial for Security) ---
        // This is a double-check to confirm the transaction with SSLCommerz's server.
        // It prevents users from faking a successful payment.
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validationResponse = await sslcz.validate({ val_id: data.val_id as string });

        if (validationResponse.status !== 'VALID') {
            console.error("SSLCommerz validation failed for val_id:", data.val_id);
            return NextResponse.json({ message: "Payment validation failed" }, { status: 400 });
        }
        
        console.log("Payment validation successful:", validationResponse);

        // --- Step 3: Update Firestore Database ---
        // Now that we are 100% sure the payment is valid, we update the user's data.
        const uid = validationResponse.value_a as string;
        const plan = validationResponse.value_b as string;

        if (!uid) {
             console.error("User ID (value_a) not found in validation response.");
             return NextResponse.json({ message: "User ID not found in IPN" }, { status: 400 });
        }

        // Calculate the subscription's expiration date
        const now = new Date();
        const validTillDate = new Date(now.setMonth(now.getMonth() + (plan === 'yearly' ? 12 : 1)));

        // Get a reference to the user's document in Firestore
        const userRef = dbAdmin.collection('users').doc(uid);

        // Update the user's document with premium details
        await userRef.update({
            isPremium: true,
            planType: plan,
            validTill: validTillDate,
            adsEnabled: false,
            lastTransactionId: validationResponse.tran_id,
            lastTransactionDate: new Date(),
            paymentGateway: 'SSLCommerz',
        });
        
        console.log(`Successfully updated user ${uid} to premium.`);

        // --- Step 4: Respond to SSLCommerz ---
        // Finally, send a success response to SSLCommerz to let them know we've handled the IPN.
        return NextResponse.json({ message: 'IPN Processed Successfully' }, { status: 200 });

    } catch (error) {
        console.error("Critical Error handling IPN:", error);
        return NextResponse.json({ message: 'Error processing IPN' }, { status: 500 });
    }
}

