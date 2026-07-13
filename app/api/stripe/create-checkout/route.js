import Stripe from 'stripe';

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return Response.json({ error: 'No items in cart' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Build Stripe line items from cart
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`] : [],
          metadata: {
            productId: item.id,
            slug: item.slug || '',
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'AU', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'AE', 'SG', 'JP'],
      },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
      custom_text: {
        submit: {
          message: 'Your order includes free insured international shipping.',
        },
      },
      metadata: {
        // Store cart item count for webhook reference
        itemCount: String(items.length),
        cartItems: JSON.stringify(
          items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price }))
        ).slice(0, 500), // Stripe metadata limit: 500 chars per value
      },
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return Response.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
