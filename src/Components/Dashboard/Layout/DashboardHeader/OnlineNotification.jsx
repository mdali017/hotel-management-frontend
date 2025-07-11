import Axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { FetchUrls } from "../../../Common/FetchUrls";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [onlinedata, setOnlineData] = useState([]);
  const [newDataNotification, setNewDataNotification] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    Axios.get(FetchUrls("onlinebooking/allonlinebookings")).then((res) => {
      setOnlineData(res.data.data);
      if (res.data.data.some((item) => item.unseen)) {
        setNewDataNotification(true);
      }
    });
  }, []);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target))
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setNewDataNotification(false);
  };

  const handleseenupdate = async (id) => {
    await Axios.put(FetchUrls(`onlinebooking/changeseenbookings/${id}`)).then((res) => {
      if (res.status === 200) {
        setNewDataNotification(false);
        Axios.get(FetchUrls("onlinebooking/allonlinebookings")).then((res) => {
          setOnlineData(res.data.data);
        });
      }
    });
  };

  const action = (
    <Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <div className="relative z-50">
      {newDataNotification && (
        <h1 className="fixed z-50 bottom-10 left-10">
          <Snackbar open={newDataNotification} onClose={handleClose}>
            <Alert onClose={handleClose} severity="info" variant="filled" sx={{ width: "100%" }}>
              New Online Customer InComming!
            </Alert>
          </Snackbar>
        </h1>
      )}

      <div
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        to="#"
        className="relative flex h-10 w-10  items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray-200 hover:text-primary"
      >
        <span className="absolute top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-red-500">
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
        </span>

        <svg
          className="fill-current duration-300 ease-in-out"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
            fill=""
          />
        </svg>
      </div>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-44 md:-right-0 mt-2.5 flex h-90 w-96 flex-col rounded-sm border border-stroke bg-white shadow-default md:w-80 ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <div className="py-3">
          <h5 className="text-sm font-bold ml-3">Online Booking</h5>
        </div>
        <hr />
        <ul className="flex h-80 w-full flex-col overflow-y-auto">
          {onlinedata.map((item) => {
            return (
              <li
                key={item?._id}
                className={`hover:bg-gray-100 duration-500 px-2 ${
                  item?.unseen && "bg-accent bg-opacity-40"
                }`}
              >
                <div className="flex flex-col border-b border-stroke py-3 hover:bg-gray-2 relative">
                  {item?.unseen ? (
                    <button
                      onClick={() => handleseenupdate(item?._id)}
                      className="absolute right-2 top-2 text-xs border bg-gray-200 p-1 rounded-lg"
                    >
                      Seen
                    </button>
                  ) : (
                    ""
                  )}

                  <p>Name : {item?.customerName}</p>
                  <p>Number : {item?.customerNumber}</p>
                  <p className="mb-2">Room Type : {item?.roomType}</p>
                  <div className="text-sm">
                    <span className="flex items-center justify-between">
                      <p>Room Need : {item?.roomsNeed}</p>
                      <p>Chek In : {item?.chekinDate}</p>
                    </span>
                    <span className="flex items-center justify-between mb-2">
                      <p>Adults : {item?.adults}</p>
                      <p>Children : {item?.childrens}</p>
                    </span>
                  </div>

                  <p className="text-xs text-right pr-1 text-primary">
                    {formatDate(item?.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DropdownNotification;
