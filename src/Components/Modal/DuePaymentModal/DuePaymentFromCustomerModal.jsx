import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Modalcommon from "../../Common/Modal";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  useAddPaymentFromCustomerMutation,
  useAddPaymentMutation,
  useCreateCardPaymentItemMutation,
  useGetCardPaymentItemsQuery,
} from "../../../redux/baseApi/baseApi";

// Add Item Modal Component
const AddItemModal = ({ isVisible, onClose, onSubmit, isLoading }) => {
  const [cardPaymentItemName, setCardPaymentItemName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardPaymentItemName.trim()) return;
    onSubmit({ cardPaymentItemName });
  };

  return (
    <Modalcommon isVisible={isVisible} onClose={onClose}>
      <div className="p-6 relative">
        <h2 className="text-xl font-bold mb-6 text-center text-blue-700">
          Add New Bank
        </h2>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={cardPaymentItemName}
              onChange={(e) => setCardPaymentItemName(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter bank name"
              required
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || !cardPaymentItemName.trim()}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-300"
            >
              {isLoading ? "Adding..." : "Add Bank"}
            </button>
          </div>
        </form>
      </div>
    </Modalcommon>
  );
};

const DuePaymentFromCustomerModal = ({
  isVisible,
  onClose,
  modaldata,
  updateAndAddPayment,
  refetch,
  setCorporateChecked,
  corporateChecked,
}) => {
  const { register, handleSubmit } = useForm();
  const [payment, setpayment] = useState(null);
  const paymentDate = new Date().toISOString().slice(0, 10);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Get card payment items from API
  const [createCardPaymentItem, { isLoading: isItemCreating }] =
    useCreateCardPaymentItemMutation();
  const { data: getAllCardPaymentItems, isLoading: cardPaymentItemsLoading } =
    useGetCardPaymentItemsQuery();
  const cardPaymentItems = getAllCardPaymentItems?.data || [];

  const [addPayment] = useAddPaymentMutation();
  const [addPaymentFromCustomer] = useAddPaymentFromCustomerMutation();

  // console.log("corporateChecked", corporateChecked);

  // Payment Submit Function
  const onPaymentSubmit = async (data) => {
    try {
      // Create payment object in the correct format
      const paymentData = {
        // Include bookingId which is likely required by your API
        bookingId: modaldata?.bookingId,
        // Format payment data properly
        payment: {
          paymentmethod: data?.paymentmethod,
          payNumber: data?.payNumber || "",
          paymentDate: paymentDate,
          amount: Number(data?.paidAmount) || 0,
        },
        isCorporate: corporateChecked,
        corporateName: data?.corporateName || "",
        corporatePhone: data?.corporateNumber || "",
      };

      console.log("Sending payment data:", paymentData);

      const response = await addPaymentFromCustomer({
        id: modaldata?._id,
        data: paymentData,
      }).unwrap();

      if (response) {
        setCorporateChecked(false);

        Swal.fire({
          title: "Success!",
          text: response?.message || "Due Payment Successfully Recorded!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          onClose();
          refetch();
        });
      }
    } catch (error) {
      console.log("Payment error details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to update payment",
      });
    }
  };

  const handleAddItemSubmit = async (data) => {
    try {
      const response = await createCardPaymentItem(data).unwrap();
      if (response) {
        Swal.fire({
          title: "Success!",
          text: "Bank added successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        setShowAddItemModal(false);
      }
    } catch (error) {
      console.error("Error adding card payment item:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to add bank",
      });
    }
  };

  return (
    <>
      <Modalcommon isVisible={isVisible} onClose={onClose}>
        <div className="p-6 relative">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            Due Payment From Customer
          </h2>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex justify-start mb-4">
            <button
              type="button"
              onClick={() => setShowAddItemModal(true)}
              className="flex uppercase text-sm text-white justify-center rounded-md bg-primary px-4 py-2 font-semibold"
              disabled={isItemCreating}
            >
              {isItemCreating ? "Adding..." : "Add Bank"}
            </button>
          </div>
          <form onSubmit={handleSubmit(onPaymentSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest's Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest's Name
                </label>
                <input
                  {...register("customerName")}
                  type="text"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={true}
                  defaultValue={modaldata?.customerName}
                />
              </div>

              {/* Guest's Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest's Phone Number
                </label>
                <input
                  {...register("customerNumber")}
                  type="number"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={true}
                  defaultValue={modaldata?.customerNumber}
                />
              </div>

              {/* Guest's Authentication Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest's Authentication Number
                </label>
                <input
                  {...register("customerNid")}
                  type="number"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={true}
                  defaultValue={modaldata?.authenticationNumber}
                />
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  {...register("paymentmethod", {
                    required: "Payment method is required",
                  })}
                  onChange={(e) => setpayment(e.target.value)}
                  defaultValue={"Cash"}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Select Payment Method</option>
                  {["Cash", "Bkash", "Card Payment", "Check"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Selection (Only for Card Payment) - Now using API data */}
              {payment === "Card Payment" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bank <span className="text-red-600">*</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <select
                      {...register("bankName", {
                        required:
                          payment === "Card Payment"
                            ? "Bank selection is required"
                            : false,
                      })}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="">Select Bank</option>
                      {cardPaymentItemsLoading ? (
                        <option value="" disabled>
                          Loading banks...
                        </option>
                      ) : (
                        cardPaymentItems.map((item) => (
                          <option
                            key={item._id}
                            value={item.cardPaymentItemName}
                          >
                            {item.cardPaymentItemName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              )}

              {/* Payment Number (for non-Cash methods except Card Payment) */}
              {payment && payment !== "Cash" && payment !== "Card Payment" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {payment} Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("payNumber", {
                      required:
                        payment !== "Cash"
                          ? "Payment number is required"
                          : false,
                    })}
                    type="text"
                    placeholder={`${payment} Number`}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
              )}

              {/* Card Number (for Card Payment) */}
              {/* {payment === "Card Payment" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("payNumber", {
                      required: "Card number is required",
                    })}
                    type="text"
                    placeholder="Card Number"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
              )} */}

              {/* Paid Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid Amount{" "}
                  <span className="text-red-600 font-semibold">
                    (Due: {modaldata?.dueAmount})
                  </span>
                </label>
                <input
                  {...register("paidAmount", {
                    required: corporateChecked ? false : true,
                  })}
                  type="number"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  defaultValue={null}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Process Payment
              </button>
            </div>
          </form>
        </div>
      </Modalcommon>

      {/* Add Item Modal */}
      <AddItemModal
        isVisible={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onSubmit={handleAddItemSubmit}
        isLoading={isItemCreating}
      />
    </>
  );
};

export default DuePaymentFromCustomerModal;
