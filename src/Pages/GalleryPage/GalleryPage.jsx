import React, { useState, useRef, useEffect } from "react";
import HeadingTag from "../../Components/Common/HeadingTag";
import { FaCamera } from "react-icons/fa";
import { PageLoader } from "../../Components/Common/Loader";
import Axios from "axios";

const GalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [gallerydata, setGallerydata] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/gallary"
        );
        setGallerydata(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API data:", error);
        setLoading(false);
      }
    };
    fetchData();
    return () => {};
  }, []);

  const openPopup = (image) => {
    setSelectedImage(image);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedImage(null);
    setIsPopupOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      closePopup();
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleOverlayClick);
    } else {
      document.removeEventListener("mousedown", handleOverlayClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [isPopupOpen]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="container mx-auto relative pt-[60px] lg:pt-[100px] w-full">
          <HeadingTag text={"Gallery"} />
          <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
            {gallerydata?.map((item, index) => (
              <div
                key={index}
                className="group relative items-center justify-center overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-black/30 transition-shadow border"
                onClick={() =>
                  openPopup(
                    `https://backend.hotelorioninternational.com/${item?.image}`
                  )
                }
              >
                <div className="h-[271px] md:h-96 w-full">
                  <img
                    className="w-full h-full object-cover duration-500"
                    src={`https://backend.hotelorioninternational.com/${item?.image}`}
                    alt={`Gallary ${index + 1}`}
                    onLoad={() => setLoading(false)}
                  />
                </div>
                <div className="absolute inset-0 from-transparent via transparent group-hover:translate-y-0 transition-all bg-black bg-opacity-35 group-hover:bg-opacity-0 duration-500">
                  <div className="flex group-hover:-translate-x-52 duration-500 justify-center items-center h-full">
                    <FaCamera className="text-3xl text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center translate-y-[41%] w-full transition-all">
                  <h1 className="text-xl font-semibold py-2 w-full bg-black bg-opacity-15 ">
                    <span className="text-white">{item?.title}</span>
                  </h1>
                </div>
              </div>
            ))}
          </div>

          {isPopupOpen && (
            <div
              className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center"
              onClick={handleOverlayClick}
            >
              <div
                ref={popupRef}
                className="max-w-screen-md w-[90%] max-h-screen-md p-2 bg-white rounded-lg relative"
              >
                <button
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center absolute right-3"
                  onClick={closePopup}
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
                <img src={selectedImage} alt="" className="w-full h-auto" />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GalleryPage;
