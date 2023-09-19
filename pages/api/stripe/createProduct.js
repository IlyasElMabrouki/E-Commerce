import Stripe from 'stripe';

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    console.log(req.body)
    let product = await stripe.products.create({
      name: req.body.name,
    });
    const price = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      unit_amount: req.body.price * 100,
    });
    product = await stripe.products.update(product.id, {
      default_price: price.id,
    });
    res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}

