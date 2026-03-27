import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Update this line to match the SDK's required version
  apiVersion: '2026-03-25.dahlia', 
});

export async function POST(req: Request) {
  try {
    const { uid, email } = await req.json();

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing user information" }, { status: 400 });
    }

    // 1. Create (or retrieve) a Stripe Customer
    // In a production app, you'd check Firestore first for an existing stripeCustomerId
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        firebaseUid: uid,
      },
    });

    // 2. Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          // Replace with your actual Price ID from Stripe Dashboard
          price: process.env.STRIPE_MONTHLY_PRICE_ID, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // This is the "Magic Sauce" for your 2-week trial
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          firebaseUid: uid,
        }
      },
      // Redirect back to your app after success or cancel
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
      
      // Collect payment method up front so the trial can transition to paid automatically
      payment_method_collection: 'always',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}