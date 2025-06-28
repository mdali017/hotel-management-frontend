import React, { useState, useRef, useEffect } from "react";

const FacilitiesCard = ({ item }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);

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
    <div>
      <div
        className="group border relative items-center justify-center overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-black/30 transition-shadow"
        onClick={() => openPopup(item.image)}
      >
        <div className="h-96 w-full">
          <img
            className="w-full h-full object-cover group-hover:rotate-3 group-hover:scale-125 duration-500"
            src={`https://backend.hotelorioninternational.com/${item?.image}`}
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via transparent to-black group-hover:translate-y-0 transition-all"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-9 text-center lg:translate-y-[55%] group-hover:translate-y-0 group-hover:duration-1000 transition-all">
          <h1 className="text-xl font-semibold text-white">{item?.title}</h1>
          <p className="text-sm my-4 italic text-white mb-3 lg:opacity-0 group-hover:opacity-100 duration-300">
            {item?.description}
          </p>
        </div>
      </div>

      {isPopupOpen && (
        <div
          className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center"
          onClick={handleOverlayClick}
        >
          <div
            ref={popupRef}
            className="max-w-screen-md max-h-[95%] overflow-y-hidden hover:overflow-y-auto p-2 bg-white rounded-lg relative"
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
            <img
              src={selectedImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesCard;
