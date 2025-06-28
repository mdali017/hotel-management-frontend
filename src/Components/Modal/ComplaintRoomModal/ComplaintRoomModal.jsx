import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  useDeleteComplaintRoomByRoomNameMutation,
  useGetComplaintRoomByRoomNameQuery,
  useUpdateHousekeepingMutation,
} from "../../../redux/baseApi/baseApi";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";

const ComplaintRoomModal = ({
  openComplaintRoomModal,
  setOpenComplaintRoomModal,
  complaintRoom,
  openBackDrop = false,
  ColorStatusRefetch,
  roomNumber,
}) => {
  const [loading, setLoading] = useState(false);
  const [newComplaint, setNewComplaint] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [checkboxes, setCheckboxes] = useState({});
  const [deleteComplaintRoomByRoomName] =
    useDeleteComplaintRoomByRoomNameMutation();

  // Use the actual complaintRoom (or roomNumber) from props
  const roomToQuery = complaintRoom || roomNumber;

  const {
    data: complaintRoomData,
    isLoading: isComplaintDataLoading,
    refetch: refetchComplaints,
  } = useGetComplaintRoomByRoomNameQuery(roomToQuery, { skip: !roomToQuery });

  // Load existing complaints when data is fetched
  useEffect(() => {
    if (complaintRoomData?.data?.[0]?.complaints) {
      const existingComplaints = complaintRoomData.data[0].complaints;
      setComplaints(existingComplaints);

      // Initialize checkboxes to all unchecked by default
      const initialCheckboxes = {};
      existingComplaints.forEach((complaint, index) => {
        initialCheckboxes[`complaint_${index}`] = false; // Set to false for unchecked
      });

      setCheckboxes(initialCheckboxes);
    }
  }, [complaintRoomData]);

  const handleCheckboxChange = (event) => {
    setCheckboxes({
      ...checkboxes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleAddComplaint = () => {
    if (!newComplaint.trim()) return;
    // Add new complaint to the list
    const updatedComplaints = [...complaints, newComplaint];
    setComplaints(updatedComplaints);

    // Add a new checkbox for this complaint - unchecked by default
    setCheckboxes({
      ...checkboxes,
      [`complaint_${complaints.length}`]: false,
    });

    setNewComplaint("");
  };

  const removeComplaint = (indexToRemove) => {
    // Remove complaint from the list
    const updatedComplaints = complaints.filter(
      (_, index) => index !== indexToRemove
    );
    setComplaints(updatedComplaints);

    // Remove this checkbox and reindex the rest
    const updatedCheckboxes = {};
    updatedComplaints.forEach((_, index) => {
      if (index < indexToRemove) {
        // Keep the same checkbox state for items before the removed one
        updatedCheckboxes[`complaint_${index}`] =
          checkboxes[`complaint_${index}`];
      } else {
        // Shift checkbox states for items after the removed one
        updatedCheckboxes[`complaint_${index}`] =
          checkboxes[`complaint_${index + 1}`];
      }
    });

    setCheckboxes(updatedCheckboxes);
  };

  const handleSubmit = async () => {
    const result = await deleteComplaintRoomByRoomName(roomToQuery);

    if (result.data?.success) {
      setOpenComplaintRoomModal(false);
      Swal.fire({
        icon: "success",
        // title: "Wow Room Ready For Guest !!!",
        title: newComplaint.length > 0 ? "This room under the construction" : "Room Ready For Guest",
        showConfirmButton: false,
        timer: 1500,
      });

      // Refresh data
      if (ColorStatusRefetch) ColorStatusRefetch();
    }
  };

  const handleDeleteAllComplaints = async () => {
    try {
      setLoading(true);

      // Confirm deletion with user
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will remove all complaints for this room.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete all!",
      });

      if (result.isConfirmed) {
        // Call the delete mutation
        await deleteComplaintRoomByRoomName(roomToQuery);

        Swal.fire({
          icon: "success",
          title: "All Complaints Removed",
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form
        setCheckboxes({});
        setComplaints([]);
        setNewComplaint("");

        // Refresh data
        if (ColorStatusRefetch) ColorStatusRefetch();

        // Close modal
        setOpenComplaintRoomModal(false);
      }
    } catch (error) {
      console.error("Error deleting complaints:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete complaints",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog
        open={openComplaintRoomModal}
        onClose={() => setOpenComplaintRoomModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          id="alert-dialog-title"
          color="error"
          sx={{ bgcolor: "#ffebee", fontWeight: "bold" }}
        >
          Room {roomToQuery} - Complaint Management
        </DialogTitle>
        <DialogContent>
          {isComplaintDataLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <FormGroup>
              {complaints.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Current Complaints:
                  </Typography>

                  <div className="grid grid-cols-1 gap-1">
                    {complaints.map((item, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={checkboxes[`complaint_${index}`] || false}
                            onChange={handleCheckboxChange}
                            name={`complaint_${index}`}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Typography>{item}</Typography>
                          </Box>
                        }
                      />
                    ))}
                  </div>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ my: 2 }}
                >
                  No complaints found for this room.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  onClick={handleDeleteAllComplaints}
                  variant="outlined"
                  color="error"
                  disabled={loading || complaints.length === 0}
                >
                  Clear All
                </Button>

                <Box>
                  <Button
                    onClick={() => setOpenComplaintRoomModal(false)}
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Resolve Room"}
                  </Button>
                </Box>
              </Box>
            </FormGroup>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintRoomModal;
