import React from 'react'
import db from '../../utils/db'
import Product from '../../models/Product';
import Layout from '../../components/Layout';
import ProductItem from '../../components/ProductItem';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useContext } from 'react';

export default function CategoryScreen({products}) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

  if (!products) {
      return <Layout title="Produt Not Found">Produt Not Found</Layout>
  }
  return (
      <Layout title="Home Page">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          ))}
        </div>
      </Layout>
  );
}

export async function getServerSideProps(context) {
    const { params } = context;
    await db.connect();
    const products = await Product.find({ category: params.slug}).lean();
    await db.disconnect();
    return {
      props: {
        products: products.map(db.convertDocToObj)
      },
    };
}
