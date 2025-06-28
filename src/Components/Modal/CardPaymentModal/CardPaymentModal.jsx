import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { useCreateCardPaymentItemMutation } from "../../../redux/baseApi/baseApi";

const CardPaymentModal = ({ isVisible, onClose }) => {
  const [cardPaymentItemName, setCardPaymentItemName] = useState("");
  const [createCardPaymentItem, { isLoading }] = useCreateCardPaymentItemMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cardPaymentItemName.trim()) return;

    try {
      // Changed from {name: cardPaymentItemName} to {cardPaymentItemName: cardPaymentItemName}
      // to match what the controller expects
      const response = await createCardPaymentItem({ cardPaymentItemName }).unwrap();
      
      if (response) {
        Swal.fire({
          title: "Success!",
          text: "Bank added successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        setCardPaymentItemName("");
        onClose();
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
    <Dialog 
      open={isVisible} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          textAlign: "center",
          color: "#1e40af",
          fontWeight: "bold",
          position: "relative",
        }}
      >
        Add New Bank
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={cardPaymentItemName}
                onChange={(e) => setCardPaymentItemName(e.target.value)}
                className="w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter bank name"
                required
                autoFocus
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading || !cardPaymentItemName.trim()}
                className="w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="inline-flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : "Add Bank"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardPaymentModal;