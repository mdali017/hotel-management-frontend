import gifFile from "../../assets/maintenance-gif-9.gif";
import img1 from "../../assets//Home page/img1.jpg";
import img2 from "../../assets//Home page/img2.jpg";
import img3 from "../../assets//Home page/img3.jpg";
import img4 from "../../assets//Home page/img4.jpg";
import img5 from "../../assets//Home page/img5.jpg";
import img6 from "../../assets//Home page/img6.jpg";
import { motion } from "framer-motion";
import { FaFacebookSquare } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

// import required modules
import { Autoplay } from "swiper/modules";

const Maintainence = () => {
  const images = [
    { src: img1, alt: "Image 1 description" },
    { src: img2, alt: "Image 2 description" },
    { src: img3, alt: "Image 3 description" },
    { src: img4, alt: "Image 4 description" },
    { src: img5, alt: "Image 5 description" },
    { src: img6, alt: "Image 6 description" },
  ];
  return (
    <section>
      <div className="relative ">
        <img className="absolute -z-50 object-cover h-screen opacity-15" src={gifFile} alt="" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 h-screen">
        <div className="p-5 col-span-2 mt-20">
          <motion.h1
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-4xl text-red-500 font-extrabold uppercase my-5"
          >
            We are in Maintainance Now! . .
          </motion.h1>
          <motion.h1
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-2xl font-semibold text-blue-600"
          >
            Welcome To Chuti Resort.
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-sm font-light mt-5"
          >
            Chuti Resort Purbachal is a beautiful escape nestled amidst the lush greenery of
            Purbachal, Bangladesh. Located about 18 kilometers from Dhaka, it offers a perfect blend
            of nature&apos;s tranquility and modern amenities, making it an ideal destination for a
            relaxing getaway with family or friends.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="mt-10 flex gap-3"
          >
            <a
              href="https://www.facebook.com/chutipurbachal"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 flex gap-2 items-center hover:text-white border border-blue-400 hover:bg-blue-500 duration-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center"
            >
              <FaFacebookSquare />
              <span>Facebook</span>
            </a>
            <a
              href="tel:+8801709-919825"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 flex gap-2 items-center hover:text-white border border-blue-400 hover:bg-blue-500 duration-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center"
            >
              <FiPhoneCall />
              <span>Call Us +8801709-919825</span>
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="col-span-3"
        >
          <>
            <Swiper
              spaceBetween={20}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              navigation={true}
              modules={[Autoplay]}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="w-full h-screen">
                    <img
                      className="w-full h-full rounded-none md:rounded-l-3xl object-cover"
                      src={image.src}
                      alt={image.alt}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        </motion.div>
      </div>
    </section>
  );
};

export default Maintainence;
