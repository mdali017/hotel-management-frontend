import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton,
  Autocomplete,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import {
  useAddComplaintRoomMutation,
  useGetRoomColorStatusQuery,
} from "../../../redux/baseApi/baseApi";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Axios from "axios";
import { FetchUrls } from "../../Common/FetchUrls";

const CreateComplaintRoom = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    roomType: "",
    roomName: "",
    complaints: [],
    newComplaint: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectRoom, setSelectRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [addComplaintRoom, { isLoading }] = useAddComplaintRoomMutation();

  // Get today's date in the same format as AddBookingPage
  const todaydate = format(new Date(), "yyyy-MM-dd");

  // Get room color status to filter out included rooms
  const {
    data: roomsColorStatus,
    isLoading: isColorStatusLoading,
    refetch: ColorStatusRefetch,
  } = useGetRoomColorStatusQuery(todaydate, {
    pollingInterval: 20000, // Poll every 10 seconds
    refetchOnFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });

  // console.log("availableRooms", availableRooms);
  // console.log("Rooms Color Status:", roomsColorStatus);

  // Get all occupied/unavailable rooms from roomsColorStatus
  const getOccupiedRooms = () => {
    if (!roomsColorStatus?.data) return [];
    
    const occupiedRooms = [
      ...(roomsColorStatus.data.registeredAndTodayCheckout || []),
      ...(roomsColorStatus.data.registeredAndNotTodayCheckout || []),
      ...(roomsColorStatus.data.previousRegisteredAndNotTodayCheckout || []),
      ...(roomsColorStatus.data.lateCheckOutRooms || []),
      ...(roomsColorStatus.data.housekeepingRooms || []),
      ...(roomsColorStatus.data.complaintRooms || []),
    ];
    
    // Remove duplicates
    return [...new Set(occupiedRooms)];
  };

  const occupiedRooms = getOccupiedRooms();
  // console.log("Occupied Rooms:", occupiedRooms);

  // Fetch rooms data using the same logic as AddBookingPage
  const {
    data: roomsData = [],
    isLoading: roomsLoading,
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
    enabled: isOpen, // Only fetch when modal is open
  });

  // Get available room numbers when a room type is selected
  useEffect(() => {
    const getAvailableRooms = async () => {
      if (!selectRoom) {
        setAvailableRooms([]);
        return;
      }

      try {
        // Get all rooms for the selected room type
        const rooms = roomsData?.datewiseRoom?.data?.data?.find(
          (item) => item?.roomname === selectRoom
        );

        // Get all room numbers for this room type (not just available ones)
        const allRoomNumbers =
          roomsData?.combinedRooms?.find(
            (room) => room?.roomname === selectRoom
          )?.roomnumber || [];

        setAvailableRooms(allRoomNumbers);
      } catch (error) {
        console.error("Error fetching available rooms:", error);
        setAvailableRooms([]);
      }
    };

    getAvailableRooms();
  }, [selectRoom, roomsData]);

  // Get room types from the API data
  const roomTypes =
    roomsData?.datewiseRoom?.data?.data?.map(
      (roomname) => roomname?.roomname
    ) || [];

  // Add custom complaint
  const handleAddComplaint = () => {
    if (
      formData.newComplaint.trim() &&
      !formData.complaints.includes(formData.newComplaint.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        complaints: [...prev.complaints, prev.newComplaint.trim()],
        newComplaint: "",
      }));
    }
  };

  // Remove complaint tag
  const removeComplaint = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      complaints: prev.complaints.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle room type change
  const handleRoomTypeChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      roomType: newValue || "",
      roomName: "", // Reset room name when room type changes
    }));
    setSelectRoom(newValue);
  };

  // Handle room name change
  const handleRoomNameChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, roomName: newValue || "" }));
  };

  // Handle form submission with API call
  const handleSubmit = async () => {
    if (
      formData.roomType &&
      formData.roomName &&
      formData.complaints.length > 0
    ) {
      try {
        setIsSubmitting(true);

        const requestBody = {
          roomName: formData.roomName,
          housekeeperName: "Staff",
          workingItem: [],
          isCleaning: false,
          complaints: formData.complaints,
          isComplaints: true,
          complaintRooms: [formData.roomName],
        };

        const response = await addComplaintRoom({
          roomName: formData.roomName,
          data: requestBody,
        }).unwrap();

        if (response) {
          Swal.fire({
            icon: "success",
            title: "Complaint Room Created Successfully!",
            showConfirmButton: false,
            timer: 1500,
          });

          // Reset form
          setFormData({
            roomType: "",
            roomName: "",
            complaints: [],
            newComplaint: "",
          });
          setSelectRoom(null);
          setAvailableRooms([]);

          if (onSubmit) onSubmit(response);
          onClose();
        } else {
          throw new Error("Failed to submit complaint");
        }
      } catch (error) {
        console.error("Error submitting complaint:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.data?.message ||
            "Failed to submit complaint. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields and add at least one complaint.",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddComplaint();
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        roomType: "",
        roomName: "",
        complaints: [],
        newComplaint: "",
      });
      setSelectRoom(null);
      setAvailableRooms([]);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="create-complaint-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        id="create-complaint-dialog-title"
        sx={{
          bgcolor: "#fff3cd",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Create Complaint Room
        </Typography>
        <IconButton onClick={handleClose} disabled={isSubmitting} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <div className="p-4 grid grid-cols-2 gap-4">
        <Autocomplete
          options={roomTypes}
          value={formData.roomType}
          onChange={handleRoomTypeChange}
          loading={roomsLoading}
          disabled={isSubmitting || roomsLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Room Type"
              placeholder="Select or enter room type"
              required
              size="small"
              error={!formData.roomType}
              helperText={!formData.roomType ? "Room type is required" : ""}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {roomsLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Autocomplete
          options={availableRooms.filter(room => !occupiedRooms.includes(room))}
          value={formData.roomName}
          onChange={handleRoomNameChange}
          disabled={!selectRoom || isSubmitting}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Room Number"
              placeholder={
                !selectRoom 
                  ? "Select room type first" 
                  : availableRooms.filter(room => !occupiedRooms.includes(room)).length === 0 
                    ? "No rooms available" 
                    : "Select or enter room number"
              }
              required
              size="small"
              error={!formData.roomName}
              helperText={
                !formData.roomName 
                  ? "Room number is required" 
                  : availableRooms.filter(room => !occupiedRooms.includes(room)).length > 0 
                    ? `${availableRooms.filter(room => !occupiedRooms.includes(room)).length} rooms available for complaints`
                    : "All rooms are currently occupied"
              }
            />
          )}
        />
      </div>
      <Box sx={{ px: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Add Custom Complaint:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <TextField
            fullWidth
            value={formData.newComplaint}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                newComplaint: e.target.value,
              }))
            }
            onKeyPress={handleKeyPress}
            placeholder="Type custom complaint..."
            disabled={isSubmitting}
            size="small"
          />
          <IconButton
            onClick={handleAddComplaint}
            disabled={!formData.newComplaint.trim() || isSubmitting}
            color="primary"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              "&:disabled": { bgcolor: "grey.300" },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      {/* Selected Complaints Display */}
      {formData.complaints.length > 0 && (
        <Box sx={{ px: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Selected Complaints ({formData.complaints.length}):
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {formData.complaints.map((complaint, index) => (
              <Chip
                key={index}
                label={complaint}
                onDelete={() => removeComplaint(index)}
                deleteIcon={<DeleteIcon />}
                color="error"
                variant="outlined"
                disabled={isSubmitting}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Action Buttons */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 4, p: 2 }}
      >
        <Button
          onClick={() => setFormData((prev) => ({ ...prev, complaints: [] }))}
          variant="outlined"
          color="error"
          disabled={formData.complaints.length === 0 || isSubmitting}
        >
          Clear All Complaints
        </Button>

        <Box>
          <Button
            onClick={handleClose}
            color="primary"
            sx={{ mr: 1 }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={
              isSubmitting ||
              !formData.roomType ||
              !formData.roomName ||
              formData.complaints.length === 0
            }
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create Complaint Room"
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CreateComplaintRoom;