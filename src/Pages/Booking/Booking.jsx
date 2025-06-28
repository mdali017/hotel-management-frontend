import { format } from "date-fns";
import { useState } from "react";
import Hero from "../../Components/Hero/Hero";
import HeroBooking from "../../Components/HeroBooking/HeroBooking";
import ViewBooking from "../../Components/ViewBooking/ViewBooking";

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  // console.log(selectedDate);
  return (
    <>
      <div className="relative">
        <HeroBooking />
        <Hero onDateChange={handleDateChange} />
      </div>  
      <ViewBooking selectedDate={selectedDate} />
    </>
  );
};

export default Booking;
