export default function Pagination({
  total,
  perPage,
  currentPage,
  setCurrentPage,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(total / perPage); i++) pageNumbers.push(i);

  return (
    <nav className="flex items-center justify-center mt-6 mr-20">
      <ul className="flex space-x-4">
        {pageNumbers.map((page) => (
          <li
            key={page}
            className={`${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              } px-4 py-2 rounded`}
          >
            <button onClick={() => setCurrentPage(page)}>{page}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
