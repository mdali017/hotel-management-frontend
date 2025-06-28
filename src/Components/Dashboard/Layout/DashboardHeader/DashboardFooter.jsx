import React, { useState } from "react";
import CreateComplaintRoom from "../../../Modal/ComplaintRoomModal/CreateComplaintRoom";
// import CreateComplaintRoom from "./CreateComplaintRoom"; // Adjust the import path as needed

const DashboardFooter = ({ updatedRoomColorStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleComplaintSubmit = (complaintData) => {
    console.log("Complaint submitted:", complaintData);
    // Handle the complaint submission here
    // You can add your API call or state update logic
    // Example:
    // submitComplaint(complaintData).then(() => {
    //   // Update your room status or show success message
    // });
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mt-5 ">
        <p>
          <span className="text-lg text-gray-500 font-semibold">
            Total Guests(Person):
          </span>{" "}
          <span className="text-xl font-bold">
            {updatedRoomColorStatus?.totalGuest}
          </span>
        </p>
        <h1>
          <span className="text-lg text-gray-500 font-semibold">
            Need To Clean:{" "}
          </span>
          <span className="text-xl font-bold">
            {updatedRoomColorStatus?.housekeepingRooms?.length}
          </span>
        </h1>
        <h1>
          <span className="text-lg text-gray-500 font-semibold">
            Complaint Rooms:{" "}
          </span>
          <span className="text-xl font-bold">
            {updatedRoomColorStatus?.complaintRooms?.length}
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-xl font-bold mx-3 text-blue-600 hover:text-blue-800 transition-colors"
            title="Add Complaint Room"
          >
            +
          </button>
        </h1>
      </div>
      <div className="flex justify-between items-center  mb-5">
        {/* Color Guidline */}
        <div className="flex justify-between w-full gap-2 mt-5 mb-5">
          <div className="flex gap-2  mb-5">
            <div className="w-[20px] h-[20px] bg-green-700"></div>
            <span className="text-sm font-semibold">New Guests</span>
          </div>
          <div className="flex gap-2 mb-5">
            <div className="w-[20px] h-[20px] bg-blue-700"></div>
            <span className="text-sm font-semibold">Previous Guests</span>
          </div>
          <div className="flex gap-2 mb-5">
            <div className="w-[20px] h-[20px] bg-red-700"></div>
            <span className="text-sm font-semibold">Checked Out Guests</span>
          </div>
          <div className="flex gap-2 mb-5">
            <div className="w-[20px] h-[20px] bg-gradient-to-r from-amber-500 to-red-600"></div>
            <span className="text-sm font-semibold">Late Out Guests</span>
          </div>
          <div className="flex gap-2 mb-5">
            <div className="w-[20px] h-[20px] bg-yellow-400"></div>
            <span className="text-sm font-semibold">Arrival Guests</span>
          </div>
          <div className="flex gap-2 mb-5">
            <div className="w-[20px] h-[20px] housekeeping-animated"></div>
            <span className="text-sm font-semibold">Housekeeping Rooms</span>
          </div>
          <div className="flex gap-2 mb-5">
            <div className="w-[20px] h-[20px] bg-black"></div>
            <span className="text-sm font-semibold">Complaint Rooms</span>
          </div>
        </div>
      </div>

      {/* Complaint Room Modal */}
      <CreateComplaintRoom 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleComplaintSubmit}
      />
    </div>
  );
};

export default DashboardFooter;