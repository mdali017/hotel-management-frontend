import React from "react";
import { Link } from "react-router-dom";
import { BiSolidEdit } from "react-icons/bi";
import { FaEye, FaFileInvoice, FaRegTrashAlt } from "react-icons/fa";

const BookingsTable = ({ 
  currentBooking, 
  search, 
  firstBookingIndex, 
  handlecheckout, 
  handleOpen, 
  setAddonsModalData, 
  setNightStayModalOpen, 
  handleDelete ,
  setSelectedBooking
}) => {
  // Filter bookings based on search term
  const filteredBookings = currentBooking.filter((item) => {
    return (
      search.toLowerCase() === "" ||
      item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.customerNumber?.toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="w-full overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left border border-blue-600">
        <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-800">
          <tr>
            <th scope="col" className="px-4 py-3 text-center">SL</th>
            <th scope="col" className="px-4 py-3 text-center">Rooms</th>
            <th scope="col" className="px-4 py-3 text-center">Guest Name</th>
            <th scope="col" className="px-4 py-3 text-center">Contact</th>
            <th scope="col" className="px-4 py-3 text-center">Paid</th>
            <th scope="col" className="px-4 py-3 text-center">Due</th>
            <th scope="col" className="px-4 py-3 text-center">Status</th>
            <th scope="col" className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <tr 
                key={booking._id}
                className={`border-b ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors duration-200 border border-gray-400`}
              >
                {/* SL Number */}
                <td className="px-4 py-3 text-center font-medium border border-gray-400">
                  {firstBookingIndex + index + 1}
                </td>

                {/* Room Numbers */}
                <td className="px-4 py-3 border border-gray-400 ">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {booking?.roomNumber?.map((item) => (
                      <span
                        key={`room-${item}`}
                        className="px-2 py-1 bg-orange-100 text-orange-700 border border-orange-300 rounded-md text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {booking?.roomsNumber?.map((item) => (
                      <span
                        key={`daylong-${item}`}
                        className="px-2 py-1 bg-green-100 text-green-700 border border-green-300 rounded-md text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Customer Name */}
                <td className="px-4 py-3 text-center font-medium text-gray-700 border border-gray-400">
                  {booking?.customerName}
                </td>

                {/* Customer Number */}
                <td className="px-4 py-3 text-center border border-gray-400">
                  {booking?.customerNumber}
                </td>

                {/* Paid Amount */}
                <td className="px-4 py-3 text-center font-medium text-green-600 border border-gray-400">
                  ৳ {booking?.paidAmount?.toLocaleString()}
                </td>

                {/* Due Amount */}
                <td className="px-4 py-3 text-center font-medium text-red-600 border border-gray-400">
                  {booking?.dueAmount > 0 ? (
                    `৳ ${booking?.dueAmount?.toLocaleString()}`
                  ) : (
                    <span className="text-green-600">Paid</span>
                  )}
                </td>

                {/* Check-In Status */}
                <td className="px-4 py-3 text-center border border-gray-400">
                  <button
                    onClick={() => handlecheckout(booking)}
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      booking?.bookedFrom === "Corporate"
                        ? "bg-orange-200 text-orange-800"
                        : booking?.bookedFrom === "Counter"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {booking?.checkIn}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-3">
                    
                      {/* <button
                        onClick={() => {
                          handleOpen();
                          setAddonsModalData(booking);
                        }}
                        className="text-orange-600 hover:text-orange-800 hover:scale-110 transition-all duration-200"
                        title="Edit Daylong Package"
                      >
                        <BiSolidEdit size={18} />
                      </button> */}
                    
                      <button
                        onClick={() => {
                          setNightStayModalOpen(true);
                          setAddonsModalData(booking);
                          setSelectedBooking(booking);
                        }}
                        className="text-orange-600 hover:text-orange-800 hover:scale-110 transition-all duration-200"
                        title="Edit Night Stay"
                      >
                        <BiSolidEdit size={18} />
                      </button>
                    

                    {/* View Button */}
                    <Link
                      to={`/dashboard/bookings-details`}
                      state={{ data: booking }}
                      title="View Details"
                    >
                      <button className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200">
                        <FaEye size={18} />
                      </button>
                    </Link>

                    {/* Invoice Button */}
                    <Link
                      to={`/dashboard/invoice/${booking._id}`}
                      state={{ data: booking }}
                      title="View Invoice"
                    >
                      <button className="text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-200">
                        <FaFileInvoice size={18} />
                      </button>
                    </Link>

                    {/* Delete Button */}
                    {/* <button
                      onClick={() => handleDelete(booking._id)}
                      className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                      title="Delete Booking"
                    >
                      <FaRegTrashAlt size={18} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg 
                    className="w-12 h-12 text-gray-400 mb-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xl font-semibold text-gray-500">No bookings found</p>
                  <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;