import Axios from "axios";
import { useEffect, useState } from "react";
import { FetchUrls } from "../../Common/FetchUrls";
import { FaSearch, FaCalendarAlt, FaFilter } from "react-icons/fa";
import Pagination from "../../Common/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Loader } from "../../Common/Loader";
import NightStayAddons from "./NightStayAddons";
import DaylongAddons from "./DaylongAddons";
import BookingsTable from "./BookingsTable";
// import DuePaymentModal from "./DuePaymentModal";
import {
  useAddHousekeepingMutation,
  useUpdateAndAddPaymentMutation,
} from "../../../redux/baseApi/baseApi";
import DuePaymentModal from "../../Modal/DuePaymentModal/DuePaymentModal";

const AllBookings = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingPerPage, setBookingPerPage] = useState(10);
  const { register, handleSubmit } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [modaldata, setmodalData] = useState(null);
  const [addonsModalData, setAddonsModalData] = useState(null);
  const [roomsDataall, setRoomsDataall] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [nightStayModalOpen, setNightStayModalOpen] = useState(false);
  const [corporateChecked, setCorporateChecked] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // api from redux
  const [addHousekeeping] = useAddHousekeepingMutation();
  const [updateAndAddPayment] = useUpdateAndAddPaymentMutation();

  //invoice function
  const onhandleinvoice = async (data) => {
    try {
      const response = await Axios.get(
        FetchUrls(`bookings/datebookings?date=${data.date}`)
      );
      const databydate = response.data;
      navigate(`/dashboard/bookings/${data?.date}`, {
        state: { data: databydate },
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate report",
      });
    }
  };

  //data fetching
  const {
    data: bookingsData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allbookings", selectedRoom],
    queryFn: async () => {
      if (selectedRoom) {
        if (selectedRoom === "Corporate Due") {
          const getdata = await Axios.get(FetchUrls(`bookings/allbookings`));
          const filterCorporate = getdata?.data?.data?.filter(
            (item) => item?.isCorporate
          );
          return filterCorporate;
        } else {
          const getdata = await Axios.get(
            FetchUrls(`bookings/roombookings?roomname=${selectedRoom}`)
          );
          return getdata.data.data;
        }
      } else {
        const getdata = await Axios.get(FetchUrls(`bookings/allbookings`));
        const filterCorporate = getdata?.data?.data?.filter((item) => item);
        return filterCorporate;
      }
    },
  });

  const { data: roomsData = [] } = useQuery({
    queryKey: ["allrooms", addonsModalData?.bookingDate],
    queryFn: async () => {
      const datewiseRoom = await Axios.get(
        FetchUrls(`rooms/allrooms?date=${addonsModalData?.bookingDate}`)
      );
      const allrooms = await Axios.get(FetchUrls(`rooms/allrooms`));
      const combinedRooms = allrooms?.data?.data?.map((room) => {
        const datewiseAvailability = datewiseRoom?.data?.data?.find(
          (datewise) => datewise?.roomname === room?.roomname
        );

        const previousdaylong = datewiseRoom?.data?.daylong
          .map((item) => {
            if (item.bookingDate === addonsModalData?.bookingDate) {
              return item.roomType.includes(room?.roomname)
                ? item.roomsNumber
                : [];
            }
          })
          .flat();

        return {
          ...room,
          datewiseAvailability: datewiseAvailability
            ? datewiseAvailability.roomnumber
            : [],
          previousroom: previousdaylong || [],
        };
      });

      return {
        combinedRooms: combinedRooms,
        datewiseRoom: datewiseRoom,
      };
    },
  });

  useEffect(() => {
    if (addonsModalData?.bookingDate) {
      Axios.get(
        FetchUrls(`rooms/allrooms?date=${addonsModalData?.bookingDate}`)
      ).then((res) => {
        setRoomsDataall(res.data.todaysDaylong);
      });
    }
  }, [addonsModalData?.bookingDate]);

  if (isLoading) {
    return <Loader />;
  }

  const lastBookingIndex = currentPage * bookingPerPage;
  const firstBookingIndex = lastBookingIndex - bookingPerPage;
  const currentBooking = bookingsData.slice(
    firstBookingIndex,
    lastBookingIndex
  );

  //checkOut Function
  const handlecheckout = async (booking) => {
    if (booking.isCorporate) {
      // For corporate bookings, directly show confirmation dialog
      Swal.fire({
        title: "Are you sure you want to check out?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, check out",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Show loading state
          Swal.fire({
            title: "Processing checkout...",
            text: "Please wait while we check you out",
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
  
          try {
            const response = await Axios.put(
              FetchUrls(`bookings/updatebooking/${booking?._id}`)
            );
            if (response.status === 200) {
              // housekeeping data
              const housekeepingData = {
                roomName: booking?.roomNumber[0],
                isCleaning: true,
              };
  
              await addHousekeeping(housekeepingData);
  
              // Send SMS after successful checkout
              if (booking?.phone) {
                try {
                  await Axios.post(FetchUrls("sms-gateway/send-sms"), {
                    phone: booking.phone,
                  });
                  console.log("SMS sent successfully");
                } catch (smsError) {
                  console.log("SMS failed:", smsError);
                  // Don't show error to user, just log it
                }
              }
  
              Swal.fire({
                text:
                  response?.data?.message ||
                  "Booking Checked Out Successfully!",
                icon: "success",
              }).then(() => {
                refetch();
              });
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to check out",
            });
          }
        }
      });
    } else if (booking.dueAmount > 0) {
      // For non-corporate bookings with due amount, show payment modal
      setShowModal(true);
      setmodalData(booking);
    } else {
      // For non-corporate bookings with no due amount
      Swal.fire({
        title: "Are you sure you want to check out?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, check out",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Show loading state
          Swal.fire({
            title: "Processing checkout...",
            text: "Please wait while we check you out",
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
  
          try {
            const response = await Axios.put(
              FetchUrls(`bookings/updatebooking/${booking?._id}`)
            );
            if (response.status === 200) {
              // housekeeping data
              const housekeepingData = {
                roomName: booking?.roomNumber[0],
                isCleaning: true,
              };
  
              await addHousekeeping(housekeepingData);
  
              // Send SMS after successful checkout
              if (booking?.customerNumber) {
                try {
                  await Axios.post(FetchUrls("sms-gateway/send-sms"), {
                    phone: booking.customerNumber,
                  });
                  console.log("SMS sent successfully");
                } catch (smsError) {
                  console.log("SMS failed:", smsError);
                  // Don't show error to user, just log it
                }
              }
  
              Swal.fire({
                text:
                  response?.data?.message ||
                  "Booking Checked Out Successfully!",
                icon: "success",
              }).then(() => {
                refetch();
              });
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to check out",
            });
          }
        }
      });
    }
  };

  //Delete Function
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Axios.delete(FetchUrls(`bookings/deletebooking/${id}`)).then(
            (res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: "Deleted!",
                  text: res?.data?.message || "Booking Deleted Successfully!",
                  icon: "success",
                }).then(() => {
                  refetch();
                });
              }
            }
          );
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete booking",
          });
        }
      }
    });
  };

  //room Report Function
  const onhandleRoomReport = async (data) => {
    try {
      setSelectedRoom(data.roomname);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Bookings{" "}
            <span className="text-blue-600">({bookingsData?.length})</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Date Report Form */}
            <form
              className="flex gap-3 items-center"
              onSubmit={handleSubmit(onhandleinvoice)}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaCalendarAlt className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  {...register("date")}
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                />
              </div>
              <Link
                to={"/dashboard/inHouseGuests-report"}
                state={{ inHouseGuest: bookingsData }}
              >
                <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors">
                  Generate Report
                </button>
              </Link>
            </form>

            {/* Room Filter Form */}
            <form
              className="flex gap-3 items-center"
              onSubmit={handleSubmit(onhandleRoomReport)}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaFilter className="w-4 h-4 text-gray-500" />
                </div>
                <select
                  {...register("roomname")}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                >
                  <option value="">All Bookings</option>
                  <option value="Corporate Due">In House Guests</option>
                  {/* <option value="Royal Suite">Royal Suite</option>
                  <option value="Privilege Suite">Privilege Suite</option>
                  <option value="Family Room">Family Room</option>
                  <option value="Premium Twin">Premium Twin</option>
                  <option value="Platinum King">Platinum King</option> */}
                </select>
              </div>
              <button
                type="submit"
                className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors"
              >
                Filter
              </button>
            </form>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-96 mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search by name or phone number..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow">
        <BookingsTable
          currentBooking={currentBooking}
          search={search}
          firstBookingIndex={firstBookingIndex}
          handlecheckout={handlecheckout}
          handleOpen={handleOpen}
          setAddonsModalData={setAddonsModalData}
          setNightStayModalOpen={setNightStayModalOpen}
          handleDelete={handleDelete}
          setSelectedBooking={setSelectedBooking}
        />
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          totalItems={bookingsData.length}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          bookingPerPage={bookingPerPage}
        />
      </div>

      {/* Payment Modal - Now as a separate component */}
      <DuePaymentModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        modaldata={modaldata}
        updateAndAddPayment={updateAndAddPayment}
        refetch={refetch}
        setCorporateChecked={setCorporateChecked}
        corporateChecked={corporateChecked}
      />

      {/* Addons Modals */}
      <DaylongAddons
        handleClose={handleClose}
        open={open}
        setOpen={setOpen}
        roomsData={roomsData}
        roomsDataall={roomsDataall}
        addonsModalData={addonsModalData}
        refetch={refetch}
      />

      <NightStayAddons
        setNightStayModalOpen={setNightStayModalOpen}
        nightStayModalOpen={nightStayModalOpen}
        id={addonsModalData?._id}
        selectedBooking={selectedBooking}
        refetch={refetch}
      />
    </div>
  );
};

export default AllBookings;
