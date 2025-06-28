import React from "react";
import leftImg from "../../assets/images/seagull_Front-building.jpg";
import rightImg from "../../assets/images/swimming-poll-orion.webp";
import HeadingTag from "../Common/HeadingTag";

const FeaturedSection = () => {
  return (
    <div className="relative  z-10 px-4 md:px-8 lg:px-16">
      <HeadingTag text={"HOTEL MANAGEMENT"} />

      <div className="h-auto  relative">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-">
          {/* Main Image - Full width on mobile, 2/3 on larger screens */}
          <div className="w-full md:col-span-2 relative overflow-hidden group">
            <div className="w-full h-64 md:h-[500px] lg:h-[560px]">
              <img
                src="https://orion-international.bangladeshhotels.net/data/Pics/OriginalPhoto/14775/1477546/1477546171/jessore-pic-2.JPEG"
                alt="Hotel Exterior"
                className="w-full h-full object-cover transition-transform duration-700 "
              />
            </div>
            {/* Overlay that appears on hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Text content that appears on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <h1 className="text-xl md:text-2xl font-thin mb-2 md:mb-4">
                HOTEL MANAGEMENT
              </h1>
              <p className="text-sm md:text-lg max-w-2xl leading-relaxed">
                Experience luxury and tranquility in the heart of the city,
                where modern comfort meets timeless elegance.
              </p>
            </div>
          </div>
          {/* Side Image - Full width on mobile, 1/3 on larger screens */}
          <div className="w-full md:col-span-1">
            <div className="relative h-64 md:h-[500px] lg:h-[560px] overflow-hidden group">
              <img
                src={rightImg}
                alt="Hotel Feature"
                className="w-full h-full  transition-transform duration-700  md:ml-4"
              />
              {/* Overlay that appears on hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Text content that appears on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h1 className="text-xl md:text-2xl font-thin mb-2 md:mb-4">
                  Luxury Comfort
                </h1>
                <p className="text-sm md:text-lg max-w-2xl leading-relaxed">
                  Discover our premium amenities and world-class services
                  designed for your ultimate relaxation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;
