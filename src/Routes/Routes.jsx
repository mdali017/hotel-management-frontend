import { createBrowserRouter } from "react-router-dom";
import Invoice from "../Components/Common/Invoice";
import ContactUs from "../Components/ContactUs/ContactUs";
import AllBookings from "../Components/Dashboard/Bookings/AllBookings";
import AllCustomers from "../Components/Dashboard/Customers/AllCustomers";
import Dashboard from "../Components/Dashboard/Dashboard";
import DashboardLayout from "../Components/Dashboard/Layout/DashboardLayout";
import AddRooms from "../Components/Dashboard/Rooms/AddRooms";
import RoomsList from "../Components/Dashboard/Rooms/RoomsList";
import Main from "../Components/Layout/Main";
import Booking from "../Pages/Booking/Booking";
import FacilitiesPage from "../Pages/FacilitiesPage/FacilitiesPage";
import Home from "../Pages/Home/Home";
import Investors from "../Pages/Investors/Investors";
import Login from "../Pages/Login/Login";
import VirtualTour from "../Pages/VirtualTour/VirtualTour";
import VirtualTourImage from "../Pages/VirtualTour/VirtualTourImage";
import Accommodation from "../Pages/Accommodation/Accommodation";
import InvoiceDateWise from "../Components/Dashboard/Bookings/InvoiceDateWise";
import Reports from "../Components/Dashboard/Reports/Reports";
import Promotions from "../Pages/Promotions/Promotions";
import Gallery from "../Pages/GalleryPage/GalleryPage";
import GalleryPage from "../Pages/GalleryPage/GalleryPage";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import PrivacyPolicy from "../Components/PrivacyPolicy/PrivacyPolicy";
import InvestorContact from "../Components/Investor/InvestorContact";
import EditBooking from "../Pages/Booking/EditBooking/EditBooking";
import BookingView from "../Pages/Booking/BookingView/BookingView";
import AddBookingPage from "../Components/Dashboard/Bookings/AddBookingPage";
import BookingGusetsPage from "../Components/Dashboard/Bookings/BookingGusetsPage/BookingGusetsPage";
import LiveReportPrint from "../Components/Reports/LiveReport/LiveReportPrint";
import DailyReportPrint from "../Components/Reports/DailyReport/DailyReport";
import TodayCheckoutCustomers from "../Components/Dashboard/Customers/TodayCheckoutCustomers/TodayCheckoutCustomers";
import DueCheckoutGuest from "../Components/Dashboard/Customers/DueCheckoutGuest/DueCheckoutGuest";
import CheckoutReports from "../Components/Reports/CheckoutReports/CheckoutReports";
import GenerateReport from "../Components/Reports/GenerateReport/GenerateReport";
import InHouseGuestsReport from "../Components/Reports/InHouseGuestsReport/InHouseGuestsReport";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/booking",
        element: <Booking />,
      },

      {
        path: "/facilities-page",
        element: <FacilitiesPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/investors",
        element: <Investors />,
      },
      {
        path: "/investors/investor-contact",
        element: <InvestorContact />,
      },
      {
        path: "/gallery",
        element: <GalleryPage />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/virtual",
        element: <VirtualTour />,
      },

      {
        path: "/accommodation",
        element: <Accommodation />,
      },
      {
        path: "/meetings&events",
        element: <Promotions />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      // {
      //   path: "/site-map",
      //   element: <SitemapComponent />,
      // },
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/dashboard/customers",
        element: (
          <AdminRoute>
            <AllCustomers />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/due-customers",
        element: (
          <AdminRoute>
            <DueCheckoutGuest />
          </AdminRoute>
        ),
      },

      {
        path: "/dashboard/add-booking",
        element: (
          <AdminRoute>
            <AddBookingPage />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/bookings-guest",
        element: <BookingGusetsPage />,
      },
      {
        path: "/dashboard/todaycheckout-guests",
        element: <TodayCheckoutCustomers />,
      },
      {
        path: "/dashboard/bookings",
        element: (
          // <AdminRoute>
          <AllBookings />
          // </AdminRoute>
        ),
      },
      {
        path: "/dashboard/bookings-details",
        element: <BookingView />,
      },
      {
        path: "/dashboard/update-booking",
        element: <EditBooking />,
      },
      {
        path: "/dashboard/addrooms",
        element: <AddRooms />,
      },
      {
        path: "/dashboard/rooms",
        element: <RoomsList />,
      },
      {
        path: "/dashboard/invoice/:id",
        element: <Invoice />,
      },
      {
        path: "/dashboard/bookings/:id",
        element: <InvoiceDateWise />,
      },
      {
        path: "/dashboard/reports",
        element: (
          <AdminRoute>
            <Reports />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/live-report",
        element: (
          <AdminRoute>
            <LiveReportPrint />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/daily-report",
        element: (
          <AdminRoute>
            <DailyReportPrint />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/checkout-report",
        element: (
          <AdminRoute>
            <CheckoutReports />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/generate-report",
        element: (
          <AdminRoute>
            <GenerateReport />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/inHouseGuests-report",
        element: (
          <AdminRoute>
            <InHouseGuestsReport />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/virtual/:id",
    element: <VirtualTourImage />,
  },
]);
