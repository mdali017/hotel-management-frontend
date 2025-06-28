/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import pdfUrl from "../../assets/Investors/Chuti_Resort_Purbachal_Brochure.pdf";
import img1 from "../../assets/Investors/investors1.png";
import img2 from "../../assets/Investors/investors2.png";
import { PageLoader } from "../Common/Loader";
import InvestorContact from "./InvestorContact";
import InvestorsCard from "./InvestorsCard";
import Axios from "axios";
import { Link } from "react-router-dom";

const InvestorsHero = () => {
  const [loading, setLoading] = useState(true);
  const [isHoveredR, setIsHoveredR] = useState(false);
  const [isHoveredRL, setIsHoveredRL] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHoveredL, setIsHoveredL] = useState(false);
  const [isModalOpenNow, setIsModalOpenNow] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [investorImage, setInvestorImage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/investment"
        );
        setInvestorImage(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API data:", error);
        setLoading(false);
      }
    };
    fetchData();
    return () => {};
  }, []);

  const handleCallIconClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Chuti_Resort_Purbachal_Brochure.pdf";
    link.click();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const translateY = Math.min(scrollPosition * 0.5, window.innerHeight / 2.5);

  return (
    <>
      <div className="hidden md:inline">
        <div
          className="z-30 fixed top-[40%] w-[90px] h-[85px]"
          style={{ transform: `translateY(-${translateY}px)` }}
        >
          <div
            onClick={handleDownload}
            onMouseEnter={() => setIsHoveredL(true)}
            onMouseLeave={() => setIsHoveredL(false)}
            className="bg-primary hover:bg-primary text-white font-semibold w-full h-full flex flex-col items-center justify-center cursor-pointer"
          >
            <IoMdDownload className="text-xl" />
            <span
              className={`text-xs text-center ${
                isHoveredL ? "text-accent" : "text-white"
              }`}
            >
              DOWNLOAD BROCHURE
            </span>
          </div>
        </div>
        <div
          className="z-30 fixed top-[50%] w-[90px] h-[85px]"
          style={{
            transform: `translateY(-${translateY}px)`,
            top: "calc(40% + 95px)",
          }}
        >
          <Link
            className="bg-accent hover:bg-accent text-white font-bold w-full h-full flex items-center justify-center cursor-pointer"
            // onClick={() => setIsModalOpen(true)}
            onMouseEnter={() => setIsHoveredR(true)}
            onMouseLeave={() => setIsHoveredR(false)}
            to={"/investors/investor-contact"}
          >
            <span
              className={`text-xs text-center ${
                isHoveredR ? "text-yellow-600" : "text-white"
              }`}
            >
              CONNECT
              <br />
              WITH US
            </span>
          </Link>
        </div>
        <div
          className="z-30 fixed w-[90px] h-[85px]"
          style={{
            transform: `translateY(-${translateY}px)`,
            top: "calc(40% + 190px)",
          }}
        >
          <div
            className="bg-secondary hover:bg-secondary text-white font-bold w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => setIsModalOpenNow(true)}
            onMouseEnter={() => setIsHoveredRL(true)}
            onMouseLeave={() => setIsHoveredRL(false)}
          >
            <span
              className={`text-xs text-center ${
                isHoveredRL ? "text-accent" : "text-white"
              }`}
            >
              WHY TRUST US?
            </span>
          </div>
        </div>
        <div
          className="fixed z-50 bottom-24 right-6 w-[60px] h-[60px] bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
          onClick={handleCallIconClick}
        >
          <IoCall className="text-white text-3xl" />
        </div>
        {isPopupVisible && (
          <div className="fixed z-50 p-3 bottom-24 right-[90px] bg-gray-200 text-primary font-semibold rounded-md flex items-center justify-center shadow-xl">
            +880 1711-074278
          </div>
        )}
      </div>
      {/* for mobile  */}
      <div className="flex md:hidden justify-between">
        <div className="z-30 fixed top-[30%] right-0  w-[50px] h-[50px]">
          <Link
            className="bg-primary hover:bg-primary text-white font-bold w-full h-full flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setIsHoveredR(true)}
            onMouseLeave={() => setIsHoveredR(false)}
            // onClick={() => setIsModalOpen(true)}
            to={"/investors/investor-contact"}
          >
            <span
              className={`text-center ${
                isHoveredR ? "text-yellow-600" : "text-white"
              } text-[7px]`}
            >
              CONNECT WITH US
            </span>
          </Link>
        </div>
        <div
          style={{ top: "calc(30% + 55px)" }}
          className="z-30 fixed right-0 w-[50px] h-[50px]"
        >
          <div
            className="bg-accent hover:bg-accent text-white font-bold w-full h-full flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setIsHoveredRL(true)}
            onMouseLeave={() => setIsHoveredRL(false)}
            onClick={() => setIsModalOpenNow(true)}
          >
            <span
              className={`text-center ${
                isHoveredRL ? "text-yellow-600" : "text-white"
              } text-[7px]`}
            >
              WHY TRUST US?
            </span>
          </div>
        </div>
        <div
          style={{ top: "calc(30% + 110px)" }}
          className="z-30 fixed right-0 w-[50px] h-[50px]"
        >
          <div
            onClick={handleDownload}
            onMouseEnter={() => setIsHoveredL(true)}
            onMouseLeave={() => setIsHoveredL(false)}
            className="bg-secondary hover:bg-secondary text-white font-bold w-full h-full flex flex-col items-center justify-center cursor-pointer"
          >
            <IoMdDownload className="text-xl" />
            <span
              className={`text-center ${
                isHoveredL ? "text-yellow-600" : "text-white"
              } text-[7px]`}
            >
              DOWNLOAD BROCHURE
            </span>
          </div>
        </div>
        <div
          style={{ top: "calc(30% + 165px)" }}
          className="fixed z-50 right-0 w-[50px] h-[50px] bg-green-500 flex items-center justify-center cursor-pointer"
          onClick={() => (window.location.href = "tel:+8801711074278")}
        >
          <IoCall className="text-white text-xl" />
        </div>
      </div>
      <div>
        <div className="relative z-10">
          <div className="absolute h-full w-full z-0"></div>
          <div className="w-full h-[200px] md:h-[500px] lg:h-screen relative">
            <div className="bg-black h-full w-full bg-opacity-50"></div>
            <img
              className="w-full h-full object-cover top-0 absolute -z-20"
              src={img1}
              alt=""
            />
          </div>
        </div>
        <div className="-mt-20 p-4 md:-mt-80 md:p-0 relative z-10">
          <img className="mx-auto w-[70%]" src={img2} alt="" />
        </div>
      </div>
      <div className="mt-10 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5 md:px-0">
          {investorImage?.map((item) => (
            <InvestorsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      {isModalOpenNow && (
        <div className="flex items-center justify-center fixed z-50 inset-0 overflow-y-auto">
          <div className="relative p-4 w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
              <div className="flex items-center justify-between px-4 md:px-5 pt-4 md:pt-5 rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Five-Star Hotel Share Ownership Opportunity
                </h3>
                <button
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                  onClick={() => setIsModalOpenNow(false)}
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

              <div className="p-4 md:p-5">
                <p>
                  Are you ready to become the proud owner of a prestigious
                  five-star hotel for just 8.25 million Taka? Chuti Resort,
                  located in Kuril, is offering an exclusive share ownership
                  opportunity with easy installment options for esteemed
                  customers. The project is a masterpiece of renowned
                  architects, covering approximately 30 acres of land and
                  boasting a stunning 10-story building.
                </p>
                <div className="mb-8">
                  <p className="text-lg font-semibold my-4">Key Features:</p>
                  <ul className="list-disc pl-6">
                    <li>
                      Modern and convenient transportation with a 20-minute
                      journey from Kuril to Chuti Resort.
                    </li>
                    <li>
                      Share ownership allows you to invest in a five-star hotel
                      suite, providing a lifetime of worry-free holiday
                      experiences.
                    </li>
                    <li>
                      Common facilities at Chuti Resort include:
                      <ul className="list-disc pl-6">
                        <li>Restaurant</li>
                        <li>Laundry service</li>
                        <li>Spacious parking area</li>
                        {/* ... other facilities ... */}
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* Owner's Benefits */}
                <div className="mb-8">
                  <p className="text-lg font-semibold my-4">
                    Owner's Benefits:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Proud ownership of a five-star hotel share.</li>
                    <li>
                      Transparent and transferable ownership with easy
                      installment options or one-time payment.
                    </li>
                    <li>Up to 40% discount on transfers before possession.</li>
                    {/* ... other benefits ... */}
                  </ul>
                </div>

                {/* Why Choose to Invest */}
                <div>
                  <p className="text-lg font-semibold my-4">
                    Why Choose to Invest:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      Conveniently connected to Asian Highway and Roads leading
                      to Shahjalal International Airport and Asian Highway.
                    </li>
                    <li>Strategic location near Rajuk Purbachal Sector 30.</li>
                    <li>
                      Tourism and hotel sector investments are more profitable
                      and secure than other assets.
                    </li>
                    {/* ... other reasons ... */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && <PageLoader />}
    </>
  );
};

export default InvestorsHero;
