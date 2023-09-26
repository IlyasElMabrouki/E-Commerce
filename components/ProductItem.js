/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import StarRating from "./StarRating"

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Carousel showThumbs={false} autoPlay>
        {product.image.map((image) => (
          <div key={image}>
            <Link href={`/product/${product.slug}`} passHref className="flex">
              <img src={image} alt={image} />
            </Link>
          </div>
        ))}
      </Carousel>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <StarRating rating={product.rating} numReviews={product.numReviews}/>
        <p>${product.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
