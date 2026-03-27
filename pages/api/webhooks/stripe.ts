import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin"; // You'll need to create this small helper

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// This is essential for Stripe to verify the signature
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"]!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // 1. Check the root metadata first
    // 2. Fallback to client_reference_id (if you used it in the checkout setup)
    const firebaseUid = 
    (session.metadata?.firebaseUid) || 
    (session.client_reference_id);

    if (!firebaseUid) {
    console.error("No Firebase UID found in session metadata or client_reference_id");
    return res.status(400).send("Missing User Identity");
    }

    if (firebaseUid) {
      await adminDb.collection("users").doc(firebaseUid).set({
        subscriptionStatus: "trialing",
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        // Calculate 14 days from now
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }, { merge: true });
      
      console.log(`Trial activated for: ${firebaseUid}`);
    }
  }

  res.status(200).json({ received: true });
}