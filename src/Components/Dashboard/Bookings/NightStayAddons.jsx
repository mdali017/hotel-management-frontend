import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Swal from "sweetalert2";
import {
  useCreateExtraPaymentMutation,
  useCreateExtraPaymentItemMutation,
  useGetExtraPaymentItemsQuery,
} from "../../../redux/baseApi/baseApi";

const NightStayAddons = ({
  setNightStayModalOpen,
  nightStayModalOpen,
  selectedBooking,
  id,
  refetch,
}) => {
  const { handleSubmit, reset } = useForm();
  const [addonsData, setAddonsData] = useState([
    { itemName: "", total: "", item: "", itemPrice: "" },
  ]);

  // State for the Add Item modal
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  // Get extra payment items from API
  const { data: extraPaymentItems, refetch: refetchItems } =
    useGetExtraPaymentItemsQuery();

  // Convert extraPaymentItems to options array for Autocomplete
  const Addons = extraPaymentItems?.data?.map(
    (item) => item.extraPaymentItemName
  ) || ["Orion Caffee", "4Q Restuarant"];

  // API mutations from redux
  const [createExtraPayment, { isLoading }] = useCreateExtraPaymentMutation();
  const [createExtraPaymentItem, { isLoading: isItemCreating }] =
    useCreateExtraPaymentItemMutation();

  // Calculate total for display in the heading
  const calculateTotalForDisplay = () => {
    if (addonsData.length === 0) return "";

    const firstItem = addonsData[0];
    if (firstItem.total) return firstItem.total;

    if (selectedBooking?.dueAmount && firstItem.itemPrice) {
      const dueAmount = parseInt(selectedBooking.dueAmount);
      const itemPrice = parseInt(firstItem.itemPrice) || 0;
      return (dueAmount + itemPrice).toString();
    }

    return selectedBooking?.dueAmount || "";
  };

  // Set default room number when selectedBooking changes
  useEffect(() => {
    if (
      selectedBooking &&
      selectedBooking.roomNumber &&
      selectedBooking.roomNumber.length > 0
    ) {
      setAddonsData([
        {
          itemName: "",
          item: selectedBooking.roomNumber[0],
          itemPrice: "",
          total: selectedBooking.dueAmount
            ? parseInt(selectedBooking.dueAmount).toString()
            : "",
        },
      ]);
    }
  }, [selectedBooking]);

  const handleAddMore = () => {
    const defaultRoom = selectedBooking?.roomNumber?.[0] || "";

    setAddonsData((prevData) => [
      ...prevData,
      {
        itemName: "",
        item: defaultRoom,
        itemPrice: "",
        total: selectedBooking.dueAmount
          ? parseInt(selectedBooking.dueAmount).toString()
          : "",
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const newData = [...addonsData];
    newData[index][field] = value;

    // Update total when itemPrice changes (just add to dueAmount instead of multiplying)
    if (field === "itemPrice") {
      const price = value ? parseInt(value) : 0;
      const dueAmount = selectedBooking?.dueAmount
        ? parseInt(selectedBooking.dueAmount)
        : 0;
      newData[index]["total"] = (dueAmount + price).toString();
    }

    setAddonsData(newData);
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

  // Submit handler for creating a new extra payment item
  const handleAddItemSubmit = async () => {
    try {
      if (!newItemName.trim()) {
        // Close the modal first before showing alert
        setAddItemModalOpen(false);
        setTimeout(() => {
          Swal.fire({
            title: "Error!",
            text: "Item name cannot be empty!",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }, 300);
        return;
      }

      // Create payload for the API
      const payload = {
        extraPaymentItemName: newItemName,
      };

      // Call the mutation
      await createExtraPaymentItem(payload).unwrap();

      // Reset form and close modal
      setNewItemName("");
      setAddItemModalOpen(false);
      setNightStayModalOpen(false);

      // Delay showing the alert to ensure modal is closed
      setTimeout(() => {
        Swal.fire({
          title: "Success!",
          text: "New Payment Item Added Successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
          didClose: () => {
            // Refresh the items list after the alert is closed
            refetchItems();
          },
        });
      }, 300);
    } catch (error) {
      console.error("Error adding payment item:", error);

      // Close the modal first before showing alert
      setAddItemModalOpen(false);
      setTimeout(() => {
        Swal.fire({
          title: "Error!",
          text: "Something Went Wrong!",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }, 300);
    }
  };

  // Updated submit function to use the RTK Query mutation
  const handleAddonsSubmit = async () => {
    try {
      // Process each addon item
      for (const addon of addonsData) {
        // Skip empty entries
        if (!addon.itemName || !addon.item || !addon.itemPrice) {
          continue;
        }

        // Create payload for the API
        const payload = {
          booking_id: id,
          extraServiceName: addon.itemName,
          extraServiceRoomNumber: addon.item,
          extraServicePrice: addon.itemPrice,
          extraServiceDate: new Date().toISOString(),
          extraServiceTotal:
            addon.total ||
            (
              parseInt(selectedBooking.dueAmount) + parseInt(addon.itemPrice)
            ).toString(),
        };

        // Call the mutation
        await createExtraPayment(payload).unwrap();
      }

      // Reset form
      const defaultRoom = selectedBooking?.roomNumber?.[0] || "";
      setAddonsData([
        {
          itemName: "",
          item: defaultRoom,
          itemPrice: "",
          total: selectedBooking.dueAmount
            ? parseInt(selectedBooking.dueAmount).toString()
            : "",
        },
      ]);

      // Close the modal first before showing alert
      setNightStayModalOpen(false);

      // Delay showing the alert to ensure modal is closed
      setTimeout(() => {
        Swal.fire({
          title: "Success!",
          text: "Extra Services Added Successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
          didClose: () => {
            // Refresh data after the alert is closed
            refetch();
          },
        });
      }, 300);
    } catch (error) {
      console.error("Error adding extra services:", error);

      // Close the modal first before showing alert
      setNightStayModalOpen(false);
      setTimeout(() => {
        Swal.fire({
          title: "Error!",
          text: "Something Went Wrong!",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }, 300);
    }
  };

  // Common style for all text fields
  const textFieldStyle = { width: "100%" };

  return (
    <>
      {/* Main Modal */}
      <Modal
        open={nightStayModalOpen}
        onClose={() => setNightStayModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <button
              type="button"
              onClick={() => setAddItemModalOpen(true)}
              className="absolute top-5 left-5 bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Add Item
            </button>
            <h1 className="mb-5 font-semibold text-2xl text-secondary text-center">
              Select Your Extra Service{" "}
              <span className="text-red-500 font-bold">
                ({calculateTotalForDisplay()} BDT)
              </span>
            </h1>
            <button
              className="text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
              onClick={() => {
                reset();
                setNightStayModalOpen(false);
              }}
            >
              X
            </button>
            <form onSubmit={handleSubmit(handleAddonsSubmit)}>
              <div className="grid grid-cols-1 gap-5">
                {addonsData.map((addon, index) => (
                  <div key={index} className="flex gap-2">
                    <Autocomplete
                      sx={textFieldStyle}
                      disablePortal
                      id={`combo-box-demo-${index}`}
                      options={Addons}
                      size="small"
                      filterSelectedOptions
                      onChange={(e, value) => {
                        handleItemChange(index, "itemName", value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label="Select Your Extra Service"
                        />
                      )}
                    />

                    <TextField
                      required
                      sx={textFieldStyle}
                      type="text"
                      value={addon.item}
                      onChange={(e) =>
                        handleItemChange(index, "item", e.target.value)
                      }
                      id={`outlined-basic-item-${index}`}
                      label="Room Number"
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      required
                      sx={textFieldStyle}
                      type="number"
                      value={addon.itemPrice}
                      onChange={(e) =>
                        handleItemChange(index, "itemPrice", e.target.value)
                      }
                      id={`outlined-basic-price-${index}`}
                      label="Price"
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      required
                      sx={textFieldStyle}
                      type="number"
                      disabled
                      onChange={(e) =>
                        handleItemChange(index, "total", e.target.value)
                      }
                      value={
                        addon.total ||
                        (selectedBooking?.dueAmount && addon.itemPrice
                          ? (
                              parseInt(selectedBooking.dueAmount) +
                              parseInt(addon.itemPrice)
                            ).toString()
                          : "")
                      }
                      id={`outlined-basic-total-${index}`}
                      label="Total"
                      variant="outlined"
                      size="small"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex uppercase text-sm text-white justify-center rounded-md bg-primary p-2 font-semibold mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        open={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        aria-labelledby="add-item-modal-title"
        aria-describedby="add-item-modal-description"
      >
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
            <h2 className="mb-4 font-semibold text-xl text-secondary text-center">
              Add New Extra Payment Item
            </h2>
            <button
              className="text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
              onClick={() => {
                setNewItemName("");
                setAddItemModalOpen(false);
              }}
            >
              X
            </button>
            <div className="mb-4">
              <TextField
                required
                fullWidth
                label="Item Name"
                variant="outlined"
                size="small"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAddItemSubmit}
                className="flex uppercase text-sm text-white justify-center rounded-md bg-primary px-4 py-2 font-semibold"
                disabled={isItemCreating}
              >
                {isItemCreating ? "Adding..." : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NightStayAddons;
