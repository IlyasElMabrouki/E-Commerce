import Stripe from 'stripe';

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Method Not Allowed' });
  }

  try {
    const { lineItems, orderId, shippingPrice } = req.body;

    if (!lineItems.length) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const taxRate = await stripe.taxRates.create({
      display_name: 'TVA',
      inclusive: false,
      percentage: 15,
    });

    const addTaxRate = (element) => {
      element.tax_rates = [taxRate.id];
      return element;
    };

    const newLineItems = lineItems.map(addTaxRate);

    const session = await stripe.checkout.sessions.create({
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingPrice * 100,
              currency: 'usd',
            },
            display_name: 'Taux de livraison',
          },
        },
      ],
      line_items: newLineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/order_stripe/${orderId}?sessionsId={CHECKOUT_SESSION_ID}`,
      cancel_url: req.headers.origin,
    });

    return res.status(200).json({ session });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
