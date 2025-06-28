import { addDays, format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import Axios from "axios";
import { FetchUrls } from "../Common/FetchUrls";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../Common/Loader";
import DaylongPackage from "./DaylongPackage/DaylongPackage";
import Button from "@mui/material/Button";
import { useForm, Controller } from "react-hook-form";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CorporateBooking from "./CorporateBooking/CorporateBooking";
import ShowCorporateBooking from "./CorporateBooking/ShowCorporateBooking";
import CustomerModal from "../Modal/CustomerModal";
import BookingModal from "../Modal/BookingModal/BookingModal";
import { createBookingsFormData } from "../Modal/BookingModal/BookingFormData";
import { Link, useNavigate } from "react-router-dom";
import useGetAllOnlineBookings from "../../hooks/useGetAllOnlineBooking";
import {
  useGetAllArrivalGuestQuery,
  // useGetAllArrivalGuestMutation,
  useGetRoomColorStatusQuery,
  useGetTodayCheckOutCustomerCountQuery,
} from "../../redux/baseApi/baseApi";
import HouseKeepingModal from "../Modal/HousekeepingModal/HousekeepingModal";
import ComplaintRoomModal from "../Modal/ComplaintRoomModal/ComplaintRoomModal";
import LogBook from "./LogBook/LogBook";
import DashboardFooter from "./Layout/DashboardHeader/DashboardFooter";

const Dashboard = () => {
  const [selectedDate, setselectedDate] = useState(new Date());
  const todaydate = format(selectedDate, "yyyy-MM-dd");
  const [showModal, setShowModal] = useState(false);
  const [selectfirstDate, setselectfirstDate] = useState(new Date());
  const [selectlastDate, setselectlastDate] = useState(addDays(new Date(), 1));
  const [discount, setDiscount] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);
  const [isFirstDatePickerVisible, setIsFirstDatePickerVisible] =
    useState(false);
  const [isLastDatePickerVisible, setIsLastDatePickerVisible] = useState(false);
  const [flatDiscount, setFlatDiscount] = useState(0);
  const [roomName, setRoomName] = useState([]);
  const [allRoomsNumber, setAllRoomsNumber] = useState([]);
  const [openCustomerDetails, setCustomerDetailsOpen] = useState(false);
  const [openBackDrop, setBackDropOpen] = useState(false);
  const [customerInfo, SetCustomerInfo] = useState([]);
  const [corporateBooking, setCorporateBooking] = useState([]);
  const [selectRoom, setselectRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentSystemDate, setCurrentSystemDate] = useState(new Date());
  const { allOnlineBookings, refetch: onlineBookingsRefetch } =
    useGetAllOnlineBookings();

  const [customerRoom, setCustomerRoom] = useState("");

  const [openHousekeepingModal, setOpenHouseKeepingModal] = useState(false);
  const [housekeepingRoom, setHousekeepingRoom] = useState("");

  const [openComplaintRoomModal, setOpenComplaintRoomModal] = useState(false);
  const [complaintRoom, setComplaintRoom] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const adminUser = user?.isAdmin === true;
  // console.log(adminUser);

  // Api From Redux
  const {
    data: roomsColorStatus,
    isLoading: isColorStatusLoading,
    refetch: ColorStatusRefetch,
  } = useGetRoomColorStatusQuery(todaydate, {
    pollingInterval: 20000, // Poll every 10 seconds
    refetchOnFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });

  const {
    data: todayCheckoutRoomsCount,
    refetch: todayCheckoutRoomsCountRefetch,
  } = useGetTodayCheckOutCustomerCountQuery();

  const { data: allArrivalGuest = [], isLoading: arrivalGuestLoading } =
    useGetAllArrivalGuestQuery();
  const TotalArrivalGuest = allArrivalGuest?.data;
  // console.log(TotalArrivalGuest)
  const todayCheckoutRoomsCountData = todayCheckoutRoomsCount?.data;
  // console.log(todayCheckoutRoomsCountData);

  const updatedRoomColorStatus = roomsColorStatus?.data;
  // console.log(updatedRoomColorStatus?.totalGuest)

  // Function to check if a room has an online booking
  const hasOnlineBooking = (roomNumber) => {
    if (!allOnlineBookings || !allOnlineBookings.data) return false;

    return allOnlineBookings.data.some((booking) => {
      if (!booking.roomNumber || !booking.isBookings) return false;

      // Handle comma-separated room numbers
      const bookingRooms = booking.roomNumber
        .split(",")
        .map((room) => room.trim());
      return bookingRooms.includes(roomNumber) && booking.isBookings === true;
    });
  };

  const handleDiscountChange = (e) => {
    const newDiscount = parseInt(e.target.value) || 0;
    setDiscount(newDiscount);
  };

  const toggleFirstDatePickerVisibility = () => {
    setIsFirstDatePickerVisible(!isFirstDatePickerVisible);
    setIsLastDatePickerVisible(false);
  };

  const toggleLastDatePickerVisibility = () => {
    setIsLastDatePickerVisible(!isLastDatePickerVisible);
    setIsFirstDatePickerVisible(false);
  };

  const {
    data: roomsData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allrooms", todaydate],
    queryFn: async () => {
      const datewiseRoom = await Axios.get(
        FetchUrls(`rooms/allrooms?date=${todaydate}`)
      );
      const allrooms = await Axios.get(FetchUrls(`rooms/allrooms`));
      const combinedRooms = allrooms?.data?.data?.map((room) => {
        const datewiseAvailability = datewiseRoom?.data?.data?.find(
          (datewise) => {
            return datewise?.roomname === room?.roomname;
          }
        );

        const daylongAvailabilities = datewiseRoom?.data?.daylong
          .map((item) => {
            return item.roomType.includes(room?.roomname)
              ? item.roomsNumber
              : [];
          })
          .flat();

        const previousdaylong = datewiseRoom?.data?.daylong
          .map((item) => {
            if (item.previousDate === todaydate) {
              return item.roomType.includes(room?.roomname)
                ? item.roomsNumber
                : [];
            }
          })
          .flat();

        return {
          ...room,
          daylongAvailblity: daylongAvailabilities,
          datewiseAvailability: datewiseAvailability
            ? datewiseAvailability.roomnumber
            : [],
          previousroom: previousdaylong,
        };
      });

      return {
        combinedRooms: combinedRooms,
        datewiseRoom: datewiseRoom,
      };
    },
  });

  const bookingsRoomsAll = {
    roomName,
    allRoomsNumber,
  };

  const roomCost = bookingsRoomsAll?.roomName?.reduce((totalCost, roomName) => {
    const roomDetails = roomsData?.combinedRooms?.find(
      (room) => room.roomname === roomName
    );
    if (roomDetails) {
      const selectedRoomNumbers = roomDetails.datewiseAvailability.filter(
        (roomNumber) => bookingsRoomsAll.allRoomsNumber.includes(roomNumber)
      );
      const roomCost = selectedRoomNumbers.length * roomDetails.cost;
      totalCost += roomCost;
    }
    return totalCost;
  }, 0);

  const calculateTotalAmount = () => {
    const daysDifference = Math.ceil(
      (selectlastDate - selectfirstDate) / (1000 * 3600 * 24)
    );
    const totalPaymentWithoutDiscount = daysDifference * roomCost;
    const discountedAmount = (totalPaymentWithoutDiscount * discount) / 100;
    const totalAmount = Math.ceil(
      totalPaymentWithoutDiscount - flatDiscount - discountedAmount
    );
    return totalAmount;
  };

  const singleRoomName = roomName.map((room1) => {
    const rooms = roomsData?.datewiseRoom?.data?.data.find(
      (item) => item?.roomname === room1
    );
    const roomnumbers = rooms?.roomnumber;
    return roomnumbers;
  });

  useEffect(() => {
    try {
      const availableRoomsget = async () => {
        const formatfirstdate = format(selectfirstDate, "yyyy-MM-dd");
        const formatlastdate = format(selectlastDate, "yyyy-MM-dd");
        const response = await Axios.get(
          FetchUrls(
            `rooms/getroombydate?firstdate=${formatfirstdate}&lastdate=${formatlastdate}`
          )
        );
        const rooms = response.data.data?.find(
          (item) => item?.roomname === selectRoom
        );
        // console.log(rooms);
        setAvailableRooms(rooms?.roomnumber);
      };

      availableRoomsget();
    } catch (error) {
      console.log(error);
    }
  }, [selectRoom, selectfirstDate, selectlastDate]);

  const disabledDates = bookedDates.flatMap((range) => {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    const disabledRange = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      disabledRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return disabledRange;
  });

  const bookingsFormData = createBookingsFormData(
    selectfirstDate,
    setselectfirstDate,
    selectlastDate,
    setselectlastDate,
    disabledDates,
    toggleFirstDatePickerVisibility,
    isFirstDatePickerVisible,
    toggleLastDatePickerVisibility,
    isLastDatePickerVisible,
    handleDiscountChange,
    setFlatDiscount,
    calculateTotalAmount
  );

  const customStyles = {
    "--rdp-cell-size": "26px",
    margin: "0px",
    "--rdp-caption-font-size": "12px",
  };

  const handleCustomerInfo = async (room) => {
    setBackDropOpen(true);
    setLoading(true);
    setCustomerRoom(room);
    // console.log(todaydate)
    try {
      const response = await Axios.get(
        FetchUrls(`bookings/roomnumber?roomnumber=${room}&date=${todaydate}`)
      );
      setLoading(false);
      setBackDropOpen(false);
      SetCustomerInfo(response?.data?.data);

      // Check if customer info exists and open the appropriate modal
      if (response?.data?.data && response.data.data.length > 0) {
        setCustomerDetailsOpen(true);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
      setShowModal(true);
      setBackDropOpen(false);
      // If there's an error, default to showing the booking modal
    }
  };

  // Function to handle online booking click
  const handleOnlineBookingClick = (room) => {
    // Find the booking for this room
    const booking = allOnlineBookings?.data?.find((booking) => {
      if (!booking.roomNumber) return false;

      // Handle comma-separated room numbers
      const bookingRooms = booking.roomNumber.split(",").map((r) => r.trim());
      return bookingRooms.includes(room) && booking.isBookings === true;
    });

    if (booking) {
      // Navigate to the booking page with the booking data
      navigate("/dashboard/add-booking", {
        state: { bookingData: booking },
      });
    } else {
      // Default behavior
      handleCustomerInfo(room);
    }
  };

  const handleHouseKeeper = (room) => {
    // console.log("Hi I am not ready !!!");
    setHousekeepingRoom(room);
    setOpenHouseKeepingModal(true); // Make sure this matches the state setter name exactly
  };

  const handleComplaintRoom = (room) => {
    // console.log("click", room)
    setComplaintRoom(room);
    setOpenComplaintRoomModal(true);
  };

  useEffect(() => {
    try {
      const fetchCorporateBooking = async () => {
        const res = await Axios.get(
          FetchUrls(`corporate/get-conferencehallbyname?date=${todaydate}`)
        );
        if (res.status === 200) {
          setCorporateBooking(res.data.data);
        }
      };
      fetchCorporateBooking();
    } catch (error) {
      console.log(error);
    }
  }, [todaydate]);

  useEffect(() => {
    ColorStatusRefetch();
  }, [navigate]);

  useEffect(() => {
    todayCheckoutRoomsCountRefetch();
  }, [navigate]);

  // if (loading) {
  //   return <h1>Loading...</h1>;
  // }

  return (
    <>
      <div className="container mx-auto">
        {/* Main flex container to allow side-by-side layout */}
        <div className="flex flex-col md:flex-row">
          {/* Calendar section - positioned on the side for md screens and up */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden md:sticky md:top-0 md:self-start ${
              showCalendar
                ? "max-h-[1000px] opacity-100 md:w-[250px]"
                : "max-h-0 opacity-0 md:w-0"
            }`}
            style={{
              marginRight: showCalendar ? "16px" : "0",
            }}
          >
            <div className="bg-gray-50 p-4 rounded-lg mb-5 border">
              <DayPicker
                style={window.innerWidth >= 768 && customStyles}
                mode="single"
                disabled={(day) =>
                  day < new Date(new Date().setHours(0, 0, 0, 0))
                }
                selected={selectedDate}
                onSelect={setselectedDate}
              ></DayPicker>
            </div>
            {/* <DaylongPackage />
            <CorporateBooking /> */}
          </div>

          {/* Main content area - takes remaining width */}
          <div className="flex-1">
            <div className="mb-3 flex justify-between items-center text-center mt-2 space-x-1">
              <div className="flex flex-col items-start">
                <h1>
                  <span className="text-sm font-semibold">Total Booked Rooms: </span>
                  <span className="text- text-green-500 font-bold">
                    {
                      (roomsColorStatus?.data?.registeredAndNotTodayCheckout
                        ?.length || 0) +
                        (roomsColorStatus?.data
                          ?.previousRegisteredAndNotTodayCheckout?.length || 0)
                      // (roomsColorStatus?.data?.registeredAndTodayCheckout
                      //   ?.length || 0)
                    }
                  </span>
                </h1>
                <h1>
                  <span className="text-sm font-semibold">
                    Todays New Booked:{" "}
                  </span>
                  <span className="text- text-green-500 font-bold">
                    {roomsColorStatus?.data?.registeredAndNotTodayCheckout
                      ?.length || 0}
                  </span>
                </h1>
                <h1>
                  <span className="text-sm font-semibold">
                    Previous Booked :{" "}
                  </span>
                  <span className="text-xl text-blue-500 font-bold">
                    {roomsColorStatus?.data
                      ?.previousRegisteredAndNotTodayCheckout?.length || 0}
                  </span>
                </h1>
              </div>

              <div className="flex">
                <div className="flex">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    {showCalendar ? "Hide Calendar" : "Calendar"}
                  </Button>
                  {adminUser && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#FFDC33",
                        color: "#000",
                        mx: 1,
                        ":hover": { backgroundColor: "#FFDC33" },
                      }}
                      size="small"
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      Reservation
                    </Button>
                  )}
                  {adminUser && (
                    <Link to={"/dashboard/add-booking"}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ marginRight: "2px", paddingY: "10px" }}
                      >
                        Registration
                      </Button>
                    </Link>
                  )}
                </div>
                {/* {adminUser && ( */}
                <div className="flex gap-3">
                  <Link to={"/dashboard/bookings"}>
                    <div className="relative inline-block">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#FF160E",
                          paddingY: "10px",
                          mx: 1,
                          ":hover": { backgroundColor: "#FF160E" },
                        }}
                        size="small"
                      >
                        In House Guests
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-white text-red-500 text-xs font-bold rounded-full border-2 border-red-500">
                          {roomsColorStatus?.data?.registeredAndTodayCheckout
                            ?.length +
                            roomsColorStatus?.data
                              ?.registeredAndNotTodayCheckout?.length +
                            roomsColorStatus?.data
                              ?.previousRegisteredAndNotTodayCheckout?.length ||
                            0}
                        </span>
                      </Button>
                    </div>
                  </Link>
                  <Link to={"/dashboard/bookings-guest"}>
                    <div className="relative inline-block">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#FFDA33",
                          color: "black",
                          paddingY: "10px",
                          mx: 1,
                          ":hover": { backgroundColor: "#FFDA33" },
                        }}
                        size="small"
                        onClick={() => {
                          setShowModal(true);
                        }}
                      >
                        On Arrival Guests
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-white border-2  border-yellow-500 text-black text-xs font-bold rounded-full">
                          {/* {roomsColorStatus?.data?.bookingRooms?.length || 0} */}
                          {TotalArrivalGuest?.length || 0}
                        </span>
                      </Button>
                    </div>
                  </Link>

                  <Link to={"/dashboard/todaycheckout-guests"}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#0067C0", paddingY: "10px" }}
                      size="small"
                      // className="w-6 h-6"
                    >
                      Today's Checkout
                    </Button>
                  </Link>
                </div>
                {/* )} */}
              </div>

              <div className="flex flex-col items-start">
                <h1>
                  <span className="text-sm font-semibold">
                    Today's Total Checkout :{" "}
                  </span>
                  <span className="text-lg text-red-500 font-bold">
                    {(roomsColorStatus?.data?.registeredAndTodayCheckout
                      ?.length || 0) +
                      (roomsColorStatus?.data?.todayCheckedOutRooms || 0)}{" "}
                    {todayCheckoutRoomsCountData?.length > 0 ? (
                      <span>+ {todayCheckoutRoomsCountData?.length}</span>
                    ) : (
                      ""
                    )}
                  </span>
                </h1>
                <h1>
                  <span className="text-sm font-semibold">
                    Already CheckedOut :{" "}
                  </span>
                  <span className="text-lg text-red-500 font-bold">
                    {roomsColorStatus?.data?.todayCheckedOutRooms || 0}
                    {todayCheckoutRoomsCountData?.length > 0 ? (
                      <span>+ {todayCheckoutRoomsCountData?.length}</span>
                    ) : (
                      ""
                    )}
                  </span>
                </h1>

                {roomsColorStatus?.data?.lateCheckOutRooms?.length > 0 ? (
                  <h1>
                    <span className="text-sm font-semibold">
                      Late Checkout Guests:
                    </span>
                    <span className="text-xl text-amber-500 font-bold">
                      {roomsColorStatus?.data?.lateCheckOutRooms?.length || 0}
                    </span>
                  </h1>
                ) : (
                  <h1>
                    <span className="text-sm font-semibold">
                      Today's CheckOut :{" "}
                    </span>
                    <span className="text-xl text-red-500 font-bold">
                      {roomsColorStatus?.data?.registeredAndTodayCheckout
                        ?.length || 0}
                    </span>
                  </h1>
                )}
              </div>
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {roomsData?.combinedRooms?.map((item) => {
                  return (
                    <>
                      <div
                        key={item?._id}
                        className={`${
                          item?.roomname === "Premium Twin"
                            ? "col-span-1 md:col-span-2 border p-2 rounded-lg"
                            : "border p-2 rounded-lg"
                        } bg-secondary bg-opacity-10`}
                      >
                        <h1 className="font-[raleway] font-extrabold text-secondary text-xl">
                          {item?.roomname}
                        </h1>
                        <p className="text-xs text-gray-600">
                          BedType - {item?.bedtype}
                        </p>
                        <p className="text-xs text-gray-600 mb-5">
                          {" "}
                          Price - {item?.cost} Taka
                        </p>
                        <div className="flex gap-2 flex-wrap mb-5">
                          {item?.roomnumber.map((room, index) => {
                            function assign_button_color(item, room) {
                              if (
                                updatedRoomColorStatus?.registeredAndTodayCheckout?.includes(
                                  room
                                ) &&
                                updatedRoomColorStatus?.lateCheckOutRooms?.includes(
                                  room
                                )
                              ) {
                                return "border p-2 rounded-lg font-bold bg-gradient-to-r from-amber-500 to-red-600 hover:from-red-600 hover:to-red-800 duration-500 text-white";
                                // return "border p-2 rounded-lg font-bold bg-gradient-to-r from-red-700 to-red-500 duration-500 text-white";
                              }
                              if (
                                updatedRoomColorStatus?.registeredAndTodayCheckout?.includes(
                                  room
                                )
                              ) {
                                return "border p-2 rounded-lg font-bold bg-red-500 hover:bg-red-600 duration-500 text-white";
                              }

                              if (
                                updatedRoomColorStatus?.registeredAndNotTodayCheckout?.includes(
                                  room
                                )
                              ) {
                                return "border p-2 rounded-lg font-bold bg-green-600 hover:bg-green-700 duration-500 text-white";
                              }
                              if (
                                updatedRoomColorStatus?.previousRegisteredAndNotTodayCheckout?.includes(
                                  room
                                )
                              ) {
                                return "border p-2 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 duration-500 text-white";
                              }

                              if (
                                updatedRoomColorStatus?.bookingRooms?.includes(
                                  room
                                )
                              ) {
                                return "border p-2 rounded-lg font-bold bg-yellow-400 hover:bg-yellow-500 duration-500";
                              }
                              if (
                                updatedRoomColorStatus?.housekeepingRooms?.includes(
                                  room
                                )
                              ) {
                                return "housekeeping-animated";
                              }
                              if (
                                updatedRoomColorStatus?.complaintRooms?.includes(
                                  room
                                )
                              ) {
                                return "border p-2 rounded-lg font-bold bg-black hover:bg-[#FF8C00] text-white duration-500";
                              }

                              // Default for available rooms
                              return "border py-2 px-3 rounded-lg font-semibold text-secondary bg-gray-100 hover:bg-gray-300 border-primary duration-500";
                            }

                            // First, add a function to get the count for a specific room number
                            const getRoomCount = (
                              roomNumber,
                              todayCheckoutRoomsCountData
                            ) => {
                              if (
                                !todayCheckoutRoomsCountData ||
                                !Array.isArray(todayCheckoutRoomsCountData)
                              ) {
                                return null;
                              }

                              const roomData = todayCheckoutRoomsCountData.find(
                                (item) => item.roomNumber === roomNumber
                              );

                              return roomData ? roomData.count : null;
                            };

                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  // Check if room has online booking first (highest priority)
                                  if (hasOnlineBooking(room)) {
                                    handleOnlineBookingClick(room);
                                  }
                                  // Check if room is in any of the registered categories from updatedRoomColorStatus
                                  else if (
                                    updatedRoomColorStatus?.registeredAndTodayCheckout?.includes(
                                      room
                                    ) ||
                                    updatedRoomColorStatus?.registeredAndNotTodayCheckout?.includes(
                                      room
                                    ) ||
                                    updatedRoomColorStatus?.previousRegisteredAndNotTodayCheckout?.includes(
                                      room
                                    )
                                  ) {
                                    // Room is registered, get customer info and open customer modal
                                    adminUser && handleCustomerInfo(room);
                                  } else if (
                                    updatedRoomColorStatus?.housekeepingRooms?.includes(
                                      room
                                    )
                                  ) {
                                    // console.log("Yes this room under the housekeeper !!!")
                                    handleHouseKeeper(room);
                                  } else if (
                                    updatedRoomColorStatus?.complaintRooms?.includes(
                                      room
                                    )
                                  ) {
                                    handleComplaintRoom(room);
                                  }
                                  // If not in datewiseAvailability but not registered (could be daylong booking)
                                  else if (
                                    !item.datewiseAvailability.includes(room)
                                  ) {
                                    // If the room is booked (not in datewiseAvailability), get customer info
                                    handleCustomerInfo(room);
                                  }
                                  // Room is available
                                  else {
                                    // Room is available, navigate to booking page
                                    navigate("/dashboard/add-booking");
                                  }
                                }}
                                className={`${assign_button_color(
                                  item,
                                  room
                                )} relative`}
                              >
                                {room}
                                {getRoomCount(
                                  room,
                                  todayCheckoutRoomsCountData
                                ) && (
                                  <span className="absolute -right-2 -top-2 flex items-center justify-center w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full">
                                    {getRoomCount(
                                      room,
                                      todayCheckoutRoomsCountData
                                    )}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })}
                <div className="col-span-1 md:col-span-1">
                  <LogBook />
                </div>
              </div>
            )}
          </div>
        </div>
        <DashboardFooter updatedRoomColorStatus={updatedRoomColorStatus} />
      </div>

      <BookingModal
        isVisible={showModal}
        setShowModal={setShowModal}
        bookingsFormData={bookingsFormData}
        refetch={onlineBookingsRefetch}
        roomsColorStatus={roomsColorStatus}
        ColorStatusRefetch={ColorStatusRefetch}
      />
      <CustomerModal
        openCustomerDetails={openCustomerDetails}
        setCustomerDetailsOpen={setCustomerDetailsOpen}
        customerInfo={customerInfo}
        openBackDrop={openBackDrop}
        customerRoom={customerRoom}
        refetch={refetch}
      />
      <HouseKeepingModal
        setOpenHouseKeepingModal={setOpenHouseKeepingModal}
        openHousekeepingModal={openHousekeepingModal}
        housekeepingRoom={housekeepingRoom}
        ColorStatusRefetch={ColorStatusRefetch}
      />
      <ComplaintRoomModal
        openComplaintRoomModal={openComplaintRoomModal}
        setOpenComplaintRoomModal={setOpenComplaintRoomModal}
        complaintRoom={complaintRoom}
        ColorStatusRefetch={ColorStatusRefetch}
      />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
