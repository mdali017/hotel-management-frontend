import React, { useEffect, useState } from "react";
import { FaBars, FaFacebookF, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from "../../assets/hotel-orion-logo.png";
import Button from "../Common/Button";
import MessengerChat from "../FacebookChat/MessengerChat";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [bg, setBg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setBg(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Rooms & Suits", link: "/accommodation" },
    { id: 3, name: "AMENITIES", link: "/meetings&events" },
    // { id: 4, name: "Virtual Tour", link: "/virtual" },
    { id: 5, name: "Gallery", link: "/gallery" },
    { id: 6, name: "Contact", link: "/contact" },
  ];

  const MenuItem = ({ item, onClick }) => (
    <div className={`${bg ? "lg:hidden" : ""}`}>
      <p onClick={onClick} className="relative group">
        {item.id !== 1 && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-1 bg-[var(--accent)] rounded-full" />
        )}
        <Link
          className="pl-5 hover:text-[#FFDD31] font-thin transition-colors duration-300"
          to={item.link}
        >
          {item.name}
        </Link>
      </p>
    </div>
  );

  return (
    <>
      <header
        className={`
          fixed w-full z-20 top-0 transition-all duration-300
          ${bg ? "lg:-top-20" : "lg:top-0"}
          bg-black/30 text-white
        `}
      >
        {/* Top Bar */}
        <div className="container mx-auto">
          <div className="flex justify-between items-center border-b border-white/40 px-4 py-2 lg:px-6">
            {/* Social Icons */}
            <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base lg:text-xl">
              <MdEmail
                onClick={() =>
                  (window.location.href = "mailto:booking@chutipurbachal.com")
                }
                className="cursor-pointer hover:text-[#FFDD31] transition-colors"
              />
              <FaPhoneAlt
                onClick={() => (window.location.href = "tel:+8801709919827")}
                className="cursor-pointer hover:text-[#FFDD31] transition-colors"
              />
              <div className="hidden sm:flex gap-2 lg:gap-4">
                <FaFacebookF
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/hotelorionjashore/",
                      "_blank"
                    )
                  }
                  className="cursor-pointer hover:text-[#FFDD31] transition-colors"
                />
                <FaInstagram
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/hotelorionjashore/",
                      "_blank"
                    )
                  }
                  className="cursor-pointer hover:text-[#FFDD31] transition-colors"
                />
                <IoLogoYoutube
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/hotelorionjashore/",
                      "_blank"
                    )
                  }
                  className="cursor-pointer hover:text-[#FFDD31] transition-colors"
                />
              </div>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0">
              <Link to="/" className="block w-16 h-14 sm:w-20 sm:h-16">
                <img
                  src={logo}
                  alt="Hotel Orion Logo"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/booking">
                <button className="px-6 py-2 text-red-600 border border-red-700 hover:bg-red-600 hover:text-white   rounded-lg transition-colors duration-300 font-medium">
                  Book Now
                </button>
              </Link>
              <Link to="/login">
                <Button text="Login" />
              </Link>
            </div>

            {/* Mobile Buttons & Menu */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link to="/booking">
                <button className="text-xs sm:text-sm border border-accent text-accent hover:bg-accent hover:text-white px-2 py-1 rounded-lg transition-colors duration-300">
                  Book Now
                </button>
              </Link>
              <FaBars
                onClick={() => setShowMenu(!showMenu)}
                className="cursor-pointer text-xl sm:text-2xl hover:text-[#FFDD31] transition-colors"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex justify-center py-4">
            <ul className="flex gap-6 xl:gap-8 tracking-wider text-base xl:text-lg font-bold uppercase">
              {menuItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </ul>
          </nav>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="lg:hidden bg-black/90 backdrop-blur-sm">
              <nav className="container mx-auto py-6">
                <ul className="flex flex-col items-center gap-4 text-base sm:text-lg uppercase">
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      onClick={() => setShowMenu(false)}
                    />
                  ))}
                  <div className="flex flex-col items-center gap-3 mt-4">
                    <Link to="/booking" onClick={() => setShowMenu(false)}>
                      <Button text="Book Now" />
                    </Link>
                    <Link to="/investors" onClick={() => setShowMenu(false)}>
                      <Button text="Investment" />
                    </Link>
                    <Link to="/login" onClick={() => setShowMenu(false)}>
                      <Button text="Login" />
                    </Link>
                  </div>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </header>
      <MessengerChat />
    </>
  );
};

export default Header;
