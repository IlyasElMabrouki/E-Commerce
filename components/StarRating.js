import { useState } from 'react';

export default function StarRating({ rate, numReviews, productId }) {
  const [rating, setRating] = useState(rate);

  const clickHandler = async (index) => {
    setRating(index + 1);
    const { message } = await fetch(`/api/starRating/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    }).then((res) => res.json());
    console.log(message);
  };

  return (
    <div className="flex m-2 gap-1 items-center">
      {[...Array(5)].map((_, index) => {
        return (
          <button key={index} onClick={() => clickHandler(index)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={0.5}
              stroke="currentColor"
              className={
                index + 1 <= rating
                  ? 'fill-yellow-500  text-yellow-500 w-6 h-6'
                  : 'fill-white w-6 h-6'
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
      {numReviews > 0 && <p>{numReviews + ' reviews'}</p>}
    </div>
  );
}
