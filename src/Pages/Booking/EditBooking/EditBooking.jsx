import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Grid,
} from "@mui/material";
import { format, addDays } from "date-fns";
import Axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { FetchUrls } from "../../../Components/Common/FetchUrls";

const EditBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location?.state?.data;

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
  // const [checkinStatus, setCheckinStatus] = useState("Normal");
  const [dueAmount, setDueAmount] = useState(0); // State to track due amount
  const [checkinStatus, setCheckinStatus] = useState("Normal CheckOut");
  // Add roomTypeOption state
  const [roomTypeOption, setRoomTypeOption] = useState("isSingle");

  // console.log(bookingData, 40)

  // New state for adding a new payment
  const [newPayment, setNewPayment] = useState({
    paymentmethod: "Cash",
    payNumber: "",
    paymentDate: format(new Date(), "yyyy-MM-dd"),
    amount: "",
  });

  // State to track payment history
  const [paymentHistory, setPaymentHistory] = useState([]);

  // State to control payment dialog
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    bookingroom: [],
    customerNumber: "",
    firstDate: "",
    lastDate: "",
    roomNumber: [],
    bookingDate: "",
    paidAmount: 0,
    dueAmount: 0,
    discountPercentage: 0,
    discountPercentageAmount: 0,
    discountFlat: 0,
    payment: [{ paymentmethod: "Cash", payNumber: "" }],
    bookedFrom: "",
    referredBy: "",
    remarks: "",
    beforeDiscountCost: 0,
    checkIn: "",
    isCorporate: false,
    addons: [],
    authentication: "",
    authenticationNumber: "",
    person: "",
    // Add roomTypeOption to form data
    roomTypeOption: "isSingle" || "true",
    addressOrCompanyName: "",
  });

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

  // Effect to fetch available rooms based on selected room type and dates
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
        const rooms = response.data.data?.find(
          (item) => item?.roomname === selectRoom
        );

        // Include current booking's room numbers in available rooms
        let availableRoomsList = rooms?.roomnumber || [];
        if (bookingData && bookingData.roomNumber) {
          bookingData.roomNumber.forEach((roomNum) => {
            if (!availableRoomsList.includes(roomNum)) {
              availableRoomsList.push(roomNum);
            }
          });
        }

        setAvailableRooms(availableRoomsList);
      };

      availableRoomsget();
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  }, [selectRoom, selectfirstDate, selectlastDate, bookingData]);

  // Load booking data
  useEffect(() => {
    if (bookingData) {
      // Handle both string and boolean types for isSingle
      let initialRoomTypeOption;

      // Check if isSingle is a string or boolean
      if (typeof bookingData.isSingle === "string") {
        // If it's a string, use it directly
        initialRoomTypeOption = bookingData.isSingle;
      } else {
        // If it's a boolean or undefined, convert appropriately
        initialRoomTypeOption =
          bookingData.isSingle === false ? "isCouple" : "isSingle";
      }

      // console.log("Setting room type option to:", initialRoomTypeOption);
      setRoomTypeOption(initialRoomTypeOption);

      // Set checkout status from booking data
      if (bookingData.checkoutStatus) {
        setCheckinStatus(bookingData.checkoutStatus);
      } else {
        setCheckinStatus("Normal CheckOut"); // Default value
      }

      setFormData({
        customerName: bookingData.customerName || "",
        customerNumber: bookingData.customerNumber || "",
        firstDate: bookingData.firstDate || "",
        lastDate: bookingData.lastDate || "",
        bookingDate: bookingData.bookingDate || "",
        paidAmount: bookingData.paidAmount || 0,
        dueAmount: bookingData.dueAmount || 0,
        discountPercentage: bookingData.discountPercentage || 0,
        discountPercentageAmount: bookingData.discountPercentageAmount || 0,
        discountFlat: bookingData.discountFlat || 0,
        payment: bookingData.payment || [
          { paymentmethod: "Cash", payNumber: "" },
        ],
        bookedFrom: bookingData.bookedFrom || "",
        referredBy: bookingData.referredBy || "",
        remarks: bookingData.remarks || "",
        beforeDiscountCost: bookingData.beforeDiscountCost || 0,
        checkIn: bookingData.checkIn || "",
        isCorporate: bookingData.isCorporate || false,
        addons: bookingData.addons || [],
        authentication: bookingData.authentication || "",
        authenticationNumber: bookingData.authenticationNumber || "",
        person: bookingData.person || "",
        roomTypeOption: initialRoomTypeOption,
        checkoutStatus: bookingData.checkoutStatus || "Normal CheckOut",
        addressOrCompanyName: bookingData.addressOrCompanyName || "",
      });

      setRoomName(bookingData.bookingroom || []);
      setAllRoomsNumber(bookingData.roomNumber || []);

      // Set payment history
      setPaymentHistory(bookingData.payment || []);

      if (bookingData.bookingroom && bookingData.bookingroom.length > 0) {
        setselectRoom(bookingData.bookingroom[0]);
      }

      if (bookingData.firstDate) {
        setselectfirstDate(new Date(bookingData.firstDate));
      }

      if (bookingData.lastDate) {
        setselectlastDate(new Date(bookingData.lastDate));
      }

      setDiscount(bookingData.discountPercentage || 0);
      setFlatDiscount(bookingData.discountFlat || 0);

      // Set checkin status if it exists in bookingData
      if (bookingData.checkinStatus) {
        setCheckinStatus(bookingData.checkinStatus);
      }

      if (bookingData.payment && bookingData.payment.length > 0) {
        setpayment(bookingData.payment[0].paymentmethod);
      }
    }
  }, [bookingData]);

  // Create bookingsRoomsAll object for calculating cost
  const bookingsRoomsAll = {
    roomName,
    allRoomsNumber,
  };

  // Calculate room cost based on selected rooms and roomTypeOption
  // Full implementation for room cost calculation with roomTypeOption
  const roomCost = bookingsRoomsAll?.roomName?.reduce((totalCost, roomName) => {
    const roomDetails = roomsData?.combinedRooms?.find(
      (room) => room.roomname === roomName
    );
    if (roomDetails) {
      // Default to standard cost
      let roomCostPerUnit = roomDetails.cost;

      // If it's a Deluxe room and the option is Single, use the single cost
      if (
        roomName.includes("Deluxe Single/Couple") &&
        (roomTypeOption === "isSingle" || roomTypeOption === "true")
      ) {
        roomCostPerUnit = roomDetails.isSingleCost || roomDetails.cost;
      }

      const selectedRoomNumbers = allRoomsNumber.filter(
        (roomNumber) =>
          roomDetails.datewiseAvailability.includes(roomNumber) ||
          bookingData?.roomNumber?.includes(roomNumber)
      );

      const roomCostAmount = selectedRoomNumbers.length * roomCostPerUnit;
      totalCost += roomCostAmount;
    }
    return totalCost;
  }, 0);

  // For Only Before Discount
  const calculateTotalAmountBeforeDiscount = () => {
    const daysDifference = Math.ceil(
      (selectlastDate - selectfirstDate) / (1000 * 3600 * 24)
    );

    let extraCharge = 0;
    if (
      checkinStatus === "Early CheckIn" ||
      checkinStatus === "Late CheckOut"
    ) {
      extraCharge = roomCost * 0.5; // Adding half-day cost
    }

    const totalPaymentWithoutDiscount = daysDifference * roomCost;
    // const discountedAmount = (totalPaymentWithoutDiscount * discount) / 100;
    const totalAmount = Math.ceil(totalPaymentWithoutDiscount);

    return totalAmount;
  };

  // console.log(calculateTotalAmountBeforeDiscount(), 322)

  // Updated calculateTotalAmount function with early checkin/late checkout charge
  const calculateTotalAmount = () => {
    const daysDifference = Math.ceil(
      (selectlastDate - selectfirstDate) / (1000 * 3600 * 24)
    );

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

  // console.log(calculateTotalAmount(), 320)

  // Calculate due amount - total amount minus paid amount
  const calculateDueAmount = () => {
    const total = calculateTotalAmount();
    return total - formData.paidAmount;
  };

  // Effect to update due amount whenever relevant factors change
  useEffect(() => {
    const newDueAmount = calculateDueAmount();
    setDueAmount(newDueAmount);
    setFormData((prev) => ({
      ...prev,
      dueAmount: newDueAmount,
    }));
  }, [
    selectfirstDate,
    selectlastDate,
    roomName,
    allRoomsNumber,
    discount,
    flatDiscount,
    formData.paidAmount,
    checkinStatus,
    roomTypeOption,
    // addressOrCompanyName
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    const { value } = e.target;
    setpayment(value);
    setFormData((prev) => ({
      ...prev,
      payment: [{ ...prev.payment[0], paymentmethod: value }],
    }));
  };

  const handlePayNumberChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      payment: [{ ...prev.payment[0], payNumber: value }],
    }));
  };

  const handleDiscountPercentageChange = (e) => {
    const value = e.target.value;
    setDiscount(Number(value));
    setFormData((prev) => ({
      ...prev,
      discountPercentage: Number(value),
    }));
  };

  const handleDiscountFlatChange = (e) => {
    const value = e.target.value;
    setFlatDiscount(Number(value));
    setFormData((prev) => ({
      ...prev,
      discountFlat: Number(value),
    }));
  };

  // Handle room type option change
  const handleRoomTypeOptionChange = (e) => {
    const value = e.target.value;
    setRoomTypeOption(value);
    setFormData((prev) => ({
      ...prev,
      roomTypeOption: value,
    }));
  };

  // Handle new payment form changes
  const handleNewPaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // Add new payment
  const handleAddPayment = async () => {
    // Validate payment amount
    if (!newPayment.amount || newPayment.amount <= 0) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid payment amount.",
        icon: "error",
      });
      return;
    }

    try {
      // Create payment object
      const paymentData = {
        bookingId: bookingData.bookingId,
        payment: {
          paymentmethod: newPayment.paymentmethod,
          payNumber: newPayment.payNumber,
          paymentDate: newPayment.paymentDate,
          amount: Number(newPayment.amount),
        },
      };

      // Make API call to add payment
      const response = await Axios.patch(
        FetchUrls(`bookings/allbookings/${bookingData._id}`),
        paymentData
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Payment added successfully!",
          icon: "success",
        });

        // Update local state with new payment
        setPaymentHistory([...paymentHistory, paymentData.payment]);

        // Update paid amount in form data
        const newPaidAmount = formData.paidAmount + Number(newPayment.amount);
        setFormData((prev) => ({
          ...prev,
          paidAmount: newPaidAmount,
        }));

        // Reset new payment form
        setNewPayment({
          paymentmethod: "Cash",
          payNumber: "",
          paymentDate: format(new Date(), "yyyy-MM-dd"),
          amount: 0,
        });

        // Close payment dialog
        setOpenPaymentDialog(false);
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add payment. Please try again.",
        icon: "error",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate due amount
    const totalAmount = calculateTotalAmount();
    const calculatedDueAmount = totalAmount - formData.paidAmount;

    // NEW VERSION - Fixed discount calculation
    // if discountPercentage is provided, calculate the discount amount
    if (
      formData.discountPercentage &&
      checkinStatus === "Late CheckOut" // Use checkinStatus instead of formData.checkoutStatus
    ) {
      // For Late CheckOut: Calculate discount on (beforeDiscountCost + half of roomRent)
      const beforeDiscountCost = parseFloat(
        calculateTotalAmountBeforeDiscount() || 0
      );
      const currentRoomCost = parseFloat(roomCost || 0);
      const discountPercentage = parseFloat(formData.discountPercentage || 0);

      const totalDiscountBase = beforeDiscountCost + currentRoomCost / 2;
      const discountAmount = (
        (totalDiscountBase * discountPercentage) /
        100
      ).toFixed(2);
      formData.discountPercentageAmount = parseFloat(discountAmount);

      console.log(
        `Late CheckOut: (${beforeDiscountCost} + ${currentRoomCost}/2) * ${discountPercentage}% = ${discountAmount}`
      );
    } else if (
      formData.discountPercentage &&
      checkinStatus === "Early CheckIn" // Use checkinStatus instead of formData.checkoutStatus
    ) {
      // For Early CheckIn: Calculate discount on (beforeDiscountCost + half of roomRent)
      const beforeDiscountCost = parseFloat(
        calculateTotalAmountBeforeDiscount() || 0
      );
      const currentRoomCost = parseFloat(roomCost || 0);
      const discountPercentage = parseFloat(formData.discountPercentage || 0);

      const totalDiscountBase = beforeDiscountCost + currentRoomCost / 2;
      const discountAmount = (
        (totalDiscountBase * discountPercentage) /
        100
      ).toFixed(2);
      formData.discountPercentageAmount = parseFloat(discountAmount);

      console.log(
        `Early CheckIn: (${beforeDiscountCost} + ${currentRoomCost}/2) * ${discountPercentage}% = ${discountAmount}`
      );
    } else if (formData.discountPercentage) {
      // For regular discount: Calculate discount only on beforeDiscountCost
      const beforeDiscountCost = parseFloat(
        calculateTotalAmountBeforeDiscount() || 0
      );
      const discountPercentage = parseFloat(formData.discountPercentage || 0);

      const discountAmount = (
        (beforeDiscountCost * discountPercentage) /
        100
      ).toFixed(2);
      formData.discountPercentageAmount = parseFloat(discountAmount);

      console.log(
        `Regular: ${beforeDiscountCost} * ${discountPercentage}% = ${discountAmount}`
      );
    } else {
      formData.discountPercentageAmount = 0; // Default to 0 if not provided
    }

    console.log(
      "Final discountPercentageAmount:",
      formData.discountPercentageAmount
    );

    // Create request body matching the API format
    const requestBody = {
      bookingId: bookingData.bookingId,
      customerName: formData.customerName,
      bookingroom: roomName,
      customerNumber: formData.customerNumber,
      authentication: formData.authentication,
      authenticationNumber: formData.authenticationNumber,
      firstDate: format(selectfirstDate, "yyyy-MM-dd"),
      lastDate: format(selectlastDate, "yyyy-MM-dd"),
      roomNumber: allRoomsNumber,
      checkinStatus: checkinStatus,
      checkoutStatus: checkinStatus, // Send checkinStatus as checkoutStatus to match your backend
      discountPercentage: discount,
      discountPercentageAmount: formData.discountPercentageAmount,
      discountFlat: flatDiscount,
      dueAmount: calculatedDueAmount,
      roomRent: roomCost, // Use roomCost here
      beforeDiscountCost: calculateTotalAmountBeforeDiscount(),
      updateDueAmount: true,
      addressOrCompanyName: formData.addressOrCompanyName,
    };

    console.log("Request Body:", requestBody);

    try {
      // Make the PATCH request to update the booking
      const response = await Axios.patch(
        FetchUrls(`bookings/allbookings/${bookingData._id}`),
        requestBody
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Booking Updated Successfully!",
          icon: "success",
        });
        navigate("/dashboard");
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      Swal.fire({
        title: "Error!",
        text: "Something Went Wrong!",
        icon: "error",
      });
    }
  };

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

  // Check if selected room type is "Deluxe Single/Couple"
  const isDeluxeRoom = roomName.some((room) =>
    room.includes("Deluxe Single/Couple")
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Update Booking</h1>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Information */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="text"
                name="customerNumber"
                value={formData.customerNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Address/Company
              </label>
              <input
                type="text"
                name="addressOrCompanyName"
                value={formData?.addressOrCompanyName || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Room Selection - Using Autocomplete like BookingModal */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Room Type
              </label>
              <Autocomplete
                size="small"
                multiple
                id="room-type-autocomplete"
                options={
                  roomsData?.datewiseRoom?.data?.data?.map(
                    (roomname) => roomname?.roomname
                  ) || []
                }
                getOptionLabel={(option) => option}
                filterSelectedOptions
                onChange={(e, value) => {
                  if (value.length > 0) {
                    setselectRoom(value[value.length - 1]);
                  }
                  setRoomName(value);
                }}
                value={roomName}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Room Type" />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Room Number
              </label>
              <Autocomplete
                size="small"
                multiple
                id="room-number-autocomplete"
                options={availableRooms || []}
                getOptionLabel={(option) => option}
                filterSelectedOptions
                onChange={(e, value) => {
                  setAllRoomsNumber(value);
                }}
                value={allRoomsNumber}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Room Numbers" />
                )}
              />
            </div>

            {/* Room Type Option - Only shown for Deluxe Single/Couple rooms */}
            {isDeluxeRoom && (
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Room Type Option
                </label>
                <select
                  disabled
                  name="roomTypeOption"
                  value={roomTypeOption} // Only use value, not defaultValue
                  onChange={handleRoomTypeOptionChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="isSingle">Single</option>
                  <option value="isCouple">Couple</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Check-in Date
              </label>
              <input
                type="date"
                name="firstDate"
                disabled
                value={format(selectfirstDate, "yyyy-MM-dd")}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setselectfirstDate(date);
                  setFormData((prev) => ({
                    ...prev,
                    firstDate: e.target.value,
                  }));
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Check-out Date
              </label>
              <input
                type="date"
                name="lastDate"
                value={format(selectlastDate, "yyyy-MM-dd")}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setselectlastDate(date);
                  setFormData((prev) => ({
                    ...prev,
                    lastDate: e.target.value,
                  }));
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* New field for checkin status */}
            <Grid item xs={12} mt={3}>
              <TextField
                select
                label="Checkout Status"
                variant="outlined"
                fullWidth
                size="small"
                value={checkinStatus}
                onChange={(e) => setCheckinStatus(e.target.value)}
                className="mt-1"
              >
                <MenuItem value="Normal CheckOut">Normal CheckOut</MenuItem>
                <MenuItem value="Early CheckIn">Early CheckIn</MenuItem>
                <MenuItem value="Early CheckOut">Early CheckOut</MenuItem>
                <MenuItem value="Late CheckOut">Late CheckOut</MenuItem>
              </TextField>
            </Grid>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Status
              </label>
              <select
                name="checkIn"
                value={formData.checkIn}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Status</option>
                <option value="checked In">Checked In</option>
                <option value="checked Out">Checked Out</option>
                <option value="reserved">Reserved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Base Amount
              </label>
              <input
                type="number"
                name="beforeDiscountCost"
                value={roomCost || formData.beforeDiscountCost}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
              />
            </div>

            {/* Discount section - similar to BookingModal */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Discount
              </label>
              <div className="flex gap-2">
                <div className="w-full relative">
                  <input
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleDiscountPercentageChange}
                    type="text"
                    onKeyDown={(e) => handleKeyCheck(e)}
                    placeholder="Percentage"
                    className="w-full rounded-lg border-[1.5px] bg-transparent p-2 font-medium outline-none transition focus:border-primary"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600">
                    %
                  </span>
                </div>
                <div className="w-full relative">
                  <input
                    name="discountFlat"
                    value={formData.discountFlat}
                    onChange={handleDiscountFlatChange}
                    type="text"
                    onKeyDown={(e) => handleKeyCheck(e)}
                    placeholder="Flat"
                    className="w-full rounded-lg border-[1.5px] bg-transparent p-2 font-medium outline-none transition focus:border-primary"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600">
                    BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Updated Paid Amount display with total amount */}
            <div>
              <label className="block font-medium text-gray-600">
                <span className="text-sm">Paid Amount</span>{" "}
                <span className="text-bold">
                  (
                  <span className="text-red-500 font-bold">
                    {calculateTotalAmount()} Taka
                  </span>
                  )
                </span>
              </label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                min="0"
              />
              <div className="mt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setOpenPaymentDialog(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Payment
                </button>
                <div className="text-sm">
                  <span className="font-medium">Due: </span>
                  <span className="text-red-500 font-semibold">
                    {dueAmount} Taka
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Booked From
              </label>
              <select
                name="bookedFrom"
                value={formData.bookedFrom}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Source</option>
                <option value="Counter">Counter</option>
                <option value="Website">Website</option>
                <option value="Phone">Phone</option>
                <option value="Third Party">Third Party</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Referred By
              </label>
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Booking
            </button>
          </div>
        </form>
      </div>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
      >
        <DialogTitle>Add New Payment</DialogTitle>
        <DialogContent>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                value={newPayment.paymentDate}
                onChange={handleNewPaymentChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Payment Method
              </label>
              <select
                name="paymentmethod"
                value={newPayment.paymentmethod}
                onChange={handleNewPaymentChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Mobile Banking">Mobile Banking</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {newPayment.paymentmethod !== "Cash" && (
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Reference Number
                </label>
                <input
                  type="text"
                  name="payNumber"
                  value={newPayment.payNumber}
                  onChange={handleNewPaymentChange}
                  placeholder={`${newPayment.paymentmethod} Number`}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={newPayment.amount}
                onChange={handleNewPaymentChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setOpenPaymentDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPayment}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Payment
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBooking;
