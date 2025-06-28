import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeadingTag from "../Common/HeadingTag";
import Axios from "axios";

const RoomsAndSuitesSection = () => {
  const [roomAndSuitesData, setRoomAndSuitesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/rooms"
        );
        setRoomAndSuitesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API data:", error);
        setLoading(false);
      }
    };
    fetchData();
    return () => {};
  }, []);

  // Function to assign accent colors dynamically
  const getAccentColor = (index) => {
    const colors = [
      "from-teal-400 to-teal-600",
      "from-yellow-400 to-yellow-600",
      "from-green-400 to-green-600",
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="w-full bg-gray-50 md:px-16">
      <div>
        <div className="text-center mb-8 sm:mb-6">
          <HeadingTag text={"ROOMS & SUITES"} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              loop={roomAndSuitesData.length > 1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                480: {
                  slidesPerView: 1.5,
                  spaceBetween: 15,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
              }}
              className="mySwiper"
              navigation={{
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
              }}
            >
              {roomAndSuitesData.map((room, index) => (
                <SwiperSlide key={room.id}>
                  <div className="group relative h-[280px] xs:h-[350px] sm:h-[400px] lg:h-[370px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    {/* Image Container */}
                    <div className="absolute inset-0">
                      <img
                        src={`https://backend.hotelorioninternational.com/${room.image}`}
                        alt={room.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                      <div className="mb-3 sm:mb-4">
                        <span
                          style={{ fontStyle: "italic", textAlign: "center" }}
                          className="inline-block px-3 sm:pl-12 py-1 text-3xl font-thin text-white"
                        >
                          {room.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className="custom-prev absolute left-0 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/90 hover:bg-white rounded-full z-10 cursor-pointer flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="custom-next absolute right-0 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/90 hover:bg-white rounded-full z-10 cursor-pointer flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .swiper-pagination {
          position: absolute;
          bottom: 0 !important;
        }

        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(0, 0, 0, 0.3);
          opacity: 1;
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
          }
        }

        .swiper-pagination-bullet-active {
          background: #000;
          transform: scale(1.2);
        }

        .custom-prev,
        .custom-next {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.3s ease;
        }

        .mySwiper:hover .custom-prev,
        .mySwiper:hover .custom-next {
          opacity: 1;
          transform: scale(1) translateY(-50%);
        }

        @media (max-width: 640px) {
          .custom-prev,
          .custom-next {
            opacity: 0.8;
            transform: scale(1) translateY(-50%);
          }
        }

        @media (max-width: 480px) {
          .custom-prev {
            left: 0;
          }
          .custom-next {
            right: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default RoomsAndSuitesSection;
