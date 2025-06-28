//import roomTypesArray from "./Data";
import image1 from "../../assets/Booking/booking1.jpg";
import royalSuit1 from "../../assets/Booking/royalSuit1.jpg";
import image2 from "../../assets/Booking/booking2.jpg";
import image3 from "../../assets/Booking/booking3.jpg";
import familyRoom2 from "../../assets/Booking/familyRoom2.jpg";
import familyRoom3 from "../../assets/Booking/familyRoom3.jpg";
import familyRoom4 from "../../assets/Booking/familyRoom4.jpg";
import familyRoom5 from "../../assets/Booking/familyRoom5.jpg";
import royalSuit2 from "../../assets/Booking/royalSuit2.jpg";
import royalSuit3 from "../../assets/Booking/royalSuit3.jpg";
import familyRoom1 from "../../assets/Booking/familyRoom1.jpg";
import image123 from "../../assets/Booking/booking123.jpg"
import PrivilegedSuite1 from "../../assets/Home page/PrivilegedSuite360.jpg";
import platinumKing1 from "../../assets/Home page/platinumKing1.jpg"

const roomTypesArray = [
  {
    roomID: "familyRoom",
    roomType: "Deluxe Single",
    image: familyRoom1,
    allImages: [familyRoom2, familyRoom3, familyRoom4, familyRoom5],
    bedType: "1 King Size & 1 Single Size Bed",
    maxCapacity: "2 Adult & 2 Child",
    description :
      "Our Family Room provides a perfect blend of comfort and space for a memorable family stay. Featuring a luxurious king-size bed and an additional single-size bed, this room is ideal for a family of two adults and two children. Enjoy the serene green view from your room and benefit from daily housekeeping support. The room is equipped with air conditioning, an attached washroom/bathroom, and modern amenities including a flat-screen TV, mini fridge, and an electric kettle with complimentary in-room tea/coffee. Additionally, you'll have access to hot & cold water, toiletries, Wi-Fi, towel, and an intercom for your convenience. Indulge in our Room with Breakfast package to make your stay even more delightful.",
    amenities: [
      "Housekeeping Support-Daily",
      "Green View",
      "Air Conditioning",
      "Attached Washroom/Bathroom",
      "1 Bottle of Mineral Water With Water Glass",
      "Hot & Cold Water(Geyser)",
      "Electric Kettle with Complementary in room Tea/Coffee",
      "Flat Screen TV",
      "Mini Fridge",
      "Toiletries",
      "WIFI",
      "Towel",
      "Intercom",
    ],
    roomPackage: {
        type: "Room with Breakfast",
        cost: 5095,
        discount: 3500,
    },
  },

  {
    roomID: "royalSuit",
    roomType: "Deluxe Couple/Twin",
    image: royalSuit1,
    allImages: [royalSuit2, royalSuit3, royalSuit1],
    bedType: "2 King Size Bed",
    maxCapacity: "4 Adult, 2 Child",
    description :
      "Experience grandeur and luxury in our Royal Suite, a spacious retreat designed for an indulgent stay. The suite features two lavish king-size beds, providing ample space for a comfortable night's rest. Enjoy breathtaking views of the swimming pool, complemented by daily housekeeping support to maintain a pristine environment. The room is equipped with essential amenities, including air conditioning, an attached washroom/bathroom, and conveniences like a flat-screen TV. Additionally, our suite offers hot & cold water, toiletries, Wi-Fi, towel, and an intercom for your convenience. Revel in the opulence of the Royal Suite and start your day right with our Room with Breakfast package.",
    amenities: [
      "Housekeeping Support-Daily",
      "Swimming Pool View",
      "Air Conditioning",
      "Attached Washroom/Bathroom",
      "1 Bottle of Mineral Water With Water Glass",
      "Hot & Cold Water(Geyser)",
      "Flat Screen TV",
      "Toiletries",
      "WIFI",
      "Towel",
      "Intercom",
    ],
    roomPackage: {
      type: "Room with Breakfast",
      cost: 6550,
      discount: 5000,
    },
  },

  {
    roomID: "premiumTwin",
    roomType: "Orion Suite",
    image: image123,
    allImages: [image1, image2, image3],
    bedType: "2 Single Size Bed",
    maxCapacity: "2 Adult",
    description :
      "Our Premium Twin room offers a spacious and comfortable stay with modern amenities. Ideal for travelers seeking a relaxing experience, this room features 2 single size beds, air conditioning, a flat-screen TV, and a private attached washroom/bathroom. Enjoy a picturesque view of the swimming pool and daily housekeeping support. The package includes a complimentary bottle of mineral water, hot & cold water (geyser), toiletries, Wi-Fi, towel, and an intercom for your convenience.",
    amenities: [
      "Housekeeping Support-Daily",
      "Swimming Pool View",
      "Air Conditioning",
      "Attached Washroom/Bathroom",
      "1 Bottle of Mineral Water With Water Glass",
      "Hot & Cold Water(Geyser)",
      "Flat Screen TV",
      "Toiletries",
      "WIFI",
      "Towel",
      "Intercom",
    ],
    roomPackage: {
      type: "Room with Breakfast",
      cost: 8000,
      discount: 5500,
    },
  },

  {
    roomID: "platinumKing",
    roomType: "Executive Suite",
    image: platinumKing1,
    allImages: [platinumKing1, royalSuit3, royalSuit1],
    bedType: "1 King Size Bed",
    maxCapacity: "2 Adult 1 Child",
    description:
      "Indulge in luxury with our Platinum King Room, offering a sophisticated retreat for a comfortable stay. The room features a plush king-size bed, providing a tranquil environment for a restful night's sleep. Enjoy the refreshing green view from your window and experience daily housekeeping support for a pristine living space. The room is equipped with modern amenities, including air conditioning, an attached washroom/bathroom, and conveniences like a flat-screen TV, mini fridge, and an electric kettle with complimentary in-room tea/coffee. Relax with the assurance of hot & cold water, toiletries, Wi-Fi, towel, and an intercom at your disposal. Enhance your stay with our Room with Breakfast package, ensuring a delightful start to your day.",
    amenities: [
      "Housekeeping Support-Daily",
      "Green View",
      "Air Conditioning",
      "Attached Washroom/Bathroom",
      "1 Bottle of Mineral Water With Water Glass",
      "Hot & Cold Water(Geyser)",
      "Electric Kettle with Complementary in room Tea/Coffee",
      "Flat Screen TV",
      "Mini Fridge",
      "Toiletries",
      "WIFI",
      "Towel",
      "Intercom",
    ],
    roomPackage: {
      type: "Room with Breakfast",
      cost: 10185,
      discount: 7000,
    },
  },

  {
    roomID: "privilegeSuite",
    roomType: "Royal Suite",
    image:PrivilegedSuite1,
    allImages: [PrivilegedSuite1, royalSuit2, royalSuit1],
    bedType: "1 Master Bed",
    maxCapacity: "2 Adult 1 Child",
    description :
      "Step into opulence with our Privilege Suite, a haven of comfort and luxury for an unforgettable stay. The suite boasts a spacious master bed, ensuring a restful night's sleep in a stylish and serene setting. Enjoy the picturesque green view from your suite, complemented by daily housekeeping support for a pristine living environment. Our suite is equipped with top-notch amenities, including air conditioning, an attached washroom/bathroom, and modern conveniences like a flat-screen TV, mini fridge, and an electric kettle with complementary in-room tea/coffee. Pamper yourself with the assurance of hot & cold water, toiletries, Wi-Fi, towel, and an intercom at your fingertips. Elevate your stay with our Room with Breakfast package, providing a delightful start to your day.",
    amenities: [
      "Housekeeping Support-Daily",
      "Green View",
      "Air Conditioning",
      "Attached Washroom/Bathroom",
      "1 Bottle of Mineral Water With Water Glass",
      "Hot & Cold Water(Geyser)",
      "Electric Kettle with Complementary in room Tea/Coffee",
      "Flat Screen TV",
      "Mini Fridge",
      "Toiletries",
      "WIFI",
      "Towel",
      "Intercom",
    ],
    roomPackage: {
        type: "Room with Breakfast",
        cost: 13090,
        discount: 9000,
    },
  },
];

export default roomTypesArray;
