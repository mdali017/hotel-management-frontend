import React, { useState } from "react";
import { Tb360View } from "react-icons/tb";
import { Link } from "react-router-dom";
import HeadingTag from "../../Components/Common/HeadingTag";
import TourData from "./TourData";
import { PageLoader } from "../../Components/Common/Loader";
import bg from "../../assets/footer-bg.svg";

const VirtualTour = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative" style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white absolute h-full w-full z-0 bg-opacity-90"></div>
      <div className="container mx-auto relative pt-[60px] lg:pt-[100px] w-full">
        <HeadingTag text={"VIRTUAL TOUR"} />
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {TourData.slice(0,12).map((item, index) => (
            <Link
              key={item.id}
              to={`/virtual/${item.id}`}
              className="group border relative items-center justify-center overflow-hidden cursor-pointer hover:shadow-md hover:shadow-black/30"
            >
              <div className="h-[271px] md:h-96 w-full">
                <img
                  className="w-full h-full object-cover group-hover:rotate-3 group-hover:scale-125 duration-500"
                  src={item.image}
                  alt=""
                  onLoad={() => setLoading(false)}
                />
                {loading && <PageLoader />}
              </div>
              <div className="visible absolute inset-0 group-hover:invisible">
                <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center text-6xl text-white">
                  <Tb360View />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b">
                <div className="absolute w-full mx-auto py-3 bottom-0 bg-black opacity-60">
                  <div className="flex justify-center gap-3 text-white">
                    <p className="font-bold uppercase text-md md:text-lg lg:text-xl text-gray-100">
                      {item.name}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;

