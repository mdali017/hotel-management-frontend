import HeadingTag from '../Common/HeadingTag';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';
import Axios from 'axios';

const Gallery = () => {
  const slideRef = useRef(null);
  const swiperRef = useRef(null);
  const [gallerydata, setGallerydata] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          'https://backend.hotelorioninternational.com/api/gallary'
        );
        setGallerydata(response.data);
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };
    fetchData();
    return () => {};
  }, []);

  const goToNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goToPrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <section className="px-4 md:px-8 lg:px-16">
      <HeadingTag text={'Gallery'} />
      <div>
        <div className="my-6 md:my-10 relative">
          {/* Navigation Buttons - Hidden on small screens */}
          <div className="hidden md:flex z-10 absolute w-full justify-between top-1/3 translate-y-7">
            <button
              onClick={goToPrevSlide}
              className="p-3 text-black bg-white hover:text-white hover:bg-black duration-300 ml-3"
            >
              <BsArrowLeft className="text-3xl" />
            </button>
            <button
              onClick={goToNextSlide}
              className="p-3 text-black bg-white hover:text-white hover:bg-black duration-200 mr-3"
            >
              <BsArrowRight className="text-3xl" />
            </button>
          </div>

          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            spaceBetween={10}
            speed={1500}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              // Small devices (phones)
              320: {
                slidesPerView: 1,
                spaceBetween: 0
              },
              // Medium devices (tablets)
              768: {
                slidesPerView: 2,
                spaceBetween: 10
              },
              // Large devices (desktops)
              1024: {
                slidesPerView: 3,
                spaceBetween: 10
              }
            }}
            loop={true}
            modules={[Navigation, Pagination, Autoplay]}
            className="w-full"
          >
            {gallerydata?.map((item, index) => (
              <SwiperSlide key={index} ref={slideRef}>
                <div className="w-full h-64 md:h-80 lg:h-96">
                  <img
                    className="h-full w-full object-cover"
                    src={`https://backend.hotelorioninternational.com/${item?.image}`}
                    alt={`Gallery ${index + 1}`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile Navigation Buttons */}
          <div className="flex md:hidden justify-between mt-4">
            <button
              onClick={goToPrevSlide}
              className="p-2 text-black bg-white hover:text-white hover:bg-black duration-300"
            >
              <BsArrowLeft className="text-xl" />
            </button>
            <button
              onClick={goToNextSlide}
              className="p-2 text-black bg-white hover:text-white hover:bg-black duration-200"
            >
              <BsArrowRight className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;