import { getToken } from 'next-auth/jwt';
import Product from '../../../../models/Product';
import Rate from '../../../../models/Rate';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'PUT') {
    return putHandler(req, res, user);
  } else if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'POST') {
    return postHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const getHandler = async (req, res, user) => {
  await db.connect();
  const rank = await Rate.findOne({
    $and: [{ user: user }, { product: req.query.id }],
  });
  await db.disconnect();
  res.send(rank);
};

const putHandler = async (req, res, user) => {
  const { rate } = req.body;
  await db.connect();
  const rank = await Rate.findOne({
    $and: [{ user: user }, { product: req.query.id }],
  });
  if (rank) {
    rank.value = rate;
    await rank.save();
  }
  const product = await Product.findById(req.query.id);
  if (product) {
    product.rating =
      (product.rating * product.numReviews + rate) / ++product.numReviews;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
};

const postHandler = async (req, res, user) => {
  const { rate } = req.body;
  await db.connect();
  const newRate = new Rate({
    user: user._id,
    product: req.query.id,
    value: rate,
  });
  const product = await Product.findById(req.query.id);
  if (product) {
    product.rating =
      (product.rating * product.numReviews + rate) / ++product.numReviews;
    await product.save();
  }
  const rank = await newRate.save();
  await db.disconnect();
  res.status(201).send(rank);
};

export default handler;
