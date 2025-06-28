import React, { useEffect, useState } from "react";
import {
  useCreateGenerateReportMutation,
  useDeleteGenerateReportMutation,
  useGetGenerateReportQuery,
  useGetSingleGenerateReportQuery,
} from "../../../redux/baseApi/baseApi";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FileTextIcon } from "lucide-react";
import { format } from "date-fns";

const GenerateReport = () => {
  const [generatedReportId, setGeneratedReportId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const [createGenerateReport, { isLoading }] =
    useCreateGenerateReportMutation();
  const { data: reportData, refetch } = useGetGenerateReportQuery();
  const [deleteGenerateReport, { isLoading: deleteGenerateReportLoading }] =
    useDeleteGenerateReportMutation();

  const {
    data: specificReportData,
    isLoading: isLoadingSpecific,
    isError: isErrorSpecific,
  } = useGetSingleGenerateReportQuery(generatedReportId, {
    skip: !generatedReportId,
  });

  const generatedReportData = reportData?.data?.at(-1)?.checkoutCustomers;

  const getCurrentDateTime = () => {
    const now = new Date();

    // Format date as YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Format time in 12-hour format with AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return { formattedDate, formattedTime, timestamp: now.toISOString() };
  };

  const handleGenerateReport = async () => {
    const { formattedDate, formattedTime, timestamp } = getCurrentDateTime();

    try {
      // Check if a report already exists for today
      const hasReportToday = reportData?.data?.some(
        (report) => report.currentDate === formattedDate
      );

      // If no report exists, create a new one
      const response = await createGenerateReport({
        currentTime: formattedTime,
        currentDate: formattedDate,
        timestamp: timestamp,
      }).unwrap();

      if (response.success) {
        await Swal.fire({
          title: "Success!",
          text: response.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        refetch();
      }
    } catch (error) {
      await Swal.fire({
        title: "No New Checkout Guest Since Last Report Genaration !!!",
        // text: error.data?.message || "Failed to generate report",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteReport = async (data) => {
    // console.log(data);
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this report!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteGenerateReport(data?._id).unwrap();
          if (response.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Your Report Deleted Successfully !!!",
              icon: "success",
            });
          }
          refetch();
        }
      });
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: error.data?.message || "Failed to delete report",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    if (generatedReportId && specificReportData && !isNavigating) {
      setIsNavigating(true);
      navigate("/dashboard/checkout-report", {
        state: {
          reportData: specificReportData.data,
          time: specificReportData.data.currentTime,
          date: specificReportData.data.currentDate,
        },
      });
    }
  }, [specificReportData, generatedReportId, navigate, isNavigating]);

  const handlePrint = (report) => {
    if (!isNavigating) {
      setGeneratedReportId(report._id);
    }
  };

  return (
    <div className="p-4 container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold mt-9 text-gray-800">
          <FileTextIcon className="inline-block mr-2 text-primary " size={28} />
          Generate Reports ({format(new Date(), "dd-MM-yyyy")})
        </h1>
        <div className="text-sm text-gray-500"></div>
      </div>

      <div className="flex justify-end w-full mb-4">
        <button
          className="border px-5 py-2 bg-primary text-black rounded disabled:opacity-50"
          onClick={handleGenerateReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">SL</th>
              <th className="py-2 px-4 border-b">Time</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {reportData?.data?.map((report, index) => (
              <tr key={report._id || index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b text-center">
                  {report.currentTime}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {report.currentDate}
                </td>
                <td className="py-2 px-4 border-b text-center  gap-4">
                  {/* <Link
                    to="/dashboard/checkout-report"
                    state={{ reportData: generatedReportData }}
                  >
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                      View
                    </button>
                  </Link> */}
                  <button
                    onClick={() => handlePrint(report)}
                    className="bg-green-500 text-white px-3 py-1 mr-4 rounded hover:bg-green-600"
                  >
                    View & Print
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {reportData?.data?.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No reports generated yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenerateReport;
