import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Axios from "axios";
import { FetchUrls } from "../../Common/FetchUrls";
import Swal from "sweetalert2";

const DaylongAddons = ({
  handleClose,
  open,
  setOpen,
  roomsData,
  addonsModalData,
  refetch,
  roomsDataall,
}) => {
  const { register, handleSubmit, control, formState, reset } = useForm();
  const [addonsData, setAddonsData] = useState([{ total: "", item: "", itemPrice: "" }]);
  const [discount, setDiscount] = useState(null);
  const [discountFlat, setDiscountFlat] = useState(null);
  const [roomType, setRoomType] = useState([]);
  const [allRoomNumbers, setAllRoomsNumber] = useState([]);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const handleItemChange = (index, field, value) => {
    const newData = [...addonsData];
    newData[index][field] = value;
    if (field === "item" || field === "itemPrice") {
      newData[index]["total"] = calculateTotal(newData[index]["item"], newData[index]["itemPrice"]);
    }
    setAddonsData(newData);
  };

  // Calculate total for each row
  const calculateTotal = (item, itemPrice) => {
    return item * itemPrice;
  };

  const calculateTotalAmount = () => {
    const discountedAmount = (roomCost * discount) / 100;
    const totalAmount = Math.ceil(roomCost - discountFlat - discountedAmount);
    return totalAmount;
  };

  //calculate room cost
  const roomCost = roomType?.reduce((totalCost, roomName) => {
    const roomDetails = roomsData?.combinedRooms?.find((room) => room.roomname === roomName);
    if (roomDetails) {
      const selectedRoomNumbers = roomDetails.datewiseAvailability.filter((roomNumber) =>
        allRoomNumbers.includes(roomNumber)
      );
      const roomCost = selectedRoomNumbers.length * roomDetails.cost;
      totalCost += roomCost;
    }
    return totalCost;
  }, 0);

  //room availability function
  const availableRooms = () => {
    const searchrooms = roomType?.flatMap((room) => {
      const getroom = roomsDataall.find((item) => item?.roomname === room);
      const roomnumbers = getroom?.roomnumber;
      return roomnumbers;
    });
    return searchrooms;
  };

  const Addons = [
    "Orion Caffee",
    "4Q Restuarant",
   
  ];
  const handleAddMore = () => {
    setAddonsData((prevData) => [...prevData, { total: "", item: "", itemPrice: "" }]);
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

  //addons submit function
  const handleAddonsSubmit = (data) => {
    const newAddonsData = {
      addonsName: data.selectedAddon,
      addonsPrices: addonsData,
      roomType: data.roomType,
      roomsNumber: data.roomsNumber,
      discountFlatroom: data.discountFlatroom,
      discountPercentageroom: data.discountPercentageroom,
      beforeRoomCost: roomCost || 0,
      roomsCost: calculateTotalAmount() || 0,
    };
    try {
      Axios.put(
        FetchUrls(`daylong/updateedaylongaddons/${addonsModalData._id}`),
        newAddonsData
      ).then((res) => {
        if (res.status === 200) {
          setOpen(false);
          refetch();
          reset();
          Swal.fire({
            title: "Addons Updated!",
            text: res?.data?.message || "Due Payment Successfully!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //key check function
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg relative">
          <h1 className="mb-5 font-semibold text-2xl text-secondary text-center">
            Select Your Extra Service
          </h1>
          <button
            className=" text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
            onClick={() => {
              setOpen(false);
              setShowAddRoom(false);
            }}
          >
            X
          </button>
          <form onSubmit={handleSubmit(handleAddonsSubmit)}>
            <div className="grid grid-cols-1 gap-5">
              {addonsData.map((addon, index) => (
                <div key={index} className=" gap-2">
                  <Controller
                    name={`selectedAddon[${index}]`}
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        sx={{ width: 500 }}
                        disablePortal
                        id={`combo-box-demo-${index}`}
                        options={Addons}
                        size="small"
                        filterSelectedOptions
                        onChange={(e, value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        renderInput={(params) => (
                          <TextField {...params} label="Select Your Extra Service" />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name={`item[${index}]`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        value={addon.item}
                        // onChange={(e) => handleItemChange(index, "item", e.target.value)}
                        id={`outlined-basic-${index}`}
                        label="Quantity"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                  <Controller
                    name={`price[${index}]`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        // className="w-full"
                        type="number"
                        value={addon.itemPrice}
                        // onChange={(e) => handleItemChange(index, "itemPrice", e.target.value)}
                        id={`outlined-basic-${index}`}
                        label="Price"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                  <Controller
                    name={`total[${index}]`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        // className="w-full"
                        type="number"
                        // onChange={(e) => handleItemChange(index, "total", e.target.value)}
                        value={calculateTotal(addon.item, addon.itemPrice)}
                        id={`outlined-basic-${index}`}
                        label="Total"
                        variant="outlined"
                        size="small"
                      />
                    )}
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
            {showAddRoom && (
              <FormControl fullWidth style={{ marginBottom: "10px", marginTop: "10px" }}>
                <div className="grid grid-cols-7 gap-5">
                  <div className="col-span-2">
                    <Controller
                      name="roomType"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Autocomplete
                          size="small"
                          multiple
                          id="tags-outlined"
                          options={
                            roomsDataall.map((item) => {
                              return item?.roomname;
                            }) || []
                          }
                          getOptionLabel={(option) => option}
                          filterSelectedOptions
                          onChange={(e, value) => {
                            field.onChange(value);
                            setRoomType(value);
                          }}
                          value={field.value}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Select Rooms" />
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <Controller
                      name="roomsNumber"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Autocomplete
                          size="small"
                          multiple
                          id="tags-outlined"
                          options={availableRooms() || []}
                          getOptionLabel={(option) => option}
                          filterSelectedOptions
                          onChange={(e, value) => {
                            field.onChange(value);
                            setAllRoomsNumber(value);
                          }}
                          value={field.value}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Select Roomnumbers" />
                          )}
                        />
                      )}
                    />
                    {formState.errors.roomsNumber && (
                      <p className="text-xs text-red-500 ml-1 mt-1">
                        {`*${formState.errors.roomsNumber.message}`}
                      </p>
                    )}
                  </div>

                  <div className="w-full relative">
                    <input
                      {...register("discountPercentageroom")}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      type="text"
                      onKeyDown={(e) => handleKeyCheck(e)}
                      placeholder="Percentage"
                      className="w-full rounded border-[1.5px] bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                    />
                    <span className="absolute inset-y-0 top-0 right-0 pr-3 flex items-center text-gray-600">
                      %
                    </span>
                  </div>
                  <div className="w-full relative">
                    <input
                      {...register("discountFlatroom")}
                      onChange={(e) => setDiscountFlat(Number(e.target.value))}
                      type="text"
                      onKeyDown={(e) => handleKeyCheck(e)}
                      placeholder="Flat"
                      className="w-full rounded border-[1.5px] bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600">
                      BDT
                    </span>
                  </div>
                  <TextField
                    id="outlined-basic"
                    label={`Total ${calculateTotalAmount()}`}
                    size="small"
                    variant="outlined"
                    disabled
                  />
                </div>
              </FormControl>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex uppercase text-sm text-white justify-center rounded-md bg-primary p-2 font-semibold mt-3"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleAddMore}
                className="flex uppercase text-sm text-white justify-center rounded-md bg-primary p-2 font-semibold mt-3"
              >
                Add Field
              </button>
              <button
                type="button"
                onClick={() => setShowAddRoom(!showAddRoom)}
                className="flex uppercase text-sm text-white justify-center rounded-md bg-accent p-2 font-semibold mt-3"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default DaylongAddons;
