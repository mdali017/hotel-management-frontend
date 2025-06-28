import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { PageLoader } from "../Common/Loader";
import Axios from "axios";
import { Link } from "react-router-dom";

const HeroSlider = ({ onDateChange }) => {
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState([]);
  const [checkInDate, setCheckInDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/banner"
        );
        setApiData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckInChange = (e) => {
    const newDate = e.target.value;
    setCheckInDate(newDate);

    if (new Date(newDate) >= new Date(checkOutDate)) {
      const nextDay = new Date(newDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay.toISOString().split("T")[0]);
    }
  };

  const handleCheckOutChange = (e) => {
    const newDate = e.target.value;
    if (new Date(newDate) > new Date(checkInDate)) {
      setCheckOutDate(newDate);
    }
  };

  const handleCheckAvailability = () => {
    onDateChange?.({ checkInDate, checkOutDate });
  };

  return (
    <div className="relative w-full">
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Swiper
            spaceBetween={30}
            speed={2000}
            centeredSlides={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            effect="fade"
            navigation={false}
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen"
          >
            {apiData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative w-full h-full">
                  <img
                    className="w-full h-full object-cover"
                    src={`https://backend.hotelorioninternational.com/${item.image}`}
                    alt="Hotel banner"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Welcome Message */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full px-4">
            <div className="animate-fade-in-down">
              <div className="overflow-hidden">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-yellow-400 mb-2 tracking-wider animate-slide-up">
                  HOTEL MANAGEMENT                </h2>
              </div>
              <div className="w-24 h-1 bg-red-600 mx-auto mt-6 mb-8 animate-width" />
            </div>
          </div>

          {/* Date Picker Section */}
          <div className="absolute bottom-8 left-0 right-0 z-10">
            <div className="max-w-6xl mx-auto px-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1">
                <div className="bg-gradient-to-r from-black/40 to-black/20 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center">
                    {/* Check-in Date */}
                    <div className="md:col-span-4 relative group">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                        <label className="block text-white/80 text-sm mb-2 uppercase tracking-wider font-medium">
                          Check-in
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={checkInDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={handleCheckInChange}
                            className="w-full bg-transparent text-white text-lg font-medium 
                              border-0 focus:ring-0 focus:outline-none 
                              placeholder-white/60"
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 
                            group-hover:bg-white/40 transition-colors duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Check-out Date */}
                    <div className="md:col-span-4 relative group">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                        <label className="block text-white/80 text-sm mb-2 uppercase tracking-wider font-medium">
                          Check-out
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={checkOutDate}
                            min={checkInDate}
                            onChange={handleCheckOutChange}
                            className="w-full bg-transparent text-white text-lg font-medium 
                              border-0 focus:ring-0 focus:outline-none 
                              placeholder-white/60"
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 
                            group-hover:bg-white/40 transition-colors duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Check Availability Button */}
                    <div className="md:col-span-4">
                      <Link to={"/booking"}>
                        <button
                          onClick={handleCheckAvailability}
                          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 
                          hover:from-yellow-500 hover:to-yellow-600 text-black font-bold 
                          px-8 py-5 rounded-xl text-lg uppercase tracking-wider 
                          transform hover:scale-[1.02] transition-all duration-300 
                          shadow-lg hover:shadow-xl"
                        >
                          Check Availability
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Border Accent */}
                  <div className="h-1 bg-gradient-to-r from-yellow-400/50 via-yellow-500/50 to-yellow-400/50 rounded-b-xl" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes widthExpand {
          from {
            width: 0;
          }
          to {
            width: 6rem;
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 1s ease-out 0.5s both;
        }

        .animate-width {
          animation: widthExpand 1s ease-out 1s both;
        }

        /* Modern date input styling */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.6;
          cursor: pointer;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
