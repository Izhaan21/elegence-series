import Stripe from 'stripe';
import { createOrder, updateOrderStatus } from '@/lib/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Parse cart items from metadata
      let cartItems = [];
      try {
        cartItems = JSON.parse(session.metadata?.cartItems || '[]');
      } catch {
        cartItems = [];
      }

      const shippingAddress = session.shipping_details?.address;
      const customerName = session.shipping_details?.name || session.customer_details?.name || '';
      const customerEmail = session.customer_details?.email || '';
      const phone = session.customer_details?.phone || '';

      // Save order to Firestore
      await createOrder({
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        customerName,
        email: customerEmail,
        phone,
        shippingAddress: shippingAddress
          ? {
              line1: shippingAddress.line1 || '',
              line2: shippingAddress.line2 || '',
              city: shippingAddress.city || '',
              state: shippingAddress.state || '',
              postalCode: shippingAddress.postal_code || '',
              country: shippingAddress.country || '',
            }
          : null,
        items: cartItems,
        totalAmount: session.amount_total / 100, // convert from cents
        currency: session.currency?.toUpperCase() || 'USD',
        paymentStatus: 'paid',
        orderStatus: 'pending',
      });

      console.log(`Order created for session: ${session.id}`);
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
      // Return 200 to Stripe anyway — Stripe will retry on 5xx only
      return new Response('Order creation failed but acknowledged', { status: 200 });
    }
  }

  // Handle payment_intent.payment_failed
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    console.log(`Payment failed for intent: ${paymentIntent.id}`);
    // No order to update since checkout.session.completed didn't fire
  }

  return new Response('OK', { status: 200 });
}
