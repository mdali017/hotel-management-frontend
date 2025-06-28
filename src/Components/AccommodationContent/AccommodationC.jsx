import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { scroller } from "react-scroll";
import CardStyle from "../Common/CardStyle";
import HeadingTag from "../Common/HeadingTag";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Axios from "axios";

const AccommodationC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [accommodationData, setAccommodationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState({
    isVisible: false,
    itemData: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(
          "https://backend.hotelorioninternational.com/api/accomodations"
        );
        setAccommodationData(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching API data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollToSection = (sectionId) => {
    setTimeout(() => {
      scroller.scrollTo(sectionId, {
        duration: 800,
        delay: 0,
        smooth: true,
      });
    }, 0);
  };

  const handleTabSelect = (index) => {
    setActiveTabIndex(index);
  };

  return (
    <div>
      <div className="container mx-auto relative pt-[60px] lg:pt-[130px] w-full">
        <HeadingTag text={"Accommodation"} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : (
          <Tabs selectedIndex={activeTabIndex} onSelect={handleTabSelect}>
            <TabList className="flex flex-wrap justify-center gap-2 md:gap-6 md:text-xl my-5 font-semibold cursor-pointer">
              {accommodationData.map((category, index) => (
                <Tab
                  key={index}
                  className={`border border-primary md:py-2 whitespace-nowrap mx-1 text-sm px-3 md:px-8 rounded focus:outline-none ${
                    activeTabIndex === index ? "bg-primary text-white" : ""
                  }`}
                >
                  {category?.title}
                </Tab>
              ))}
            </TabList>

            {accommodationData.map((category, categoryIndex) => (
              <TabPanel key={categoryIndex}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[150px] gap-5 mb-40">
                  {category.accomodations &&
                  category.accomodations.length > 0 ? (
                    category.accomodations.map((item, index) => (
                      <CardStyle
                        key={index}
                        index={index} // Add index for animation direction
                        item={{
                          ...item,
                          image: `https://backend.hotelorioninternational.com/${item.image}`,
                          allImages: item.image ? [`${item.image}`] : [], // Prepare images for modal
                        }}
                        title={item.title}
                        type={"Package Type"}
                        name={item.package}
                        discount={"Discount"}
                        discountValue={"0%"} // Add default discount if not available
                        cost={"Rate"}
                        costValue={item.price}
                        showModal={showModal}
                        setShowModal={setShowModal}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 text-gray-500">
                      No accommodations available for this category.
                    </div>
                  )}
                </div>
              </TabPanel>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AccommodationC;
