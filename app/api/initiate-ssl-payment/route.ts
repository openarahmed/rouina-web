// File: app/api/initiate-ssl-payment/route.ts

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL; // Reading the site URL from Netlify's environment variables
    const is_live = false; // false for sandbox

    const body = await req.json();
    const { amount, currency, plan, uid } = body;
    const tran_id = uuidv4();

    // SSLCommerz API expects form data, not JSON
    const formData = new URLSearchParams();
    formData.append('store_id', store_id!);
    formData.append('store_passwd', store_passwd!);
    formData.append('total_amount', amount.toString());
    formData.append('currency', currency);
    formData.append('tran_id', tran_id);
    formData.append('success_url', `${siteURL}/payment/success?tran_id=${tran_id}`);
    formData.append('fail_url', `${siteURL}/payment/fail`);
    formData.append('cancel_url', `${siteURL}/payment/cancel`);
    
    // --- IMPORTANT CHANGE FOR DEPLOYMENT ---
    // The IPN URL must be a full, absolute URL for the SSLCommerz server to find it.
    formData.append('ipn_url', `${siteURL}/api/ipn`);
    // --- END CHANGE ---

    formData.append('shipping_method', 'No');
    formData.append('product_name', `Routina ${plan} Plan`);
    formData.append('product_category', 'Digital Service');
    formData.append('product_profile', 'general');
    
    // Customer Info
    formData.append('cus_name', 'Customer Name');
    formData.append('cus_email', 'customer@example.com');
    formData.append('cus_add1', 'Dhaka');
    formData.append('cus_country', 'Bangladesh');
    formData.append('cus_phone', '01711111111');
    formData.append('cus_city', 'Dhaka');
    formData.append('cus_state', 'Dhaka');
    formData.append('cus_postcode', '1200');
    
    // Custom values for our app
    formData.append('value_a', uid);
    formData.append('value_b', plan);

    try {
        const response = await fetch(
            is_live 
                ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php' 
                : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
            {
                method: 'POST',
                body: formData,
            }
        );

        const apiResponse = await response.json();

        if (apiResponse.status === 'SUCCESS') {
            return NextResponse.json({ url: apiResponse.GatewayPageURL }, { status: 200 });
        } else {
            console.error('SSLCommerz API Error:', apiResponse);
            return NextResponse.json({ message: 'Payment session creation failed', error: apiResponse }, { status: 400 });
        }
    } catch (error) {
        console.error("Error creating SSLCommerz session:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}