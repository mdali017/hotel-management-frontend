import { useNavigate } from "react-router-dom";
import HeadingTag from "../Common/HeadingTag";
import { fadeIn } from "../../variants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Axios from "axios";

const Facility = () => {
  const navigate = useNavigate();
  const [facilitiesItem, setFacilitiesItem] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/facilities"
        );
        setFacilitiesItem(response.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };
    fetchData();
    return () => {};
  }, []);
  const handleFacilities = (id) => {
    navigate("/facilities-page");
  };

  return (
    <section>
      <HeadingTag text={"FACILITIES & SERVICES"} />
      <div className="mx-auto mt-8 shadow-black/30">
        <motion.div
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileInView={"show"}
          viewport={{ once: true, amount: 0.7 }}
          className="md:flex [&>div:hover]:w-full"
        >
          {facilitiesItem?.slice(0, 5).map((facility, index) => (
            <div
              onClick={() => handleFacilities(index)}
              key={index}
              className={`group relative h-[200px] md:h-[400px] lg:h-screen w-full md:w-1/4 cursor-pointer overflow-hidden shadow-lg transition-all duration-700 ${
                index === 4 ? "bg-gray-900" : ""
              }`}
            >
              {index <= 4 ? (
                <img
                  className={`h-full w-full object-cover duration-700 transition-all group-hover:rotate-3 group-hover:scale-125 ${
                    index === 4 ? "bg-gray-900 opacity-40" : ""
                  }`}
                  src={`https://backend.hotelorioninternational.com/${facility?.image}`}
                  alt=""
                />
              ) : (
                "Hi Bangladesh"
              )}
              <div className="visible absolute inset-0 group-hover:invisible">
                <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
                  <div className="w-full text-center text-white bg-black bg-opacity-30">
                    <p className="font-semibold text-md md:text-lg lg:text-xl p-4">
                      {index === 4 ? "See more" : facility.title}
                    </p>
                  </div>
                </div>
              </div>
              <div className="invisible absolute inset-0 bg-gradient-to-b from-green-500/20 to-black group-hover:visible">
                <div className="absolute w-full mx-auto py-3 border-t border-gray-800 bottom-0">
                  <div className="flex justify-center gap-3 text-white">
                    <p className="font-bold uppercase text-md md:text-lg lg:text-xl text-gray-100">
                      {index === 4 ? "See more" : facility.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Facility;
