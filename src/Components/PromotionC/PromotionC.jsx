import valentineOffer from "../../assets/Home page/valentineOffer.jpg";
import coupleNightStay from "../../assets/Home page/offer3.jpg";
import dayLong from "../../assets/Booking/dayLong1.jpg";
import coupleDayLong from "../../assets/Booking/dayLong2.jpg";
import bookingSlider1 from "../../assets/Home page/bookingSlider1.jpg";
import bookingSlider2 from "../../assets/Home page/bookingSlider2.jpg";
import bookingSlider3 from "../../assets/Home page/bookingSlider3.jpg";
import bookingSlider4 from "../../assets/Home page/bookingSlider4.jpg";
import bookingSlider5 from "../../assets/Home page/bookingSlider5.jpg";
import corporateEvent1 from "../../assets/Home page/facility02.jpg";
import corporateEvent2 from "../../assets/Home page/facility01.jpg";
import weddingDestination1 from "../../assets/Home page/weddingDestination1.jpg";
import weddingDestination2 from "../../assets/Home page/weddingDestination2.jpg";
import weddingDestination3 from "../../assets/Home page/weddingDestination3.jpg";

const MeetingAndEvents = [
    {
      id: 1,
      image: corporateEvent1,
      package: "Corporate Event",
      packageType: "Diamond",
      category: "corporateEvent",
      allImages: [ corporateEvent1, corporateEvent2 ],
      cost: "2200",
      discount: "700",
      included: ["BBQ Dinner", "Camfire", "Tent", "Breakfast", "Boating", "Swimming", "Playground"],
      description:
        "From a delectable breakfast to exciting activities like swimming, boating, and sports, we've crafted the perfect blend of fun. Kids have their zone, and everyone enjoys lunch and snacks. Book now for a day of memorable moments! 🎉🥂",
    },
    {
      id: 2,
      image: corporateEvent1,
      package: "Conference Room - Nagori",
      packageType: "Golden",
      category: "conferenceRoom",
      allImages: [ corporateEvent1, corporateEvent2 ],
      cost: "2200",
      discount: "600",
      included: ["Length (ft) - 45", "Width (ft) - 19", "Classroom - 32", "Theatre - 72", "U-shape - 30", "Banquet - 36", "Banner size - 8x4"],
      description:
        "From a delectable breakfast to exciting activities like swimming, boating, and sports, we've crafted the perfect blend of fun. Kids have their zone, and everyone enjoys lunch and snacks. Book now for a day of memorable moments! 🎉🥂",
    },
    {
      id: 3,
      image: corporateEvent1,
      package: "Conference Room - Rathora",
      packageType: "Silver",
      category: "conferenceRoom",
      allImages: [ corporateEvent1, corporateEvent2 ],
      cost: "3000",
      discount: "500",
      included: ["Length (ft) - 25", "Width (ft) - 19", "Classroom - 15", "Theatre - 20", "U-shape - 15", "Banquet - 15", "Banner size - 8x4"],
      description:
        "Celebrate love with our enchanting Valentine Package! Immerse yourselves in delightful meals, take a dip in a refreshing swim, and indulge in various experiences that together will weave the tapestry of cherished romantic memories.🎉🥂",
    },
    {
      id: 4,
      image: corporateEvent1,
      package: "Conference Room - Kanchan",
      packageType: "Silver",
      category: "conferenceRoom",
      allImages: [ corporateEvent1, corporateEvent2 ],
      cost: "2200",
      discount: "500",
      included: ["Length (ft) - 77", "Width (ft) - 20", "Classroom - 70", "Theatre - 130", "U-shape - 60", "Banquet - 60", "Banner size - 9x4"],
      description:
      "Embrace a night at Chuti Resort with evening snacks, BBQ dinner by the campfire, and a cozy tent stay. Wake up to a delightful breakfast and enjoy boating and swimming. Your perfect night escape awaits! 🌙🏕️🍴",
    },
    {
      id: 5,
      image: bookingSlider2,
      package: "Banquet",
      packageType: "Silver",
      category: "banquet",
      allImages: [ bookingSlider1, bookingSlider2, bookingSlider3, bookingSlider4, bookingSlider5],
      cost: "3000",
      discount: "500",
      included: ["Delicious Breakfast", "Sumptuous Lunch", "Tasty Afternoon Snacks", "Refreshing Swimming", "Indoor and Outdoor Playground", "Kids Zone",],
      description:
        "Celebrate love with our enchanting Valentine Package! Immerse yourselves in delightful meals, take a dip in a refreshing swim, and indulge in various experiences that together will weave the tapestry of cherished romantic memories.🎉🥂",
    },
    {
      id: 6,
      image: weddingDestination1,
      package: "Wedding Destinations",
      packageType: "Silver",
      category: "weddingDestinations",
      allImages: [ weddingDestination1, weddingDestination2, weddingDestination3 ],
      cost: "2200",
      discount: "500",
      included: ["BBQ Dinner", "Camfire", "Tent", "Breakfast", "Boating", "Swimming", "Playground"],
      description:
      "Embrace a night at Chuti Resort with evening snacks, BBQ dinner by the campfire, and a cozy tent stay. Wake up to a delightful breakfast and enjoy boating and swimming. Your perfect night escape awaits! 🌙🏕️🍴",
    },    
];
  
export default MeetingAndEvents;