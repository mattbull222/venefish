import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia', 
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "Missing user information" });
    }

    // 1. Create Stripe Customer
    const customer = await stripe.customers.create({
      email: email,
      metadata: { firebaseUid: uid },
    });

    // 2. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      metadata: { 
        firebaseUid: uid 
      },
      line_items: [
        {
          price: process.env.STRIPE_MONTHLY_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 14,
        metadata: { firebaseUid: uid }
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
      payment_method_collection: 'always',
    });

    // 3. Return the URL as JSON
    return res.status(200).json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}