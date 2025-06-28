import { useQuery } from "@tanstack/react-query";
import Axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Button from "../Common/Button";
import { FetchUrls } from "../Common/FetchUrls";
import { Loader } from "../Common/Loader";
import SliderBooking from "../SliderBooking/SliderBooking";
import ViewAllModal from "../ViewAllModal/ViewAllModal";
// import BookingDialog from "../BookingDialog/BookingDialog"; // Import the new Material UI dialog
import roomTypesArray from "./Data";
import DayLongBooking from "./DayLongBooking";
import { Element } from "react-scroll";
import BookingDialog from "./ViewBookingModal/ViewBookingModal";

const ViewBooking = ({ selectedDate }) => {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [selectedAdults, setSelectedAdults] = useState(0);
  const [selectedChildren5To10, setSelectedChildren5To10] = useState(0);
  const [selectedChildren0To5, setSelectedChildren0To5] = useState(0);
  const [showViewAllPopup, setShowViewAllPopup] = useState(false);
  const [selectedViewAllIndex, setSelectedViewAllIndex] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState();
  // New state for controlling the booking dialog
  const [openBookingDialog, setOpenBookingDialog] = useState(false);

  const { data: bookingApiData = [], isLoading } = useQuery({
    queryKey: ["allrooms", selectedDate],
    queryFn: async () => {
      const getdata = await Axios.get(
        FetchUrls(`rooms/allrooms?date=${selectedDate}`)
      );
      return getdata.data.data;
    },
  });

  if (isLoading)
    return (
      <>
        <Loader />
      </>
    );

  const handleViewAllClick = (roomId) => {
    const selectedRoomData = bookingApiData.find((room) => room._id === roomId);
    setSelectedViewAllIndex(
      roomTypesArray.findIndex(
        (type) =>
          type.roomType ===
          bookingApiData.find((room) => room._id === roomId)?.roomname
      )
    );
    setShowViewAllPopup(true);
    setSelectedRoomId(selectedRoomData);
  };

  const handleRoomChange = (e) => {
    setSelectedRooms(parseInt(e.target.value, 10));
  };

  const handleAddRoomsClick = (index) => {
    const roomSelected = bookingApiData.find((room) => room._id === index);
    setSelectedRoomIndex(roomSelected);
    setOpenBookingDialog(true); // Open the dialog when Book Now is clicked
  };

  const handleConfirmClick = () => {
    let totalAdults = 0;
    let totalChildren5To10 = 0;
    let totalChildren0To5 = 0;

    for (let roomIndex = 0; roomIndex < selectedRooms; roomIndex++) {
      const roomAdults = parseInt(
        document.getElementById(`adults_${roomIndex}`).value,
        10
      );
      const roomChildren5To10 = parseInt(
        document.getElementById(`children5To10_${roomIndex}`).value,
        10
      );
      const roomChildren0To5 = parseInt(
        document.getElementById(`children0To5_${roomIndex}`).value,
        10
      );

      totalAdults += roomAdults;
      totalChildren5To10 += roomChildren5To10;
      totalChildren0To5 += roomChildren0To5;
    }

    setSelectedAdults(totalAdults);
    setSelectedChildren5To10(totalChildren5To10);
    setSelectedChildren0To5(totalChildren0To5);
  };

  const closeViewAllModal = () => {
    setShowViewAllPopup(false);
  };

  // Function to close the booking dialog
  const closeBookingDialog = () => {
    setOpenBookingDialog(false);
    setSelectedRoomIndex(null);
  };

  const handleDropdownChange = (e, roomIndex, type) => {
    const value = parseInt(e.target.value, 10);

    switch (type) {
      case "adults":
        setSelectedAdults((prev) => prev + value);
        break;
      case "children5To10":
        setSelectedChildren5To10((prev) => prev + value);
        break;
      case "children0To5":
        setSelectedChildren0To5((prev) => prev + value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newonlinebooking = {
      customerName: e.target.name.value,
      customerEmail: e.target.email.value,
      customerNumber: e.target.number.value,
      roomsNeed: e.target.roomnumber.value,
      roomType: selectedRoomIndex.roomname,
      adults: selectedAdults,
      childrens: selectedChildren5To10 + selectedChildren0To5,
      chekinDate: selectedDate,
    };
    e.target.reset();
    setSelectedRoomIndex(null);
    setOpenBookingDialog(false); // Close dialog after submission

    try {
      Axios.post(
        FetchUrls("onlinebooking/add-onlinebookings"),
        newonlinebooking
      ).then((res) => {
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Thank you for your interest!",
            text: "To confirm the booking, someone will communicate with you.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Booking Failed!",
            text: "Failed to add online booking. Please try again.",
          });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred. Please try again.",
      });
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex p-4">
        <div className="w-full md:w-[70%]">
          {bookingApiData.map((room) => {
            const roomTypeData = roomTypesArray.find(
              (type) => type.roomType === room.roomname
            );
            return (
              <Element
                key={room._id}
                name={roomTypeData?.roomID}
                id={roomTypeData?.roomID}
                className="ring ring-gray-200 rounded-md mb-4"
              >
                {roomTypeData && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 font-sans">
                      <div className="w-full h-full object-cover">
                        <img
                          src={roomTypeData.image}
                          alt="Room Image Preview"
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold text-xl">
                          {room?.roomname}
                        </h2>
                        <p className="text-sm font-medium">
                          Bed type: {room?.bedtype}
                        </p>
                        <p className="text-sm font-medium">
                          Max Room capacity: {room?.maxcapacity}
                        </p>
                        <ul className="text-sm font-normal">
                          {room?.facilities.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="bg-gray-200 p-4 rounded">
                          <p className="font-semibold text-xl">
                            <span>From </span>
                            <span>{`@Tk. ${roomTypeData.roomPackage.cost}++`}</span>
                          </p>
                          <p className="per-day-price">Per Room / Night</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4">
                      {roomTypeData.allImages.map((image, item) => (
                        <div key={item} className="w-[80px] h-[80px] relative">
                          <img
                            className="room-images w-full h-full object-cover"
                            src={image}
                            alt={`room image ${item + 1}`}
                          />
                          {item === roomTypeData.allImages.length - 1 && (
                            <div
                              className="absolute inset-0 bg-gray-700 bg-opacity-40 flex items-center justify-center text-white font-bold cursor-pointer"
                              onClick={() => handleViewAllClick(room._id)}
                            >
                              View All
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 font-sans pb-2">
                      <div className="font-semibold text-xl">
                        Room with Breakfast
                      </div>
                      <div className="text-md font-medium">
                        <ul>
                          <li className="price-small">
                            <span>{`@Tk. ${roomTypeData.roomPackage.cost}++`}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative">
                        {room?.roomnumber?.length === 0 ? (
                          <button
                            className="w-full p-2 my-2 tracking-widest font-semibold text-white bg-red-300 rounded focus:outline-none"
                            disabled
                          >
                            Not Available
                          </button>
                        ) : (
                          <Button
                            text="Book Now"
                            onClick={() => handleAddRoomsClick(room._id)}
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Element>
            );
          })}
          <Element name="dayLongPackage" id="dayLongPackage">
            <DayLongBooking dateSelect={selectedDate} />
          </Element>
        </div>
        <div className="pl-4 pb-4 hidden md:block md:w-[30%]">
          <SliderBooking />
        </div>
      </div>

      {/* View All Modal */}
      {showViewAllPopup && selectedViewAllIndex !== null && (
        <ViewAllModal
          roomTypesArray={roomTypesArray[selectedViewAllIndex]}
          selectedRoomId={selectedRoomId}
          onClose={closeViewAllModal}
          open={showViewAllPopup}
        />
      )}

      {/* Material UI Booking Dialog */}
      {selectedRoomIndex && (
        <BookingDialog
          open={openBookingDialog}
          onClose={closeBookingDialog}
          selectedRoom={selectedRoomIndex}
          selectedRooms={selectedRooms}
          selectedDate={selectedDate}
          handleRoomChange={handleRoomChange}
          handleDropdownChange={handleDropdownChange}
          handleSubmit={handleSubmit}
          handleConfirmClick={handleConfirmClick}
        />
      )}
    </>
  );
};

export default ViewBooking;
