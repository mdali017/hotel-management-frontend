import React from "react";
import { FaArrowRight } from "react-icons/fa";
import Modal from "../../Components/Common/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Button from "../../Components/Common/Button";
import { fadeIn } from "../../variants";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AmenityCard = ({
  item,
  index = 0,
  showModal,
  setShowModal,
}) => {
  const getAnimationDirection = (idx) => {
    return idx % 2 === 0 ? "right" : "left";
  };

  const handleShowModal = (itemData) => {
    setShowModal({
      isVisible: true,
      itemData,
    });
  };

  // Create a description list from the item description if available
  const descriptionItems = item.description 
    ? item.description.split('\r\n').filter(item => item.trim() !== '')
    : [];

  const imageUrl = item.image.startsWith('http') 
    ? item.image 
    : `https://backend.hotelorioninternational.com/${item.image}`;

  return (
    <>
      <motion.div
        variants={fadeIn(getAnimationDirection(index))}
        initial="hidden"
        animate="show"
        viewport={{ once: false, amount: 0.7 }}
      >
        <div className="w-full h-[350px] md:h-[500px] overflow-hidden">
          <img
            src={imageUrl}
            className="hover:scale-110 h-full w-full object-cover duration-[2000ms]"
            alt={item.title || "Amenity"}
          />
        </div>
        <div
          onClick={() => handleShowModal(item)}
          className="absolute bg-white group cursor-pointer text-balck rounded-lg md:w-[513px] h-[150px] p-6 shadow-lg hover:translate-x-6 duration-500 -mt-4 md:ml-10"
        >
          <div className="flex justify-between">
            <h1 className="text-[#6EC1E4] text-3xl font-extrabold">{item.title}</h1>
            <FaArrowRight className="text-3xl group-hover:text-orange-500" />
          </div>
          <p className="text-black font-md">
            Package Type: {item.package}
          </p>
          <p className="text-black font-md">
            Rate:{" "}
            <span className="text-orange-500 font-semibold">
              {item.price}++ Taka
            </span>
          </p>
        </div>
      </motion.div>

      {showModal && showModal.isVisible && showModal.itemData.id === item.id && (
        <Modal 
          isVisible={showModal.isVisible} 
          onClose={() => setShowModal({isVisible: false, itemData: null})}
        >
          <section className="relative p-10">
            <button
              className="text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
              onClick={() => setShowModal({isVisible: false, itemData: null})}
            >
              X
            </button>
            <div className="min-h-[200px]">
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
                    <SwiperSlide>
                      <div className="w-full h-56 lg:h-72">
                        <img
                          className="w-full h-full object-cover"
                          src={imageUrl}
                          alt={item.title}
                        />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
                <div className="h-full font-sans">
                  <p className="text-2xl font-bold text-green-700">
                    {item.title}
                  </p>
                  <p className="text-md font-medium">
                    Package Type: {item.package}
                  </p>
                  <p className="text-md font-medium">
                    Rate: {item.price}++ Taka
                  </p>

                  {descriptionItems.length > 0 && (
                    <>
                      <p className="text-md font-medium mt-2">Package Includes:</p>
                      <ul className="text-md font-natural text-gray-600">
                        <div className="grid grid-cols-2">
                          {descriptionItems.map((amenity, idx) => (
                            <li key={idx}>{amenity}</li>
                          ))}
                        </div>
                      </ul>
                    </>
                  )}
                  
                  <Link to={"/booking"} className="mt-4 inline-block">
                    <Button text={"Book Now"}></Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Modal>
      )}
    </>
  );
};

export default AmenityCard;