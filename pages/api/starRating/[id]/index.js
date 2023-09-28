import { getToken } from 'next-auth/jwt';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

export default async function handler(req, res) {
  const user = await getToken({ req });
  const { rating } = req.body;
  if (!user) {
    return res.status(401).send('signin required');
  }

  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Method Not Allowed' });
  }

  await db.connect();
  const product = await Product.findById(req.query.id);
  console.log(req.body);
  if (product) {
    product.rating = rating;
    product.numReviews++;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
}
