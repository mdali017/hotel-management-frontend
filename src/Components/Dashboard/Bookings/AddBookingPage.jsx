import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { DayPicker } from "react-day-picker";
import { Controller, useForm } from "react-hook-form";
import { format, addDays, parse, set } from "date-fns";
import Axios from "axios";
import { FetchUrls } from "../../Common/FetchUrls";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import orion_logo from "../../../assets/orion-invoice-logo.png";
import {
  useAddRegisterationMutation,
  useDeleteBookingRoomByIdMutation,
  useDeleteBookingRoomByRoomNameMutation,
  useGetCardPaymentItemsQuery,
  useGetLastRegisteredIdQuery,
  useGetRoomColorStatusQuery,
} from "../../../redux/baseApi/baseApi";
import CardPaymentModal from "../../Modal/CardPaymentModal/CardPaymentModal";

const AddBookingPage = () => {
  // from redux api
  const [addRegisteration, { isLoading: isSubmitting }] =
    useAddRegisterationMutation();

  const [selectedDate, setselectedDate] = useState(new Date());
  const todaydate = format(selectedDate, "yyyy-MM-dd");
  const [selectfirstDate, setselectfirstDate] = useState(new Date());
  const [selectlastDate, setselectlastDate] = useState(addDays(new Date(), 1));
  const [discount, setDiscount] = useState(0);
  const [flatDiscount, setFlatDiscount] = useState(0);
  const [roomName, setRoomName] = useState([]);
  const [allRoomsNumber, setAllRoomsNumber] = useState([]);
  const [payment, setpayment] = useState(null);
  const [selectRoom, setselectRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [nidFile, setNidFile] = useState(null);
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [isFirstDatePickerVisible, setIsFirstDatePickerVisible] =
    useState(false);
  const [isLastDatePickerVisible, setIsLastDatePickerVisible] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("Mr.");
  const [paidAmount, setPaidAmount] = useState(0);
  const [formInitialized, setFormInitialized] = useState(false);
  const [roomTypeOption, setRoomTypeOption] = useState("isSingle");
  const [showBankItemModal, setShowBankItemModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: lastRegistrationId,
    isLoading: loadingLastId,
    refetch: lastResigterIdRefetch,
  } = useGetLastRegisteredIdQuery();

  const {
    data: roomsColorStatus,
    isLoading: isColorStatusLoading,
    refetch: ColorStatusRefetch,
  } = useGetRoomColorStatusQuery(todaydate, {
    pollingInterval: 20000, // Poll every 10 seconds
    refetchOnFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });

  const [deleteBookingRoomByRoomName] =
    useDeleteBookingRoomByRoomNameMutation();
  const [deleteBookingRoomById] = useDeleteBookingRoomByIdMutation();

  const { data: getAllCardPaymentItems, isLoading: cardPaymentItemsLoading } =
    useGetCardPaymentItemsQuery();
  const cardPaymentItems = getAllCardPaymentItems?.data || [];
  // console.log("Card Payment Items:", cardPaymentItems);

  // CSL Generation handling with error protection
  const generateNewBookingId = () => {
    if (!lastRegistrationId || !lastRegistrationId.bookingId) {
      return "0001"; // Default if data not  available
    }

    try {
      const lastIdNumber = parseInt(lastRegistrationId.bookingId);
      const newIdNumber = lastIdNumber + 1;
      return `${newIdNumber.toString().padStart(4, "0")}`;
    } catch (error) {
      console.error("Error generating booking ID:", error);
      return "0001"; // Fallback in case of error
    }
  };

  const newBookingId = generateNewBookingId();

  const bookingGuestInfo = location?.state?.bookingData;

  const [checkinStatus, setCheckinStatus] = useState(
    bookingGuestInfo?.additionalInformation
      ? "Normal CheckOut"
      : "Normal CheckOut"
  );

  // console.log("checkinStatus", checkinStatus)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: "onChange", // Enable validation on change
  });

  // Initialize form with bookingGuestInfo data if available
  useEffect(() => {
    if (bookingGuestInfo && !formInitialized) {
      // Set form values
      setValue("customerName", bookingGuestInfo.customerName || "");
      setValue(
        "customerNumber",
        bookingGuestInfo.customerNumber?.toString() || ""
      );
      setValue("addressCompany", bookingGuestInfo.companyNameAddress || "");
      // Updated person logic to handle all cases properly
      let personValue = "";
      if (bookingGuestInfo.person) {
        personValue = bookingGuestInfo.person.toString();
      } else if (bookingGuestInfo.adults !== undefined) {
        const totalPersons =
          bookingGuestInfo.adults + (bookingGuestInfo.childrens || 0);
        personValue = totalPersons.toString();
      }
      setValue("person", personValue);

      // Handle dates
      if (bookingGuestInfo.chekinDate) {
        const checkinDate = bookingGuestInfo.chekinDate;
        setValue("checkInDate", checkinDate);
        try {
          const parsedDate = parse(checkinDate, "yyyy-MM-dd", new Date());
          setselectfirstDate(parsedDate);
        } catch (error) {
          console.error("Error parsing check-in date:", error);
        }
      }

      if (bookingGuestInfo.chekoutDate) {
        const checkoutDate = bookingGuestInfo.chekoutDate;
        setValue("checkOutDate", checkoutDate);
        try {
          const parsedDate = parse(checkoutDate, "yyyy-MM-dd", new Date());
          setselectlastDate(parsedDate);
        } catch (error) {
          console.error("Error parsing check-out date:", error);
        }
      }

      // Set room information
      if (bookingGuestInfo.roomType) {
        const roomTypeArray = [bookingGuestInfo.roomType];
        setValue("roomName", roomTypeArray);
        setRoomName(roomTypeArray);
        setselectRoom(bookingGuestInfo.roomType);
      }

      if (bookingGuestInfo.roomNumber) {
        const roomNumberArray = [bookingGuestInfo.roomNumber];
        setValue("roomNumber", roomNumberArray);
        setAllRoomsNumber(roomNumberArray);
      }

      // Handle payment information
      if (bookingGuestInfo.paymentMethod) {
        // Map from numeric to string value (assuming 1 is Cash)
        const paymentMethodValue =
          bookingGuestInfo.paymentMethod === 1 ? "Cash" : "";
        setValue("paymentMethod", paymentMethodValue);
        setpayment(paymentMethodValue);
      }

      if (bookingGuestInfo.advancePayment) {
        setValue("paidAmount", bookingGuestInfo.advancePayment.toString());
        setPaidAmount(bookingGuestInfo.advancePayment);
      }

      // Additional information
      if (bookingGuestInfo.additionalInformation) {
        setValue("remarks", bookingGuestInfo.additionalInformation);
      }

      setFormInitialized(true);
    }
  }, [bookingGuestInfo, setValue, formInitialized]);

  useEffect(() => {
    lastResigterIdRefetch();
  }, [navigate]);

  const toggleFirstDatePickerVisibility = () => {
    setIsFirstDatePickerVisible(!isFirstDatePickerVisible);
    setIsLastDatePickerVisible(false);
  };

  const toggleLastDatePickerVisibility = () => {
    setIsLastDatePickerVisible(!isLastDatePickerVisible);
    setIsFirstDatePickerVisible(false);
  };

  const handleDiscountChange = (e) => {
    const newDiscount = parseInt(e.target.value) || 0;
    setDiscount(newDiscount);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNidFile(e.target.files[0]);
    }
  };

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
      } catch (error) {
        console.error("Error fetching rooms data:", error);
        return { combinedRooms: [], datewiseRoom: { data: { data: [] } } };
      }
    },
  });

  // Update this useEffect to filter out late checkout rooms
  useEffect(() => {
    try {
      const availableRoomsget = async () => {
        if (!selectRoom) return;

        const formatfirstdate = format(selectfirstDate, "yyyy-MM-dd");
        const formatlastdate = format(selectlastDate, "yyyy-MM-dd");
        const response = await Axios.get(
          FetchUrls(
            `rooms/getroombydate?firstdate=${formatfirstdate}&lastdate=${formatlastdate}`
          )
        );

        // Get rooms by selected room type
        const rooms = response.data.data?.find(
          (item) => item?.roomname === selectRoom
        );

        // Filter out late checkout rooms if they exist in roomsColorStatus
        let availableRoomNumbers = rooms?.roomnumber || [];

        if (roomsColorStatus?.data?.lateCheckOutRooms?.length > 0) {
          // console.log(
          //   "Filtering out late checkout rooms:",
          //   roomsColorStatus.data.lateCheckOutRooms
          // );
          availableRoomNumbers = availableRoomNumbers.filter(
            (roomNum) =>
              !roomsColorStatus.data.lateCheckOutRooms.includes(roomNum)
          );
        }

        setAvailableRooms(availableRoomNumbers);

        // If we have a room number from bookingGuestInfo and it's not in availableRooms,
        // add it to make sure it's selectable in the dropdown (only if it's not a late checkout room)
        if (
          bookingGuestInfo?.roomNumber &&
          !availableRoomNumbers.includes(bookingGuestInfo.roomNumber) &&
          !roomsColorStatus?.data?.lateCheckOutRooms?.includes(
            bookingGuestInfo.roomNumber
          )
        ) {
          setAvailableRooms((prev) => [
            ...(prev || []),
            bookingGuestInfo.roomNumber,
          ]);
        }
      };

      availableRoomsget();
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  }, [
    selectRoom,
    selectfirstDate,
    selectlastDate,
    bookingGuestInfo,
    roomsColorStatus,
  ]);

  // Create bookingsRoomsAll object for calculating cost
  const bookingsRoomsAll = {
    roomName,
    allRoomsNumber,
  };

  // Calculate room cost based on selected rooms
  const roomCost = bookingsRoomsAll?.roomName?.reduce((totalCost, roomName) => {
    const roomDetails = roomsData?.combinedRooms?.find(
      (room) => room.roomname === roomName
    );
    if (roomDetails) {
      let updatedRoomCost = 1;
      if (roomTypeOption === "isSingle") {
        updatedRoomCost = roomDetails?.isSingleCost;
      } else {
        updatedRoomCost = roomDetails?.cost;
      }

      const selectedRoomNumbers = roomDetails.datewiseAvailability.filter(
        (roomNumber) => bookingsRoomsAll.allRoomsNumber.includes(roomNumber)
      );

      const roomCost = selectedRoomNumbers.length * updatedRoomCost;
      totalCost += roomCost;
    }
    return totalCost;
  }, 0);
  const oneDayCost = roomCost;

  const calculateTotalAmountBeforeDiscount = () => {
    // Get dates in the same format for accurate comparison
    const firstDate = new Date(selectfirstDate.setHours(0, 0, 0, 0));
    const lastDate = new Date(selectlastDate.setHours(0, 0, 0, 0));

    // Calculate difference in days more accurately
    // Use time difference in milliseconds and convert to days
    const timeDiff = Math.abs(lastDate.getTime() - firstDate.getTime());
    const daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let extraCharge = 0;
    if (
      checkinStatus === "Early CheckIn" ||
      checkinStatus === "Late CheckOut"
    ) {
      extraCharge = roomCost * 0.5; // Adding half-day cost
    }

    const totalPaymentWithoutDiscount = daysDifference * roomCost;
    const totalAmount = Math.ceil(totalPaymentWithoutDiscount);

    return totalAmount;
  };
  const calculateTotalAmount = () => {
    // Get dates in the same format for accurate comparison
    const firstDate = new Date(selectfirstDate.setHours(0, 0, 0, 0));
    const lastDate = new Date(selectlastDate.setHours(0, 0, 0, 0));

    // Calculate difference in days more accurately
    // Use time difference in milliseconds and convert to days
    const timeDiff = Math.abs(lastDate.getTime() - firstDate.getTime());
    const daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let extraCharge = 0;
    if (
      checkinStatus === "Early CheckIn" ||
      checkinStatus === "Late CheckOut"
    ) {
      extraCharge = roomCost * 0.5; // Adding half-day cost
    }

    const totalPaymentWithoutDiscount = daysDifference * roomCost + extraCharge;
    const discountedAmount = (totalPaymentWithoutDiscount * discount) / 100;
    const totalAmount = Math.ceil(
      totalPaymentWithoutDiscount - flatDiscount - discountedAmount
    );

    return totalAmount;
  };

  // console.log(calculateTotalAmount())

  // Update the onSubmit function to include checkInTime and checkOutTime
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      // Check for required fields before submission
      const isValid = await trigger();
      if (!isValid) {
        Swal.fire({
          title: "Error!",
          text: "Please fill in all required fields marked with *",
          icon: "error",
        });
        return;
      }

      // If we have booking guest info, update its status first
      if (bookingGuestInfo && bookingGuestInfo.roomNumber) {
        await deleteBookingRoomByRoomName(bookingGuestInfo.roomNumber);
      }
      // If we have booking guest info, update its status first
      if (bookingGuestInfo && bookingGuestInfo._id) {
        await deleteBookingRoomById(bookingGuestInfo._id);
      }

      // Get profession value from checkboxes
      const professionElements = document.querySelectorAll(
        'input[name="profession"]:checked'
      );
      const professionValue =
        professionElements.length > 0
          ? professionElements[0].value
          : "Business";

      // console.log(data);
      // Create booking data object
      const bookingData = {
        bookingId: `${newBookingId}`,
        bookingroom: roomName,
        bookingDate: todaydate,
        customerTitle: selectedTitle,
        customerName: data.customerName,
        customerNumber: data.customerNumber,
        authentication: data.authentication,
        authenticationNumber: data.authenticationNumber,
        person: data.person,
        addressOrCompanyName: data.addressCompany,
        firstDate: format(selectfirstDate, "yyyy-MM-dd"),
        lastDate: format(selectlastDate, "yyyy-MM-dd"),
        checkInTime: data.checkInTime || "12:00",
        checkOutTime: data.checkOutTime || "12:00",
        roomNumber: allRoomsNumber,
        paidAmount: Number(data.paidAmount) || 0,
        dueAmount: calculateTotalAmount() - (Number(data.paidAmount) || 0),
        discountPercentage: parseInt(data.discountPercentage) || 0,
        discountFlat: parseInt(data.discountFlat) || 0,
        payment: [
          {
            paymentmethod: data.paymentMethod,
            payNumber: data.payNumber || "",
            bankName:
              data.paymentMethod === "Card Payment" ? data.bankName : "", // Include selected bank name
            paymentDate: new Date(),
            amount: paidAmount,
          },
        ],
        referredBy: data.referredBy,
        beforeDiscountCost: calculateTotalAmountBeforeDiscount(),
        roomDetails: bookingsRoomsAll,
        remarks: data.remarks || "",
        bookedFrom: bookingGuestInfo ? "Online" : "Counter",
        checkoutStatus: checkinStatus || "Normal CheckOut", // Set default value if empty
        roomRent: oneDayCost,
        isRegistered: true,
        isSingle: roomTypeOption,
        profession: professionValue,
        onlineBookingId: bookingGuestInfo ? bookingGuestInfo._id : null,
      };

      // Validate required fields
      if (!bookingData.roomNumber || bookingData.roomNumber.length === 0) {
        Swal.fire({
          title: "Error!",
          text: "Please select at least one room number",
          icon: "error",
        });
        return;
      }

      if (!bookingData.bookingroom || bookingData.bookingroom.length === 0) {
        Swal.fire({
          title: "Error!",
          text: "Please select a room type",
          icon: "error",
        });
        return;
      }

      // Create FormData object for file upload
      const formData = new FormData();

      // Add all booking data fields individually to FormData
      Object.keys(bookingData).forEach((key) => {
        if (
          typeof bookingData[key] === "object" &&
          bookingData[key] !== null &&
          !(bookingData[key] instanceof File)
        ) {
          formData.append(key, JSON.stringify(bookingData[key]));
        } else {
          formData.append(key, bookingData[key]);
        }
      });

      // Add file to FormData if it exists
      if (nidFile) {
        formData.append("nidFile", nidFile);
      }

      // console.log(bookingData);

      // Use RTK Query mutation instead of Axios
      const response = await addRegisteration(formData).unwrap();

      if (response) {
        navigate("/dashboard");
        Swal.fire({
          title: "Success!",
          text: "Room Added Successfully!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something Went Wrong!",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to submit booking!",
        icon: "error",
      });
    }
  };
  // Custom label renderer to add red asterisk for required fields
  const RequiredLabel = ({ label }) => (
    <span>
      {label} <span style={{ color: "red" }}>*</span>
    </span>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-2xl">
      <div className="p-2 border">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {bookingGuestInfo ? `Booking #${bookingGuestInfo?.bookingId}` : ""}
          </h1>
          <Link
            to={"/dashboard"}
            className="bg-secondary text-white px-3 rounded-sm mb-2 text-lg"
          >
            Back
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-semibold uppercase w-full text-center py-2">
            Registration Form
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            {/* CSL and Title section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTitle === "Mr."}
                      onChange={() => setSelectedTitle("Mr.")}
                    />
                  }
                  label="Mr."
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTitle === "Mrs."}
                      onChange={() => setSelectedTitle("Mrs.")}
                    />
                  }
                  label="Mrs."
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTitle === "Ms."}
                      onChange={() => setSelectedTitle("Ms.")}
                    />
                  }
                  label="Ms."
                />
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      fontWeight: 600,
                    }}
                  >
                    CSL:{" "}
                  </span>
                  <span style={{ fontSize: "1.25rem", marginLeft: "4px" }}>
                    {loadingLastId ? "Loading..." : newBookingId}
                  </span>
                </Box>
              </Box>
            </Box>

            {/* Form fields in grid layout */}
            <Grid container spacing={2}>
              {/* Row 1 */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="customerName"
                  control={control}
                  defaultValue={bookingGuestInfo?.customerName || ""}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label="Customer Name" />}
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.customerName}
                      helperText={errors.customerName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="customerNumber"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.customerNumber?.toString() || ""
                  }
                  rules={{ required: "Mobile number is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label="Mobile Number" />}
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.customerNumber}
                      helperText={errors.customerNumber?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="addressCompany"
                  control={control}
                  defaultValue={bookingGuestInfo?.companyNameAddress || ""}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address/Company Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              {/* Row 2 - Removed RD/PO and PS fields */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="person"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.person
                      ? bookingGuestInfo.person.toString()
                      : bookingGuestInfo?.adults !== undefined
                      ? (
                          bookingGuestInfo.adults +
                          (bookingGuestInfo.childrens || 0)
                        ).toString()
                      : ""
                  }
                  rules={{ required: "Number of persons is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label="Person" />}
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="number"
                      error={!!errors.person}
                      helperText={errors.person?.message}
                    />
                  )}
                />
              </Grid>
              {/* Row 3 */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="checkInDate"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.chekinDate ||
                    format(selectfirstDate, "yyyy-MM-dd")
                  }
                  rules={{ required: "Check-in date is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label="Check-In Date" />}
                      type="date"
                      variant="outlined"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.checkInDate}
                      helperText={errors.checkInDate?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value) {
                          setselectfirstDate(new Date(e.target.value));
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="checkInTime"
                  control={control}
                  defaultValue="14:00"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Check-In Time"
                      type="time"
                      variant="outlined"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="checkOutDate"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.chekoutDate ||
                    format(selectlastDate, "yyyy-MM-dd")
                  }
                  rules={{ required: "Check-out date is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label="Check-Out Date" />}
                      type="date"
                      variant="outlined"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.checkOutDate}
                      helperText={errors.checkOutDate?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value) {
                          setselectlastDate(new Date(e.target.value));
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              {/* Row 4 */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="checkOutTime"
                  control={control}
                  defaultValue="12:00"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Check-Out Time"
                      type="time"
                      variant="outlined"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="roomName"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.roomType
                      ? [bookingGuestInfo.roomType]
                      : []
                  }
                  rules={{ required: "Room type is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      id="tags-outlined-room-type"
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
                          setselectRoom(value[value.length - 1]);
                        }
                        setRoomName(value);
                      }}
                      value={field.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label="Room Type" />}
                          variant="outlined"
                          fullWidth
                          size="small"
                          error={!!errors.roomName}
                          helperText={
                            errors.roomName ? "Room type is required" : ""
                          }
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              {/* Row 5 */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="roomNumber"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.roomNumber
                      ? [bookingGuestInfo.roomNumber]
                      : []
                  }
                  rules={{ required: "Room number is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      id="tags-outlined-room-number"
                      options={availableRooms || []}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(e, value) => {
                        field.onChange(value);
                        setAllRoomsNumber(value);
                      }}
                      value={field.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label="Room Number" />}
                          variant="outlined"
                          fullWidth
                          size="small"
                          error={!!errors.roomNumber}
                          helperText={
                            errors.roomNumber ? "Room number is required" : ""
                          }
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              {/* for room type option */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="roomTypeOption"
                  control={control}
                  defaultValue="isSingle"
                  rules={{ required: "Room type option is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={<RequiredLabel label="Room Type Option" />}
                      variant="outlined"
                      fullWidth
                      size="small"
                      disabled={!roomName?.includes("Deluxe Single/Couple")}
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
              <Grid item xs={12} md={6}>
                <Controller
                  name="paymentMethod"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.paymentMethod === 1 ? "Cash" : "Cash"
                  }
                  rules={{ required: "Payment method is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={<RequiredLabel label="Payment Method" />}
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.paymentMethod}
                      helperText={errors.paymentMethod?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        setpayment(e.target.value);
                      }}
                    >
                      <MenuItem value="">Select Payment Method</MenuItem>
                      {["Cash", "Bkash", "Card Payment", "Check"].map(
                        (value) => (
                          <MenuItem key={value} value={value}>
                            {value}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  )}
                />
              </Grid>
              {/* Row 6A - Bank Selection (Only for Card Payment) */}
              {payment === "Card Payment" && (
                <>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="bankName"
                      control={control}
                      defaultValue=""
                      rules={{
                        required:
                          payment === "Card Payment"
                            ? "Bank selection is required"
                            : false,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label={<RequiredLabel label="Select Bank" />}
                          variant="outlined"
                          fullWidth
                          size="small"
                          error={!!errors.bankName}
                          helperText={errors.bankName?.message}
                        >
                          <MenuItem value="">Select Bank</MenuItem>
                          {cardPaymentItems?.map((bank, index) => (
                            <MenuItem
                              key={bank}
                              value={bank?.cardPaymentItemName}
                            >
                              {bank?.cardPaymentItemName}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <div className="mt-2">
                    <button
                      onClick={() => setShowBankItemModal(true)}
                      className="flex items-center justify-center  gap-2 bg-blue-600 hover:bg-blue-700 text-white ml-4 px-3 py-2 rounded-md shadow-md transition-colors duration-200 text-sm font-medium mt-2"
                      type="button"
                    >
                      {/* <PlusCircle size={16} /> */}
                      <span>Add Bank</span>
                    </button>
                  </div>
                </>
              )}
              {/* Row 6B - Payment Number (Conditional) */}
              {payment && payment !== "Cash" && payment !== "Card Payment" && (
                <Grid item xs={12} md={4}>
                  <Controller
                    name="payNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required:
                        payment !== "Cash"
                          ? "Payment number is required"
                          : false,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          <RequiredLabel
                            label={`${
                              payment === "Card Payment" ? "Card" : payment
                            } Number`}
                          />
                        }
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={!!errors.payNumber}
                        helperText={errors.payNumber?.message}
                      />
                    )}
                  />
                </Grid>
              )}
              {/* Row 7 */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="paidAmount"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.advancePayment?.toString() || "0"
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <React.Fragment>
                          Paid Amount (
                          <span className="text-red-500 font-bold text-xl">
                            {calculateTotalAmount()} Taka
                          </span>
                          )
                        </React.Fragment>
                      }
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: <span>Taka</span>,
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        setPaidAmount(parseInt(e.target.value) || 0);
                      }}
                      helperText={
                        calculateTotalAmount() > 0
                          ? `Due: ${
                              calculateTotalAmount() -
                              (parseInt(field.value) || 0)
                            } Taka`
                          : ""
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="discountPercentage"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.discountPercentage?.toString() || ""
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Percent Discount"
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: <span>%</span>,
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        handleDiscountChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="discountFlat"
                  control={control}
                  defaultValue={
                    bookingGuestInfo?.discountFlat?.toString() || ""
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Flat Discount"
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: <span>Taka</span>,
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        setFlatDiscount(parseInt(e.target.value) || 0);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="authentication"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Authentication Type"
                      variant="outlined"
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">Select Item</MenuItem>
                      <MenuItem value="NID">NID</MenuItem>
                      <MenuItem value="Passport">Passport</MenuItem>
                      <MenuItem value="Driving License">
                        Driving License
                      </MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              {/* Row 9 */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="authenticationNumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Authentication Number"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="File"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleFileChange}
                />
              </Grid>
              {/* Row 8 */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="referredBy"
                  control={control}
                  defaultValue={bookingGuestInfo?.referredBy || ""}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Referred By"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="checkinStatus"
                  control={control}
                  defaultValue={checkinStatus}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Checkout Status"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={checkinStatus}
                      onChange={(event) => {
                        setCheckinStatus(event.target.value);
                        field.onChange(event.target.value);
                      }}
                    >
                      <MenuItem value="Normal CheckOut">
                        Normal CheckOut
                      </MenuItem>
                      <MenuItem value="Early CheckIn">Early CheckIn</MenuItem>
                      <MenuItem value="Early CheckOut">Early CheckOut</MenuItem>
                      <MenuItem value="Late CheckOut">Late CheckOut</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            {/* Professional section */}
            <Box sx={{ mt: 4 }}>
              <p className="mb-2 text-sm text-gray-600">Profession:</p>
              <Box sx={{ display: "flex", gap: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox {...register("profession")} value="Service" />
                  }
                  label="Service"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("profession")}
                      value="Business"
                      defaultChecked
                    />
                  }
                  label="Business"
                />
                <FormControlLabel
                  control={
                    <Checkbox {...register("profession")} value="Student" />
                  }
                  label="Student"
                />
                <FormControlLabel
                  control={
                    <Checkbox {...register("profession")} value="Others" />
                  }
                  label="Others"
                />
              </Box>
            </Box>

            {/* Total Amount and Submit Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
              }}
            >
              <div>
                <p className="text-sm text-black font-semibold">
                  Total Amount:{" "}
                  <span className="text-lg font-semibold text-green-600">
                    {calculateTotalAmount()} Taka
                  </span>
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex uppercase text-lg text-white px-16 py-3 justify-end rounded-md ${
                    isSubmitting
                      ? "bg-pink-400 cursor-not-allowed"
                      : "bg-pink-600"
                  } font-semibold`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Confirm Registration"
                  )}
                </button>
              </div>
            </Box>
          </Box>
        </form>
        <div className="flex h-2 mt-4 mb-5">
          <div className="w-1/4 bg-red-600"></div>
          <div className="w-1/4 bg-green-600"></div>
          <div className="w-1/4 bg-yellow-400"></div>
          <div className="w-1/4 bg-blue-800"></div>
        </div>
      </div>

      {/* Display additional information from online booking if available */}
      {bookingGuestInfo && bookingGuestInfo.additionalInformation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Additional Information from Online Booking
          </h3>
          <p className="text-gray-700">
            {bookingGuestInfo.additionalInformation}
          </p>
        </div>
      )}

      {/* Show online booking status indicator if applicable */}
      {bookingGuestInfo && (
        <div className="mt-4 p-2 bg-green-50 rounded-lg border border-green-200 text-center">
          <span className="text-sm font-medium text-green-700">
            Converting online booking #{bookingGuestInfo.bookingId} to
            registration
          </span>
        </div>
      )}
      <CardPaymentModal
        isVisible={showBankItemModal}
        onClose={() => setShowBankItemModal(false)}
        // onSubmit={handleAddItemSubmit}
        // isLoading={isItemCreating}
      />
    </div>
  );
};

export default AddBookingPage;
