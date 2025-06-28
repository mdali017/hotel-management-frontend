import valentineOffer from "../../assets/Home page/valentineOffer.jpg";
import coupleNightStay from "../../assets/Home page/offer3.jpg";
import dayLong from "../../assets/Booking/dayLong1.jpg";
import coupleDayLong from "../../assets/Home page/CoupleDayLong.jpg";
import bookingSlider1 from "../../assets/Home page/bookingSlider1.jpg";
import bookingSlider2 from "../../assets/Home page/bookingSlider2.jpg";
import bookingSlider3 from "../../assets/Home page/bookingSlider3.jpg";
import bookingSlider4 from "../../assets/Home page/bookingSlider4.jpg";
import bookingSlider5 from "../../assets/Home page/bookingSlider5.jpg";

const PromotionsAndOffers = [
    {
      id: 1,
      image: dayLong,
      package: "Daylong Package",
      packageType: "Diamond",
      category: "Day_long",
      allImages: [ bookingSlider1, bookingSlider2, bookingSlider3, bookingSlider4, bookingSlider5],
      cost: "2200",
      discount: "700",
      included: ["BBQ Dinner", "Camfire", "Tent", "Breakfast", "Boating", "Swimming", "Playground"],
      description:
        "From a delectable breakfast to exciting activities like swimming, boating, and sports, we've crafted the perfect blend of fun. Kids have their zone, and everyone enjoys lunch and snacks. Book now for a day of memorable moments! 🎉🥂",
    },
    {
      id: 2,
      image: coupleDayLong,
      package: "Couple Daylong",
      packageType: "Golden",
      category: "Day_long",
      allImages: [ bookingSlider1, bookingSlider2, bookingSlider3, bookingSlider4, bookingSlider5],
      cost: "2200",
      discount: "600",
      included: ["BBQ Dinner", "Camfire", "Tent", "Breakfast", "Boating", "Swimming", "Playground"],
      description:
        "From a delectable breakfast to exciting activities like swimming, boating, and sports, we've crafted the perfect blend of fun. Kids have their zone, and everyone enjoys lunch and snacks. Book now for a day of memorable moments! 🎉🥂",
    },
    {
      id: 3,
      image: valentineOffer,
      package: "Valentine Offer",
      packageType: "Silver",
      category: "Day_long",
      allImages: [ bookingSlider1, bookingSlider2, bookingSlider3, bookingSlider4, bookingSlider5],
      cost: "3000",
      discount: "500",
      included: ["Delicious Breakfast", "Sumptuous Lunch", "Tasty Afternoon Snacks", "Refreshing Swimming", "Indoor and Outdoor Playground", "Kids Zone",],
      description:
        "Celebrate love with our enchanting Valentine Package! Immerse yourselves in delightful meals, take a dip in a refreshing swim, and indulge in various experiences that together will weave the tapestry of cherished romantic memories.🎉🥂",
    },
    {
      id: 4,
      image: coupleNightStay,
      package: "Couple Night Stay",
      packageType: "Silver",
      category: "Night_Stay",
      allImages: [ bookingSlider1, bookingSlider2, bookingSlider3, bookingSlider4, bookingSlider5],
      cost: "2200",
      discount: "500",
      included: ["BBQ Dinner", "Camfire", "Tent", "Breakfast", "Boating", "Swimming", "Playground"],
      description:
      "Embrace a night at Chuti Resort with evening snacks, BBQ dinner by the campfire, and a cozy tent stay. Wake up to a delightful breakfast and enjoy boating and swimming. Your perfect night escape awaits! 🌙🏕️🍴",
    },
    
];
  
export default PromotionsAndOffers;