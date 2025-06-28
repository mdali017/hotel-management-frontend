import { Link } from "react-router-dom";
import Booking from "../../Components/Booking/Booking";
import Facility from "../../Components/Facility/Facility";
import Gallery from "../../Components/Gallery/Gallery";
import HeroSlider from "../../Components/HeroSlider/HeroSlider";
import OurPartners from "../../Components/OurPartners/OurPartners";
import RecentOffers from "../../Components/RecentOffers/RecentOffers";
import bg from "../../assets/footer-bg.svg";
import RoomsSuitesSection from "../../Components/RoomsSuitesSection/RoomsSuitesSection";
import FeaturedSection from "../../Components/FeaturedSection/FeaturedSection";

const Home = () => {
  return (
    <div className="relative" >
      <div className="bg-white absolute h-full w-full z-0 bg-opacity-90"></div>
      <HeroSlider />
      <RoomsSuitesSection />
      {/* <Booking /> */}
      {/* <Facility /> */}
        <FeaturedSection />
      <RecentOffers />
      <Gallery />
      {/* <OurPartners /> */}
      
    </div>
  );
};

export default Home;
