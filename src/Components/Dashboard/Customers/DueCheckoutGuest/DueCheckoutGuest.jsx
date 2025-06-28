import React, { useState } from "react";
import { useGetDueCheckoutCustomerQuery } from "../../../../redux/baseApi/baseApi";
import { Link } from "react-router-dom";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
// import DuePaymentModal from "../../Modal/DuePaymentModal/DuePaymentModal";
import { useAddPaymentMutation } from "../../../../redux/baseApi/baseApi";
import DuePaymentModal from "../../../Modal/DuePaymentModal/DuePaymentModal";
import DuePaymentFromCustomerModal from "../../../Modal/DuePaymentModal/DuePaymentFromCustomerModal";

const DueCheckoutGuest = () => {
  const {
    data: dueCheckoutCustomers,
    isLoading,
    refetch,
  } = useGetDueCheckoutCustomerQuery();
  const dueGuestCustomerData = dueCheckoutCustomers?.data || [];

  // States for modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [corporateChecked, setCorporateChecked] = useState(false);

  // API mutations
  const [addPayment] = useAddPaymentMutation();

  // Handler for edit button
  const handleEditClick = (guest) => {
    setModalData(guest);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Due Checkout Guests{" "}
            <span className="text-blue-600">
              ({dueGuestCustomerData?.length || 0})
            </span>
          </h1>
        </div>
      </div>

      {/* Due Checkout Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="w-full overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left border border-blue-600">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-center">
                  SL
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Rooms
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Guest Name
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Contact
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Booking Date
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Due Amount
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dueGuestCustomerData.length > 0 ? (
                dueGuestCustomerData.map((guest, index) => (
                  <tr
                    key={guest._id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200 border border-gray-400`}
                  >
                    {/* SL Number */}
                    <td className="px-4 py-3 text-center font-medium border border-gray-400">
                      {index + 1}
                    </td>

                    {/* Room Numbers */}
                    <td className="px-4 py-3 border border-gray-400">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {guest?.roomNumber?.map((item) => (
                          <span
                            key={`room-${item}`}
                            className="px-2 py-1 bg-orange-100 text-orange-700 border border-orange-300 rounded-md text-xs font-medium"
                          >
                            {item}
                          </span>
                        ))}
                        {guest?.roomsNumber?.map((item) => (
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
                      {guest?.customerName}
                    </td>

                    {/* Customer Number */}
                    <td className="px-4 py-3 text-center border border-gray-400">
                      {guest?.customerNumber}
                    </td>

                    {/* Booking Date */}
                    <td className="px-4 py-3 text-center border border-gray-400">
                      {guest?.bookingDate}
                    </td>

                    {/* Due Amount */}
                    <td className="px-4 py-3 text-center font-medium text-red-600 border border-gray-400">
                      ৳ {guest?.dueAmount?.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center border border-gray-400">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          guest?.isCorporate
                            ? "bg-orange-200 text-orange-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {guest?.checkIn}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-3">
                        {/* DuePaymentModal Button */}
                        <button
                          onClick={() => handleEditClick(guest)}
                          className="text-orange-600 hover:text-orange-800 hover:scale-110 transition-all duration-200"
                          title="Process Payment"
                        >
                          <BiSolidEdit size={18} />
                        </button>

                        {/* View Button */}
                        <Link
                          to={`/dashboard/bookings-details`}
                          state={{ data: guest }}
                          title="View Details"
                        >
                          <button className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200">
                            <FaEye size={18} />
                          </button>
                        </Link>

                        {/* Invoice Button */}
                        <Link
                          to={`/dashboard/invoice/${guest._id}`}
                          state={{ data: guest }}
                          title="View Invoice"
                        >
                          <button className="text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-200">
                            <FaFileInvoice size={18} />
                          </button>
                        </Link>
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
                      <p className="text-xl font-semibold text-gray-500">
                        No due checkout guests found
                      </p>
                      <p className="text-gray-400 mt-1">
                        There are currently no corporate guests with due amounts
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <DuePaymentFromCustomerModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        modaldata={modalData}
        updateAndAddPayment={null} // Adjust this as needed for your implementation
        refetch={refetch}
        setCorporateChecked={setCorporateChecked}
        corporateChecked={corporateChecked}
      />
    </div>
  );
};

export default DueCheckoutGuest;
