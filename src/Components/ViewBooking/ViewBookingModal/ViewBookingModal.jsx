import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
}));

const BookingDialog = ({ 
  open, 
  onClose, 
  selectedRoom, 
  selectedRooms,
  selectedDate, 
  handleRoomChange, 
  handleDropdownChange, 
  handleSubmit, 
  handleConfirmClick 
}) => {
  if (!selectedRoom) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24,
        },
      }}
    >
      <form onSubmit={(e) => {
        handleSubmit(e);
        handleConfirmClick();
      }}>
        <StyledDialogTitle>
          Book {selectedRoom.roomname}
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        <DialogContent dividers>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              placeholder="Enter your name"
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="number"
              label="Phone Number"
              name="number"
              type="text"
              placeholder="Enter your phone number"
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="date"
              label="Date"
              name="date"
              type="date"
              defaultValue={selectedDate || new Date().toISOString().split('T')[0]}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel id="roomnumber-label">No. of Rooms</InputLabel>
              <Select
                labelId="roomnumber-label"
                id="roomnumber"
                name="roomnumber"
                value={selectedRooms}
                label="No. of Rooms"
                onChange={handleRoomChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>

            {Array(selectedRooms)
              .fill()
              .map((_, roomIndex) => (
                <Box key={roomIndex} sx={{ mt: 3, mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Room {roomIndex + 1}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`adults-label-${roomIndex}`}>Adults</InputLabel>
                        <Select
                          labelId={`adults-label-${roomIndex}`}
                          id={`adults_${roomIndex}`}
                          label="Adults"
                          defaultValue={1}
                          onChange={(e) => handleDropdownChange(e, roomIndex, "adults")}
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`children5To10-label-${roomIndex}`}>Children (5-10 yrs)</InputLabel>
                        <Select
                          labelId={`children5To10-label-${roomIndex}`}
                          id={`children5To10_${roomIndex}`}
                          label="Children (5-10 yrs)"
                          defaultValue={0}
                          onChange={(e) => handleDropdownChange(e, roomIndex, "children5To10")}
                        >
                          <MenuItem value={0}>0</MenuItem>
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`children0To5-label-${roomIndex}`}>Children (0-5 yrs)</InputLabel>
                        <Select
                          labelId={`children0To5-label-${roomIndex}`}
                          id={`children0To5_${roomIndex}`}
                          label="Children (0-5 yrs)"
                          defaultValue={0}
                          onChange={(e) => handleDropdownChange(e, roomIndex, "children0To5")}
                        >
                          <MenuItem value={0}>0</MenuItem>
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: 2, justifyContent: 'space-between' }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 1 }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookingDialog;