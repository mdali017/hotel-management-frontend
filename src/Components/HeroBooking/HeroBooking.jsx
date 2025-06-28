import { useState } from "react";
import { FadeLoader } from "react-spinners";
import Hero from "../../Components/Hero/Hero";
import img1 from "../../assets//Booking/img1.jpg";

const HeroBooking = () => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
      <div className="w-full h-[300px] relative">
        <img
          className="w-full h-full object-cover top-0 absolute blur-3xl -z-20"
          src={img1}
          alt=""
          onLoad={handleImageLoad}
        />
        {loading && (
          <div className="flex items-center justify-center w-full h-full absolute top-0 left-0 ">
            <FadeLoader color={"#e11e26"} loading={loading} size={100} />
          </div>
        )}
      </div>
  )
}

export default HeroBooking;
