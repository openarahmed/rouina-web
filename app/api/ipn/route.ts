// File: app/api/ipn/route.ts

import { NextResponse } from 'next/server';
import { dbAdmin } from '../../lib/firebaseAdmin';
import SSLCommerzPayment from 'sslcommerz-lts';

export async function POST(req: Request) {
    try {
        const store_id = process.env.SSLCOMMERZ_STORE_ID;
        const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
        const is_live = false; 

        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());

        console.log("DEBUG: IPN Received. Data:", data);

        if (data.status !== 'VALID') {
            console.error("DEBUG: IPN status is not VALID:", data.status);
            return NextResponse.json({ message: "IPN status is not VALID" }, { status: 400 });
        }
        console.log("DEBUG: IPN status is VALID. Proceeding to server validation...");

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validationResponse = await sslcz.validate({ val_id: data.val_id as string });

        if (validationResponse.status !== 'VALID') {
            console.error("DEBUG: SSLCommerz server validation FAILED. Response:", validationResponse);
            return NextResponse.json({ message: "Payment validation failed" }, { status: 400 });
        }
        
        console.log("DEBUG: Server validation successful. Preparing to update database...");

        const uid = validationResponse.value_a as string;
        const plan = validationResponse.value_b as string;

        if (!uid) {
             console.error("DEBUG: User ID (value_a) is missing from validation response!");
             return NextResponse.json({ message: "User ID not found in IPN" }, { status: 400 });
        }
        console.log(`DEBUG: Found UID: ${uid} and Plan: ${plan}. Targeting Firestore document...`);

        const now = new Date();
        const validTillDate = new Date(now.setMonth(now.getMonth() + (plan === 'yearly' ? 12 : 1)));

        const userRef = dbAdmin.collection('users').doc(uid);
        
        console.log(`DEBUG: Attempting to update document at path: users/${uid}`);

        // THE UPDATE COMMAND
        await userRef.update({
            isPremium: true,
            planType: plan,
            validTill: validTillDate,
            adsEnabled: false,
            lastTransactionId: validationResponse.tran_id,
            lastTransactionDate: new Date(),
            paymentGateway: 'SSLCommerz',
        });
        
        console.log(`DEBUG: SUCCESS! Firestore document for user ${uid} has been updated.`);

        return NextResponse.json({ message: 'IPN Processed Successfully' }, { status: 200 });

    } catch (error) {
        // This will catch any error, including Firestore permission issues
        console.error("DEBUG: CRITICAL ERROR inside IPN handler:", error);
        return NextResponse.json({ message: 'Error processing IPN', errorDetails: (error as Error).message }, { status: 500 });
    }
}

