import { useEffect, useState } from 'react';

export default function StarRating({ productId }) {
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(`/api/starRating/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const rank = await response.json();
        if (rank) setRate(rank.value);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getProduct();
  }, [productId]);

  const clickHandler = async (index) => {
    setRate(index + 1);
    await fetch(`/api/starRating/${productId}`, {
      method: rate == 0 ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rate: index + 1 }),
    }).then((res) => res.json());
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
                index + 1 <= rate
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
    </div>
  );
}
