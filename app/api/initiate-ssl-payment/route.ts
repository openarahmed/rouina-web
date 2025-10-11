// File: app/api/initiate-ssl-payment/route.ts

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
    
    // --- FIX: Gracefully handle trailing slashes in the site URL ---
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""); 
    
    const is_live = false; 

    const body = await req.json();
    const { amount, currency, plan, uid } = body;
    const tran_id = uuidv4();

    const formData = new URLSearchParams();
    formData.append('store_id', store_id!);
    formData.append('store_passwd', store_passwd!);
    formData.append('total_amount', amount.toString());
    formData.append('currency', currency);
    formData.append('tran_id', tran_id);
    formData.append('success_url', `${siteURL}/payment/success?tran_id=${tran_id}`);
    formData.append('fail_url', `${siteURL}/payment/fail`);
    formData.append('cancel_url', `${siteURL}/payment/cancel`);
    formData.append('ipn_url', `${siteURL}/api/ipn`);

    // ... (baki shob code ager motoi)
    formData.append('shipping_method', 'No');
    formData.append('product_name', `Routina ${plan} Plan`);
    formData.append('product_category', 'Digital Service');
    formData.append('product_profile', 'general');
    formData.append('cus_name', 'Customer Name');
    formData.append('cus_email', 'customer@example.com');
    formData.append('cus_add1', 'Dhaka');
    formData.append('cus_country', 'Bangladesh');
    formData.append('cus_phone', '01711111111');
    formData.append('cus_city', 'Dhaka');
    formData.append('cus_state', 'Dhaka');
    formData.append('cus_postcode', '1200');
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
            return NextResponse.json({ message: 'Payment session creation failed', error: apiResponse }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
