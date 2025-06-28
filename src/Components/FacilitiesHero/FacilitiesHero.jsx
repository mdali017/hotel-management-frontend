import Axios from "axios";
import React, { useEffect, useState } from "react";
import img1 from "../../assets//Booking/img1.jpg";
import img2 from "../../assets/Home page/facilityTop2.jpg";
import { PageLoader } from "../Common/Loader";
import FacilitiesCard from "./FacilitiesCard";

const FacilitiesHero = () => {
  const [loading, setLoading] = useState(true);
  const [facilitiesItem, setFacilitiesItem] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/facilities"
        );
        setFacilitiesItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API data:", error);
        setLoading(false);
      }
    };
    fetchData();
    return () => {};
  }, []);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div>
          <div>
            <div className="relative">
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
            <div className="-mt-20 p-4 md:-mt-80 md:p-0 relative">
              <img className="mx-auto w-[70%]" src={img2} alt="" />
            </div>
          </div>
          <div className="mt-10 container mx-auto mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {facilitiesItem.map((item) => (
                <FacilitiesCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FacilitiesHero;
