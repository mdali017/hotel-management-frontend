import React from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import bookingSlider1 from "../../assets/Home page/bookingSlider1.jpg";
import bookingSlider2 from "../../assets/Home page/bookingSlider2.jpg";
import bookingSlider3 from "../../assets/Home page/bookingSlider3.jpg";
import bookingSlider4 from "../../assets/Home page/bookingSlider4.jpg";
import bookingSlider5 from "../../assets/Home page/bookingSlider5.jpg";

const images = [
  {
    id: 1,
    image: bookingSlider1,
  },
  {
    id: 2,
    image: bookingSlider2,
  },
  {
    id: 3,
    image: bookingSlider3,
  },
  {
    id: 4,
    image: bookingSlider4,
  },
  {
    id: 5,
    image: bookingSlider5,
  },
];

const SliderBooking = () => {
  return (
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
          {images.map((item) => (
            <SwiperSlide key={item?.id}>
              <div className="w-full h-56 lg:h-72">
                <img className="w-full h-full object-cover" src={item.image} alt="" />
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default SliderBooking;
