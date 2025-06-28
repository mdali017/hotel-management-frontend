import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaEye,
  FaFilter,
  FaTrash,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { format, isValid, parseISO, isEqual } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FetchUrls } from "../../../Common/FetchUrls";
import Axios from "axios";
import { Link } from "react-router-dom";
import {
  useDeleteBookingRoomByIdMutation,
  useDeleteBookingRoomByRoomNameMutation,
} from "../../../../redux/baseApi/baseApi";

// Safe date formatting function to handle invalid dates
const formatDate = (dateString, formatPattern = "MMM dd, yyyy") => {
  if (!dateString) return "N/A";

  // Try to parse the date string to a Date object
  const date = parseISO(dateString);

  // Check if the resulting Date is valid
  if (!isValid(date)) return "Invalid date";

  // If valid, format the date according to the pattern
  return format(date, formatPattern);
};

const BookingGuestsPage = () => {
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];
  
  const [search, setSearch] = useState(today); // Set default search to today's date
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [guestsPerPage] = useState(10);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(true); // Track if date filter is active

  // RTK Query delete mutation
  const [deleteBookingRoom, { isLoading: isDeleting }] =
    useDeleteBookingRoomByRoomNameMutation();
  const [deleteBookingRoomById] = useDeleteBookingRoomByIdMutation();

  // Fetch all guests data
  const {
    data: guestsData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allguests"],
    queryFn: async () => {
      try {
        const response = await Axios.get(
          FetchUrls("onlinebooking/allonlinebookings")
        );
        return response.data.data;
      } catch (error) {
        console.error("Error fetching guests data:", error);
        return [];
      }
    },
  });

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  // Function to check if a date matches the search date
  const isDateMatch = (dateStr, searchDate) => {
    if (!dateStr || !searchDate || !isFilterActive) return true;
    try {
      const date = new Date(dateStr);
      const searchDateObj = new Date(searchDate);
      
      return (
        date.getFullYear() === searchDateObj.getFullYear() &&
        date.getMonth() === searchDateObj.getMonth() &&
        date.getDate() === searchDateObj.getDate()
      );
    } catch (error) {
      return false;
    }
  };

  // Filter guests based on search date and filter status
  const filteredGuests = guestsData.filter((guest) => {
    // Check if either check-in or check-out date matches the search date
    const matchesDate = isFilterActive && 
      (isDateMatch(guest.chekinDate, search)
      //  || 
      //  isDateMatch(guest.chekoutDate, search)
      );
    
    // If date filter is not active, check other fields
    const matchesSearch = !isFilterActive && (
      guest.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      guest.customerNumber?.toString().includes(search) ||
      (guest.roomNumber && guest.roomNumber.toLowerCase().includes(search.toLowerCase())) ||
      (guest.companyNameAddress && guest.companyNameAddress.toLowerCase().includes(search.toLowerCase()))
    );

    // Safely check dates for status filtering
    const checkoutDate = guest.chekoutDate ? new Date(guest.chekoutDate) : null;
    const isValidCheckoutDate = checkoutDate && isValid(checkoutDate);
    const now = new Date();

    // Apply filters based on selected status
    if (filterStatus === "all") return isFilterActive ? matchesDate : matchesSearch;
    if (filterStatus === "active") {
      return (isFilterActive ? matchesDate : matchesSearch) && isValidCheckoutDate && checkoutDate >= now;
    }
    if (filterStatus === "past") {
      return (isFilterActive ? matchesDate : matchesSearch) && isValidCheckoutDate && checkoutDate < now;
    }
    return isFilterActive ? matchesDate : matchesSearch;
  });

  // Get current guests for pagination
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = filteredGuests.slice(
    indexOfFirstGuest,
    indexOfLastGuest
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle view guest details
  const handleViewGuest = (guest) => {
    setSelectedGuest(guest);
    setIsViewModalOpen(true);
  };

  // Clear date filter and switch to text search
  const clearDateFilter = () => {
    setSearch("");
    setIsFilterActive(false);
  };

  // Switch back to date filter
  const enableDateFilter = () => {
    setSearch(today);
    setIsFilterActive(true);
  };

  // Handle delete guest - Updated to use RTK Query mutation
  const handleDeleteGuest = (guest) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Use the RTK Query mutation instead of direct Axios call
        if (guest.roomNumber) {
          deleteBookingRoom(guest.roomNumber)
            .unwrap()
            .then(() => {
              Swal.fire("Deleted!", "Guest has been deleted.", "success");
              refetch(); // Refetch guests data after deletion
            })
            .catch((error) => {
              console.error("Error deleting guest:", error);
              Swal.fire("Error!", "Failed to delete guest.", "error");
            });
        } else {
          deleteBookingRoomById(guest._id)
            .unwrap()
            .then(() => {
              Swal.fire("Deleted!", "Guest has been deleted.", "success");
              refetch(); // Refetch guests data after deletion
            })
            .catch((error) => {
              console.error("Error deleting guest:", error);
              Swal.fire("Error!", "Failed to delete guest.", "error");
            });
        }
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      {/* Header with search and filters */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            On Arrival Guests ({filteredGuests.length || 0})
          </h1>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            {/* Search input - either date or text based on isFilterActive */}
            <div className="relative">
              {isFilterActive ? (
                <>
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-64 h-10 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    type="date"
                    placeholder="Select date"
                    value={search}
                  />
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <button 
                    onClick={clearDateFilter} 
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    title="Switch to text search"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-64 h-10 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    type="text"
                    placeholder="Search by name, number..."
                    value={search}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <button 
                    onClick={enableDateFilter} 
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    title="Switch to date filter"
                  >
                    <FaCalendarAlt />
                  </button>
                </>
              )}
            </div>

            {/* Filter dropdown */}
            <div className="relative">
              <select
                className="w-full md:w-40 h-10 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Guests</option>
                <option value="active">Current Guests</option>
                <option value="past">Past Guests</option>
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Date filter info */}
        {isFilterActive && (
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <FaCalendarAlt className="mr-2" />
            <span>Showing guests with check-in or check-out on {formatDate(search, "MMM dd, yyyy")}</span>
          </div>
        )}
      </div>

      {/* Guests table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In/Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading guests data...
                  </td>
                </tr>
              ) : currentGuests.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No guests found matching your criteria
                  </td>
                </tr>
              ) : (
                currentGuests?.map((guest, index) => {
                  // Safely determine if the booking is active
                  let isActive = false;
                  try {
                    const checkoutDate = guest.chekoutDate
                      ? new Date(guest.chekoutDate)
                      : null;
                    isActive =
                      isValid(checkoutDate) && checkoutDate >= new Date();
                  } catch (error) {
                    // Keep isActive as false if there's an error
                  }

                  // Highlight row if matching today's date exactly
                  const isCheckInToday = isDateMatch(guest.chekinDate, today);
                  const isCheckOutToday = isDateMatch(guest.chekoutDate, today);
                  const highlightRow = isCheckInToday || isCheckOutToday;

                  return (
                    <tr
                      key={guest._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        highlightRow ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {indexOfFirstGuest + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                              {guest.customerName?.charAt(0).toUpperCase() ||
                                "G"}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {guest.customerName || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {guest.customerNumber || "No contact"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {guest?.roomType?.includes("Deluxe Single/Couple") &&
                          guest?.isSingle === true ? (
                            <span>Deluxe Single</span>
                          ) : guest?.roomType?.includes(
                              "Deluxe Single/Couple"
                            ) && guest?.isSingle === false ? (
                            <span>Deluxe Couple</span>
                          ) : (
                            <span>{guest.roomType || "N/A"}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {guest.roomNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${isCheckInToday ? "font-bold text-green-600" : "text-gray-900"}`}>
                          {formatDate(guest.chekinDate)}
                          {isCheckInToday && " (Today)"}
                        </div>
                        <div className={`text-sm ${isCheckOutToday ? "font-bold text-red-600" : "text-gray-500"}`}>
                          to {formatDate(guest.chekoutDate)}
                          {isCheckOutToday && " (Today)"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {isActive ? "Reception" : "Online"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewGuest(guest)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View details"
                          >
                            <FaEye />
                          </button>
                          <Link
                            to={"/dashboard/add-booking"}
                            state={{ bookingData: guest }}
                          >
                            <button
                              className="text-green-600  hover:text-green-900"
                              title="Edit guest"
                            >
                              <FaEdit />
                            </button>
                          </Link>
                          {/* <button
                            onClick={() => handleDeleteGuest(guest)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isDeleting}
                            title="Delete guest"
                          >
                            <FaTrash />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredGuests.length > guestsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstGuest + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastGuest, filteredGuests.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredGuests.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {Array.from({ length: Math.ceil(filteredGuests.length / guestsPerPage) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-pink-50 border-pink-500 text-pink-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Guest Details Modal */}
      {isViewModalOpen && selectedGuest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Guest Details
                    </h3>
                    <div className="border-t border-gray-200 py-5 space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">Name:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedGuest.customerName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">Contact:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedGuest.customerNumber || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">
                          Room Type:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          <div className="text-sm text-gray-900">
                            {selectedGuest?.roomType?.includes(
                              "Deluxe Single/Couple"
                            ) && selectedGuest?.isSingle === true ? (
                              <span>Deluxe Single</span>
                            ) : selectedGuest?.roomType?.includes(
                                "Deluxe Single/Couple"
                              ) && selectedGuest?.isSingle === false ? (
                              <span>Deluxe Couple</span>
                            ) : (
                              <span>{selectedGuest.roomType || "N/A"}</span>
                            )}
                          </div>
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">
                          Room Number:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedGuest.roomNumber || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">Check-in:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(
                            selectedGuest.chekinDate,
                            "MMMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">
                          Check-out:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(
                            selectedGuest.chekoutDate,
                            "MMMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">
                          Company/Address:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedGuest.companyNameAddress || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">
                          Host Info:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedGuest.hostNameAndNumber || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-gray-500">Payment:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedGuest.paymentMethod === 1
                            ? "Cash"
                            : "Online"}
                          {selectedGuest.advancePayment
                            ? ` (${selectedGuest.advancePayment} BDT advance)`
                            : ""}
                        </span>
                      </div>
                      {selectedGuest.additionalInformation && (
                        <div className="border-b pb-2">
                          <span className="text-sm text-gray-500">
                            Additional Info:
                          </span>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {selectedGuest.additionalInformation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingGuestsPage;