import React, { useState } from "react";
import { 
  useGetTodayCheckOutCustomerQuery,
  useUpdateAndAddPaymentMutation,
  useAddHousekeepingMutation 
} from "../../../../redux/baseApi/baseApi";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileInvoice,
  FaRegTrashAlt,
  FaEye
} from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Axios from "axios";
import { FetchUrls } from "../../../Common/FetchUrls";
import DuePaymentModal from "../../../Modal/DuePaymentModal/DuePaymentModal";
import NightStayAddons from "../../Bookings/NightStayAddons";
// import NightStayAddons from "../NightStayAddons";

const TodayCheckoutCustomers = () => {
  const { data: todayCheckoutCustomer, isLoading, refetch } =
    useGetTodayCheckOutCustomerQuery();
  const todayCheckoutCustomerData = todayCheckoutCustomer?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [nightStayModalOpen, setNightStayModalOpen] = useState(false);
  const [addonsModalData, setAddonsModalData] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modaldata, setmodalData] = useState(null);
  const [corporateChecked, setCorporateChecked] = useState(false);

  // API mutations
  const [addHousekeeping] = useAddHousekeepingMutation();
  const [updateAndAddPayment] = useUpdateAndAddPaymentMutation();

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort the data
  const sortedData = React.useMemo(() => {
    let sortableItems = [...(todayCheckoutCustomerData || [])];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle arrays for room numbers
        if (Array.isArray(aValue)) aValue = aValue.join(", ");
        if (Array.isArray(bValue)) bValue = bValue.join(", ");

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [todayCheckoutCustomerData, sortConfig]);

  // Filter the data based on search term
  const filteredData = sortedData.filter((customer) => {
    return (
      customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNumber?.toString().includes(searchTerm) ||
      (customer.roomNumber && customer.roomNumber.join(", ").includes(searchTerm))
    );
  });

  // Get sort icon
  const getSortIcon = (name) => {
    if (sortConfig.key !== name) {
      return <FaSort className="inline ml-1 text-gray-400" />;
    }
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="inline ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="inline ml-1 text-blue-500" />
    );
  };

  // Handle checkout function
  const handlecheckout = async (booking) => {
    if (booking.dueAmount > 0) {
      // If there's a due amount, show the payment modal
      setShowModal(true);
      setmodalData(booking);
    } else {
      Swal.fire({
        title: "Are you sure you want to check out?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, check out",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await Axios.put(
              FetchUrls(`bookings/updatebooking/${booking?._id}`)
            );
            if (response.status === 200) {
              // housekeeping data
              const housekeepingData = {
                roomName: booking?.roomNumber[0],
                isCleaning: true,
              };

              await addHousekeeping(housekeepingData);

              Swal.fire({
                text: response?.data?.message || "Booking Checked Out Successfully!",
                icon: "success",
              }).then(() => {
                refetch();
              });
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to check out",
            });
          }
        }
      });
    }
  };

  // Delete function
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Axios.delete(FetchUrls(`bookings/deletebooking/${id}`)).then(
            (res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: "Deleted!",
                  text: res?.data?.message || "Booking Deleted Successfully!",
                  icon: "success",
                }).then(() => {
                  refetch();
                });
              }
            }
          );
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete booking",
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 ml-5">
          Today's Checkout Guests ({filteredData.length})
        </h1>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search by name, phone or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {todayCheckoutCustomerData.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-500 text-lg">
            No customers have checked out today.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-blue-600 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("customerName")}
                >
                  Customer Name {getSortIcon("customerName")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("customerNumber")}
                >
                  Phone {getSortIcon("customerNumber")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Room & Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("firstDate")}
                >
                  Stay Period {getSortIcon("firstDate")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("paidAmount")}
                >
                  Amount {getSortIcon("paidAmount")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((customer, index) => (
                <tr
                  key={customer._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {customer.customerName}
                    </div>
                    {customer.discountFlat > 0 && (
                      <div className="text-xs text-red-500">
                        Discount: {customer.discountFlat} Taka
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.customerNumber || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {customer.roomNumber && customer.roomNumber.map((room) => (
                        <span
                          key={`room-${room}`}
                          className="px-2 py-1 bg-orange-100 text-orange-700 border border-orange-300 rounded-md text-xs font-medium"
                        >
                          {room}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {customer.bookingroom && customer.bookingroom.join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.firstDate} - {customer.lastDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-green-600">
                      ৳ {customer.paidAmount?.toLocaleString()}
                    </div>
                    {customer.dueAmount > 0 && (
                      <div className="text-xs text-red-600">
                        Due: ৳ {customer.dueAmount?.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handlecheckout(customer)}
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        customer?.bookedFrom === "Corporate"
                          ? "bg-orange-200 text-orange-800"
                          : customer?.bookedFrom === "Counter"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {customer?.checkIn}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setNightStayModalOpen(true);
                          setAddonsModalData(customer);
                          setSelectedBooking(customer);
                        }}
                        className="text-orange-600 hover:text-orange-800 hover:scale-110 transition-all duration-200"
                        title="Edit Night Stay"
                      >
                        <BiSolidEdit size={18} />
                      </button>

                      {/* View Button */}
                      <Link
                        to={`/dashboard/bookings-details`}
                        state={{ data: customer }}
                        title="View Details"
                      >
                        <button className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200">
                          <FaEye size={18} />
                        </button>
                      </Link>

                      {/* Invoice Button */}
                      <Link
                        to={`/dashboard/invoice/${customer._id}`}
                        state={{ data: customer }}
                        title="View Invoice"
                      >
                        <button className="text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-200">
                          <FaFileInvoice size={18} />
                        </button>
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                        title="Delete Booking"
                      >
                        <FaRegTrashAlt size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      <DuePaymentModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        modaldata={modaldata}
        updateAndAddPayment={updateAndAddPayment}
        refetch={refetch}
        setCorporateChecked={setCorporateChecked}
        corporateChecked={corporateChecked}
      />

      {/* Night Stay Addons Modal */}
      <NightStayAddons
        setNightStayModalOpen={setNightStayModalOpen}
        nightStayModalOpen={nightStayModalOpen}
        id={addonsModalData?._id}
        selectedBooking={selectedBooking}
        refetch={refetch}
      />
    </div>
  );
};

export default TodayCheckoutCustomers;