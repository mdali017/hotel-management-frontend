import React from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ViewAllModal = ({ roomTypesArray, selectedRoomId, onClose }) => {

  return (
    <div style={{ zIndex: 100 }} className="fixed inset-0 bg-gray-600 bg-opacity-50">
      <div className="absolute inset-0 w-full p-2 flex items-center justify-center">
        <div className="max-w-4xl h-[500px] overflow-y-hidden hover:overflow-y-auto">
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between  md:p-2">
              <button
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                data-modal-hide="small-modal"
                onClick={onClose}
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
                    {roomTypesArray.allImages.map((image, index) => (
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
                  {selectedRoomId.roomname}
                </h3>
                <p className="text-md text-gray-600">
                  {roomTypesArray.description}
                </p>
                <p className="text-md font-medium">Bed type: {selectedRoomId.bedtype}</p>
                <p className="text-md font-medium">
                  Max Room capacity: {selectedRoomId.maxcapacity}
                </p>
                <p className="text-md font-medium">Amenities</p>
                <ul className="text-md font-natural text-gray-600">
                  {selectedRoomId?.facilities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllModal;
