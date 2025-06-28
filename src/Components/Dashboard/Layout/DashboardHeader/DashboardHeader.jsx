import React, { useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import hotel_orion_logo from "../../../../assets/hotel-orion-logo.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "../../../Common/Modal";
import { MdArrowForward } from "react-icons/md";
import DropdownNotification from "./OnlineNotification";

const DashboardHeader = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // logout
  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Logout Successfully",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate("/login");
        });
      }
    });
  };

  return (
    <div className="bg-gray-200 py-1">
      <header className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-16 h-16">
                <img
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  src={hotel_orion_logo}
                  alt="Hotel Orion Logo"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-secondary text-lg font-medium tracking-wide">
                  Hotel Orion
                  <span className="block text-sm font-light tracking-wider text-accent">
                    International
                  </span>
                </h1>
                <div className="h-0.5 w-0 bg-accent group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>
          </div>
          <ul className="hidden sm:flex gap-4 translate-x-10">
            <li>
              <Link className="nav" to="/dashboard">
                Dashboard
              </Link>
            </li>
            {/* <li className="relative">
              <Link className="nav" to="/dashboard/bookings">
                Bookings
              </Link>
            </li> */}
            <li className="relative group transition-all duration-900">
              <Link
                to="/dashboard/customers"
                className="flex nav items-center space-x-2 "
              >
                <span>Guests</span>
              </Link>
            </li>
            <li>
              <Link
                className="nav"
                to="/dashboard/reports"
                onClick={toggleMenu}
              >
                Reports
              </Link>
            </li>
            <li>
              <Link
                className="nav"
                to="/dashboard/daily-report"
                onClick={toggleMenu}
              >
                Daily Report
              </Link>
            </li>
            {/* <li>
              <Link
                className="nav"
                to="/dashboard/checkout-report"
                onClick={toggleMenu}
              >
                Checkout Report
              </Link>
            </li> */}
            <li>
              <Link className="nav" to={"/dashboard/due-customers"}>
                Due Guests
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-5">
            <Link
              className="bg-indigo-700 px-2 py-1 text-white"
              to="/dashboard/generate-report"
              onClick={toggleMenu}
            >
              Checkout Report
            </Link>

            <Link to={"/dashboard/live-report"}>
              <button className="bg-green-800 px-2 py-1 text-white">
                Live Report
              </button>
            </Link>

            <div className="cursor-pointer">
              <DropdownNotification />
            </div>
            <div className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray-200 hover:text-primary p-2 cursor-pointer">
              <BiLogOutCircle onClick={handleLogOut} className="text-xl" />
            </div>
            <span className="hidden text-right lg:block">
              <span className="block font-medium text-black">
                {user ? user?.username : "Manager"}
              </span>
              <span className="block text-xs">
                {user?.isAdmin === true ? "Admin" : "User"}
              </span>
            </span>
          </div>
          {/* Hamburger menu for small screens */}
          <div className="sm:hidden">
            <button onClick={toggleMenu}>
              {isMenuOpen ? (
                <span className="text-2xl">&#10006;</span>
              ) : (
                <span className="text-2xl">&#9776;</span>
              )}
            </button>
          </div>
        </div>

        {/* Responsive navigation menu for mobile */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:hidden items-center gap-4 mt-4`}
        >
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/dashboard/bookings" onClick={toggleMenu}>
                Booking
              </Link>
            </li>
            <li className="relative group transition-all duration-900">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 group-hover:bg-gray-100"
              >
                <span>Guest's</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/reports" onClick={toggleMenu}>
                Reports
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <section className="font-[raleway] p-5 relative">
          <h1 className="text-2xl font-bold pb-8">Settings</h1>
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Link
              onClick={() => setShowModal(false)}
              to="/dashboard/addrooms"
              className="bg-gray-100 w-full p-4 hover:bg-lime-100 duration-300 rounded-lg flex items-center justify-between text-xl"
            >
              <span className="font font-semibold text-secondary">
                Add Rooms
              </span>{" "}
              <MdArrowForward
                className={`text-primary ${
                  hover
                    ? "translate-x-2 duration-500"
                    : "translate-x-0 duration-500"
                }`}
              />
            </Link>
          </div>
          <button
            className=" text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
            onClick={() => {
              setShowModal(false);
            }}
          >
            X
          </button>
        </section>
      </Modal>
    </div>
  );
};

export default DashboardHeader;
