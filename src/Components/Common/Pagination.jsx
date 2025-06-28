import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({ totalItems, setCurrentPage, currentPage, bookingPerPage }) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalItems / bookingPerPage); i++) {
    pages.push(i);
  }

  return (
    <div>
      <div className="my-10 flex justify-end gap-2">
        <button
          className={`border px-4 rounded py-2 ${
            currentPage === 1 || !totalItems ? "text-gray-600" : ""
          }`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || !totalItems}
        >
          <FaArrowLeft />
        </button>
        {pages.map((page, index) => {
          return (
            <button
              className={`${
                page === currentPage ? "text-white bg-green-700" : ""
              } border px-4 rounded py-[4px]`}
              onClick={() => setCurrentPage(page)}
              key={index}
            >
              {page}
            </button>
          );
        })}
        <button
          className={`border px-4 rounded py-2 ${
            currentPage === Math.ceil(totalItems / bookingPerPage) || !totalItems
              ? "text-gray-600"
              : ""
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalItems / bookingPerPage) || !totalItems}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
