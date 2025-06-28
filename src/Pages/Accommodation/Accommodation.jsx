import React from "react";
import AccommodationC from "../../Components/AccommodationContent/AccommodationC";
import bg from "../../assets/footer-bg.svg";

const Accommodation = () => {
  return (
    <div className="relative" style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white absolute h-full w-full z-0 bg-opacity-90"></div>
      <AccommodationC />
    </div>
  );
};

export default Accommodation;
