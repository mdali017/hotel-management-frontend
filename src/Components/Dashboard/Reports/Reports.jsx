import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { CalendarIcon, PrinterIcon, FileTextIcon } from "lucide-react";
import { useGetDateRangeReportQuery } from "../../../redux/baseApi/baseApi";

const Reports = () => {
  const { register, handleSubmit } = useForm();
  const componentRef = useRef();
  const [dateParams, setDateParams] = useState({ startDate: "", endDate: "" });

  // Using the API query with the date parameters
  const { data: reportData, isLoading } = useGetDateRangeReportQuery(dateParams, {
    skip: !dateParams.startDate || !dateParams.endDate,
  });

  // Extract required data from the API response - fixing the nested data structure
  const reportDataContent = reportData?.data || {};
  const dateRange = reportDataContent.dateRange || {};
  const summary = reportDataContent.summary || {};
  const customers = reportDataContent.customers || [];
  const dueCustomers = reportDataContent.dueCustomers || [];
  
  // Calculate totals
  const totalPaid = summary?.paymentSummary?.totalAmount || 0;
  const totalDue = summary?.totalDueAmount || 0;

  // All customers for display in the table (combine regular and due customers)
  const allCustomers = [...customers, ...dueCustomers];

  const handleReportSubmit = (data) => {
    setDateParams({
      startDate: data.firstdate,
      endDate: data.lastdate
    });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "hotel-orion-report",
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              <FileTextIcon
                className="inline-block mr-2 text-primary"
                size={28}
              />
              All Reports
            </h1>
            <div className="text-sm text-gray-500">
              Generate detailed revenue reports for any date range
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="bg-gray-50 rounded-lg p-5 mb-8">
            <form
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
              onSubmit={handleSubmit(handleReportSubmit)}
            >
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <div className="relative">
                  <input
                    {...register("firstdate", { required: true })}
                    type="date"
                    className="w-full rounded-lg border-2 border-gray-300 bg-white py-2 pl-3 pr-10 font-medium outline-none transition focus:border-primary"
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <div className="relative">
                  <input
                    {...register("lastdate", { required: true })}
                    type="date"
                    className="w-full rounded-lg border-2 border-gray-300 bg-white py-2 pl-3 pr-10 font-medium outline-none transition focus:border-primary"
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="col-span-1">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center rounded-lg bg-primary p-2.5 font-semibold text-white hover:bg-primary/90 transition"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>

          {/* Reports Display */}
          {reportData && allCustomers.length > 0 ? (
            <div className="bg-white rounded-lg border-2 border-gray-100">
              {/* Report Header and Print Button */}
              <div className="flex justify-between items-center p-4 border-b-2 border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  Revenue Report Results
                </h2>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <PrinterIcon size={18} />
                  Print Report
                </button>
              </div>

              {/* Printable Report Content */}
              <div ref={componentRef} className="p-6">
                {/* Hotel Info Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    HOTEL MANAGEMENT
                  </h1>
                  <p className="text-gray-600">Rail Road, 7400, Jessore</p>
                  <p className="text-gray-600">Jessore, Bangladesh</p>
                  <p className="text-gray-600">
                    +8801981-333444, +8801981-333444
                  </p>
                  <h2 className="mt-4 text-xl font-semibold">Revenue Report</h2>
                  <p className="text-sm text-gray-500">
                    {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
                  </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                    <p className="text-gray-600 mb-1">Total Income</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalPaid.toLocaleString()} Taka
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
                    <p className="text-gray-600 mb-1">Total Due</p>
                    <p className="text-2xl font-bold text-red-600">
                      {totalDue.toLocaleString()} Taka
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                    <p className="text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {summary.totalBookings || 0}
                    </p>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Total Customers</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {summary.totalCustomers || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Cash Payment</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {(summary.paymentSummary?.cashAmount || 0).toLocaleString()} Taka
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Card Payment</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {(summary.paymentSummary?.creditCardAmount || 0).toLocaleString()} Taka
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Due Customers</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {summary.totalDueCustomers || 0}
                    </p>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Booking ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Guest's Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Booked From
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Room No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Paid Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Due Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {allCustomers.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item?.bookingId}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item?.lastDate}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {item?.customerName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item?.customerNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item?.bookedFrom === "Counter"
                              ? "Night Stay"
                              : item?.bookedFrom === "Daylong Package"
                              ? "Daylong Package"
                              : item?.bookedFrom || ""}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {Array.isArray(item?.roomNumber) 
                              ? item.roomNumber.join(", ") 
                              : item?.roomNumber || ""}
                          </td>
                          <td className="px-4 py-3 text-sm text-green-600 font-medium">
                            {(item?.paidAmount || 0).toLocaleString()} Taka
                          </td>
                          <td className="px-4 py-3 text-sm text-red-600 font-medium">
                            {(item?.dueAmount || 0).toLocaleString()} Taka
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Room Type Statistics */}
                {summary.roomTypeStats && Object.keys(summary.roomTypeStats).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Room Type Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(summary.roomTypeStats).map(([roomType, count]) => (
                        <div key={roomType} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 mb-1 capitalize">{roomType}</p>
                          <p className="text-lg font-semibold text-gray-700">{count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking Trends */}
                {reportDataContent?.trends?.bookingsByDate && Object.keys(reportDataContent.trends.bookingsByDate).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Booking Trends</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Bookings</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {Object.entries(reportDataContent.trends.bookingsByDate).map(([date, data]) => (
                            <tr key={date} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-700">{date}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{data.count}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{data.revenue.toLocaleString()} Taka</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>
                    This is a computer generated report and does not require a
                    signature.
                  </p>
                  <p>Generated on: {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-16 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <FileTextIcon size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No Report Data
              </h3>
              <p className="text-gray-500 max-w-md">
                {isLoading 
                  ? "Loading report data..." 
                  : "Select a date range and generate a report to see revenue details."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Reports;