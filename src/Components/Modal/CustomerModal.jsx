import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

import { addDays, format } from "date-fns";
import Swal from "sweetalert2";
import Axios from "axios";
import { FetchUrls } from "../Common/FetchUrls";
import { Link } from "react-router-dom";
import { useAddPaymentMutation } from "../../redux/baseApi/baseApi";

const CustomerModal = ({
  openCustomerDetails,
  setCustomerDetailsOpen,
  customerInfo,
  openBackDrop = false,
  refetch,
}) => {
  // State to manage payment dialog
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  // State to store selected booking for payment
  const [selectedBooking, setSelectedBooking] = useState(null);
  // State for new payment details
  const [newPayment, setNewPayment] = useState({
    paymentmethod: "Cash",
    payNumber: "",
    paymentDate: format(new Date(), "yyyy-MM-dd"),
    amount: "",
  });

  const [addPayment] = useAddPaymentMutation();

  const handleinvoice = async (data) => {
    try {
      await Axios.get(
        FetchUrls(`bookings/datebookings?date=${data.date}`)
      ).then((res) => {
        const databydate = res.data;
        navigate(`/dashboard/bookings/${data?.date}`, {
          state: { data: databydate },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure To Delete?",
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
                refetch();
                Swal.fire({
                  title: "Deleted!",
                  text: res?.data?.message || "Booking Deleted Successfully!",
                  icon: "success",
                });
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  // Handle new payment form changes
  const handleNewPaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // Open payment dialog for a specific booking
  const handleOpenPaymentDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenPaymentDialog(true);
  };

  // Add new payment
  // Add new payment
  // Add new payment
  // Add new payment
  const handleAddPayment = async () => {
    // Validate payment amount
    if (!newPayment.amount || Number(newPayment.amount) <= 0) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid payment amount.",
        icon: "error",
      });
      return;
    }

    try {
      // Create payment object
      const paymentData = {
        bookingId: selectedBooking.bookingId,
        payment: {
          paymentmethod: newPayment.paymentmethod,
          payNumber: newPayment.payNumber,
          paymentDate: newPayment.paymentDate,
          amount: Number(newPayment.amount),
        },
      };

      // Make API call to add payment using RTK Query mutation
      const response = await addPayment({
        id: selectedBooking._id,
        data: paymentData,
      }).unwrap();

      // Log the entire response for debugging
      console.log("Payment response:", response);

      // Check if the response has data with a success status
      if (response?.data?.updatedAt) {
        Swal.fire({
          title: "Success!",
          text: response.data.message || "Payment added successfully!",
          icon: "success",
        });

        // Reset new payment form
        setNewPayment({
          paymentmethod: "Cash",
          payNumber: "",
          paymentDate: format(new Date(), "yyyy-MM-dd"),
          amount: "",
        });

        // Close payment dialog
        setOpenPaymentDialog(false);
        setCustomerDetailsOpen(false);

        // Refetch data to update the UI
        refetch && refetch();
      } else {
        // Handle unsuccessful response
        throw new Error(response.data?.message || "Failed to add payment");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to add payment. Please try again.",
        icon: "error",
      });
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "PP");
    } catch (error) {
      console.log("Date formatting error:", error);
      return dateString;
    }
  };

  const renderBookingDetails = (item) => {
    // Common action buttons for all booking types
    const actionButtons = (
      <div className="flex gap-2">
        <Link to={`/dashboard/invoice/${item?._id}`} state={{ data: item }}>
          <button className="px-4 py-1 mx-1 bg-blue-600 text-white hover:bg-blue-800 rounded-full transition-colors duration-200">
            Invoice
          </button>
        </Link>
        <Link to={"/dashboard/update-booking"} state={{ data: item }}>
          <button
            className="px-4 py-1 bg-green-600 text-white hover:bg-green-800 rounded-full transition-colors duration-200"
            title="Edit Details"
          >
            Update
          </button>
        </Link>
        {item?.dueAmount !== 0 && (
          <button
            onClick={() => handleOpenPaymentDialog(item)}
            className="px-4 py-1 bg-amber-600 text-white hover:bg-amber-800 rounded-full transition-colors duration-200"
            title="Add Payment"
          >
            Payment
          </button>
        )}
      </div>
    );

    // Common booking details
    return (
      <div className="border p-2 rounded-lg text-black text-sm">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg uppercase">
            {item?.customerTitle} {item?.customerName}
          </p>
          <div className="flex items-center py-2">{actionButtons}</div>
        </div>
        <div>
          Advance <span>{item?.paidAmount} Taka</span> ({" "}
          <span>{formatDate(item?.firstDate)}</span> -{" "}
          <span>{formatDate(item?.lastDate)}</span>)
        </div>
        <p>Due Amount - {item?.dueAmount}</p>
        <p>Phone No - {item?.customerNumber}</p>
        {/* <p>Booked From - {item?.bookedFrom}</p> */}

        {/* Show room details if available */}
        {/* {item?.roomNumber && item?.roomNumber.length > 0 && (
          <>
            <p>Room Type - {item?.bookingroom?.join(", ")}</p>
            <p>
              Room {item?.roomNumber?.length === 1 ? "Number" : "Numbers"} - {item?.roomNumber.join(", ")}
            </p>
          </>
        )} */}

        {/* Show number of people if available */}
        {item?.person && <p>Number of Persons - {item?.person}</p>}

        {/* Show check-in status if available */}
        {item?.checkIn && <p>Status - {item?.checkIn}</p>}
      </div>
    );
  };

  return (
    <div>
      <Dialog
        open={openCustomerDetails}
        onClose={() => setCustomerDetailsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        {customerInfo?.length > 0 ? (
          <>
            <DialogTitle
              id="alert-dialog-title"
              color={"primary"}
              className="grid grid-cols-2"
            >
              {"Guest's Information"}{" "}
            </DialogTitle>
            <DialogContent>
              <button
                className="text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
                onClick={() => {
                  setCustomerDetailsOpen(false);
                }}
              >
                X
              </button>
              <DialogContentText id="alert-dialog-description">
                {openBackDrop ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress />
                  </div>
                ) : (
                  <>
                    {customerInfo.map((item, index) => (
                      <React.Fragment key={index}>
                        {renderBookingDetails(item)}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </DialogContentText>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogContent>
              <button
                className="text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
                onClick={() => {
                  setCustomerDetailsOpen(false);
                }}
              >
                X
              </button>
              <DialogContentText id="alert-dialog-description">
                {openBackDrop ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress />
                  </div>
                ) : (
                  <h1 className="p-5">No booking information available.</h1>
                )}
              </DialogContentText>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        aria-labelledby="payment-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="payment-dialog-title">Add New Payment</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <div className="p-2">
              <div className="mb-4 bg-gray-100 p-3 rounded">
                <p className="font-bold text-lg mb-2">
                  {selectedBooking.customerName}
                </p>
                <p>
                  Total Amount:{" "}
                  <span className="font-semibold">
                    {selectedBooking.beforeDiscountCost || 0} Taka
                  </span>
                </p>
                <p>
                  Paid Amount:{" "}
                  <span className="font-semibold">
                    {selectedBooking.paidAmount || 0} Taka
                  </span>
                </p>
                <p>
                  Due Amount:{" "}
                  <span className="font-semibold text-red-600">
                    {selectedBooking.dueAmount || 0} Taka
                  </span>
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={newPayment.paymentDate}
                    onChange={handleNewPaymentChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Payment Method
                  </label>
                  <select
                    name="paymentmethod"
                    value={newPayment.paymentmethod}
                    onChange={handleNewPaymentChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Mobile Banking">Mobile Banking</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                {newPayment.paymentmethod !== "Cash" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      name="payNumber"
                      value={newPayment.payNumber}
                      onChange={handleNewPaymentChange}
                      placeholder={`${newPayment.paymentmethod} Number`}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={newPayment.amount}
                    onChange={handleNewPaymentChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max={selectedBooking.dueAmount}
                    required
                  />
                  {newPayment.amount > selectedBooking.dueAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      Amount cannot be greater than due amount.
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setOpenPaymentDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    disabled={
                      !newPayment.amount ||
                      Number(newPayment.amount) <= 0 ||
                      Number(newPayment.amount) > selectedBooking.dueAmount
                    }
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      !newPayment.amount ||
                      Number(newPayment.amount) <= 0 ||
                      Number(newPayment.amount) > selectedBooking.dueAmount
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerModal;
