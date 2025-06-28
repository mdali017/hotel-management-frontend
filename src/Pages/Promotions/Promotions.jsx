import React, { useEffect, useState } from "react";
// import CardStyle from "../../Components/Common/CardStyle";
import AmenityCard from "./AmenityCard";
import HeadingTag from "../../Components/Common/HeadingTag";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Axios from "axios";

const Promotions = () => {
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState("1");
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/ammenities"
        );
        setAmenitiesData(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching API data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Create tabs dynamically from amenities categories
  const tabCategories = amenitiesData.map(category => ({
    id: category.id,
    title: category.title
  }));

  return (
    <div className="container mx-auto relative pt-[60px] lg:pt-[120px] w-full">
      <HeadingTag text={"Amenities"} />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs>
          <TabList className="flex flex-wrap justify-center gap-2 md:gap-6 md:text-xl my-5 font-semibold cursor-pointer">
            {tabCategories.map((category, index) => (
              <Tab
                key={category.id}
                className={`border border-primary md:py-2 whitespace-nowrap mx-1 text-sm px-3 md:px-8 rounded focus:outline-none ${
                  value === String(index + 1) && "bg-primary text-white"
                }`}
                onClick={(e) => handleChange(e, String(index + 1))}
              >
                {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
              </Tab>
            ))}
          </TabList>

          {amenitiesData.map((category, index) => (
            <TabPanel key={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[150px] gap-5 mb-40">
                {category.ammenity.length > 0 ? (
                  category.ammenity.map((item, idx) => (
                    <AmenityCard
                      key={item.id}
                      index={idx}
                      item={{
                        ...item,
                        image: item.image,
                        category_id: category.title
                      }}
                      showModal={showModal}
                      setShowModal={setShowModal}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10">
                    <p className="text-gray-500">No amenities available in this category.</p>
                  </div>
                )}
              </div>
            </TabPanel>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default Promotions;