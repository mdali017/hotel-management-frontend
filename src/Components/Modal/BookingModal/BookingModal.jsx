import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
} from "@mui/material";
import { DayPicker } from "react-day-picker";
import { Controller, useForm } from "react-hook-form";
import { format, addDays } from "date-fns";
import Axios from "axios";
import { FetchUrls } from "../../Common/FetchUrls";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const BookingModal = ({
  isVisible,
  setShowModal,
  refetch: allBookingRefetch,
  roomsColorStatus,
  ColorStatusRefetch,
}) => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const todaydate = format(selectedDate, "yyyy-MM-dd");
  const [selectfirstDate, setSelectFirstDate] = useState(new Date());
  const [selectlastDate, setSelectLastDate] = useState(addDays(new Date(), 1));
  const [isFirstDatePickerVisible, setIsFirstDatePickerVisible] =
    useState(false);
  const [isLastDatePickerVisible, setIsLastDatePickerVisible] = useState(false);
  const [roomName, setRoomName] = useState([]);
  const [allRoomsNumber, setAllRoomsNumber] = useState([]);
  const [payment, setPayment] = useState(null);
  const [selectRoom, setSelectRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [roomTypeOption, setRoomTypeOption] = useState("isSingle");

  // console.log(roomTypeOption)

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm();

  // Toggle date picker visibility
  const toggleFirstDatePickerVisibility = () => {
    setIsFirstDatePickerVisible(!isFirstDatePickerVisible);
    setIsLastDatePickerVisible(false);
  };

  const toggleLastDatePickerVisibility = () => {
    setIsLastDatePickerVisible(!isLastDatePickerVisible);
    setIsFirstDatePickerVisible(false);
  };

  // Fetch rooms data
  const {
    data: roomsData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allrooms", todaydate],
    queryFn: async () => {
      try {
        const datewiseRoom = await Axios.get(
          FetchUrls(`rooms/allrooms?date=${todaydate}`)
        );
        const allrooms = await Axios.get(FetchUrls(`rooms/allrooms`));

        const combinedRooms = allrooms?.data?.data?.map((room) => {
          const datewiseAvailability = datewiseRoom?.data?.data?.find(
            (datewise) => datewise?.roomname === room?.roomname
          );

          return {
            ...room,
            datewiseAvailability: datewiseAvailability
              ? datewiseAvailability.roomnumber
              : [],
          };
        });

        return {
          combinedRooms: combinedRooms,
          datewiseRoom: datewiseRoom,
        };
      } catch (error) {
        console.error("Error fetching rooms data:", error);
        return { combinedRooms: [], datewiseRoom: { data: { data: [] } } };
      }
    },
  });

  // Fetch available rooms when room type or dates change
  useEffect(() => {
    try {
      const getAvailableRooms = async () => {
        if (!selectRoom) return;

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

        // Filter out rooms that are in the bookingRooms list
        const filteredRooms =
          rooms?.roomnumber?.filter(
            (room) => !roomsColorStatus?.data?.bookingRooms?.includes(room)
          ) || [];

        setAvailableRooms(filteredRooms);
      };

      getAvailableRooms();
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  }, [
    selectRoom,
    selectfirstDate,
    selectlastDate,
    roomsColorStatus?.data?.bookingRooms,
  ]);

  // Calculate total amount based on room selection and dates
  const calculateTotalAmount = () => {
    if (
      !roomsData?.combinedRooms ||
      !roomName.length ||
      !allRoomsNumber.length
    ) {
      return 0;
    }

    const daysDifference = Math.ceil(
      (selectlastDate - selectfirstDate) / (1000 * 3600 * 24)
    );

    // Calculate total cost based on selected rooms
    const totalRoomCost = roomName.reduce((totalCost, room) => {
      const roomDetails = roomsData.combinedRooms.find(
        (r) => r.roomname === room
      );

      if (roomDetails) {
        let updatedRoomCost = 1;
        if (roomTypeOption === "isSingle") {
          updatedRoomCost = roomDetails?.isSingleCost;
        } else {
          updatedRoomCost = roomDetails?.cost;
        }
        const selectedRoomsCount = allRoomsNumber.length;
        const roomCost = selectedRoomsCount * updatedRoomCost;
        totalCost += roomCost;
      }
      return totalCost;
    }, 0);

    return daysDifference * totalRoomCost;
  };

  // Handle numeric input validation
  const handleKeyCheck = (e) => {
    const isAllowedKey =
      (e.key >= "0" && e.key <= "9") ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Backspace" ||
      e.key === "Delete";

    if (!isAllowedKey) {
      e.preventDefault();
    }

    return isAllowedKey;
  };

  // Form submission handler
  const onSubmit = (data) => {
    const totalAmount = calculateTotalAmount();
    const advancePayment = Number(data.paidAmount) || 0;

    const bookingData = {
      customerName: data.customerName,
      customerNumber: data.customerNumber,
      person: 1,
      companyNameAddress: data.companyNameAddress,
      hostNameAndNumber: data.hostNameAndNumber,
      roomType: roomName[0], // Using the first selected room type
      roomNumber: allRoomsNumber.join(", "), // Joining all room numbers into a string
      roomsNeed: allRoomsNumber.length,
      chekinDate: format(selectfirstDate, "yyyy-MM-dd"),
      chekoutDate: format(selectlastDate, "yyyy-MM-dd"),
      additionalInformation: data.additionalInformation || "",
      paymentMethod: data.paymentMethod === "Cash" ? 1 : 2, // 1 for Cash, 2 for others
      advancePayment: advancePayment,
      isSingle: roomTypeOption === "isSingle" ? true : false, // 1 for Single, 0 for Couple
    };

    console.log(bookingData, "Booking Data");

    try {
      Axios.post(
        FetchUrls("onlinebooking/add-onlinebookings"),
        bookingData
      ).then((res) => {
        if (res.status === 200) {
          setShowModal(false);
          allBookingRefetch();
          ColorStatusRefetch();
          Swal.fire({
            title: "Success!",
            text: "Booking Added Successfully!",
            icon: "success",
          });
          reset();
        } else {
          Swal.fire({
            title: "Error!",
            text: "Something Went Wrong!",
            icon: "error",
          });
        }
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit booking. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <Dialog
      open={isVisible}
      onClose={() => setShowModal(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold w-full text-center">
            Booking Form
          </h1>
          <button
            className="text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200"
            onClick={() => {
              setShowModal(false);
              reset();
            }}
          >
            X
          </button>
        </div>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
          <div className="grid grid-cols-2 gap-5">
            {/* Guest's Name */}
            <div>
              <label className="text-md font-bold block">Name</label>
              <input
                {...register("customerName", { required: true })}
                type="text"
                placeholder="Guest's Name"
                className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
              />
              {errors.customerName && (
                <span className="text-red-500 text-sm">Name is required</span>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-md font-bold block">Contact Number</label>
              <input
                {...register("customerNumber")}
                type="text"
                placeholder="Contact Number"
                // onKeyDown={handleKeyCheck}
                className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
              />
              {/* {errors.customerNumber && (
                <span className="text-red-500 text-sm">
                  Contact Number is required
                </span>
              )} */}
            </div>

            {/* Company Name / Address */}
            <div>
              <label className="text-md font-bold block">
                Company Name / Address
              </label>
              <input
                {...register("companyNameAddress")}
                type="text"
                placeholder="Company Name / Address"
                className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
              />
            </div>

            {/* Host Name */}
            <div>
              <label className="text-md font-bold block">
                Host Name & Number
              </label>
              <input
                {...register("hostNameAndNumber")}
                type="text"
                placeholder="Host Name & Number"
                className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
              />
            </div>

            {/* Check in Date */}
            <div>
              <label className="text-md font-bold block">Check in Date</label>
              <div className="relative">
                <input
                  onClick={toggleFirstDatePickerVisibility}
                  className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                  value={format(selectfirstDate, "dd.MM.yyyy")}
                  placeholder="Select Check in Date"
                  type="text"
                  readOnly
                />
                {isFirstDatePickerVisible && (
                  <DayPicker
                    className="absolute border p-3 -left-4 z-10 bg-white shadow-xl"
                    mode="single"
                    selected={selectfirstDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectFirstDate(date);
                        toggleFirstDatePickerVisibility();
                      }
                    }}
                    disabled={(day) =>
                      day < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                )}
              </div>
            </div>

            {/* Check Out Date */}
            <div>
              <label className="text-md font-bold block">Check Out Date</label>
              <div className="relative">
                <input
                  onClick={toggleLastDatePickerVisibility}
                  className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                  value={format(selectlastDate, "dd.MM.yyyy")}
                  placeholder="Select Check Out Date"
                  type="text"
                  readOnly
                />
                {isLastDatePickerVisible && (
                  <DayPicker
                    className="absolute border p-3 -left-4 z-10 bg-white shadow-xl"
                    mode="single"
                    selected={selectlastDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectLastDate(date);
                        toggleLastDatePickerVisibility();
                      }
                    }}
                    disabled={(day) => day <= selectfirstDate}
                  />
                )}
              </div>
            </div>

            {/* Room Name */}
            <div>
              <label className="text-md font-bold block">Room Name</label>
              <Controller
                name="roomName"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Autocomplete
                    size="small"
                    multiple
                    id="room-name-select"
                    options={
                      roomsData?.datewiseRoom?.data?.data?.map(
                        (roomname) => roomname?.roomname
                      ) || []
                    }
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    onChange={(e, value) => {
                      field.onChange(value);
                      if (value.length > 0) {
                        setSelectRoom(value[value.length - 1]);
                      }
                      setRoomName(value);
                    }}
                    value={field.value}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Room Name" />
                    )}
                  />
                )}
              />
            </div>

            {/* Room Number */}
            <div>
              <label className="text-md font-bold block">Room Number</label>
              <Controller
                name="roomNumber"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Autocomplete
                    size="small"
                    multiple
                    id="room-number-select"
                    options={availableRooms || []}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    onChange={(e, value) => {
                      field.onChange(value);
                      setAllRoomsNumber(value);
                    }}
                    value={field.value}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Room Number" />
                    )}
                  />
                )}
              />
            </div>

            <Grid item xs={12} md={4} mt={3}>
              <Controller
                name="roomTypeOption"
                control={control}
                defaultValue="isSingle"
                rules={{ required: "Room type option is required" }}
                disabled={!roomName.includes("Deluxe Single/Couple")}
                sx={{ paddingY: 3 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={"Room Type Options"}
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={!!errors.roomTypeOption}
                    helperText={errors.roomTypeOption?.message}
                    onChange={(e) => {
                      field.onChange(e);
                      setRoomTypeOption(e.target.value);
                    }}
                  >
                    <MenuItem value="isCouple">Couple</MenuItem>
                    <MenuItem value="isSingle">Single</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Payment Method */}
            <div>
              <label className="text-md font-bold block">
                Select Payment Method
              </label>
              <div className="flex gap-5">
                <select
                  {...register("paymentMethod")}
                  className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                  onChange={(e) => {
                    setPayment(e.target.value);
                  }}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Check">Check</option>
                  <option value="City Bank">City Bank</option>
                  <option value="Prime Bank">Prime Bank</option>
                </select>
                {payment !== "Cash" && payment && (
                  <div className="w-full">
                    <input
                      {...register("payNumber")}
                      type="text"
                      placeholder={`${payment} Number`}
                      className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Advance Amount */}
            <div>
              <label className="text-md font-bold block">
                Advance Amount ({calculateTotalAmount()} Tk)
              </label>
              <input
                {...register("paidAmount")}
                type="text"
                placeholder="Paid Amount"
                onKeyDown={handleKeyCheck}
                className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
              />
            </div>

            {/* Additional Information */}
            <div className="col-span-1">
              <label className="text-md font-bold block">
                Additional Information
              </label>
              <textarea
                {...register("additionalInformation")}
                placeholder="Additional Information or Remarks"
                className="w-full rounded-lg border-[1.5px] border-gray-500 bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                rows="1"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end items-center mt-4">
            <button
              type="submit"
              className="flex uppercase text-lg text-white px-16 py-3 justify-end rounded-md bg-pink-600 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
