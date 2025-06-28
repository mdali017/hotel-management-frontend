import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

import HeadingTag from "../Common/HeadingTag";
import Axios from "axios";

const OurPartners = () => {
  const [partnerImages, setPartnerImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/ourPartner"
        );
        setPartnerImages(response.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };
    fetchData();
    return () => {};
  }, []);

  return (
    <section className="container mx-auto">
      <HeadingTag text={"OUR PARTNERS"} />
      <div>
        <Marquee speed={40}>
          {partnerImages?.map((item, index) => (
            <div
              key={index}
              className="h-[82px] w-[150px] md:h-[130px] md:w-[220px] mr-4 md:mr-6 overflow-hidden"
            >
              <img
                src={`https://backend.hotelorioninternational.com/${item?.logo}`}
                alt={`Partner ${index + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default OurPartners;
