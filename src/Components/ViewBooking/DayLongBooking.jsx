import Axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import dayLongPackage from "../../assets/Booking/dayLong1.jpg";
import Button from "../Common/Button";
import { FetchUrls } from "../Common/FetchUrls";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import dayLong1 from "../../assets/Booking/dayLong1.jpg";
import dayLong2 from "../../assets/Booking/dayLong2.jpg";
import dayLong3 from "../../assets/Booking/dayLong3.jpg";
import dayLong4 from "../../assets/Booking/dayLong4.jpg";
import dayLong5 from "../../assets/Booking/dayLong5.jpg";
import dayLong6 from "../../assets/Booking/dayLong6.jpg";


const dayLongImages = [dayLong1, dayLong2, dayLong3, dayLong4, dayLong5, dayLong6];

const DayLongBooking = ({ dateSelect }) => {
  const [viewForm, setViewForm] = useState(false);
  const [viewAllDetails, setViewAllDetails] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newonlinebooking = {
      customerName: e.target.name.value,
      customerEmail: e.target.email.value,
      customerNumber: e.target.number.value,
      roomsNeed: e.target.roomNumber.value,
      roomType: "Day Long Package",
      adults: e.target.adults.value,
      childrens: e.target.child4to11.value + e.target.child0to3.value,
      chekinDate: dateSelect,
    };
    e.target.reset();
    setViewForm(false);
    try {
      Axios.post(FetchUrls("onlinebooking/add-onlinebookings"), newonlinebooking).then((res) => {
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
      
        <div className="ring ring-gray-200 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 font-sans">
            <div className="w-full h-full object-cover">
              <img src={dayLongPackage} alt="Day long preview" />
            </div>
            <div>
              <h2 className="font-semibold text-xl">Day Long Package</h2>
              <p className="font-medium text-md">𝗙𝗮𝗰𝗶𝗹𝗶𝘁𝗶𝗲𝘀: </p>
              <ul className="text-sm font-normal">
                <li>Breakfast</li>
                <li>Lunch</li>
                <li>Evening Snacks</li>
                <li>Swimming</li>
                <li>Boating</li>
                <li>Kids zone</li>
                <li>Sports Indoor/Outdoor</li>
              </ul>
            </div>
            <div>
              <div className="bg-gray-200 p-4 rounded">
                <p className="font-semibold text-xl">
                  <span>From </span>
                  <span>@Tk. 2200++</span>
                </p>
                <p className="per-day-price">Per person</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 font-sans pb-2">
            <div className="col-span-2">
              <div className="flex gap-4">
                      {dayLongImages.slice(0,3).map((image, item) => (
                        <div key={item} className="w-[80px] h-[80px] relative">
                          <img
                            className="room-images w-full h-full object-cover"
                            src={image}
                            alt={`room image ${item + 1}`}
                          />
                          {item === dayLongImages.length - 4 && (
                            <div
                              className="absolute inset-0 bg-gray-700 bg-opacity-40 flex items-center justify-center text-white font-bold cursor-pointer"
                              onClick={() => setViewAllDetails(true)}
                            >
                              View All
                            </div>
                          )}
                        </div>
                      ))}
              </div>
            </div>
            {/* <div></div> */}
            <div className="relative">
              <Button text="Book Now" onClick={() => setViewForm(true)} />
              {viewForm && (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="absolute -top-[635px] lg:-top-[440px] right-10 md:right-0 left-10 md:-left-48 bg-gray-300 p-4 z-50">
                      <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
                        placeholder="Enter your name"
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
                        placeholder="Enter your email"
                      />
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Phone Number
                      </label>
                      <input
                        type="number"
                        name="number"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
                        placeholder="Enter your phone number"
                      />
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        No. Of Rooms
                      </label>
                      <input
                        type="number"
                        name="roomNumber"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
                        placeholder="No. Of Rooms"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                        <div className="col-span-full md:col-span-1">
                          <label className="text-sm">Adults</label>
                          <input
                            type="number"
                            name="adults"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
                            placeholder=""
                          />
                        </div>
                        <div className="col-span-full md:col-span-1">
                          <label className="text-sm">(4-11 yrs)</label>
                          <input
                            type="number"
                            name="child4to11"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
                            placeholder=""
                          />
                        </div>
                        <div className="col-span-full md:col-span-1">
                          <label className="text-sm">(0-3 yrs)</label>
                          <input
                            type="number"
                            name="child0to3"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
                            placeholder=""
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between">
                        <button
                          className="p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300"
                          onClick={() => setViewForm(false)}
                        >
                          <div className="px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                            Cancel
                          </div>
                        </button>
                        <button
                          type="submit"
                          className="p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-pink-200"
                        >
                          <div className="px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                            Confirm
                          </div>
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        {
          viewAllDetails && (
            <div style={{ zIndex: 100 }} className="fixed inset-0 bg-gray-600 bg-opacity-50">
            <div className="absolute inset-0 w-full p-2 flex items-center justify-center">
              <div className="max-w-4xl h-[500px] overflow-y-hidden hover:overflow-y-auto">
                <div className="bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between  md:p-2">
                    <button
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                      data-modal-hide="small-modal"
                      onClick={() => setViewAllDetails(false)}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>

                  <div className="pb-4 px-4 md:px-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Swiper
                        spaceBetween={30}
                        speed={1000}
                        centeredSlides={true}
                        autoplay={{
                          delay: 2000,
                          disableOnInteraction: false,
                        }}
                        effect="fade"
                        navigation={false}
                        modules={[Autoplay, Pagination, Navigation, EffectFade]}
                      >
                        <div>
                          {dayLongImages.map((image, index) => (
                            <>
                              <SwiperSlide key={index}>
                                <div className="w-full h-56 lg:h-72">
                                  <img className="w-full h-full object-cover" src={image} alt="" />
                                </div>
                              </SwiperSlide>
                            </>
                          ))}
                        </div>
                      </Swiper>
                    </div>
                    <div className="h-full space-y-4 font-sans">
                      <h3 className="text-xl font-medium text-gray-900">
                        Day Long Package
                      </h3>
                      <p className="text-md text-gray-600">
                        From a delectable breakfast to exciting activities like swimming, boating, and sports, we've crafted the perfect blend of fun. Kids have their zone, and everyone enjoys lunch and snacks. Book now for a day of memorable moments
                      </p>
                      <p className="text-md font-medium">𝗙𝗮𝗰𝗶𝗹𝗶𝘁𝗶𝗲𝘀:</p>
                      <ul className="text-md font-natural text-gray-600">
                        <li>Breakfast</li>
                        <li>Lunch</li>
                        <li>Evening Snacks</li>
                        <li>Swimming</li>
                        <li>Boating</li>
                        <li>Kids zone</li>
                        <li>Sports Indoor/Outdoor</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )        
        }
        
    </>
  );
};

export default DayLongBooking;
