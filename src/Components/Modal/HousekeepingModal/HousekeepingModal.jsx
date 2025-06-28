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
  IconButton,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import Axios from "axios";
import {
  useAddHousekeepingMutation,
  useUpdateHousekeepingMutation,
} from "../../../redux/baseApi/baseApi";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";

const HouseKeepingModal = ({
  openHousekeepingModal,
  setOpenHouseKeepingModal,
  housekeepingRoom,
  openBackDrop = false,
  ColorStatusRefetch,
  roomNumber,
}) => {
  const [loading, setLoading] = useState(false);
  const [housekeeperName, setHousekeeperName] = useState("");
  const [checklist, setChecklist] = useState({
    cleanTheRoom: false,
    outOfOrder: false,
    outOfService: false,
    makeup: false,
    wipeDust: false,
    vacuumSweep: false,
    complaint: false,
  });
  const [complaintText, setComplaintText] = useState("");
  const [complaints, setComplaints] = useState([]);

  // List of housekeepers
  const housekeepers = [
    "Mahfuz",
    "Tanvir",
    "Monir",
    "Nayem",
    "Raz",
    "Onik",
    "Saiful",
  ];

  const [addHousekeeping] = useAddHousekeepingMutation();
  const [updateHousekeeping] = useUpdateHousekeepingMutation();

  const handleCheckboxChange = (event) => {
    setChecklist({
      ...checklist,
      [event.target.name]: event.target.checked,
    });
  };

  const addComplaint = () => {
    if (complaintText.trim()) {
      setComplaints([...complaints, complaintText.trim()]);
      setComplaintText(""); // Clear the input after adding
    }
  };

  const removeComplaint = (index) => {
    const updatedComplaints = [...complaints];
    updatedComplaints.splice(index, 1);
    setComplaints(updatedComplaints);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Create array of selected tasks
    const workingItems = [];
    if (checklist.cleanTheRoom) workingItems.push("Clean The Room");
    if (checklist.outOfOrder) workingItems.push("Out Of Order");
    if (checklist.outOfService) workingItems.push("Out Of Service");
    if (checklist.makeup) workingItems.push("Make up");
    if (checklist.wipeDust) workingItems.push("Wipe the dust");
    if (checklist.vacuumSweep) workingItems.push("Vacuum / Sweep");

    try {
      // Prepare data for API call
      const housekeepingData = {
        roomName: housekeepingRoom,
        housekeeperName: housekeeperName,
        workingItem: workingItems,
        isCleaning: false,
      };

      // Add complaints data if needed
      if (checklist.complaint && complaints.length > 0) {
        housekeepingData.complaints = complaints;
        housekeepingData.isComplaints = true;
        housekeepingData.complaintRooms = [housekeepingRoom]; // Using current room
      }

      // Make API call to update housekeeping record
      const response = await updateHousekeeping(housekeepingData);

      if (response.data) {
        ColorStatusRefetch();
        Swal.fire({
          icon: "success",
          // title: "Wow Now Room is Ready!!!",
          title:
            complaints.length > 0
              ? "Room is under construction"
              : "Room is ready for guest",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // Close modal and refresh data
      setOpenHouseKeepingModal(false);
    } catch (error) {
      console.error("Error creating housekeeping record:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update housekeeping record",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog
        open={openHousekeepingModal}
        onClose={() => setOpenHouseKeepingModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          id="alert-dialog-title"
          color="primary"
          sx={{ bgcolor: "#e6f7ff", fontWeight: "bold" }}
        >
          Room {roomNumber} - Housekeeping Tasks
        </DialogTitle>
        <DialogContent>
          <FormGroup className="grid grid-cols-2">
            <div className="grid grid-cols-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.cleanTheRoom}
                    onChange={handleCheckboxChange}
                    name="cleanTheRoom"
                  />
                }
                label="Clean The Room"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.outOfOrder}
                    onChange={handleCheckboxChange}
                    name="outOfOrder"
                  />
                }
                label="Out Of Order"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.outOfService}
                    onChange={handleCheckboxChange}
                    name="outOfService"
                  />
                }
                label="Out Of Service"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.makeup}
                    onChange={handleCheckboxChange}
                    name="makeup"
                  />
                }
                label="Make up"
              />
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.wipeDust}
                    onChange={handleCheckboxChange}
                    name="wipeDust"
                  />
                }
                label="Wipe the dust"
              /> */}
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.vacuumSweep}
                    onChange={handleCheckboxChange}
                    name="vacuumSweep"
                  />
                }
                label="Vacuum / Sweep"
              /> */}
              <FormControlLabel
                sx={{ color: "red" }}
                control={
                  <Checkbox
                    checked={checklist.complaint}
                    onChange={handleCheckboxChange}
                    name="complaint"
                  />
                }
                label="Complain"
              />
            </div>

            {checklist.complaint && (
              <Box sx={{ ml: 3, width: "calc(100% - 24px)" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Enter Complaint"
                    variant="outlined"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    margin="normal"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addComplaint}
                    disabled={!complaintText.trim()}
                    sx={{ ml: 1, height: 40 }}
                    size="small"
                  >
                    Add
                  </Button>
                </Box>

                {complaints.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    {complaints.map((complaint, index) => (
                      <Chip
                        key={index}
                        label={complaint}
                        onDelete={() => removeComplaint(index)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            <div className="flex justify-between col-span-2 mt-4">
              <Box>
                <FormControl size="small" sx={{ minWidth: 200, mt: 1 }}>
                  <InputLabel id="housekeeper-select-label">
                    Housekeeper Name
                  </InputLabel>
                  <Select
                    labelId="housekeeper-select-label"
                    id="housekeeper-select"
                    value={housekeeperName}
                    label="Housekeeper Name"
                    onChange={(e) => setHousekeeperName(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select a housekeeper</em>
                    </MenuItem>
                    {housekeepers.map((name, index) => (
                      <MenuItem key={index} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  onClick={() => setOpenHouseKeepingModal(false)}
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disabled={loading || !housekeeperName}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>
            </div>
          </FormGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HouseKeepingModal;
