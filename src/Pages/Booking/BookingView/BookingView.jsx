import React, { useState, useEffect } from "react";
import invoiceLogo from "../../../assets/orion-invoice-logo.png";
import { useLocation } from "react-router-dom";

const BookingView = () => {
  const location = useLocation();
  const bookingData = location?.state?.data;

  // Initialize selectedTitle from bookingData
  const [selectedTitle, setSelectedTitle] = useState(
    bookingData?.customerTitle || "Mr."
  );

  // Set the title checkbox based on the data from API
  useEffect(() => {
    if (bookingData?.customerTitle) {
      setSelectedTitle(bookingData.customerTitle);
    }
  }, [bookingData]);

  // Format date to display in readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate total nights
  const calculateNights = () => {
    if (bookingData?.firstDate && bookingData?.lastDate) {
      const checkIn = new Date(bookingData.firstDate);
      const checkOut = new Date(bookingData.lastDate);
      return Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  if (!bookingData) {
    return <div className="p-4">Loading booking data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-2xl">
      {/* Header with Card Number */}
      <div className="mb-6 border rounded-md shadow-sm overflow-hidden">
        <div className="flex items-center justify-center p-3 border-b bg-white">
          <h1 className="text-center font-bold text-3xl text-blue-600 uppercase">
            Registration Form
          </h1>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mr"
                  checked={selectedTitle === "Mr."}
                  onChange={() => setSelectedTitle("Mr.")}
                  className="mr-1"
                />
                <label htmlFor="mr" className="text-sm">
                  Mr.
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mrs"
                  checked={selectedTitle === "Mrs."}
                  onChange={() => setSelectedTitle("Mrs.")}
                  className="mr-1"
                />
                <label htmlFor="mrs" className="text-sm">
                  Mrs.
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ms"
                  checked={selectedTitle === "Ms."}
                  onChange={() => setSelectedTitle("Ms.")}
                  className="mr-1"
                />
                <label htmlFor="ms" className="text-sm">
                  Ms.
                </label>
              </div>
            </div>
            <div>
              <h1>CSL: {bookingData?.bookingId}</h1>
            </div>
          </div>

          {/* Guest Information */}
          <div className="mb-4">
            <div className="mb-3">
              <div className="mb-3 flex justify-between">
                <div className="w-2/3 mr-4">
                  <label className="text-sm text-gray-600">
                    Customer Name:
                  </label>
                  <div className="border-b border-gray-400 py-1">
                    {bookingData.customerName}
                  </div>
                </div>
                <div className="w-1/3">
                  <label className="text-sm text-gray-600">
                    Mobile Number:
                  </label>
                  <div className="border-b border-gray-400 py-1">
                    {bookingData.customerNumber}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3 flex">
              <div className="flex-grow mr-4">
                <label className="text-sm text-gray-600">
                  Address/Company Name:
                </label>
                <div className="border-b border-gray-400 py-1">-</div>
              </div>
              <div className="w-1/3">
                <label className="text-sm text-gray-600">RD/P.O:</label>
                <div className="border-b border-gray-400 py-1">-</div>
              </div>
            </div>
            <div className="mb-3 flex justify-between">
              <div className="w-2/3 mr-4">
                <label className="text-sm text-gray-600">Mobile No #:</label>
                <div className="border-b border-gray-400 py-1">
                  {bookingData.customerNumber}
                </div>
              </div>
              <div className="w-1/3">
                <label className="text-sm text-gray-600">PS:</label>
                <div className="border-b border-gray-400 py-1">-</div>
              </div>
            </div>
            <div className="mb-3">
              <label className="text-sm text-gray-600">Email:</label>
              <div className="border-b border-gray-400 py-1">-</div>
            </div>
          </div>

          {/* Profession */}
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-600">Profession:</p>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="service" 
                  checked={bookingData.profession === "Service"}
                  readOnly 
                  className="mr-1" 
                />
                <label htmlFor="service" className="text-sm">
                  Service
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="business"
                  checked={bookingData.profession === "Business"}
                  readOnly
                  className="mr-1"
                />
                <label htmlFor="business" className="text-sm">
                  Business
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="student" 
                  checked={bookingData.profession === "Student"}
                  readOnly 
                  className="mr-1" 
                />
                <label htmlFor="student" className="text-sm">
                  Student
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="others" 
                  checked={bookingData.profession === "Others"}
                  readOnly 
                  className="mr-1" 
                />
                <label htmlFor="others" className="text-sm">
                  Others
                </label>
              </div>
            </div>
          </div>

          {/* Check-in Check-out */}
          <div className="mb-4 flex">
            <div className="w-1/2 mr-4">
              <label className="text-sm text-gray-600">Check in Date:</label>
              <div className="flex">
                <div className="border-b border-gray-400 py-1 flex-grow">
                  {formatDate(bookingData.firstDate)}
                </div>
                <span className="mx-2 text-sm text-gray-600">Time:</span>
                <div className="border-b border-gray-400 py-1 w-20">
                  {bookingData.checkInTime || "12:00"}
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-600">Check out Date:</label>
              <div className="flex">
                <div className="border-b border-gray-400 py-1 flex-grow">
                  {formatDate(bookingData.lastDate)}
                </div>
                <span className="mx-2 text-sm text-gray-600">Time:</span>
                <div className="border-b border-gray-400 py-1 w-20">
                  {bookingData.checkOutTime || "12:00"}
                </div>
              </div>
            </div>
          </div>

          {/* Detail Boxes */}
          <div className="mb-6 flex space-x-2">
            <div className="w-1/5">
              <div className="bg-yellow-300 text-black text-center rounded-t px-2 py-1 text-sm">
                Room(s) #
              </div>
              <div className="border border-gray-300 rounded-b p-3 h-14 flex items-center justify-center">
                <span className="font-semibold">
                  {bookingData.roomNumber.join(", ")}
                </span>
              </div>
            </div>
            <div className="w-1/5">
              <div className="bg-blue-800 text-white text-center rounded-t px-2 py-1 text-sm">
                Person(s) #
              </div>
              <div className="border border-gray-300 rounded-b p-3 h-14 flex items-center justify-center">
                <span className="font-semibold">{bookingData.person}</span>
              </div>
            </div>
            <div className="w-1/5">
              <div className="bg-green-500 text-white text-center rounded-t px-2 py-1 text-sm">
                Room Type
              </div>
              <div className="border border-gray-300 rounded-b p-3 h-14 flex items-center justify-center">
                <span className="font-semibold">
                  {bookingData.bookingroom.join(", ")}
                </span>
              </div>
            </div>
            <div className="w-1/5">
              <div className="bg-purple-600 text-white text-center rounded-t px-2 py-1 text-sm">
                Night(s)
              </div>
              <div className="border border-gray-300 rounded-b p-3 h-14 flex items-center justify-center">
                <span className="font-semibold">{calculateNights()}</span>
              </div>
            </div>
            <div className="w-1/5">
              <div className="bg-red-600 text-white text-center rounded-t px-2 py-1 text-sm">
                Remarks
              </div>
              <div className="border border-gray-300 rounded-b p-3 h-14 flex items-center justify-center text-xs">
                <span>{bookingData.remarks || "-"}</span>
              </div>
            </div>
          </div>

          {/* Check Out Time Notice */}
          <div className="mb-4">
            <div className="bg-green-600 text-white p-2 rounded">
              <p className="font-bold text-center">Check Out Time: {bookingData.checkOutTime || "12:00"}</p>
              <p className="text-xs text-center">
                (Late check out will be charged Accordingly)
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-8">
            <div className="w-1/3">
              <div className="border-t border-gray-400 pt-1 text-center">
                <p className="text-xs text-gray-600">Guest's Signature</p>
              </div>
            </div>
            <div className="w-1/3 text-right">
              <div className="border-t border-gray-400 pt-1 text-center">
                <p className="text-xs text-gray-600">Prepared by</p>
              </div>
            </div>
          </div>

          {/* Colored Bottom Border */}
          <div className="flex h-2 mt-4">
            <div className="w-1/4 bg-red-600"></div>
            <div className="w-1/4 bg-green-600"></div>
            <div className="w-1/4 bg-yellow-400"></div>
            <div className="w-1/4 bg-blue-800"></div>
          </div>
        </div>
      </div>

      {/* Payment Details Card (Additional info not in image but useful) */}
      <div className="mb-6 border rounded-md shadow-sm overflow-hidden">
        <div className="bg-green-600 text-white px-4 py-2">
          <h3 className="font-bold">Payment Details</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Before Discount:</p>
              <p className="font-medium">
                {bookingData.beforeDiscountCost} Taka
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Discount:</p>
              <p className="font-medium">
                {bookingData.discountPercentage}% + {bookingData.discountFlat}{" "}
                Taka
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Paid Amount:</p>
              <p className="font-medium text-green-600">
                {bookingData.paidAmount} Taka
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Due Amount:</p>
              <p className="font-medium text-red-600">
                {bookingData.dueAmount} Taka
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600 text-sm">Payment Method:</p>
            <div className="mt-2">
              {bookingData.payment.map((method, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-2 rounded mb-2 flex justify-between"
                >
                  <span>{method.paymentmethod}</span>
                  {method.payNumber && method.payNumber !== "" && (
                    <span>#{method.payNumber}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => window.print()}
        >
          Print Registration Card
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Edit Booking
        </button>
      </div>
    </div>
  );
};

export default BookingView;