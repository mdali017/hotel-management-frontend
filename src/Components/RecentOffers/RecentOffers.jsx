import HeadingTag from "../Common/HeadingTag";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";

const RecentOffers = () => {
  const [offerData, setOfferData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/offer"
        );
        setOfferData(response.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };
    fetchData();
    return () => {};
  }, []);

  return (
    <section className="relative z-0 px-4 md:px-16">
      <HeadingTag text={"Recent Offers"} />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {offerData?.slice(0, 3).map((item, index) => (
            <div key={item.id} className="h-full">
              <div className="border border-gray-300 bg-white h-full flex flex-col">
                {/* Image container with fixed height */}
                <div className="w-full h-80 overflow-hidden">
                  <img
                    className="object-cover w-full h-full hover:scale-110 duration-700"
                    src={`https://backend.hotelorioninternational.com/${item?.image}`}
                    alt={item?.title || "Offer image"}
                  />
                </div>
                {/* Content container with flex-grow to fill remaining space */}
                <div className="flex-grow flex flex-col justify-between p-6">
                  <div className="text-center">
                    <h1 className="text-2xl text-[var(--primary)] font-semibold tracking-widest uppercase">
                      {item?.title}
                    </h1>
                    <p className="mt-4 font-[raleway] font-light text-gray-600 line-clamp-3">
                      {item?.description}
                    </p>
                  </div>
                  <div className="text-center mt-6">
                    <Link to="/contact" className="block">
                      <button className="border font-sans border-black px-5 py-3 hover:bg-red-500 hover:text-white tracking-widest border-opacity-40 w-2/3 duration-500">
                        Connect
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentOffers;
