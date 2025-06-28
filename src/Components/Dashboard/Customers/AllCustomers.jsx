import Axios from "axios";
import { useRef, useState } from "react";
import { FetchUrls } from "../../Common/FetchUrls";
import { BiSolidEdit } from "react-icons/bi";
import { FaFileInvoice, FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loader } from "../../Common/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Typography,
  Box,
  IconButton,
  Chip,
  styled,
} from "@mui/material";

// Styled components for better styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[100],
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.grey[50],
  },
  "& .MuiTableCell-root": {
    padding: theme.spacing(1.5),
  },
}));

const AllCustomers = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // MUI uses 0-based indexing
  const [bookingPerPage, setBookingPerPage] = useState(30);

  const {
    data: customersData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allcustomers"],
    queryFn: async () => {
      const getdata = await Axios.get(
        FetchUrls(`customers/allcustomers/?search=${search}`)
      );
      return getdata.data.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  // Filter customers based on search
  const filteredCustomers = customersData.filter((item) => {
    return search === ""
      ? item
      : item.customerName.toLowerCase().includes(search.toLowerCase());
  });

  // Pagination logic for MUI
  const paginatedCustomers = filteredCustomers.slice(
    currentPage * bookingPerPage,
    currentPage * bookingPerPage + bookingPerPage
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure To Delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Axios.delete(FetchUrls(`customers/deletecustomer/${id}`)).then(
            (res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: "Deleted!",
                  text: res?.data?.message || "Customer Deleted Successfully!",
                  icon: "success",
                }).then(() => {
                  refetch();
                });
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setBookingPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          All Previous Guest's
        </Typography>

        {/* Search Field */}
        <TextField
          variant="outlined"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch style={{ color: "#9CA3AF" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table Section */}
      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customers table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">SL</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Mobile Num.</StyledTableCell>
              <StyledTableCell align="center">NID</StyledTableCell>
              <StyledTableCell align="center">Rooms</StyledTableCell>
              <StyledTableCell align="center">Start Date</StyledTableCell>
              <StyledTableCell align="center">End Date</StyledTableCell>
              <StyledTableCell align="center">Booked From</StyledTableCell>
              <StyledTableCell align="center">Paid Amount</StyledTableCell>
              <StyledTableCell align="center">Due Amount</StyledTableCell>
              <StyledTableCell align="center">Checked</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer, index) => (
              <StyledTableRow key={customer._id}>
                <TableCell align="center">
                  {currentPage * bookingPerPage + index + 1}
                </TableCell>
                <TableCell align="center">{customer?.customerName}</TableCell>
                <TableCell align="center">{customer?.customerNumber}</TableCell>
                <TableCell align="center">{customer?.customerNid}</TableCell>
                <TableCell align="center">{customer?.roomNumber}</TableCell>
                <TableCell align="center">{customer?.firstDate}</TableCell>
                <TableCell align="center">{customer?.lastDate}</TableCell>
                <TableCell align="center">
                  {customer?.bookedFrom === "Counter" && "Night Stay"}
                  {customer?.bookedFrom === "Daylong Package" &&
                    "Daylong Package"}
                </TableCell>
                <TableCell align="center">{customer?.paidAmount}</TableCell>
                <TableCell align="center">{customer?.dueAmount}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={customer?.checkIn}
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton
                      color="warning"
                      size="small"
                      sx={{ "&:hover": { transform: "scale(1.2)" } }}
                    >
                      <BiSolidEdit />
                    </IconButton>

                    <Link
                      to={`/dashboard/invoice/${customer._id}`}
                      state={{ data: customer }}
                      style={{ textDecoration: "none" }}
                    >
                      <IconButton
                        color="default"
                        size="small"
                        sx={{ "&:hover": { transform: "scale(1.2)" } }}
                      >
                        <FaFileInvoice />
                      </IconButton>
                    </Link>

                    {/* Uncomment if you want to enable delete functionality */}
                    {/* <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(customer._id)}
                      sx={{ '&:hover': { transform: 'scale(1.2)' } }}
                    >
                      <FaRegTrashAlt />
                    </IconButton> */}
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 30, 50, 100]}
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={bookingPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />
    </Box>
  );
};

export default AllCustomers;
