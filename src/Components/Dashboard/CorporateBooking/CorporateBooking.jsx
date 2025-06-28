import React, { useState } from "react";
import Modal from "../../Common/Modal";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";
import Axios from "axios";
import { FetchUrls } from "../../Common/FetchUrls";
import Swal from "sweetalert2";

const CorporateBooking = () => {
  const [corporateModal, setshowCorporateModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [addonsData, setAddonsData] = useState([
    { itemName: "", total: 0, item: "", itemPrice: "" },
  ]);
  const [payment, setpayment] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [corporateBooking, setCorporateBooking] = useState([]);

  const addonstotalPrice = addonsData?.reduce((acc, curr) => acc + curr.total, 0);

  const corporateFormData = [
    {
      label: "Organization Name",
      type: "text",
      placeholder: "Organization Name",
      name: "organizationName",
      required: false,
    },
    {
      label: "Guest's Name",
      type: "text",
      placeholder: "Guest's Name",
      name: "customerName",
      required: true,
    },
    {
      label: "Phone Number",
      type: "number",
      placeholder: "Phone Number",
      name: "customerNumber",
      required: true,
    },
    {
      label: "Select Authentication",
      type: "select",
      placeholder: "Select",
      name: "authentication",
      values: ["NID", "Passport", "Driving Licence number"],
      required: false,
    },
    {
      label: "Authentication Number",
      type: "text",
      placeholder: "Authentication Number",
      name: "authenticationNumber",
      required: false,
    },
    {
      type: "date",
      name: "bookingDate",
      onchange: (e) => {
        handleDateChange(e.target.value);
      },
      required: true,
    },
    {
      label: "No of Adults",
      type: "number",
      placeholder: "No of Adults",
      name: "adult",
      required: false,
    },
    {
      label: "Select Conference Hall",
      type: "select",
      placeholder: "Select",
      name: "halls",
      values: [
        "Hall 1 (Shift- 9 to 5pm)",
        "Hall 1 (Shift- 5 to 11pm)",
        "Hall 2 (Shift- 9 to 5pm)",
        "Hall 2 (Shift- 5 to 11pm)",
        "Hall 3 (Shift- 9 to 5pm)",
        "Hall 3 (Shift- 5 to 11pm)",
      ].filter((hall) => !corporateBooking.some((booking) => booking.halls?.includes(hall))),
      required: false,
    },
    {
      label: `Price`,
      type: "number",
      placeholder: "Hall Price",
      name: "price",
      required: false,
      onchange: (e) => {
        setPaidAmount(Number(e.target.value));
      },
    },
    {
      label: "Payment Method",
      type: "select",
      placeholder: "Payment Method",
      name: "paymentmethod",
      values: ["Cash", "Bkash", "Check", "City Bank", "Prime Bank"],
      required: false,
    },

    {
      label: `Paid Amount (${paidAmount + addonstotalPrice})`,
      type: "number",
      placeholder: "Paid Amount",
      name: "paidAmount",
      required: false,
    },
  ];

  const handleItemChange = (index, field, value) => {
    const newData = [...addonsData];
    newData[index][field] = value;
    if (field === "item" || field === "itemPrice") {
      newData[index]["total"] = newData[index]["item"] * newData[index]["itemPrice"];
    }
    setAddonsData(newData);
  };

  const Addons = [
    "Breakfast",
    "Lunch",
    "Mid Morning Snacks",
    "Evening Snacks",
    "Sound System",
    "Plastic Chair",
    "Multimedia Projector",
    "Cordless Sound system",
    "Chotpoti/Fuska",
    "Pandle (Per Sqft)",
    "Stage (Per Sqft)",
    "Extra Table",
    "Note Pad",
    "Pen",
    "Print",
  ];

  const handleAddMore = () => {
    setAddonsData((prevData) => [...prevData, { itemName: "", total: 0, item: "", itemPrice: "" }]);
  };

  const handleRemoveField = (index) => {
    if (addonsData.length === 1) {
      return;
    }
    setAddonsData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleDateChange = async (date) => {
    try {
      const res = await Axios.get(FetchUrls(`corporate/get-conferencehallbyname?date=${date}`));
      if (res.status === 200) {
        setCorporateBooking(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCorporateSubmit = async (data) => {
    const { paymentmethod, payNumber, ...rest } = data;
    try {
      const newData = {
        ...rest,
        addonsData,
        hallPrice: Number(data?.price) || 0,
        price: Number(data?.price) + addonstotalPrice || 0,
        paidAmount: Number(data?.paidAmount) || 0,
        dueAmount: (Number(data?.price) + addonstotalPrice || 0) - (Number(data?.paidAmount) || 0),
        checkIn: "checked In",
        bookedFrom: "Corporate",
        payment: {
          paymentmethod: data?.paymentmethod,
          payNumber: data?.payNumber || "",
        },
      };
      const res = await Axios.post(FetchUrls("corporate/add-conferencehall"), newData);
      if (res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Corporate Booking Added Successfully!",
          icon: "success",
        }).then(() => {
          setAddonsData([{ itemName: "", total: 0, item: "", itemPrice: "" }]);
          setshowCorporateModal(false);
          reset();
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong!",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-2">
      <div className="bg-accent bg-opacity-25 p-2 text-center rounded-lg border">
        <h1 className="text-lg font-bold">Confarence Room</h1>
        <button
          onClick={() => setshowCorporateModal(true)}
          className="bg-accent text-sm p-2 text-white rounded-md hover:bg-secondary duration-300 mt-2"
        >
          Book Now
        </button>
      </div>
      <Modal isVisible={corporateModal} onClose={() => setshowCorporateModal(false)}>
        <section className="p-5 relative">
          <h1 className="text-2xl font-bold pb-8">Add conference hall with food</h1>
          <button
            className=" text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
            onClick={() => {
              setshowCorporateModal(false);
            }}
          >
            X
          </button>
          <form onSubmit={handleSubmit(onCorporateSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {corporateFormData?.map((data, index) => {
                return (
                  <div key={index}>
                    {data.name === "authentication" || data?.name === "halls" ? (
                      <FormControl fullWidth>
                        <InputLabel size="small" id="demo-simple-select-label">
                          {data?.label}
                        </InputLabel>
                        <Select
                          {...register(`${data?.name}`, { required: true })}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={data?.label}
                          size="small"
                        >
                          {corporateBooking &&
                            data?.values?.map((value, index) => (
                              <MenuItem key={index} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    ) : data.name === "paymentmethod" ? (
                      <div className="flex gap-4">
                        <FormControl fullWidth>
                          <InputLabel size="small" id="demo-simple-select-label">
                            {data?.label}
                          </InputLabel>
                          <Select
                            {...register(`${data?.name}`, {
                              required: `${data?.label} is Required`,
                            })}
                            onChange={(e) => {
                              setpayment(e.target.value);
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={data?.label}
                            size="small"
                          >
                            {data?.values?.map((value, index) => (
                              <MenuItem key={index} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {payment && payment !== "Cash" && (
                          <FormControl fullWidth>
                            <TextField
                              {...register("payNumber")}
                              type="text"
                              id="outlined-basic"
                              label={`${payment} Number`}
                              variant="outlined"
                              size="small"
                            />
                          </FormControl>
                        )}
                      </div>
                    ) : (
                      <FormControl fullWidth>
                        <TextField
                          {...register(`${data?.name}`, { required: `${data?.label} is Required` })}
                          type={data?.type}
                          onChange={data?.onchange}
                          id="outlined-basic"
                          label={data?.label}
                          variant="outlined"
                          size="small"
                        />
                      </FormControl>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 gap-5 mt-5">
              {addonsData.map((addon, index) => (
                <div key={index} className="flex gap-2">
                  <Autocomplete
                    sx={{ width: 800 }}
                    disablePortal
                    id={`combo-box-demo-${index}`}
                    options={Addons}
                    size="small"
                    filterSelectedOptions
                    onChange={(e, value) => {
                      handleItemChange(index, "itemName", value);
                    }}
                    renderInput={(params) => <TextField {...params} label="Add Extra Service" />}
                  />
                  <TextField
                    sx={{ width: 400 }}
                    type="number"
                    value={addon.item}
                    onChange={(e) => handleItemChange(index, "item", e.target.value)}
                    id={`outlined-basic-${index}`}
                    label="Quantity"
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    className="w-full"
                    type="number"
                    value={addon.itemPrice}
                    onChange={(e) => handleItemChange(index, "itemPrice", e.target.value)}
                    id={`outlined-basic-${index}`}
                    label="Price"
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    className="w-full"
                    type="number"
                    onChange={(e) => handleItemChange(index, "total", e.target.value)}
                    value={addon.item * addon.itemPrice}
                    id={`outlined-basic-${index}`}
                    label="Total"
                    variant="outlined"
                    size="small"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="flex uppercase items-center text-xs text-white justify-center rounded-md bg-secondary p-2 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                onSubmit={handleSubmit}
                className="flex uppercase text-sm text-white justify-center rounded-md bg-primary p-2 font-semibold mt-3"
              >
                Add Hall
              </button>
              <button
                type="button"
                onClick={handleAddMore}
                className="flex uppercase text-sm text-white justify-center rounded-md bg-secondary p-2 font-semibold mt-3"
              >
                Add Field
              </button>
            </div>
          </form>
        </section>
      </Modal>
    </div>
  );
};

export default CorporateBooking;
