import { useState } from "react";

const Hero = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  const handleCheckAvailabilityClick = () => {
    onDateChange(selectedDate);
  };

  return (
    // <section className="mt-[40vh] md:mt-[60vh] lg:mt-[70vh]">
    <section className="absolute w-full h-full top-0  z-10">
      <div className="bg-black bg-opacity-40 h-full"></div>
      <div className="absolute bottom-10 w-full">
        <div className="text-white bg-black bg-opacity-30 grid grid-cols-1 md:grid-cols-3 gap-5 items-center justify-center backdrop-blur-sm py-3 mx-5 font-sans">
          <div className="text-center">
            <p className="text-base text-center">Check-in Date</p>
            <input
              className="bg-gray-100 rounded-lg px-4 py-2 border border-gray-400 focus:outline-none text-black text-base font-medium"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="text-center">
            <p className="text-base text-center">Check-out Date</p>
            <input
              className="bg-gray-100 rounded-lg px-4 py-2 border border-gray-400 focus:outline-none text-black text-base font-medium"
              type="date"
              // onChange={handleDateChange}
            />
          </div>

          <div className="flex justify-center">
            <button
              className="text-lg p-3 border tracking-widest hover:text-black hover:bg-white uppercase duration-500 font-bold"
              onClick={handleCheckAvailabilityClick}
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
