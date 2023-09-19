import Stripe from 'stripe';

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Method Not Allowed' });
  }

  try {
    const { lineItems } = req.body;

    if (!lineItems.length) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/checkout/success?sessionsId={CHECKOUT_SESSION_ID}`,
      cancel_url: req.headers.origin,
    });

    return res.status(200).json({ session });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
