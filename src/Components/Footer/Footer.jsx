import { Link } from "react-router-dom";
import bg from "../../assets/footer-bg.svg";
import { fadeIn } from "../../variants";
import { motion } from "framer-motion";
import Animation from "../Common/Animation";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className=" text-white relative bg-gray-800 pt-8 font-[raleway]"
    >
      <div className="bg-black absolute w-full h-full top-0 bg-opacity-40"></div>
      {/* <Animation direction={"up"}> */}
      <div className="container relative z-30 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 items-start justify-items-center border-b-2 pb-4 border-gray-600">
        <div className="w-full text-center ">
          <div className="text-center">
            <p className="border-b-2 pb-2 border-gray-600 text-xl uppercase tracking-wider font-bold">
              Reach Us
            </p>
          </div>
          <div className="text-sm lg:pt-3">
            <p className="font-semibold mb-1 tracking-wider">
              For resort booking :
            </p>
            <p>info.hotelorionint@gmail.com</p>
            <p className="">01981-333444 </p>
            <p className="font-semibold mb-1 tracking-wider">
              Rail Road, Jessore, Bangladesh, 7400
            </p>
          </div>
          <div className="text-sm lg:pt-3">
            <p className="font-semibold mb-1 tracking-wider">
              For Cafe booking :
            </p>
            <p>info.hotelorionint@gmail.com</p>
            <p className="">01981-333444 </p>z
            <p className="font-semibold mb-1 tracking-wider">
              Rail Road, Jessore, Bangladesh, 7400
            </p>
          </div>
        </div>
        <div className="w-full">
          <div className="text-center mb-4">
            <p className="border-b-2 pb-2 border-gray-600 text-xl uppercase tracking-wider font-bold">
              Site Map
            </p>
          </div>
          <ol className="grid grid-cols-2 list-disc list-inside gap-x-10 md:text-sm px-10 md:px-20 lg:px-0 text-xs tracking-wider [&>li:hover]:text-gray-400 lg:pt-10">
            <li>
              <Link
                onClick={window.scrollTo({ top: 0, behavior: "smooth" })}
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link to="/booking">Booking</Link>
            </li>
            <li>
              <Link to="/accommodation">Rooms & Suites</Link>
            </li>
            <li>
              <Link href="./">Photo Gallery</Link>
            </li>
            <li>
              <Link href="./">Restaurants</Link>
            </li>
            <li>
              <Link to="/virtual">Virtual Tours</Link>
            </li>
            <li>
              <Link href="./">Meetings & Events</Link>
            </li>
            <li>
              <Link to="./contact">Contact Us</Link>
            </li>
            <li>
              <Link to="./privacy-policy">Privacy Policy</Link>
            </li>
          </ol>
        </div>
        <div className="w-full">
          <div className="text-center mb-4">
            <p className="border-b-2 pb-2 border-gray-600 text-xl uppercase tracking-wider font-bold">
              Stay In Touch
            </p>
          </div>

          <div className="flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.2773448822863!2d89.20918687531794!3d23.16007557907764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff11c56681c4cf%3A0x885d4987820128e5!2z4Ka54KeL4Kaf4KeH4KayIOCmk-CmsOCmv-Cnn-CmqCDgpofgpqjgp43gpp_gpr7gprDgpqjgp43gpq_gpr7gprbgpqjgpr7gprI!5e0!3m2!1sbn!2sbd!4v1739534204153!5m2!1sbn!2sbd"
              width="400"
              height="200"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      {/* </Animation> */}
      <div className="container relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-2 pt-4 pb-4 text-sm">
        <div className="text-center lg:text-left">
          {currentYear} © HOTEL MANAGEMENT, All rights reserved.
        </div>
        <div
          className="text-center lg:text-right cursor-pointer"
          onClick={() =>
            window.open("https://iciclecorporation.com/", "_blank")
          }
        >
          powered by Icicle Corporation.
        </div>
      </div>
    </div>
  );
};

export default Footer;
